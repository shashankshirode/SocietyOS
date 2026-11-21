import { mockStore } from '../../../../core/mockStore/mockStore';
import type {
  VisitorPass,
  VisitorCategory,
  EntrySource,
  ApprovalSource,
} from '../../../../shared/types/visitorPhase5';
import { unifiedVisitorStateMachine } from './unifiedVisitorStateMachine';
import { auditService, createAuditEntry } from '../../../../core/audit';
import { createIdempotencyKey } from '../../../../core/api/idempotency';

export interface ResidentAuthorityContext {
  readonly residentId: string;
  readonly societyId: string;
  readonly unitId: string;
  readonly flatNumber: string;
  readonly role: 'OWNER' | 'TENANT' | 'CO_OWNER' | 'FAMILY_MEMBER';
  readonly permissions: string[];
}

export interface VisitorPassCreationInput {
  readonly name: string;
  readonly phone: string;
  readonly email?: string;
  readonly category: VisitorCategory;
  readonly purpose: string;
  readonly expectedEntryAt: string;
  readonly expectedExitAt: string;
  readonly vehicleRegistration?: string;
  readonly vehicleType?: 'CAR' | 'BIKE' | 'OTHER';
  readonly isRecurring: boolean;
  readonly recurringPattern?: {
    readonly frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
    readonly daysOfWeek?: readonly number[];
    readonly startDate: string;
    readonly endDate?: string;
    readonly timeWindow: { readonly start: string; readonly end: string };
    readonly exceptions?: readonly string[];
  };
  readonly unitId: string;
  readonly flatNumber: string;
  readonly societyId: string;
  readonly deliveryBrand?: string;
  readonly cabCompany?: string;
  readonly cabDriverName?: string;
  readonly vendorCompany?: string;
  readonly vendorContactPerson?: string;
}

export interface PassCreationResult {
  readonly success: boolean;
  readonly pass?: VisitorPass;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly qrCredential?: string;
  readonly otpCredential?: string;
}

export class ResidentAuthorityService {
  private static instance: ResidentAuthorityService;

  static getInstance(): ResidentAuthorityService {
    if (!ResidentAuthorityService.instance) {
      ResidentAuthorityService.instance = new ResidentAuthorityService();
    }
    return ResidentAuthorityService.instance;
  }

  async validateResidentAuthority(
    residentId: string,
    societyId: string,
    unitId: string
  ): Promise<{ valid: boolean; errorCode?: string; errorMessage?: string; context?: ResidentAuthorityContext }> {
    const residences = mockStore.getState().residences || [];
    const residence = residences.find(r =>
      r.residentId === residentId &&
      r.societyId === societyId &&
      r.unitId === unitId &&
      r.status === 'ACTIVE'
    );

    if (!residence) {
      return { valid: false, errorCode: 'RESIDENT_NOT_AUTHORIZED', errorMessage: 'Resident is not authorized for this unit' };
    }

    const permissions = mockStore.getState().residentPermissions || [];
    const residentPermissions = permissions.filter(p =>
      p.residentId === residentId &&
      p.societyId === societyId &&
      p.unitId === unitId &&
      p.active
    );

    const hasVisitorPermission = residentPermissions.some(p =>
      p.permissionId === 'VISITOR_PASS_CREATE' ||
      p.permissionId === 'VISITOR_MANAGEMENT'
    );

    if (!hasVisitorPermission) {
      return { valid: false, errorCode: 'PERMISSION_DENIED', errorMessage: 'Resident does not have visitor pass creation permission' };
    }

    const flatNumber = typeof residence.flatNumber === 'string' ? residence.flatNumber : '';
    const roleValue = residence.role;
    const role: ResidentAuthorityContext['role'] =
      roleValue === 'TENANT' || roleValue === 'CO_OWNER' || roleValue === 'FAMILY_MEMBER'
        ? roleValue
        : 'OWNER';
    const permissionsList: string[] = residentPermissions
      .map(p => (typeof p.permissionId === 'string' ? p.permissionId : ''))
      .filter((id): id is string => id.length > 0);

    const context: ResidentAuthorityContext = {
      residentId,
      societyId,
      unitId,
      flatNumber,
      role,
      permissions: permissionsList,
    };

    return { valid: true, context };
  }

  async canCreatePassForCategory(
    context: ResidentAuthorityContext,
    category: VisitorCategory
  ): Promise<{ allowed: boolean; errorCode?: string; errorMessage?: string }> {
    const categoryPermissions: Record<VisitorCategory, string[]> = {
      GUEST: ['VISITOR_PASS_CREATE'],
      DELIVERY: ['VISITOR_PASS_CREATE'],
      CAB: ['VISITOR_PASS_CREATE'],
      VENDOR: ['VISITOR_PASS_CREATE', 'VENDOR_VISITOR_APPROVE'],
      SERVICE_PROVIDER: ['VISITOR_PASS_CREATE', 'SERVICE_VISITOR_APPROVE'],
      DOMESTIC_HELP: ['VISITOR_PASS_CREATE', 'DOMESTIC_HELP_MANAGE'],
      REPAIR_TECHNICIAN: ['VISITOR_PASS_CREATE', 'SERVICE_VISITOR_APPROVE'],
      MATERIAL_MOVEMENT: ['VISITOR_PASS_CREATE', 'MATERIAL_MOVEMENT_APPROVE'],
      SCHOOL_TRANSPORT: ['VISITOR_PASS_CREATE'],
      RECURRING_VISITOR: ['VISITOR_PASS_CREATE', 'RECURRING_VISITOR_MANAGE'],
      EMERGENCY: ['EMERGENCY_BYPASS_AUTHORIZE'],
      OTHER: ['VISITOR_PASS_CREATE'],
    };

    const requiredPermissions = categoryPermissions[category] || ['VISITOR_PASS_CREATE'];
    const hasPermission = requiredPermissions.some(p => context.permissions.includes(p));

    if (!hasPermission) {
      return { allowed: false, errorCode: 'CATEGORY_PERMISSION_DENIED', errorMessage: `Resident does not have permission to create ${category} visitor passes` };
    }

    return { allowed: true };
  }

  async validateRecurringPass(
    context: ResidentAuthorityContext,
    pattern: {
      readonly frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
      readonly daysOfWeek?: readonly number[];
      readonly startDate: string;
      readonly endDate?: string;
      readonly timeWindow: { readonly start: string; readonly end: string };
      readonly exceptions?: readonly string[];
    }
  ): Promise<{ valid: boolean; errorCode?: string; errorMessage?: string }> {
    if (pattern.frequency === 'CUSTOM' && (!pattern.daysOfWeek || pattern.daysOfWeek.length === 0)) {
      return { valid: false, errorCode: 'INVALID_RECURRING_PATTERN', errorMessage: 'Custom frequency requires days of week' };
    }

    const startDate = new Date(pattern.startDate);
    const endDate = pattern.endDate ? new Date(pattern.endDate) : null;

    if (endDate && endDate <= startDate) {
      return { valid: false, errorCode: 'INVALID_DATE_RANGE', errorMessage: 'End date must be after start date' };
    }

    if (endDate && endDate > new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000)) {
      return { valid: false, errorCode: 'RECURRING_TOO_LONG', errorMessage: 'Recurring pass cannot exceed 1 year' };
    }

    return { valid: true };
  }
}

export class VisitorPassCreationService {
  private static instance: VisitorPassCreationService;

  static getInstance(): VisitorPassCreationService {
    if (!VisitorPassCreationService.instance) {
      VisitorPassCreationService.instance = new VisitorPassCreationService();
    }
    return VisitorPassCreationService.instance;
  }

  async createVisitorPass(
    input: VisitorPassCreationInput,
    residentContext: ResidentAuthorityContext,
    idempotencyKey?: string
  ): Promise<PassCreationResult> {
    const key = idempotencyKey || createIdempotencyKey(`visitor-pass-${input.unitId}-${input.name}-${input.expectedEntryAt}`);

    const authorityResult = await residentAuthorityService.validateResidentAuthority(
      input.unitId,
      input.societyId,
      input.unitId
    );

    if (!authorityResult.valid) {
      return {
        success: false,
        ...(authorityResult.errorCode ? { errorCode: authorityResult.errorCode } : {}),
        ...(authorityResult.errorMessage ? { errorMessage: authorityResult.errorMessage } : {}),
      };
    }

    if (!authorityResult.context) {
      return { success: false, errorCode: 'AUTHORITY_CONTEXT_MISSING', errorMessage: 'Authority context not available' };
    }

    const categoryCheck = await residentAuthorityService.canCreatePassForCategory(
      authorityResult.context,
      input.category
    );

    if (!categoryCheck.allowed) {
      return {
        success: false,
        ...(categoryCheck.errorCode ? { errorCode: categoryCheck.errorCode } : {}),
        ...(categoryCheck.errorMessage ? { errorMessage: categoryCheck.errorMessage } : {}),
      };
    }

    if (input.isRecurring && input.recurringPattern) {
      const recurringCheck = await residentAuthorityService.validateRecurringPass(
        authorityResult.context,
        input.recurringPattern
      );

      if (!recurringCheck.valid) {
        return {
          success: false,
          ...(recurringCheck.errorCode ? { errorCode: recurringCheck.errorCode } : {}),
          ...(recurringCheck.errorMessage ? { errorMessage: recurringCheck.errorMessage } : {}),
        };
      }
    }

    const passes = mockStore.getState().visitorPasses || [];
    const duplicatePass = passes.find(v =>
      v.visitorName === input.name &&
      v.visitorPhone === input.phone &&
      v.unitId === input.unitId &&
      v.expectedEntryAt === input.expectedEntryAt &&
      v.status !== 'CANCELLED' &&
      v.status !== 'REVOKED'
    );

    if (duplicatePass) {
      return { success: false, errorCode: 'DUPLICATE_PASS', errorMessage: 'A similar visitor pass already exists' };
    }

    const now = new Date();
    const passId = `pass-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const personId = `person-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const qrCredential = `SOC-OS:PASS:${passId}:${input.name.toUpperCase()}:${input.flatNumber}`;
    const otpCredential = this.generateOtp(passId);

    const pass: VisitorPass = {
      passId,
      personId,
      visitorName: input.name,
      visitorPhone: input.phone,
      visitorCategory: input.category,
      purpose: input.purpose,
      unitId: input.unitId,
      flatNumber: input.flatNumber,
      societyId: input.societyId,
      status: 'APPROVED',
      approvalSource: 'RESIDENT',
      createdByUserId: residentContext.residentId,
      createdByDisplayName: 'Resident',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expectedEntryAt: input.expectedEntryAt,
      expectedExitAt: input.expectedExitAt,
      isRecurring: input.isRecurring,
      dataVersion: 1,
      watchlistWarning: false,
      qrCredential,
      otpCredential,
      credentialExpiresAt: input.expectedExitAt,
      ...(input.vehicleRegistration ? { vehicleRegistration: input.vehicleRegistration.toUpperCase() } : {}),
      ...(input.vehicleType ? { vehicleType: input.vehicleType } : {}),
      ...(input.recurringPattern ? { recurringPattern: input.recurringPattern } : {}),
    };

    mockStore.getState().visitorPasses = [...passes, pass];
    mockStore.notify();

    createAuditEntry({
      actorUserId: residentContext.residentId,
      actorType: 'RESIDENT',
      societyId: input.societyId,
      action: 'VISITOR_PASS_CREATED',
      entityType: 'VisitorPass',
      entityId: passId,
      newState: { status: 'APPROVED', visitorName: input.name, category: input.category, unitId: input.unitId },
      idempotencyKey: key,
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return {
      success: true,
      pass,
      qrCredential,
      otpCredential,
    };
  }

  private generateOtp(passId: string): string {
    let hash = 17;
    for (const char of passId) {
      hash = (hash * 31 + char.charCodeAt(0)) % 900000;
    }
    return String(100000 + hash).slice(-6);
  }
}

export class VisitorPassRevocationService {
  private static instance: VisitorPassRevocationService;

  static getInstance(): VisitorPassRevocationService {
    if (!VisitorPassRevocationService.instance) {
      VisitorPassRevocationService.instance = new VisitorPassRevocationService();
    }
    return VisitorPassRevocationService.instance;
  }

  async revokePass(
    passId: string,
    residentId: string,
    societyId: string,
    reason: string,
    notes?: string
  ): Promise<{ success: boolean; errorCode?: string; errorMessage?: string; pass?: VisitorPass }> {
    const passes = mockStore.getState().visitorPasses || [];
    const passIndex = passes.findIndex(v => v.passId === passId);

    if (passIndex === -1) {
      return { success: false, errorCode: 'PASS_NOT_FOUND', errorMessage: 'Visitor pass not found' };
    }

    const pass = passes[passIndex];
    if (!pass) {
      return { success: false, errorCode: 'PASS_NOT_FOUND', errorMessage: 'Visitor pass not found' };
    }

    if (pass.societyId !== societyId) {
      return { success: false, errorCode: 'CROSS_SOCIETY_PASS', errorMessage: 'Pass belongs to a different society' };
    }

    if (!unifiedVisitorStateMachine.isVisitorPassActive(pass.status)) {
      return { success: false, errorCode: 'PASS_NOT_REVOCABLE', errorMessage: `Cannot revoke pass in ${pass.status} status` };
    }

    const authorityResult = await residentAuthorityService.validateResidentAuthority(
      residentId,
      societyId,
      pass.unitId
    );

    if (!authorityResult.valid) {
      return {
        success: false,
        ...(authorityResult.errorCode ? { errorCode: authorityResult.errorCode } : {}),
        ...(authorityResult.errorMessage ? { errorMessage: authorityResult.errorMessage } : {}),
      };
    }

    const now = new Date();
    const revokedPass: VisitorPass = {
      ...pass,
      status: 'REVOKED',
      updatedAt: now.toISOString(),
      dataVersion: pass.dataVersion + 1,
    };

    const updatedPasses = [...passes];
    updatedPasses[passIndex] = revokedPass;
    mockStore.getState().visitorPasses = updatedPasses;
    mockStore.notify();

    createAuditEntry({
      actorUserId: residentId,
      actorType: 'RESIDENT',
      societyId,
      action: 'VISITOR_PASS_REVOKED',
      entityType: 'VisitorPass',
      entityId: passId,
      previousState: { status: pass.status },
      newState: { status: 'REVOKED', reason, ...(notes ? { notes } : {}) },
      idempotencyKey: createIdempotencyKey(`revoke-${passId}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
      reason,
    });

    return { success: true, pass: revokedPass };
  }
}

export const residentAuthorityService = ResidentAuthorityService.getInstance();
export const visitorPassCreationService = VisitorPassCreationService.getInstance();
export const visitorPassRevocationService = VisitorPassRevocationService.getInstance();