import type { NocCertificate, NocRequest } from '../../../../shared/types/noc.types';
import type { ClearanceChecklistItem, MoveOutRequest } from '../../../../shared/types/moveOut.types';

export type NocRequestDto = Partial<NocRequest> & Pick<NocRequest, 'id'>;
export type NocCertificateDto = Partial<NocCertificate> & Pick<NocCertificate, 'id'>;
export type MoveOutRequestDto = Partial<MoveOutRequest> & Pick<MoveOutRequest, 'id'>;
export type ClearanceChecklistItemDto = Partial<ClearanceChecklistItem> & Pick<ClearanceChecklistItem, 'id'>;

export type CreateNocRequestInput = {
  nocType: string;
  reason: string;
  requiredByDate: string;
  notes?: string;
};

export type MoveOutRequestInput = {
  personType: string;
  proposedMoveOutDate: string;
  reason: string;
  contactNumber: string;
};

