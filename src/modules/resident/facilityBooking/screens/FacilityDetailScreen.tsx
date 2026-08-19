import { useState } from 'react';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from '../../../../app/navigation/navigation.types';
import { AppCard } from '../../../../shared/cards/AppCard';
import { AppButton } from '../../../../shared/components/AppButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { DetailBlockSkeleton, Skeleton } from '../../../../shared/feedback/Skeleton';
import { StickyFooter } from '../../../../shared/layout/StickyFooter';
import { ResponsiveImage } from '../../../../ui/components/ResponsiveImage';
import { useMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { FacilityAvailabilityStatus } from '../models/facilityBooking.enums';
import { useBookingEligibility } from '../hooks/useBookingEligibility';
import { useFacilityDetails } from '../hooks/useFacilityDetails';
import { resolveFacilityImage } from '../media/resolveFacilityImage';
import {
  formatFacilityCurrency,
  formatFacilityOperatingHours,
} from '../services/facilityDateTimeFormatter';
import {
  backgroundBorderStyle,
  backgroundColorStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';
import { FacilityScreenLayout } from '../components/FacilityScreenLayout';
import { FacilityStatusBadge } from '../components/FacilityStatusBadge';

type Props = NativeStackScreenProps<FacilityStackParamList, 'FacilityDetail'>;

export function FacilityDetailScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const labels = useMessages().resident.facilityBooking;
  const { activeContext } = useActiveResidentHome();
  const resource = useFacilityDetails(route.params.facilityId);
  const facility = resource.data;
  const eligibility = useBookingEligibility({
    facilityId: route.params.facilityId,
    slotId: null,
    guestCount: facility?.minimumGuests ?? 1,
    consentAccepted: true,
    paymentMethodAvailable: true,
  });
  const [showAllRules, setShowAllRules] = useState(false);
  const locale = activeContext.locale ?? 'en-IN';
  if (resource.isLoading || !facility && !resource.error) {
    return (
      <FacilityScreenLayout title={labels.details.title} onBack={navigation.goBack}>
        <Skeleton height={280} />
        <DetailBlockSkeleton />
        <DetailBlockSkeleton />
      </FacilityScreenLayout>
    );
  }
  if (resource.error || !facility) {
    return (
      <FacilityScreenLayout title={labels.details.title} onBack={navigation.goBack}>
        <ErrorState
          title={labels.states.loadDetailsTitle}
          message={labels.states.loadDetailsDescription}
          onRetry={() => void resource.refresh()}
          retryLabel={labels.states.retry}
        />
      </FacilityScreenLayout>
    );
  }
  const visibleRules = showAllRules ? facility.rules : facility.rules.slice(0, 3);
  const eligible = eligibility.data?.eligible ?? facility.bookingEnabled;
  const operatingSchedule = facility.operatingSchedule.find((item) => !item.closed);
  const operatingHours = operatingSchedule
    ? formatFacilityOperatingHours(operatingSchedule.opensAtLocalTime, operatingSchedule.closesAtLocalTime, locale)
    : labels.availability.TEMPORARILY_CLOSED;
  const footer = (
    <StickyFooter>
      <View style={styles.stickyButtonRow}>
        <AppButton
          title={labels.details.viewAllSlots}
          onPress={() => navigation.navigate('FacilitySlotAvailability', { facilityId: facility.id })}
          variant="outline"
          style={styles.stickyButton}
          disabled={!eligible}
        />
        <AppButton
          title={eligible ? labels.details.bookAction : labels.details.disabledAction}
          onPress={() => navigation.navigate('FacilitySlotAvailability', { facilityId: facility.id })}
          style={styles.stickyButton}
          disabled={!eligible}
        />
      </View>
    </StickyFooter>
  );
  return (
    <FacilityScreenLayout
      title={facility.name}
      subtitle={facility.locationName}
      onBack={navigation.goBack}
      footer={footer}
      testID="facility-detail-screen"
    >
      <View style={styles.detailHero}>
        <ResponsiveImage image={resolveFacilityImage(facility)} aspectRatio={16 / 8} style={styles.detailImage} />
        <View style={styles.imageBadges}>
          <FacilityStatusBadge status={facility.availabilityStatus} />
        </View>
      </View>
      <View style={styles.section}>
        <SafeText variant="h2">{facility.name}</SafeText>
        <SafeText variant="body" color="secondary">{facility.description}</SafeText>
      </View>
      <View style={styles.informationGrid}>
        {[
          { id: 'location', icon: 'location-outline', label: labels.details.location, value: `${facility.locationName} · ${facility.floorOrZone}` },
          { id: 'capacity', icon: 'people-outline', label: labels.details.capacity, value: labels.details.guests(facility.maximumGuests) },
          { id: 'hours', icon: 'time-outline', label: labels.discovery.operatingHours, value: operatingHours },
          { id: 'window', icon: 'calendar-outline', label: labels.details.bookingWindow, value: labels.details.daysInAdvance(facility.maximumAdvanceBookingDays) },
        ].map((item) => (
          <View key={item.id} style={[styles.informationCell, backgroundBorderStyle(colors.surface, colors.border)]}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <SafeText variant="tiny" color="muted">{item.label}</SafeText>
            <SafeText variant="caption">{item.value}</SafeText>
          </View>
        ))}
      </View>
      <AppCard variant="outlined" style={styles.summaryCard}>
        <SafeText variant="bodyStrong">{labels.discovery.rate}</SafeText>
        <SafeText variant="title">
          {facility.baseFeeInMinorUnits > 0
            ? formatFacilityCurrency(facility.baseFeeInMinorUnits, facility.currencyCode, locale)
            : labels.free}
        </SafeText>
        <SafeText variant="tiny" color="muted">
          {labels.discovery.refundableDeposit}: {facility.refundableDepositInMinorUnits > 0
            ? formatFacilityCurrency(facility.refundableDepositInMinorUnits, facility.currencyCode, locale)
            : labels.notRequired}
        </SafeText>
      </AppCard>
      <View style={styles.section}>
        <SafeText variant="title">{labels.details.amenities}</SafeText>
        <View style={styles.amenityGrid}>
          {facility.amenities.map((amenity) => (
            <View key={amenity.id} style={[styles.amenity, backgroundBorderStyle(colors.surface, colors.border)]}>
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
              <SafeText variant="caption">{amenity.name}</SafeText>
            </View>
          ))}
        </View>
      </View>
      <AppCard variant={eligible ? 'success' : 'danger'} style={styles.summaryCard}>
        <View style={styles.rowBetween}>
          <SafeText variant="bodyStrong">{labels.details.eligibility}</SafeText>
          <Ionicons name={eligible ? 'shield-checkmark-outline' : 'lock-closed-outline'} size={22} color={eligible ? colors.success : colors.danger} />
        </View>
        <SafeText variant="caption" color="secondary">
          {eligible ? labels.details.eligible : labels.details.blocked}
        </SafeText>
        {eligibility.data?.blockingReasons.map((reason) => (
          <SafeText key={reason.code} variant="tiny" color="danger">{labels.eligibilityReasons[reason.code]}</SafeText>
        ))}
      </AppCard>
      <AppCard variant="outlined" style={styles.policyCard}>
        <SafeText variant="title">{labels.details.rules}</SafeText>
        {visibleRules.map((rule) => (
          <View key={rule.id} style={styles.policyRow}>
            <View style={[styles.policyIcon, backgroundColorStyle(colors.primarySoft)]}>
              <Ionicons name="document-text-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.grow}>
              <SafeText variant="caption">{rule.title}</SafeText>
              <SafeText variant="tiny" color="secondary">{rule.description}</SafeText>
            </View>
          </View>
        ))}
        {facility.rules.length > 3 ? (
          <AppButton
            title={showAllRules ? labels.details.showFewerRules : labels.details.showAllRules}
            onPress={() => setShowAllRules((current) => !current)}
            variant="ghost"
            size="sm"
          />
        ) : null}
      </AppCard>
      {facility.availabilityStatus === FacilityAvailabilityStatus.UnderMaintenance ? (
        <AppCard variant="warning">
          <SafeText variant="bodyStrong">{labels.availability.UNDER_MAINTENANCE}</SafeText>
          <SafeText variant="caption" color="secondary">{labels.details.disabledAction}</SafeText>
        </AppCard>
      ) : null}
    </FacilityScreenLayout>
  );
}
