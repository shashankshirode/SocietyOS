import type {
  HomeStackParamList,
  ResidentConnectStackParamList,
} from '../../app/navigation/navigation.types';
import type { MessageKey } from '../../modules/resident/navigation/residentHeader.types';

export type PrerequisiteSeverity = 'info' | 'warning' | 'blocking' | 'restricted';

export type PrerequisiteStatus =
  | 'satisfied'
  | 'missing'
  | 'blocked'
  | 'restricted'
  | 'notApplicable';

export type PrerequisiteActionType =
  | 'navigate'
  | 'openModal'
  | 'retry'
  | 'contactAdmin'
  | 'waitForApproval'
  | 'uploadDocument'
  | 'completeProfile'
  | 'payDues'
  | 'createDraft'
  | 'none';

export type ResidentRouteName = keyof HomeStackParamList | keyof ResidentConnectStackParamList;

export type ResidentModuleKey =
  | 'visitors'
  | 'billing'
  | 'complaints'
  | 'documents'
  | 'noc'
  | 'tenant'
  | 'facility'
  | 'residentConnect'
  | 'contextualInsights';

export type PrerequisiteAction = {
  type: PrerequisiteActionType;
  labelMessageKey: MessageKey;
  routeName?: ResidentRouteName;
};

export type PrerequisiteCheck = {
  id: string;
  status: PrerequisiteStatus;
  severity: PrerequisiteSeverity;
  titleMessageKey: MessageKey;
  descriptionMessageKey: MessageKey;
  requiredForMessageKey: MessageKey;
  resolutionStepsMessageKeys: MessageKey[];
  action?: PrerequisiteAction;
};

export type PrerequisiteEvaluationResult = {
  moduleKey: ResidentModuleKey;
  actionKey: string;
  canContinue: boolean;
  checks: PrerequisiteCheck[];
  blockingChecks: PrerequisiteCheck[];
  warningChecks: PrerequisiteCheck[];
};

export type PrerequisiteRuntimeContext = {
  activeSocietyExists?: boolean;
  activeUnitExists?: boolean;
  residentAccessActive?: boolean;
  featureEnabled?: boolean;
  permissionEnabled?: boolean;
  gateSetupExists?: boolean;
  visitorDetailsProvided?: boolean;
  currentBillExists?: boolean;
  billPublished?: boolean;
  outstandingAmountExists?: boolean;
  paymentMethodsConfigured?: boolean;
  complaintCategoriesConfigured?: boolean;
  complaintDetailsProvided?: boolean;
  documentPermissionEnabled?: boolean;
  documentTypeSelected?: boolean;
  documentFileSelected?: boolean;
  documentVisibilityDefined?: boolean;
  nocTypeSelected?: boolean;
  requiredDocumentsAvailable?: boolean;
  duesClearanceAvailable?: boolean;
  complaintClearanceAvailable?: boolean;
  parkingClearanceAvailable?: boolean;
  currentResidentIsOwner?: boolean;
  ownerProfileActive?: boolean;
  activeTenantExists?: boolean;
  pendingTenantRequestExists?: boolean;
  previousTenantMoveOutCompleted?: boolean;
  previousTenantNocCompleted?: boolean;
  ownerConsentAvailable?: boolean;
  rentAgreementAvailable?: boolean;
  facilityExists?: boolean;
  facilityRulesConfigured?: boolean;
  facilitySlotsConfigured?: boolean;
  selectedSlotAvailable?: boolean;
  facilityPaymentRuleKnown?: boolean;
  privacySettingsLoaded?: boolean;
  targetResidentExists?: boolean;
  connectDetailsProvided?: boolean;
  duplicateRequestExists?: boolean;
  targetBlockedRequester?: boolean;
  activeSocietyAreaExists?: boolean;
  weatherSnapshotExists?: boolean;
  localAdvisoryFeedAvailable?: boolean;
};

export type PrerequisiteDefinition = {
  id: string;
  contextKey: keyof PrerequisiteRuntimeContext;
  missingStatus: Exclude<PrerequisiteStatus, 'satisfied' | 'notApplicable'>;
  severity: PrerequisiteSeverity;
  titleMessageKey: MessageKey;
  descriptionMessageKey: MessageKey;
  requiredForMessageKey: MessageKey;
  resolutionStepsMessageKeys: MessageKey[];
  action?: PrerequisiteAction;
  expectedValue?: boolean;
};
