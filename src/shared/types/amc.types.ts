export type AmcCategory =
  | 'LIFT' | 'FIRE_SYSTEM' | 'FIRE_SAFETY' | 'WATER_PUMP' | 'GENERATOR' | 'CCTV' | 'INTERCOM' | 'STP' | 'WTP'
  | 'SOLAR' | 'SWIMMING_POOL' | 'PEST_CONTROL' | 'HOUSEKEEPING' | 'SECURITY' | 'OTHER';

export type AmcStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'RENEWAL_PENDING' | 'TERMINATED' | 'DRAFT' | 'SUPERSEDED';
export type AmcReminderStatus = 'UPCOMING' | 'DUE_SOON' | 'OVERDUE' | 'RENEWAL_STARTED' | 'RENEWED' | 'ESCALATED';

export type CreateAmcContractInput = {
  vendorId: string;
  vendorName: string;
  category: AmcCategory;
  linkedAssets: string[];
  startDate: string;
  endDate: string;
  contractAmount: number;
  serviceFrequency: string;
  slaTerms: string;
  emergencyResponseTime: string;
  includedServices: string[];
  excludedServices: string[];
  documentVaultIds?: string[];
  notes?: string;
  clientOperationId?: string;
};

export type RenewAmcContractInput = {
  newStartDate?: string;
  newEndDate: string;
  newContractAmount: number;
  newServiceFrequency?: string;
  newSlaTerms?: string;
  newEmergencyResponseTime?: string;
  newIncludedServices?: string[];
  newExcludedServices?: string[];
  newDocumentVaultIds?: string[];
  renewalReason?: string;
  notes?: string;
  clientOperationId?: string;
};

export type AmcContract = {
  id: string;
  contractNumber: string;
  vendorId: string;
  vendorName: string;
  category: AmcCategory;
  linkedAssets: string[];
  startDate: string;
  endDate: string;
  renewalNoticeDate: string;
  renewalDueInDays: number;
  contractAmount: number;
  status: AmcStatus;
  serviceFrequency: string;
  lastServiceDate: string;
  nextServiceDate: string;
  slaTerms: string;
  emergencyResponseTime: string;
  includedServices: string[];
  excludedServices: string[];
  documents: string[];
  documentVaultIds?: string[];
  renewalStatus: AmcReminderStatus;
  notes: string;
  version?: number;
  previousVersionId?: string;
  supersededBy?: string;
  createdAt?: string;
  createdBy?: string;
};

export type AmcRenewalReminder = {
  id: string;
  contractId: string;
  contractNumber: string;
  vendorName: string;
  expiryDate: string;
  daysRemaining: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: AmcReminderStatus;
  responsiblePerson: string;
  lastReminderDate: string;
};
