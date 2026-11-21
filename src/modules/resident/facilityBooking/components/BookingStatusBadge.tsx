import { StatusPill } from '../../../../shared/components/StatusPill';
import type { StatusTone } from '../../../../shared/theme/statusColors';
import { useMessages } from '../../../../messages/useMessages';
import { FacilityBookingStatus } from '../models/facilityBooking.enums';

interface BookingStatusBadgeProps {
  readonly status: FacilityBookingStatus;
}

function toneForStatus(status: FacilityBookingStatus): StatusTone {
  const successList: readonly FacilityBookingStatus[] = [FacilityBookingStatus.Confirmed, FacilityBookingStatus.CheckedIn, FacilityBookingStatus.InUse, FacilityBookingStatus.Completed, FacilityBookingStatus.Refunded];
  if (successList.includes(status)) return 'success';
  const warningList: readonly FacilityBookingStatus[] = [FacilityBookingStatus.PaymentPending, FacilityBookingStatus.Waitlisted, FacilityBookingStatus.RefundPending, FacilityBookingStatus.PartiallyRefunded];
  if (warningList.includes(status)) return 'warning';
  const dangerList: readonly FacilityBookingStatus[] = [FacilityBookingStatus.CancelledByResident, FacilityBookingStatus.CancelledBySociety, FacilityBookingStatus.Rejected, FacilityBookingStatus.NoShow, FacilityBookingStatus.Expired];
  if (dangerList.includes(status)) return 'danger';
  return 'neutral';
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const labels = useMessages().resident.facilityBooking.bookingStatus as Record<string, string>;
  return <StatusPill label={labels[status] ?? status} tone={toneForStatus(status)} />;
}
