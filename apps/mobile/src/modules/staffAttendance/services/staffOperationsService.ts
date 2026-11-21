import type {
  StaffProfile,
  StaffEngagement,
  StaffAccessCredential,
  RegisterStaffInput,
  StaffVerificationStatus,
  StaffEmploymentStatus,
} from '../../../shared/types/staff.types';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';
import {
  assertSocietyContext,
  canRegisterStaff,
  canVerifyStaff,
  canExitStaff,
  canSuspendStaff,
} from '../data/staffAttendanceActor';
import { generateOperationId } from '../../../core/api/idempotency';

export interface VerifyStaffChecklistInput {
  staffId: string;
  societyId: string;
  policeVerificationVerified: boolean;
  idDocumentVerified: boolean;
  addressProofVerified: boolean;
  notes?: string;
}

export interface ExitStaffInput {
  staffId: string;
  societyId: string;
  exitDate: string;
  exitReason: string;
}

export class StaffOperationsService {
  private profiles = new Map<string, StaffProfile>();
  private engagements = new Map<string, StaffEngagement>();
  private credentials = new Map<string, StaffAccessCredential>();
  private auditLogs: { action: string; entityId: string; actorId: string; timestamp: string; details?: string }[] = [];

  constructor(initialProfiles?: StaffProfile[]) {
    if (initialProfiles) {
      for (const p of initialProfiles) {
        this.profiles.set(p.id, { ...p });
      }
    }
  }

  public registerStaff(
    actor: StaffOperationsActor,
    societyId: string,
    input: RegisterStaffInput
  ): { profile: StaffProfile; engagement: StaffEngagement; credential: StaffAccessCredential } {
    assertSocietyContext(actor, societyId);
    if (!canRegisterStaff(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to register staff');
    }

    const existingCode = Array.from(this.profiles.values()).find(
      p => p.staffCode.toUpperCase() === input.staffCode.trim().toUpperCase()
    );
    if (existingCode) {
      throw new Error(`STAFF_CODE_CONFLICT: Staff code ${input.staffCode} already exists`);
    }

    const staffId = `stf-${generateOperationId('stf')}`;
    const credentialId = `cred-${generateOperationId('cred')}`;
    const engagementId = `eng-${generateOperationId('eng')}`;
    const nowIso = new Date().toISOString();

    const maskedMobile = input.mobile.length >= 4
      ? `${input.mobile.slice(0, 2)}******${input.mobile.slice(-2)}`
      : '**********';

    const credential: StaffAccessCredential = {
      credentialId,
      staffId,
      societyId,
      type: 'DIGITAL_QR',
      signedQrToken: `token-${staffId}-${Date.now().toString(36)}`,
      validFrom: input.joiningDate,
      status: 'ACTIVE',
      allowedGates: [input.assignedLocation],
      createdAt: nowIso,
    };

    const profile: StaffProfile = {
      id: staffId,
      staffCode: input.staffCode.trim().toUpperCase(),
      name: input.name.trim(),
      category: input.category,
      employmentStatus: 'ACTIVE',
      verificationStatus: input.verificationStatus,
      policeVerificationStatus: 'NOT_SUBMITTED',
      idDocumentStatus: 'NOT_COLLECTED',
      ...(input.vendorId ? { vendorId: input.vendorId, isVendorWorker: true } : { isVendorWorker: false }),
      assignedLocation: input.assignedLocation,
      assignedAreas: [input.assignedLocation],
      ...(input.shiftId ? { shiftId: input.shiftId } : {}),
      mobileMasked: maskedMobile,
      ...(input.emergencyContact ? { emergencyContactMasked: '******' } : {}),
      joiningDate: input.joiningDate,
      accessCredentialId: credentialId,
      ...(credential.signedQrToken ? { signedQrToken: credential.signedQrToken } : {}),
      ...(input.notes ? { notes: input.notes } : {}),
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const engagement: StaffEngagement = {
      id: engagementId,
      staffId,
      societyId,
      engagementType: input.engagementType ?? (input.vendorId ? 'VENDOR_WORKER' : 'DIRECT_SOCIETY_STAFF'),
      ...(input.vendorId ? { vendorId: input.vendorId } : {}),
      roleCategory: input.category as StaffEngagement['roleCategory'],
      effectiveFrom: input.joiningDate,
      status: 'ACTIVE',
      assignedLocation: input.assignedLocation,
      ...(input.notes ? { notes: input.notes } : {}),
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    this.profiles.set(staffId, profile);
    this.engagements.set(engagementId, engagement);
    this.credentials.set(credentialId, credential);

    this.auditLogs.push({
      action: 'STAFF_CREATED',
      entityId: staffId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Registered ${profile.name} (${profile.staffCode})`,
    });

    return { profile, engagement, credential };
  }

  public verifyStaff(
    actor: StaffOperationsActor,
    input: VerifyStaffChecklistInput
  ): StaffProfile {
    assertSocietyContext(actor, input.societyId);
    if (!canVerifyStaff(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to verify staff');
    }

    const profile = this.profiles.get(input.staffId);
    if (!profile) {
      throw new Error('STAFF_NOT_FOUND: Staff does not exist');
    }

    const allMandatoryVerified = input.policeVerificationVerified && input.idDocumentVerified && input.addressProofVerified;
    const newStatus: StaffVerificationStatus = allMandatoryVerified ? 'VERIFIED' : 'PENDING';
    const nowIso = new Date().toISOString();

    const updated: StaffProfile = {
      ...profile,
      verificationStatus: newStatus,
      policeVerificationStatus: input.policeVerificationVerified ? 'VERIFIED' : 'REJECTED',
      idDocumentStatus: input.idDocumentVerified ? 'VERIFIED' : 'REJECTED',
      updatedAt: nowIso,
    };

    this.profiles.set(input.staffId, updated);

    this.auditLogs.push({
      action: 'STAFF_VERIFICATION_CHANGED',
      entityId: input.staffId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Verification status changed to ${newStatus}`,
    });

    return updated;
  }

  public exitStaff(
    actor: StaffOperationsActor,
    input: ExitStaffInput
  ): { profile: StaffProfile; revokedCredentialId?: string } {
    assertSocietyContext(actor, input.societyId);
    if (!canExitStaff(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to exit staff');
    }

    const profile = this.profiles.get(input.staffId);
    if (!profile) {
      throw new Error('STAFF_NOT_FOUND: Staff does not exist');
    }

    const nowIso = new Date().toISOString();

    const updatedProfile: StaffProfile = {
      ...profile,
      employmentStatus: 'EXITED',
      exitDate: input.exitDate,
      updatedAt: nowIso,
    };
    this.profiles.set(input.staffId, updatedProfile);

    for (const [id, eng] of this.engagements.entries()) {
      if (eng.staffId === input.staffId && eng.status === 'ACTIVE') {
        this.engagements.set(id, {
          ...eng,
          status: 'EXITED',
          effectiveTo: input.exitDate,
          updatedAt: nowIso,
        });
      }
    }

    let revokedCredId: string | undefined;
    for (const [id, cred] of this.credentials.entries()) {
      if (cred.staffId === input.staffId && cred.status === 'ACTIVE') {
        this.credentials.set(id, {
          ...cred,
          status: 'REVOKED',
          revocationReason: `Staff exited: ${input.exitReason}`,
          revokedAt: nowIso,
        });
        revokedCredId = id;
      }
    }

    this.auditLogs.push({
      action: 'STAFF_EXITED',
      entityId: input.staffId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Exited staff effective ${input.exitDate}. Reason: ${input.exitReason}`,
    });

    return {
      profile: updatedProfile,
      ...(revokedCredId ? { revokedCredentialId: revokedCredId } : {}),
    };
  }

  public suspendStaff(
    actor: StaffOperationsActor,
    societyId: string,
    staffId: string,
    reason: string
  ): StaffProfile {
    assertSocietyContext(actor, societyId);
    if (!canSuspendStaff(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to suspend staff');
    }

    const profile = this.profiles.get(staffId);
    if (!profile) {
      throw new Error('STAFF_NOT_FOUND: Staff does not exist');
    }

    const nowIso = new Date().toISOString();
    const updated: StaffProfile = {
      ...profile,
      employmentStatus: 'SUSPENDED',
      updatedAt: nowIso,
    };
    this.profiles.set(staffId, updated);

    for (const [id, cred] of this.credentials.entries()) {
      if (cred.staffId === staffId && cred.status === 'ACTIVE') {
        this.credentials.set(id, {
          ...cred,
          status: 'SUSPENDED',
          revocationReason: reason,
        });
      }
    }

    this.auditLogs.push({
      action: 'STAFF_SUSPENDED',
      entityId: staffId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Suspended staff: ${reason}`,
    });

    return updated;
  }

  public reactivateStaff(
    actor: StaffOperationsActor,
    societyId: string,
    staffId: string,
    effectiveDate: string
  ): StaffProfile {
    assertSocietyContext(actor, societyId);
    if (!canRegisterStaff(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to reactivate staff');
    }

    const profile = this.profiles.get(staffId);
    if (!profile) {
      throw new Error('STAFF_NOT_FOUND: Staff does not exist');
    }

    const nowIso = new Date().toISOString();
    const updated: StaffProfile = {
      ...profile,
      employmentStatus: 'ACTIVE',
      updatedAt: nowIso,
    };
    this.profiles.set(staffId, updated);

    const newEngagementId = `eng-${generateOperationId('eng')}`;
    const newEngagement: StaffEngagement = {
      id: newEngagementId,
      staffId,
      societyId,
      engagementType: profile.isVendorWorker ? 'VENDOR_WORKER' : 'DIRECT_SOCIETY_STAFF',
      ...(profile.vendorId ? { vendorId: profile.vendorId } : {}),
      roleCategory: profile.category as StaffEngagement['roleCategory'],
      effectiveFrom: effectiveDate,
      status: 'ACTIVE',
      assignedLocation: profile.assignedLocation,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    this.engagements.set(newEngagementId, newEngagement);

    const credentialId = `cred-${generateOperationId('cred')}`;
    const credential: StaffAccessCredential = {
      credentialId,
      staffId,
      societyId,
      type: 'DIGITAL_QR',
      signedQrToken: `token-${staffId}-${Date.now().toString(36)}`,
      validFrom: effectiveDate,
      status: 'ACTIVE',
      allowedGates: [profile.assignedLocation],
      createdAt: nowIso,
    };
    this.credentials.set(credentialId, credential);

    this.auditLogs.push({
      action: 'STAFF_REACTIVATED',
      entityId: staffId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Reactivated staff effective ${effectiveDate}`,
    });

    return updated;
  }

  public getStaff(staffId: string): StaffProfile | undefined {
    return this.profiles.get(staffId);
  }

  public getCredential(credentialId: string): StaffAccessCredential | undefined {
    return this.credentials.get(credentialId);
  }

  public getEngagements(staffId: string): StaffEngagement[] {
    return Array.from(this.engagements.values()).filter(e => e.staffId === staffId);
  }

  public getAuditLogs() {
    return [...this.auditLogs];
  }
}
