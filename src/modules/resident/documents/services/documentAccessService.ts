import type {
  Document,
  DocumentVersion,
  DocumentAccessCheckResult,
  DocumentEntityType,
  DocumentSensitivity,
  DocumentCategory,
  DocumentStatus,
} from '../types/documentVault.types';
import type { ResidentHomeRole } from '../../homeContext/data/residentHomeContext.types';
import type { AppRole } from '../../../../core/permissions/permission.types';
import { hasPermission } from '../../../../core/permissions/rolePermissionMap';

export interface DocumentAccessContext {
  userId: string;
  userRole: AppRole;
  societyId: string;
  residentRole?: ResidentHomeRole;
  activeUnitId?: string;
  activeHomeContextId?: string;
  permissions: string[];
}

export interface EntityRelationship {
  entityType: string;
  entityId: string;
  relationshipType: 'OWNER' | 'TENANT' | 'FAMILY_MEMBER' | 'CO_OWNER' | 'AUTHORIZED_OCCUPANT' | 'STAFF' | 'VENDOR' | 'COMMITTEE_MEMBER' | 'NONE';
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export class DocumentAccessService {
  private static entityTypeRoleMap: Record<DocumentEntityType, AppRole[]> = {
    USER: ['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY'],
    RESIDENT: ['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY'],
    OWNER: ['RESIDENT_OWNER', 'CHAIRPERSON', 'SECRETARY', 'TREASURER', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN'],
    TENANT: ['RESIDENT_TENANT', 'RESIDENT_FAMILY'],
    UNIT: ['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY', 'CHAIRPERSON', 'SECRETARY', 'TREASURER', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN', 'FACILITY_MANAGER'],
    SOCIETY: ['CHAIRPERSON', 'SECRETARY', 'TREASURER', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN', 'SUPER_ADMIN'],
    MOVE_IN_REQUEST: ['RESIDENT_OWNER', 'RESIDENT_TENANT', 'CHAIRPERSON', 'SECRETARY', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN'],
    MOVE_OUT_REQUEST: ['RESIDENT_OWNER', 'RESIDENT_TENANT', 'CHAIRPERSON', 'SECRETARY', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN'],
    NOC: ['RESIDENT_OWNER', 'RESIDENT_TENANT', 'CHAIRPERSON', 'SECRETARY', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN'],
    VEHICLE: ['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY', 'SECURITY_GUARD', 'SECURITY_SUPERVISOR'],
    PARKING: ['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY', 'SECURITY_GUARD', 'SECURITY_SUPERVISOR'],
    VENDOR: ['VENDOR_USER', 'FACILITY_MANAGER', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN'],
    COMPLIANCE_RECORD: ['COMMITTEE_MEMBER', 'SOCIETY_ADMIN', 'AUDITOR'],
    STAFF: ['STAFF_USER', 'FACILITY_MANAGER', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN'],
    ASSET: ['FACILITY_MANAGER', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN'],
  };

  private static sensitivityRoleMap: Record<DocumentSensitivity, AppRole[]> = {
    PUBLIC: [],
    INTERNAL: ['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY', 'CHAIRPERSON', 'SECRETARY', 'TREASURER', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN', 'FACILITY_MANAGER', 'SECURITY_GUARD', 'SECURITY_SUPERVISOR', 'STAFF_USER', 'VENDOR_USER'],
    CONFIDENTIAL: ['RESIDENT_OWNER', 'CHAIRPERSON', 'SECRETARY', 'TREASURER', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN'],
    SENSITIVE: ['RESIDENT_OWNER', 'RESIDENT_TENANT', 'CHAIRPERSON', 'SECRETARY', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN'],
    HIGHLY_SENSITIVE: ['RESIDENT_OWNER', 'CHAIRPERSON', 'SECRETARY', 'SOCIETY_ADMIN'],
    RESIDENT_ONLY: ['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY'],
    OWNER_ONLY: ['RESIDENT_OWNER', 'CHAIRPERSON', 'SECRETARY', 'SOCIETY_ADMIN'],
    TENANT_ONLY: ['RESIDENT_TENAT', 'RESIDENT_FAMILY', 'CHAIRPERSON', 'SECRETARY', 'SOCIETY_ADMIN'],
    COMMITTEE_ONLY: ['CHAIRPERSON', 'SECRETARY', 'TREASURER', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN'],
    ADMIN_ONLY: ['SOCIETY_ADMIN', 'SUPER_ADMIN'],
    RESTRICTED: ['SUPER_ADMIN'],
  };

  static async checkDocumentAccess(
    context: DocumentAccessContext,
    document: Document,
    action: 'VIEW' | 'DOWNLOAD' | 'UPLOAD' | 'REPLACE' | 'VERIFY' | 'ARCHIVE' | 'VIEW_VERSIONS'
  ): Promise<DocumentAccessCheckResult> {
    const baseResult: DocumentAccessCheckResult = {
      canView: false,
      canDownload: false,
      canUpload: false,
      canReplace: false,
      canVerify: false,
      canArchive: false,
      canViewVersions: false,
    };

    if (document.societyId !== context.societyId) {
      return { ...baseResult, denialReason: 'Cross-society access denied' };
    }

    const entityRelationship = await this.getEntityRelationship(context, document);
    if (!entityRelationship || entityRelationship.relationshipType === 'NONE') {
      return { ...baseResult, denialReason: 'No valid relationship to document entity' };
    }

    const hasEntityAccess = this.entityTypeRoleMap[document.entityType]?.some(role => context.userRole === role) ?? false;
    if (!hasEntityAccess) {
      return { ...baseResult, denialReason: 'Insufficient role for entity type' };
    }

    const hasSensitivityAccess = this.sensitivityRoleMap[document.sensitivity]?.some(role => context.userRole === role) ?? false;
    if (!hasSensitivityAccess) {
      return { ...baseResult, denialReason: 'Insufficient role for document sensitivity' };
    }

    const hasDocumentPermission = this.checkDocumentPermission(context, action);
    if (!hasDocumentPermission) {
      return { ...baseResult, denialReason: `Missing ${action.toLowerCase()} permission` };
    }

    if (!entityRelationship.isActive) {
      const isHistoricalAccess = this.isHistoricalAccessAllowed(context, document, entityRelationship);
      if (!isHistoricalAccess) {
        return { ...baseResult, denialReason: 'Relationship is not active and historical access not permitted' };
      }
    }

    switch (action) {
      case 'VIEW':
        baseResult.canView = true;
        break;
      case 'DOWNLOAD':
        baseResult.canDownload = true;
        baseResult.canView = true;
        break;
      case 'UPLOAD':
        baseResult.canUpload = true;
        break;
      case 'REPLACE':
        baseResult.canReplace = true;
        baseResult.canView = true;
        break;
      case 'VERIFY':
        baseResult.canVerify = true;
        baseResult.canView = true;
        break;
      case 'ARCHIVE':
        baseResult.canArchive = true;
        baseResult.canView = true;
        break;
      case 'VIEW_VERSIONS':
        baseResult.canViewVersions = true;
        baseResult.canView = true;
        break;
    }

    return baseResult;
  }

  private static async getEntityRelationship(
    context: DocumentAccessContext,
    document: Document
  ): Promise<EntityRelationship | null> {
    if (document.entityType === 'UNIT' && context.activeUnitId === document.entityId) {
      return {
        entityType: 'UNIT',
        entityId: document.entityId,
        relationshipType: context.residentRole === 'owner' ? 'OWNER' :
          context.residentRole === 'tenant' ? 'TENANT' :
            context.residentRole === 'familyMember' ? 'FAMILY_MEMBER' : 'NONE',
        isActive: true,
      };
    }

    if (document.entityType === 'RESIDENT' && document.entityId === context.userId) {
      return {
        entityType: 'RESIDENT',
        entityId: document.entityId,
        relationshipType: 'OWNER',
        isActive: true,
      };
    }

    if (document.entityType === 'TENANT' || document.entityType === 'OWNER' || document.entityType === 'FAMILY_MEMBER') {
      return {
        entityType: document.entityType,
        entityId: document.entityId,
        relationshipType: document.entityType as any,
        isActive: document.status === 'VERIFIED' || document.status === 'ACTIVE',
      };
    }

    if (document.entityType === 'SOCIETY') {
      return {
        entityType: 'SOCIETY',
        entityId: document.entityId,
        relationshipType: 'COMMITTEE_MEMBER',
        isActive: ['CHAIRPERSON', 'SECRETARY', 'TREASURER', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN'].includes(context.userRole),
      };
    }

    return {
      entityType: document.entityType,
      entityId: document.entityId,
      relationshipType: 'NONE',
      isActive: false,
    };
  }

  private static checkDocumentPermission(context: DocumentAccessContext, action: string): boolean {
    const permissionMap: Record<string, string[]> = {
      VIEW: ['DOCUMENT_VIEW_OWN', 'DOCUMENT_VIEW_SOCIETY', 'DOCUMENT_VIEW_RESTRICTED'],
      DOWNLOAD: ['DOCUMENT_DOWNLOAD', 'DOCUMENT_VIEW_OWN', 'DOCUMENT_VIEW_SOCIETY'],
      UPLOAD: ['DOCUMENT_UPLOAD'],
      REPLACE: ['DOCUMENT_REPLACE', 'DOCUMENT_UPLOAD'],
      VERIFY: ['DOCUMENT_VERIFY'],
      ARCHIVE: ['DOCUMENT_ARCHIVE'],
      VIEW_VERSIONS: ['DOCUMENT_VIEW_VERSIONS', 'DOCUMENT_VIEW_OWN', 'DOCUMENT_VIEW_SOCIETY'],
    };

    const requiredPermissions = permissionMap[action] || [];
    if (requiredPermissions.length === 0) return true;

    return requiredPermissions.some(perm => context.permissions.includes(perm));
  }

  private static isHistoricalAccessAllowed(
    context: DocumentAccessContext,
    document: Document,
    relationship: EntityRelationship
  ): boolean {
    if (['CHAIRPERSON', 'SECRETARY', 'TREASURER', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN', 'SUPER_ADMIN', 'AUDITOR'].includes(context.userRole)) {
      return true;
    }

    if (document.entityType === 'RESIDENT' && document.entityId === context.userId) {
      return true;
    }

    if (document.sensitivity === 'PUBLIC' || document.sensitivity === 'INTERNAL') {
      return true;
    }

    return false;
  }

  static getAccessibleCategoriesForRole(role: AppRole, isAdmin: boolean): DocumentCategory[] {
    if (isAdmin || ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'CHAIRPERSON', 'SECRETARY'].includes(role)) {
      return [
        'IDENTITY', 'ADDRESS_PROOF', 'KYC', 'OWNERSHIP_PROOF', 'RENTAL_AGREEMENT',
        'TENANCY_DOCUMENT', 'MOVE_IN_DOCUMENT', 'MOVE_OUT_DOCUMENT', 'NOC',
        'PARKING_DOCUMENT', 'VEHICLE_DOCUMENT', 'SOCIETY_DOCUMENT', 'INSURANCE',
        'MAINTENANCE_DOCUMENT', 'VENDOR_DOCUMENT', 'COMPLIANCE_DOCUMENT',
        'FINANCIAL_DOCUMENT', 'LEGAL_DOCUMENT', 'STAFF_CONTRACT', 'AMC',
        'PET_REGISTRATION', 'OTHER'
      ];
    }

    const roleCategoryMap: Record<string, DocumentCategory[]> = {
      RESIDENT_OWNER: [
        'IDENTITY', 'ADDRESS_PROOF', 'KYC', 'OWNERSHIP_PROOF', 'RENTAL_AGREEMENT',
        'TENANCY_DOCUMENT', 'MOVE_IN_DOCUMENT', 'MOVE_OUT_DOCUMENT', 'NOC',
        'PARKING_DOCUMENT', 'VEHICLE_DOCUMENT', 'INSURANCE', 'PET_REGISTRATION', 'OTHER'
      ],
      RESIDENT_TENANT: [
        'IDENTITY', 'ADDRESS_PROOF', 'KYC', 'RENTAL_AGREEMENT', 'TENANCY_DOCUMENT',
        'MOVE_IN_DOCUMENT', 'MOVE_OUT_DOCUMENT', 'NOC', 'PARKING_DOCUMENT',
        'VEHICLE_DOCUMENT', 'PET_REGISTRATION', 'OTHER'
      ],
      RESIDENT_FAMILY: [
        'IDENTITY', 'ADDRESS_PROOF', 'KYC', 'PARKING_DOCUMENT', 'VEHICLE_DOCUMENT', 'OTHER'
      ],
      SECURITY_GUARD: ['VEHICLE_DOCUMENT', 'PARKING_DOCUMENT'],
      SECURITY_SUPERVISOR: ['VEHICLE_DOCUMENT', 'PARKING_DOCUMENT'],
      FACILITY_MANAGER: ['MAINTENANCE_DOCUMENT', 'VENDOR_DOCUMENT', 'INSURANCE', 'AMC'],
      VENDOR_USER: ['VENDOR_DOCUMENT', 'AMC'],
      STAFF_USER: ['STAFF_CONTRACT'],
    };

    return roleCategoryMap[role] || ['OTHER'];
  }

  static canUserAccessDocumentInHistoricalContext(
    context: DocumentAccessContext,
    document: Document,
    currentOccupantRole?: ResidentHomeRole
  ): boolean {
    if (['SUPER_ADMIN', 'SOCIETY_ADMIN', 'AUDITOR'].includes(context.userRole)) {
      return true;
    }

    if (document.entityType === 'RESIDENT' && document.entityId === context.userId) {
      return true;
    }

    if (document.sensitivity === 'PUBLIC') {
      return true;
    }

    if (document.sensitivity === 'INTERNAL' && ['CHAIRPERSON', 'SECRETARY', 'TREASURER', 'COMMITTEE_MEMBER', 'SOCIETY_ADMIN'].includes(context.userRole)) {
      return true;
    }

    if (document.entityType === 'UNIT' && currentOccupantRole) {
      if (currentOccupantRole === 'owner' && ['RESIDENT_OWNER', 'RESIDENT_TENANT'].includes(context.userRole)) {
        return document.sensitivity !== 'HIGHLY_SENSITIVE' && document.sensitivity !== 'RESTRICTED';
      }
      if (currentOccupantRole === 'tenant' && context.userRole === 'RESIDENT_TENANT') {
        return document.sensitivity !== 'HIGHLY_SENSITIVE' && document.sensitivity !== 'RESTRICTED' && document.sensitivity !== 'OWNER_ONLY';
      }
    }

    return false;
  }
}