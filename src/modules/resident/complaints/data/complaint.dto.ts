import type { ComplaintCategory, ComplaintPriority, ComplaintStatus, CreateComplaintPayload } from '../../../../shared/types/complaint.types';
import { D, type Decoder } from '../../../../core/api/decoders';

export interface ComplaintUpdateDto {
  readonly id: string;
  readonly status: string;
  readonly note: string;
  readonly timestamp: string;
}

export interface ComplaintDto {
  readonly id: string;
  readonly title?: string;
  readonly description?: string;
  readonly category?: ComplaintCategory;
  readonly status?: ComplaintStatus;
  readonly priority?: ComplaintPriority;
  readonly location?: string;
  readonly flatNumber?: string;
  readonly residentName?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly slaText?: string;
  readonly assignedTo?: string;
  readonly resolutionNote?: string;
  readonly updates?: readonly ComplaintUpdateDto[];
}

export type CreateComplaintRequestDto = CreateComplaintPayload;

export const complaintUpdateDtoDecoder: Decoder<ComplaintUpdateDto> = D.object({
  id: D.string,
  status: D.string,
  note: D.string,
  timestamp: D.string,
});

export const complaintDtoDecoder: Decoder<ComplaintDto> = D.object({
  id: D.string,
  title: D.optional(D.string),
  description: D.optional(D.string),
  category: D.optional(D.oneOf([
    'PLUMBING',
    'LIFT',
    'SECURITY',
    'HOUSEKEEPING',
    'PARKING',
    'NOISE',
    'WATER_LEAKAGE',
    'ELECTRICAL',
    'OTHER',
  ] as const)),
  status: D.optional(D.oneOf([
    'OPEN',
    'IN_PROGRESS',
    'WAITING_FOR_RESIDENT',
    'RESOLVED',
    'CLOSED',
    'REOPENED',
  ] as const)),
  priority: D.optional(D.oneOf(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const)),
  location: D.optional(D.string),
  flatNumber: D.optional(D.string),
  residentName: D.optional(D.string),
  createdAt: D.optional(D.string),
  updatedAt: D.optional(D.string),
  slaText: D.optional(D.string),
  assignedTo: D.optional(D.string),
  resolutionNote: D.optional(D.string),
  updates: D.optional(D.array(complaintUpdateDtoDecoder)),
});

export const complaintDtoListDecoder: Decoder<ComplaintDto[]> = D.array(complaintDtoDecoder);
