import type { CreateVisitorPayload, Visitor, VisitorStatus, VisitorType } from '../../../../shared/types/visitor.types';
import type { Absent } from '../../../../shared/types/absence.types';
import { D, type Decoder } from '../../../../core/api/decoders';

export interface VisitorDto {
  readonly id: string;
  readonly name?: string | Absent;
  readonly phone?: string | Absent;
  readonly type?: VisitorType | Absent;
  readonly status?: VisitorStatus | Absent;
  readonly expectedDate?: string | Absent;
  readonly expectedTime?: string | Absent;
  readonly actualEntryTime?: string | Absent;
  readonly actualExitTime?: string | Absent;
  readonly flatNumber?: string | Absent;
  readonly societyName?: string | Absent;
  readonly purpose?: string | Absent;
  readonly vehicleNumber?: string | Absent;
  readonly otp?: string | Absent;
  readonly createdAt?: string | Absent;
}

export type CreateVisitorPassRequestDto = CreateVisitorPayload & {
  readonly flatNumber: string;
  readonly societyName: string;
};

export const visitorDtoDecoder: Decoder<VisitorDto> = D.object({
  id: D.string,
  name: D.optional(D.string),
  phone: D.optional(D.string),
  type: D.optional(D.oneOf([
    'GUEST',
    'guest',
    'DELIVERY',
    'delivery',
    'CAB',
    'cab',
    'VENDOR',
    'vendor',
    'SERVICE_PROVIDER',
    'serviceProvider',
    'DOMESTIC_HELP',
    'domesticHelp',
    'STAFF',
    'staff',
    'COURIER',
    'courier',
  ] as const)),
  status: D.optional(D.oneOf([
    'DRAFT',
    'EXPECTED',
    'WAITING_APPROVAL',
    'APPROVED',
    'PRESENTED',
    'CHECKED_IN',
    'CHECKED_OUT',
    'COMPLETED',
    'REJECTED',
    'EXPIRED',
    'CANCELLED',
    'DENIED',
    'ESCALATED',
    'REVOKED',
    'EMERGENCY_BYPASS',
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
