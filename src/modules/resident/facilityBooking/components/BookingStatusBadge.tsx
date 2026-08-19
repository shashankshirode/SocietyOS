import { StatusPill } from '../../../../shared/components/StatusPill';
import type { StatusTone } from '../../../../shared/theme/statusColors';
import { useMessages } from '../../../../messages/useMessages';
import { FacilityBookingStatus } from '../models/facilityBooking.enums';

interface BookingStatusBadgeProps {
  readonly status: FacilityBookingStatus;
}

function toneForStatus(status: FacilityBookingStatus): StatusTone {
  if ([FacilityBookingStatus.Confirmed, FacilityBookingStatus.CheckedIn, FacilityBookingStatus.InUse, FacilityBookingStatus.Completed, FacilityBookingStatus.Refunded].includes(status)) return 'success';
  if ([FacilityBookingStatus.PaymentPending, FacilityBookingStatus.Waitlisted, FacilityBookingStatus.RefundPending, FacilityBookingStatus.PartiallyRefunded].includes(status)) return 'warning';
  if ([FacilityBookingStatus.CancelledByResident, FacilityBookingStatus.CancelledBySociety, FacilityBookingStatus.Rejected, FacilityBookingStatus.NoShow, FacilityBookingStatus.Expired].includes(status)) return 'danger';
  return 'neutral';
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const labels = useMessages().resident.facilityBooking.bookingStatus;
  return <StatusPill label={labels[status]} tone={toneForStatus(status)} />;
}
