import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppCard } from '../../../../shared/cards/AppCard';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useMessages } from '../../../../messages/useMessages';
import type { FacilityBookingQrPass } from '../models/facilityBooking.models';
import { formatFacilityTimeRange } from '../services/facilityDateTimeFormatter';
import { BookingInfoRow } from './BookingInfoRow';
import {
  backgroundColorStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';

interface BookingQrCardProps {
  readonly pass: FacilityBookingQrPass;
  readonly locale: string;
  readonly timezone: string;
}

export function BookingQrCard({ pass, locale, timezone }: BookingQrCardProps) {
  const { colors } = useAppTheme();
  const messages = useMessages().resident.facilityBooking;
  const labels = messages.checkIn;
  return (
    <AppCard variant="outlined" style={styles.summaryCard}>
      <View style={styles.rowBetween}>
        <View style={styles.grow}>
          <SafeText variant="bodyStrong">{labels.securePass}</SafeText>
          <SafeText variant="tiny" color="secondary">{labels.refreshInformation}</SafeText>
        </View>
        <Ionicons name="shield-checkmark-outline" size={24} color={colors.success} />
      </View>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={messages.accessibilityLabels.qrCode}
        style={[styles.qrSurface, backgroundColorStyle(colors.white)]}
      >
        <QRCode
          value={pass.token}
          size={190}
          color={colors.black}
          backgroundColor={colors.white}
          ecl="H"
          testID="facility-booking-qr"
        />
      </View>
      <SafeText variant="tiny" color="muted" align="center">{labels.fallbackCode}</SafeText>
      <SafeText variant="title" align="center" style={styles.qrCodeText}>{pass.fallbackCode}</SafeText>
      <BookingInfoRow
        label={labels.validWindow}
        value={formatFacilityTimeRange(pass.validFrom, pass.validUntil, { locale, timezone })}
      />
      <BookingInfoRow label={labels.presentationLocation} value={pass.presentationLocation} isLast />
    </AppCard>
  );
}
