import type { FamilyAccessPermissions, FamilyMember, FamilyRelation } from '../../household/data/residentHousehold.types';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';

export type FamilyStayPattern =
  | 'primaryResident'
  | 'secondarySeasonalResident'
  | 'occasionalFamilyVisitor'
  | 'emergencyContactOnly'
  | 'guardianManagedChild'
  | 'inactiveMovedOut';

export type FamilyPortabilityDocument = {
  documentId: string;
  memberId: string;
  title: string;
  scope: 'reusable' | 'societySpecific';
};

export type FamilyPortabilityPlan = {
  sourceHomeContextId: string;
  sourceMembers: readonly FamilyMember[];
  eligibleTargetContexts: readonly ResidentRepositoryRequestContext[];
  reusableDocuments: readonly FamilyPortabilityDocument[];
  missingLocalDocumentTitles: readonly string[];
};

export type FamilyPortabilityInput = {
  sourceContext: ResidentRepositoryRequestContext;
  targetContext: ResidentRepositoryRequestContext;
  familyMemberIds: readonly string[];
  relationToOwner: FamilyRelation;
  stayPattern: FamilyStayPattern;
  permissions: FamilyAccessPermissions;
  consentConfirmed: boolean;
};

export type FamilyPortabilityMemberResult = {
  sourceFamilyMemberId: string;
  targetFamilyMemberId?: string;
  outcome: 'linkedExistingPerson' | 'copiedNewPerson' | 'alreadyLinked' | 'failed';
  reason?: string;
};

export type FamilyPortabilityResult = {
  operationId: string;
  targetHomeContextId: string;
  results: readonly FamilyPortabilityMemberResult[];
  reusableDocumentIds: readonly string[];
  missingLocalDocumentTitles: readonly string[];
};

export type RentalOccupancyModel =
  | 'selfUse'
  | 'longTermTenant'
  | 'companyLease'
  | 'brokerManagedStay'
  | 'shortTermRental'
  | 'vacant'
  | 'underRenovation';

export type RentalDeclaration = {
  declarationId: string;
  homeContextId: string;
  societyId: string;
  unitId: string;
  occupancyModel: RentalOccupancyModel;
  managerName?: string;
  managerPhone?: string;
  effectiveFrom: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled';
  rejectionReason?: string;
  updatedAt: string;
};

export type SubmitRentalDeclarationInput = {
  context: ResidentRepositoryRequestContext;
  occupancyModel: RentalOccupancyModel;
  managerName?: string;
  managerPhone?: string;
  effectiveFrom: string;
};

export type ShortStayPolicyStatus = 'allowed' | 'approvalRequired' | 'prohibited';
export type ShortStayKycStatus = 'notStarted' | 'pending' | 'verified' | 'rejected';
export type ShortStayStatus = 'draft' | 'pendingApproval' | 'approved' | 'checkedIn' | 'overdue' | 'completed' | 'rejected' | 'cancelled';

export type ShortStay = {
  stayId: string;
  homeContextId: string;
  societyId: string;
  unitId: string;
  platform: string;
  listingIdentifier: string;
  listingTitle: string;
  hostOrManager: string;
  societyPolicyStatus: ShortStayPolicyStatus;
  approvalRequired: boolean;
  guestName: string;
  guestCount: number;
  kycStatus: ShortStayKycStatus;
  checkInAt: string;
  checkOutAt: string;
  vehicleNumber?: string;
  accessWindowStart: string;
  accessWindowEnd: string;
  rulesAcknowledged: boolean;
  status: ShortStayStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateShortStayInput = {
  context: ResidentRepositoryRequestContext;
  platform: string;
  listingIdentifier: string;
  listingTitle: string;
  hostOrManager: string;
  guestName: string;
  guestCount: number;
  checkInAt: string;
  checkOutAt: string;
  vehicleNumber?: string;
  rulesAcknowledged: boolean;
};

export type UpdateShortStayStatusInput = {
  context: ResidentRepositoryRequestContext;
  stayId: string;
  action: 'approve' | 'reject' | 'checkIn' | 'checkOut' | 'cancel' | 'extend';
  extendedCheckOutAt?: string;
};

export type ResidentLifecycleRepository = {
  getFamilyPortabilityPlan(context: ResidentRepositoryRequestContext): Promise<FamilyPortabilityPlan>;
  executeFamilyPortability(input: FamilyPortabilityInput): Promise<FamilyPortabilityResult>;
  getRentalDeclaration(context: ResidentRepositoryRequestContext): Promise<RentalDeclaration | null>;
  submitRentalDeclaration(input: SubmitRentalDeclarationInput): Promise<RentalDeclaration>;
  listShortStays(context: ResidentRepositoryRequestContext): Promise<readonly ShortStay[]>;
  createShortStay(input: CreateShortStayInput): Promise<ShortStay>;
  updateShortStayStatus(input: UpdateShortStayStatusInput): Promise<ShortStay>;
};
