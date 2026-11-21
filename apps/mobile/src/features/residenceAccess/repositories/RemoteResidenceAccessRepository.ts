import { repositoryErrorMessages } from '../../../messages/en/residenceAccess.messages';
import { residenceAccessApiClient } from '../api/residenceAccessApiClient';
import { residenceAccessEndpoints } from '../api/residenceAccessEndpoints';
import {
  parseResidenceAccessDetail,
  parseResidenceAccessPage,
} from '../api/residenceAccessApiParsers';
import type {
  LinkResidenceInput,
  ResidenceAccessDetail,
  ResidenceAccessListQuery,
  ResidenceAccessPage,
  ResidenceAccessResult,
  ResidenceAppealInput,
  ResidenceCorrectionSubmissionInput,
  ResidenceDocumentUploadInput,
  ResidenceOwnerConsentInput,
  ResidenceReactivationInput,
  ResidenceRecoveredUpload,
  ResidenceSuspensionResolutionInput,
  SendResidenceReminderInput,
  SubmitResidenceAccessInput,
} from '../models/residenceAccess.types';
import type {
  ResidenceAccessRepository,
  ResidenceAccessRepositoryListener,
  ResidenceAccessRepositorySnapshot,
} from './residenceAccess.repository.types';

function serverFailure<T>(): ResidenceAccessResult<T> {
  return {
    ok: false,
    error: {
      code: 'SERVER_ERROR',
      message: repositoryErrorMessages.SERVER_ERROR,
      retryable: true,
    },
  };
}

async function postDetail(
  endpoint: string,
  body: JsonObject,
  idempotencyKey: string,
  signal?: AbortSignal,
): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
  try {
    const payload = await residenceAccessApiClient.postDetail(endpoint, body, idempotencyKey, signal);
    return parseResidenceAccessDetail(payload);
  } catch {
    if (signal?.aborted) {
      return {
        ok: false,
        error: {
          code: 'UPLOAD_CANCELLED',
          message: repositoryErrorMessages.UPLOAD_CANCELLED,
          retryable: true,
        },
      };
    }
    return serverFailure();
  }
}

export class RemoteResidenceAccessRepository implements ResidenceAccessRepository {
  async getResidences(
    query: ResidenceAccessListQuery,
  ): Promise<ResidenceAccessResult<ResidenceAccessPage>> {
    try {
      return parseResidenceAccessPage(await residenceAccessApiClient.list(query));
    } catch {
      return serverFailure();
    }
  }

  async getResidenceDetail(
    _userId: string,
    residenceAccessId: string,
  ): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
    try {
      return parseResidenceAccessDetail(await residenceAccessApiClient.detail(residenceAccessId));
    } catch {
      return serverFailure();
    }
  }

  uploadDocument(input: ResidenceDocumentUploadInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
    return postDetail(
      residenceAccessEndpoints.documents(input.residenceAccessId),
      {
        requirementId: input.requirementId,
        fileName: input.selection.fileName,
        mimeType: input.selection.mimeType,
        fileSizeBytes: input.selection.fileSizeBytes,
        side: input.selection.side,
        expiryDate: input.expiryDate,
      },
      input.idempotencyKey,
      input.signal,
    );
  }

  async removeDocument(
    _userId: string,
    residenceAccessId: string,
    documentId: string,
  ): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
    try {
      const payload = await residenceAccessApiClient.deleteDetail(
        residenceAccessEndpoints.document(residenceAccessId, documentId),
      );
      return parseResidenceAccessDetail(payload);
    } catch {
      return serverFailure();
    }
  }

  async getRecoveredUploads(_residenceAccessId: string): Promise<readonly ResidenceRecoveredUpload[]> {
    return [];
  }

  submitForReview(input: SubmitResidenceAccessInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
    return postDetail(
      residenceAccessEndpoints.submit(input.residenceAccessId),
      {
        residenceAccessId: input.residenceAccessId,
        declarationsAccepted: input.declarationsAccepted,
        rulesAcknowledged: input.rulesAcknowledged,
        consentAccepted: input.consentAccepted,
      },
      input.idempotencyKey,
    );
  }

  sendReminder(input: SendResidenceReminderInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
    return postDetail(
      residenceAccessEndpoints.reminders(input.residenceAccessId),
      {
        residenceAccessId: input.residenceAccessId,
        reason: input.reason,
        ...input.optionalMessage ? { optionalMessage: input.optionalMessage } : {},
      },
      input.idempotencyKey,
    );
  }

  requestOwnerConsent(input: ResidenceOwnerConsentInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
    return postDetail(
      residenceAccessEndpoints.ownerConsent(input.residenceAccessId),
      {
        residenceAccessId: input.residenceAccessId,
        deliveryMethod: input.deliveryMethod,
      },
      input.idempotencyKey,
    );
  }

  resubmitCorrection(input: ResidenceCorrectionSubmissionInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
    return postDetail(
      residenceAccessEndpoints.resubmit(input.residenceAccessId),
      {
        residenceAccessId: input.residenceAccessId,
        affectedRequirementIds: [...input.affectedRequirementIds],
      },
      input.idempotencyKey,
    );
  }

  submitAppeal(input: ResidenceAppealInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
    return postDetail(
      residenceAccessEndpoints.appeals(input.residenceAccessId),
      {
        residenceAccessId: input.residenceAccessId,
        reason: input.reason,
        explanation: input.explanation,
        supportingDocumentId: input.supportingDocumentId,
        supportingDocument: input.supportingDocument
          ? {
              fileName: input.supportingDocument.fileName,
              mimeType: input.supportingDocument.mimeType,
              fileSizeBytes: input.supportingDocument.fileSizeBytes,
              side: input.supportingDocument.side,
            }
          : undefined,
        acknowledgementAccepted: input.acknowledgementAccepted,
      },
      input.idempotencyKey,
    );
  }

  submitSuspensionResolution(input: ResidenceSuspensionResolutionInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
    return postDetail(
      residenceAccessEndpoints.suspensionResolution(input.residenceAccessId),
      {
        residenceAccessId: input.residenceAccessId,
        explanation: input.explanation,
        supportingDocumentIds: [...input.supportingDocumentIds],
      },
      input.idempotencyKey,
    );
  }

  requestReactivation(input: ResidenceReactivationInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
    return postDetail(
      residenceAccessEndpoints.reactivation(input.residenceAccessId),
      {
        residenceAccessId: input.residenceAccessId,
        reason: input.reason,
        ...input.residentMessage ? { residentMessage: input.residentMessage } : {},
        supportingDocumentIds: [...input.supportingDocumentIds],
      },
      input.idempotencyKey,
    );
  }

  linkResidence(input: LinkResidenceInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
    return postDetail(residenceAccessEndpoints.link, {
      userId: input.userId,
      method: input.method,
      societyIdentifier: input.societyIdentifier,
      unitNumber: input.unitNumber,
      role: input.role,
      ...input.relationshipDescription ? { relationshipDescription: input.relationshipDescription } : {},
    }, input.idempotencyKey);
  }

  withdrawRequest(
    _userId: string,
    residenceAccessId: string,
    idempotencyKey: string,
  ): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
    return postDetail(
      residenceAccessEndpoints.withdraw(residenceAccessId),
      { residenceAccessId },
      idempotencyKey,
    );
  }

  activateResidence(
    _userId: string,
    residenceAccessId: string,
    idempotencyKey: string,
  ): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
    return postDetail(
      residenceAccessEndpoints.activate(residenceAccessId),
      { residenceAccessId },
      idempotencyKey,
    );
  }

  refreshResidence(
    userId: string,
    residenceAccessId: string,
  ): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
    return this.getResidenceDetail(userId, residenceAccessId);
  }

  getOutboxSnapshot(): ResidenceAccessRepositorySnapshot {
    return { adminTasks: [], reminders: [], appeals: [], notifications: [] };
  }

  subscribe(_listener: ResidenceAccessRepositoryListener): () => void {
    return () => undefined;
  }
}

export const remoteResidenceAccessRepository = new RemoteResidenceAccessRepository();
