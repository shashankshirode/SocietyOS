import { View } from 'react-native';
import { AppCard } from '../../../../shared/cards/AppCard';
import { SafeText } from '../../../../shared/components/SafeText';
import { useMessages } from '../../../../messages/useMessages';
import type { FacilityBookingPriceBreakdown } from '../models/facilityBooking.models';
import { formatFacilityCurrency } from '../services/facilityDateTimeFormatter';
import { BookingInfoRow } from './BookingInfoRow';
import { facilityBookingStyles as styles } from '../styles/facilityBooking.styles';

interface BookingPriceBreakdownProps {
  readonly breakdown: FacilityBookingPriceBreakdown;
  readonly currencyCode: string;
  readonly locale: string;
}

export function BookingPriceBreakdown({
  breakdown,
  currencyCode,
  locale,
}: BookingPriceBreakdownProps) {
  const labels = useMessages().resident.facilityBooking.review;
  const money = (amount: number) => formatFacilityCurrency(amount, currencyCode, locale);
  const rows = [
    { key: 'facility', label: labels.facilityFee, amount: breakdown.facilityFeeInMinorUnits },
    { key: 'slot', label: labels.slotFee, amount: breakdown.slotFeeInMinorUnits },
    { key: 'equipment', label: labels.equipmentFee, amount: breakdown.equipmentFeeInMinorUnits },
    { key: 'guests', label: labels.guestSurcharge, amount: breakdown.guestSurchargeInMinorUnits },
    { key: 'tax', label: labels.tax, amount: breakdown.taxInMinorUnits },
    { key: 'convenience', label: labels.convenienceFee, amount: breakdown.convenienceFeeInMinorUnits },
    { key: 'discount', label: labels.discount, amount: -breakdown.discountInMinorUnits },
    { key: 'deposit', label: labels.deposit, amount: breakdown.refundableDepositInMinorUnits },
  ].filter((row) => row.amount !== 0);
  return (
    <AppCard variant="outlined" style={styles.summaryCard}>
      <SafeText variant="bodyStrong">{labels.feeSummary}</SafeText>
      <View>
        {rows.map((row, index) => (
          <BookingInfoRow
            key={row.key}
            label={row.label}
            value={money(row.amount)}
            isLast={index === rows.length - 1}
          />
        ))}
      </View>
      <View style={styles.priceTotal}>
        <View style={styles.rowBetween}>
          <SafeText variant="bodyStrong">{labels.total}</SafeText>
          <SafeText variant="title">{money(breakdown.totalPayableInMinorUnits)}</SafeText>
        </View>
      </View>
    </AppCard>
  );
}
