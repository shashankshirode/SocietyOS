import type { CreateVisitorPayload, Visitor, VisitorStatus, VisitorType } from '../../../../shared/types/visitor.types';
import { D, type Decoder } from '../../../../core/api/decoders';

export interface VisitorDto {
  readonly id: string;
  readonly name?: string;
  readonly phone?: string;
  readonly type?: VisitorType;
  readonly status?: VisitorStatus;
  readonly expectedDate?: string;
  readonly expectedTime?: string;
  readonly actualEntryTime?: string;
  readonly actualExitTime?: string;
  readonly flatNumber?: string;
  readonly societyName?: string;
  readonly purpose?: string;
  readonly vehicleNumber?: string;
  readonly otp?: string;
  readonly createdAt?: string;
}

export type CreateVisitorPassRequestDto = CreateVisitorPayload & {
  readonly flatNumber: string;
  readonly societyName: string;
};

export const visitorDtoDecoder: Decoder<VisitorDto> = D.object({
  id: D.string,
  name: D.optional(D.string),
  phone: D.optional(D.string),
  type: D.optional(D.oneOf(['GUEST', 'DELIVERY', 'CAB', 'SERVICE', 'OTHER'] as const)),
  status: D.optional(D.oneOf([
    'EXPECTED',
    'CHECKED_IN',
    'COMPLETED',
    'CANCELLED',
    'EXPIRED',
    'WAITING_APPROVAL',
    'APPROVED',
    'CHECKED_OUT',
  ] as const)),
  expectedDate: D.optional(D.string),
  expectedTime: D.optional(D.string),
  actualEntryTime: D.optional(D.string),
  actualExitTime: D.optional(D.string),
  flatNumber: D.optional(D.string),
  societyName: D.optional(D.string),
  purpose: D.optional(D.string),
  vehicleNumber: D.optional(D.string),
  otp: D.optional(D.string),
  createdAt: D.optional(D.string),
});

export const visitorDtoListDecoder: Decoder<VisitorDto[]> = D.array(visitorDtoDecoder);
