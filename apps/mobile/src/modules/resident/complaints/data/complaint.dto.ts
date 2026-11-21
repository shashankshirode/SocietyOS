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
  readonly title?: string | undefined;
  readonly description?: string | undefined;
  readonly category?: ComplaintCategory | undefined;
  readonly status?: ComplaintStatus | undefined;
  readonly priority?: ComplaintPriority | undefined;
  readonly location?: string | undefined;
  readonly flatNumber?: string | undefined;
  readonly residentName?: string | undefined;
  readonly createdAt?: string | undefined;
  readonly updatedAt?: string | undefined;
  readonly slaText?: string | undefined;
  readonly assignedTo?: string | undefined;
  readonly resolutionNote?: string | undefined;
  readonly updates?: readonly ComplaintUpdateDto[] | undefined;
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
