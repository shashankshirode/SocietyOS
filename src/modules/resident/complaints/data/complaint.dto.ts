import type { Complaint, CreateComplaintPayload } from '../../../../shared/types/complaint.types';

export type ComplaintDto = Partial<Complaint> & Pick<Complaint, 'id'>;
export type CreateComplaintRequestDto = CreateComplaintPayload;

