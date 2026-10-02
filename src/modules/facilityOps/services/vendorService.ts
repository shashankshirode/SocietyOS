import type {
  Vendor,
  RegisterVendorInput,
  VendorDocument,
  VendorVerification,
  EmergencyVendorOverride,
  VendorCategory,
} from '../../../shared/types/vendor.types';
import type { FacilityOperationsActor } from '../data/facilityOpsActor.types';
import { generateOperationId } from '../../../core/api/idempotency';

export interface VendorOnboardingResult {
  vendor: Vendor;
  requiredDocuments: VendorDocument[];
  verification: VendorVerification;
}

export class VendorService {
  private static instance: VendorService;
  private vendors: Map<string, Vendor> = new Map();
  private documents: Map<string, VendorDocument[]> = new Map();
  private verifications: Map<string, VendorVerification> = new Map();
  private emergencyOverrides: EmergencyVendorOverride[] = [];

  private constructor() {}

  static getInstance(): VendorService {
    if (!VendorService.instance) {
      VendorService.instance = new VendorService();
    }
    return VendorService.instance;
  }

  getRequiredDocumentsForCategory(category: VendorCategory): Array<{
    documentType: string;
    documentCategory: VendorDocument['documentCategory'];
    expiryDate?: string;
  }> {
    const baseDocs: Array<{
      documentType: string;
      documentCategory: VendorDocument['documentCategory'];
      expiryDate?: string;
    }> = [
      { documentType: 'GST Certificate', documentCategory: 'GST' },
      { documentType: 'PAN Card', documentCategory: 'PAN' },
      { documentType: 'Insurance Certificate', documentCategory: 'INSURANCE', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '' },
    ];

    const categoryDocs: Record<string, Array<{ documentType: string; documentCategory: VendorDocument['documentCategory']; expiryDate?: string }>> = {
      LIFT_MAINTENANCE: [
        { documentType: 'Lift License', documentCategory: 'LICENSE', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '' },
        { documentType: 'Safety Certificate', documentCategory: 'CERTIFICATE', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '' },
      ],
      FIRE_SAFETY: [
        { documentType: 'Fire License', documentCategory: 'LICENSE', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '' },
        { documentType: 'Equipment Certificate', documentCategory: 'CERTIFICATE', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '' },
      ],
      ELECTRICAL: [
        { documentType: 'Electrical License', documentCategory: 'LICENSE', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '' },
      ],
    };

    return [...baseDocs, ...(categoryDocs[category] || [])];
  }

  registerVendor(
    input: RegisterVendorInput,
    actor: FacilityOperationsActor,
    clientVendorRegistrationId?: string
  ): Vendor {
    if (!actor.hasPermission('CREATE_VENDOR') && !actor.hasPermission('MANAGE_VENDORS')) {
      throw new Error('ACCESS_DENIED: Actor lacks permission to register vendor');
    }

    if (!input.vendorName || input.vendorName.trim().length === 0) {
      throw new Error('VALIDATION_ERROR: Vendor name is mandatory');
    }
    if (!input.category) {
      throw new Error('VALIDATION_ERROR: Vendor category is mandatory');
    }
    if (!input.mobileNumber || input.mobileNumber.trim().length < 10) {
      throw new Error('VALIDATION_ERROR: Valid mobile number is mandatory');
    }

    const vendorId = clientVendorRegistrationId ?? generateOperationId('vnd');

    const vendor: Vendor = {
      id: vendorId,
      name: input.vendorName.trim(),
      vendorName: input.vendorName.trim(),
      category: input.category,
      contactPerson: input.contactPerson,
      maskedPhone: input.mobileNumber.replace(/\d(?=\d{4})/g, '*'),
      maskedEmail: input.email ? `${input.email.slice(0, 2)}****${input.email.slice(input.email.indexOf('@'))}` : '****@example.com',
      officeAddress: input.officeAddress,
      status: 'VERIFICATION_PENDING',
      verificationStatus: 'PENDING',
      complianceStatus: 'PENDING',
      activeAmcCount: 0,
      openWorkOrders: 0,
      rating: 0,
      overallRating: 0,
      servicesOffered: typeof input.servicesOffered === 'string'
        ? [{ category: input.category, description: input.servicesOffered, emergencySupport: input.emergencySupportAvailable ?? false }]
        : input.servicesOffered
        ? [...input.servicesOffered]
        : [{ category: input.category, description: `${input.category} services`, emergencySupport: input.emergencySupportAvailable ?? false }],
      assignedAssets: [],
      completedWorkOrders: 0,
      slaScore: 100,
      notes: input.notes ?? '',
      contacts: (input.contacts ?? []).map((c, index) => ({
        ...c,
        id: `ct-${index + 1}`,
        vendorId,
      })),
      documents: [],
      bankAccounts: (input.bankAccounts ?? []).map((b, index) => ({
        ...b,
        id: `ba-${index + 1}`,
        vendorId,
        accountNumberMasked: b.accountNumberMasked ?? '****0000',
        verified: false,
        createdAt: new Date().toISOString(),
      })),
      emergencySupportAvailable: input.emergencySupportAvailable ?? false,
      version: 1,
      createdAt: new Date().toISOString(),
      createdBy: actor.userId,
      ...(input.legalName ? { legalName: input.legalName.trim() } : {}),
      ...(input.gstNumber ? { gstMasked: `${input.gstNumber.slice(0, 4)}****${input.gstNumber.slice(-3)}` } : {}),
      ...(input.panNumber ? { panMasked: `${input.panNumber.slice(0, 3)}****${input.panNumber.slice(-1)}` } : {}),
      ...(input.cinNumber ? { cinMasked: `${input.cinNumber.slice(0, 4)}****${input.cinNumber.slice(-3)}` } : {}),
    };

    this.vendors.set(vendor.id, vendor);
    this.documents.set(vendor.id, []);

    const verification: VendorVerification = {
      vendorId: vendor.id,
      status: 'PENDING',
      checks: {
        gstValid: false,
        panValid: false,
        insuranceValid: false,
        licensesValid: false,
        bankVerified: false,
        addressVerified: false,
      },
    };
    this.verifications.set(vendor.id, verification);

    return vendor;
  }

  getVendor(id: string): Vendor | null {
    return this.vendors.get(id) ?? null;
  }

  getVendors(): Vendor[] {
    return Array.from(this.vendors.values());
  }

  uploadDocument(
    vendorId: string,
    doc: {
      documentType: string;
      documentCategory: VendorDocument['documentCategory'];
      documentVaultId: string;
      sensitivity?: VendorDocument['sensitivity'];
      expiryDate?: string;
    },
    actor: FacilityOperationsActor
  ): VendorDocument {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) {
      throw new Error('VENDOR_NOT_FOUND');
    }

    const docId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newDoc: VendorDocument = {
      id: docId,
      vendorId,
      documentName: doc.documentType,
      documentType: doc.documentType,
      documentCategory: doc.documentCategory,
      documentVaultId: doc.documentVaultId,
      status: 'UPLOADED',
      uploadedDate: new Date().toISOString().split('T')[0] ?? '',
      sensitivity: doc.sensitivity ?? 'INTERNAL',
      version: 1,
      ...(doc.expiryDate ? { expiryDate: doc.expiryDate } : {}),
    };

    const docs = this.documents.get(vendorId) ?? [];
    docs.push(newDoc);
    this.documents.set(vendorId, docs);

    vendor.documents = docs;
    return newDoc;
  }

  getVendorDocuments(vendorId: string, actor: FacilityOperationsActor): VendorDocument[] {
    const docs = this.documents.get(vendorId) ?? [];
    if (actor.role === 'TECHNICIAN' || actor.role === 'VENDOR_TECHNICIAN') {
      return docs.filter((d) => d.sensitivity === 'PUBLIC');
    }
    return docs;
  }

  verifyDocument(vendorId: string, documentId: string, actor: FacilityOperationsActor): VendorDocument {
    if (!actor.hasPermission('VERIFY_VENDOR_DOCUMENTS') && !actor.hasPermission('MANAGE_VENDORS')) {
      throw new Error('ACCESS_DENIED: Actor lacks permission to verify vendor documents');
    }

    const docs = this.documents.get(vendorId) ?? [];
    const doc = docs.find((d) => d.id === documentId);
    if (!doc) {
      throw new Error('DOCUMENT_NOT_FOUND');
    }

    doc.status = 'VERIFIED';
    doc.verifiedBy = actor.name;
    doc.verifiedAt = new Date().toISOString();

    return doc;
  }

  verifyVendor(vendorId: string, actor: FacilityOperationsActor): VendorVerification {
    if (!actor.hasPermission('APPROVE_VENDOR') && !actor.hasPermission('MANAGE_VENDORS')) {
      throw new Error('ACCESS_DENIED: Actor lacks permission to approve vendor');
    }

    const vendor = this.vendors.get(vendorId);
    if (!vendor) {
      throw new Error('VENDOR_NOT_FOUND');
    }

    const docs = this.documents.get(vendorId) ?? [];
    const allVerified = docs.length > 0 && docs.every((d) => d.status === 'VERIFIED');

    const verification: VendorVerification = {
      vendorId,
      status: allVerified ? 'VERIFIED' : 'IN_PROGRESS',
      verifiedBy: actor.name,
      verifiedAt: new Date().toISOString(),
      checks: {
        gstValid: docs.some((d) => d.documentCategory === 'GST' && d.status === 'VERIFIED'),
        panValid: docs.some((d) => d.documentCategory === 'PAN' && d.status === 'VERIFIED'),
        insuranceValid: docs.some((d) => d.documentCategory === 'INSURANCE' && d.status === 'VERIFIED'),
        licensesValid: true,
        bankVerified: true,
        addressVerified: true,
      },
    };

    this.verifications.set(vendorId, verification);

    if (allVerified) {
      vendor.status = 'ACTIVE';
      vendor.verificationStatus = 'VERIFIED';
      vendor.complianceStatus = 'COMPLIANT';
    }

    return verification;
  }

  suspendVendor(vendorId: string, reason: string, actor: FacilityOperationsActor): Vendor {
    if (!actor.hasPermission('SUSPEND_VENDOR') && !actor.hasPermission('MANAGE_VENDORS')) {
      throw new Error('ACCESS_DENIED: Actor lacks permission to suspend vendor');
    }

    const vendor = this.vendors.get(vendorId);
    if (!vendor) {
      throw new Error('VENDOR_NOT_FOUND');
    }

    vendor.status = 'SUSPENDED';
    vendor.notes = `${vendor.notes ?? ''} | Suspended: ${reason}`;
    vendor.updatedAt = new Date().toISOString();
    return vendor;
  }

  deactivateVendor(vendorId: string, reason: string, actor: FacilityOperationsActor): Vendor {
    if (!actor.hasPermission('DEACTIVATE_VENDOR') && !actor.hasPermission('MANAGE_VENDORS')) {
      throw new Error('ACCESS_DENIED: Actor lacks permission to deactivate vendor');
    }

    const vendor = this.vendors.get(vendorId);
    if (!vendor) {
      throw new Error('VENDOR_NOT_FOUND');
    }

    if (vendor.openWorkOrders > 0) {
      throw new Error(`DEACTIVATION_BLOCKED: Vendor has ${vendor.openWorkOrders} open work orders`);
    }

    vendor.status = 'INACTIVE';
    vendor.notes = `${vendor.notes ?? ''} | Deactivated: ${reason}`;
    vendor.updatedAt = new Date().toISOString();
    return vendor;
  }

  recordEmergencyOverride(
    vendorId: string,
    workOrderId: string,
    expiredRequirements: string[],
    overrideReason: string,
    actor: FacilityOperationsActor
  ): EmergencyVendorOverride {
    if (!actor.hasPermission('EMERGENCY_OVERRIDE')) {
      throw new Error('ACCESS_DENIED: Insufficient permissions to perform emergency vendor override');
    }
    if (!overrideReason || overrideReason.trim().length === 0) {
      throw new Error('VALIDATION_ERROR: Emergency override reason is mandatory');
    }
    if (expiredRequirements.length === 0) {
      throw new Error('VALIDATION_ERROR: Expired requirements must be specified');
    }

    const override: EmergencyVendorOverride = {
      id: generateOperationId('emerg-override'),
      vendorId,
      workOrderId,
      expiredRequirements: [...expiredRequirements],
      overrideReason,
      authorizedByActorId: actor.userId,
      authorizedByActorName: actor.name,
      authorizedAt: new Date().toISOString(),
    };

    this.emergencyOverrides.push(override);
    return override;
  }

  clear(): void {
    this.vendors.clear();
    this.documents.clear();
    this.verifications.clear();
    this.emergencyOverrides = [];
  }
}

export const vendorService = VendorService.getInstance();
