import type {
  LinkResidenceInput,
  ResidenceAccessAppeal,
  ResidenceAccessDetail,
  ResidenceAccessListQuery,
  ResidenceAccessNotification,
  ResidenceAccessPage,
  ResidenceAccessResult,
  ResidenceAppealInput,
  ResidenceApprovalReminder,
  ResidenceCorrectionSubmissionInput,
  ResidenceDocumentUploadInput,
  ResidenceOwnerConsentInput,
  ResidenceReactivationInput,
  ResidenceRecoveredUpload,
  ResidenceSuspensionResolutionInput,
  SendResidenceReminderInput,
  SocietyAccessReviewTask,
  SubmitResidenceAccessInput,
} from '../models/residenceAccess.types';

export interface ResidenceAccessRepositorySnapshot {
  readonly adminTasks: readonly SocietyAccessReviewTask[];
  readonly reminders: readonly ResidenceApprovalReminder[];
  readonly appeals: readonly ResidenceAccessAppeal[];
  readonly notifications: readonly ResidenceAccessNotification[];
}

export type ResidenceAccessRepositoryListener = () => void;

export interface ResidenceAccessRepository {
  getResidences(query: ResidenceAccessListQuery): Promise<ResidenceAccessResult<ResidenceAccessPage>>;
  getResidenceDetail(userId: string, residenceAccessId: string): Promise<ResidenceAccessResult<ResidenceAccessDetail>>;
  uploadDocument(input: ResidenceDocumentUploadInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>>;
  removeDocument(userId: string, residenceAccessId: string, documentId: string): Promise<ResidenceAccessResult<ResidenceAccessDetail>>;
  getRecoveredUploads(residenceAccessId: string): Promise<readonly ResidenceRecoveredUpload[]>;
  submitForReview(input: SubmitResidenceAccessInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>>;
  sendReminder(input: SendResidenceReminderInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>>;
  requestOwnerConsent(input: ResidenceOwnerConsentInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>>;
  resubmitCorrection(input: ResidenceCorrectionSubmissionInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>>;
  submitAppeal(input: ResidenceAppealInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>>;
  submitSuspensionResolution(input: ResidenceSuspensionResolutionInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>>;
  requestReactivation(input: ResidenceReactivationInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>>;
  linkResidence(input: LinkResidenceInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>>;
  withdrawRequest(userId: string, residenceAccessId: string, idempotencyKey: string): Promise<ResidenceAccessResult<ResidenceAccessDetail>>;
  activateResidence(userId: string, residenceAccessId: string, idempotencyKey: string): Promise<ResidenceAccessResult<ResidenceAccessDetail>>;
  refreshResidence(userId: string, residenceAccessId: string): Promise<ResidenceAccessResult<ResidenceAccessDetail>>;
  getOutboxSnapshot(): ResidenceAccessRepositorySnapshot;
  subscribe(listener: ResidenceAccessRepositoryListener): () => void;
}
