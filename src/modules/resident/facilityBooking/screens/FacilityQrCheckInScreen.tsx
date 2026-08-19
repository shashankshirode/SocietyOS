import { useState } from 'react';
import * as Crypto from 'expo-crypto';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from '../../../../app/navigation/navigation.types';
import { AppCard } from '../../../../shared/cards/AppCard';
import { AppButton } from '../../../../shared/components/AppButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { useMessages } from '../../../../messages/useMessages';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityBookingDetail } from '../hooks/useFacilityBookingDetail';
import { useFacilityCheckInMutation } from '../hooks/useFacilityBookingMutations';
import { FacilityBookingStatus, FacilityCheckInResultCode } from '../models/facilityBooking.enums';
import { BookingQrCard } from '../components/BookingQrCard';
import { BookingStatusBadge } from '../components/BookingStatusBadge';
import { FacilityScreenLayout } from '../components/FacilityScreenLayout';
import { facilityBookingStyles as styles } from '../styles/facilityBooking.styles';

type Props = NativeStackScreenProps<FacilityStackParamList, 'FacilityQrCheckIn'>;

export function FacilityQrCheckInScreen({ navigation, route }: Props) {
  const labels = useMessages().resident.facilityBooking;
  const { activeContext } = useActiveResidentHome();
  const resource = useFacilityBookingDetail(route.params.bookingId);
  const mutation = useFacilityCheckInMutation();
  const [idempotencyKey] = useState(() => Crypto.randomUUID());
  const booking = resource.data;
  const locale = activeContext.locale ?? 'en-IN';
  const pass = booking?.qrPass ?? null;
  const now = Date.now();
  const tooEarly = pass ? now < Date.parse(pass.validFrom) : false;
  const tooLate = pass ? now > Date.parse(pass.validUntil) : false;

  async function checkIn(): Promise<void> {
    if (!booking || !pass) return;
    const result = await mutation.mutate({
      idempotencyKey,
      residenceId: activeContext.homeContextId,
      bookingId: booking.id,
      token: pass.token,
    });
    if (result?.code === FacilityCheckInResultCode.Success) await resource.refresh();
  }

  if (resource.isLoading || !booking && !resource.error) {
    return <FacilityScreenLayout title={labels.checkIn.title} onBack={navigation.goBack}><AppCard><SafeText>{labels.states.loadingBooking}</SafeText></AppCard></FacilityScreenLayout>;
  }
  if (resource.error || !booking) {
    return (
      <FacilityScreenLayout title={labels.checkIn.title} onBack={navigation.goBack}>
        <ErrorState title={labels.states.loadBookingTitle} message={labels.states.loadBookingDescription} onRetry={() => void resource.refresh()} />
      </FacilityScreenLayout>
    );
  }
  if (!pass) {
    return (
      <FacilityScreenLayout title={labels.checkIn.title} subtitle={booking.bookingReference} onBack={navigation.goBack}>
        <AppCard variant="muted"><SafeText variant="caption" color="muted">{labels.bookingDetail.noQr}</SafeText></AppCard>
      </FacilityScreenLayout>
    );
  }
  const stateMessage = tooEarly ? labels.checkIn.tooEarly : tooLate ? labels.checkIn.tooLate : mutation.error ? labels.checkIn.invalid : mutation.data?.code === FacilityCheckInResultCode.Success ? labels.checkIn.success : null;
  return (
    <FacilityScreenLayout
      title={labels.checkIn.title}
      subtitle={booking.bookingReference}
      onBack={navigation.goBack}
      testID="facility-check-in-screen"
    >
      <BookingQrCard pass={pass} locale={locale} timezone={booking.timezone} />
      <AppCard variant={tooEarly || tooLate || mutation.error ? 'warning' : mutation.data ? 'success' : 'info'} style={styles.summaryCard}>
        <BookingStatusBadge status={booking.status} />
        {stateMessage ? <SafeText variant="caption" color="secondary">{stateMessage}</SafeText> : null}
      </AppCard>
      <AppButton
        title={labels.checkIn.action}
        onPress={() => void checkIn()}
        disabled={tooEarly || tooLate || !pass.active || booking.status !== FacilityBookingStatus.Confirmed}
        loading={mutation.isPending}
        variant="success"
        fullWidth
      />
    </FacilityScreenLayout>
  );
}
