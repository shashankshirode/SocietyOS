import { StatusPill } from '../../../../shared/components/StatusPill';
import type { StatusTone } from '../../../../shared/theme/statusColors';
import { useMessages } from '../../../../messages/useMessages';
import { FacilityAvailabilityStatus } from '../models/facilityBooking.enums';

interface FacilityStatusBadgeProps {
  readonly status: FacilityAvailabilityStatus;
}

const tones: Record<FacilityAvailabilityStatus, StatusTone> = {
  [FacilityAvailabilityStatus.Available]: 'success',
  [FacilityAvailabilityStatus.LimitedSlots]: 'warning',
  [FacilityAvailabilityStatus.FullyBooked]: 'danger',
  [FacilityAvailabilityStatus.UnderMaintenance]: 'warning',
  [FacilityAvailabilityStatus.TemporarilyClosed]: 'neutral',
  [FacilityAvailabilityStatus.Restricted]: 'danger',
};

export function FacilityStatusBadge({ status }: FacilityStatusBadgeProps) {
  const labels = useMessages().resident.facilityBooking.availability;
  return <StatusPill label={labels[status]} tone={tones[status]} />;
}
