import { useState } from 'react';
import { Pressable, View } from 'react-native';
import * as Crypto from 'expo-crypto';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from '../../../../app/navigation/navigation.types';
import { AppCard } from '../../../../shared/cards/AppCard';
import { AppButton } from '../../../../shared/components/AppButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { StickyFooter } from '../../../../shared/layout/StickyFooter';
import { useMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityBookingDetail } from '../hooks/useFacilityBookingDetail';
import { usePayFacilityBooking } from '../hooks/useFacilityBookingMutations';
import { FacilityPaymentMethod, FacilityPaymentStatus } from '../models/facilityBooking.enums';
import { formatFacilityCurrency } from '../services/facilityDateTimeFormatter';
import {
  backgroundBorderStyle,
  backgroundColorStyle,
  borderColorStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';
import { BookingPriceBreakdown } from '../components/BookingPriceBreakdown';
import { FacilityScreenLayout } from '../components/FacilityScreenLayout';

type Props = NativeStackScreenProps<FacilityStackParamList, 'FacilityPayment'>;

const methods = Object.values(FacilityPaymentMethod);

export function FacilityPaymentScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const labels = useMessages().resident.facilityBooking;
  const { activeContext } = useActiveResidentHome();
  const resource = useFacilityBookingDetail(route.params.bookingId);
  const paymentMutation = usePayFacilityBooking();
  const [method, setMethod] = useState(FacilityPaymentMethod.Upi);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [idempotencyKey] = useState(() => Crypto.randomUUID());
  const locale = activeContext.locale ?? 'en-IN';
  const booking = resource.data;

  async function pay(): Promise<void> {
    if (!booking) return;
    const updated = await paymentMutation.mutate({
      idempotencyKey,
      residenceId: activeContext.homeContextId,
      bookingId: booking.id,
      paymentMethod: method,
      simulateFailure,
    });
    if (updated?.payment.status === FacilityPaymentStatus.Paid) {
      navigation.replace('FacilityBookingConfirmation', { bookingId: updated.id });
    }
  }

  if (resource.isLoading || !booking && !resource.error) {
    return <FacilityScreenLayout title={labels.payment.title} onBack={navigation.goBack}><AppCard><SafeText>{labels.states.loadingBooking}</SafeText></AppCard></FacilityScreenLayout>;
  }
  if (resource.error || !booking) {
    return (
      <FacilityScreenLayout title={labels.payment.title} onBack={navigation.goBack}>
        <ErrorState title={labels.states.loadBookingTitle} message={labels.states.loadBookingDescription} onRetry={() => void resource.refresh()} />
      </FacilityScreenLayout>
    );
  }
  const amount = formatFacilityCurrency(booking.quote.breakdown.totalPayableInMinorUnits, booking.quote.currencyCode, locale);
  const footer = (
    <StickyFooter>
      <AppButton
        title={labels.payment.payAction(amount)}
        onPress={() => void pay()}
        loading={paymentMutation.isPending}
        fullWidth
      />
    </StickyFooter>
  );
  return (
    <FacilityScreenLayout
      title={labels.payment.title}
      subtitle={labels.payment.subtitle}
      onBack={navigation.goBack}
      footer={footer}
      testID="facility-payment-screen"
    >
      <BookingPriceBreakdown breakdown={booking.quote.breakdown} currencyCode={booking.quote.currencyCode} locale={locale} />
      <View style={styles.section} accessibilityRole="radiogroup">
        <SafeText variant="title">{labels.payment.selectMethod}</SafeText>
        {methods.map((item) => {
          const selected = method === item;
          return (
            <Pressable
              key={item}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => setMethod(item)}
              style={[
                styles.paymentMethod,
                backgroundBorderStyle(selected ? colors.primarySoft : colors.surface, selected ? colors.primary : colors.border),
              ]}
            >
              <View style={[styles.paymentIcon, backgroundColorStyle(colors.infoSoft)]}>
                <Ionicons name={item === FacilityPaymentMethod.Upi ? 'phone-portrait-outline' : item === FacilityPaymentMethod.Card ? 'card-outline' : 'business-outline'} size={22} color={colors.info} />
              </View>
              <View style={styles.grow}>
                <SafeText variant="caption">{labels.payment.methods[item]}</SafeText>
                <SafeText variant="tiny" color="muted">{labels.payment.methodDescriptions[item]}</SafeText>
              </View>
              <View style={[styles.paymentRadio, borderColorStyle(selected ? colors.primary : colors.border)]}>
                {selected ? <View style={[styles.slotSelectInner, backgroundColorStyle(colors.primary)]} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
      {__DEV__ ? (
        <AppCard variant="info" style={styles.summaryCard}>
          <SafeText variant="bodyStrong">{labels.payment.simulationTitle}</SafeText>
          <SafeText variant="tiny" color="secondary">{labels.payment.simulationDescription}</SafeText>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: simulateFailure }}
            onPress={() => setSimulateFailure((current) => !current)}
            style={styles.consentRow}
          >
            <View style={[
              styles.checkbox,
              backgroundBorderStyle(simulateFailure ? colors.danger : colors.surface, simulateFailure ? colors.danger : colors.border),
            ]}>
              {simulateFailure ? <Ionicons name="checkmark" size={18} color={colors.textInverse} /> : null}
            </View>
            <SafeText variant="caption" style={styles.grow}>{labels.payment.simulationFailure}</SafeText>
          </Pressable>
        </AppCard>
      ) : null}
      {paymentMutation.error || paymentMutation.data?.payment.status === FacilityPaymentStatus.Failed ? (
        <AppCard variant="danger" style={styles.summaryCard}>
          <SafeText variant="bodyStrong">{labels.payment.failedTitle}</SafeText>
          <SafeText variant="caption" color="secondary">{labels.payment.failedDescription}</SafeText>
          <AppButton title={labels.payment.retry} onPress={() => paymentMutation.reset()} variant="outline" />
        </AppCard>
      ) : null}
    </FacilityScreenLayout>
  );
}
