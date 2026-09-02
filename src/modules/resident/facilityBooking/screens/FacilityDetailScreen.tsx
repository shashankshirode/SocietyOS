import React, { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
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
  const msg = labels.spaces;
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
  const [selectedSlotHour, setSelectedSlotHour] = useState<string | null>(null);
  const locale = activeContext.locale ?? 'en-IN';

  if (resource.isLoading || !facility && !resource.error) {
    return (
      <FacilityScreenLayout title={msg.spaceFocusTitle} onBack={navigation.goBack}>
        <Skeleton height={200} />
        <DetailBlockSkeleton />
        <DetailBlockSkeleton />
      </FacilityScreenLayout>
    );
  }

  if (resource.error || !facility) {
    return (
      <FacilityScreenLayout title={msg.spaceFocusTitle} onBack={navigation.goBack}>
        <ErrorState
          title={labels.states.loadDetailsTitle}
          message={labels.states.loadDetailsDescription}
          onRetry={() => void resource.refresh()}
          retryLabel={labels.states.retry}
        />
      </FacilityScreenLayout>
    );
  }

  // Check Role & Admin Policy Restrictions
  const isRoleRestricted = !facility.eligibilityPolicy.allowedRoles.includes(activeContext.residentRole as any);
  const isUnitBlocked = facility.eligibilityPolicy.blockedUnitIds?.includes(activeContext.unitId) || false;
  const isTowerBlocked = facility.eligibilityPolicy.blockedTowersOrWings?.some((t) =>
    activeContext.displayUnitName.toLowerCase().includes(t.toLowerCase()) ||
    (activeContext.towerName && activeContext.towerName.toLowerCase().includes(t.toLowerCase()))
  ) || false;
  const isMaintenance = facility.availabilityStatus === FacilityAvailabilityStatus.UnderMaintenance;
  const isAccessBlocked = isRoleRestricted || isUnitBlocked || isTowerBlocked;
  const eligible = !isAccessBlocked && (eligibility.data?.eligible ?? (facility.bookingEnabled && !isMaintenance));

  const visibleRules = showAllRules ? facility.rules : facility.rules.slice(0, 3);
  const operatingSchedule = facility.operatingSchedule.find((item) => !item.closed);
  const operatingHours = operatingSchedule
    ? formatFacilityOperatingHours(operatingSchedule.opensAtLocalTime, operatingSchedule.closesAtLocalTime, locale)
    : labels.availability.TEMPORARILY_CLOSED;

  // Single authoritative footer
  const footer = isAccessBlocked || isMaintenance ? (
    <StickyFooter>
      <View style={styles.stickyButtonRow}>
        <AppButton
          title={msg.exploreOtherSpaces}
          onPress={() => navigation.navigate('FacilityList')}
          style={styles.stickyButton}
          variant="primary"
        />
      </View>
    </StickyFooter>
  ) : (
    <StickyFooter>
      <View style={styles.stickyButtonRow}>
        <AppButton
          title={msg.seeFullSchedule}
          onPress={() => navigation.navigate('FacilitySlotAvailability', { facilityId: facility.id })}
          variant="outline"
          style={styles.stickyButton}
        />
        <AppButton
          title={!eligible ? msg.notEligible : selectedSlotHour ? msg.reserveSlotHour(selectedSlotHour) : msg.reserveAnHour}
          onPress={() => navigation.navigate('FacilitySlotAvailability', { facilityId: facility.id })}
          style={styles.stickyButton}
          disabled={!eligible || !selectedSlotHour}
        />
      </View>
    </StickyFooter>
  );

  return (
    <FacilityScreenLayout
      title={msg.spaceFocusTitle}
      subtitle={facility.name}
      onBack={navigation.goBack}
      footer={footer}
      testID="facility-detail-screen"
    >
      {/* 1. Immersive Focus Image & Status Pill */}
      <View style={styles.detailHero}>
        <ResponsiveImage
          image={resolveFacilityImage(facility)}
          aspectRatio={16 / 8}
          style={styles.detailImage}
        />
        <View style={styles.imageBadges}>
          <FacilityStatusBadge status={facility.availabilityStatus} />
        </View>
      </View>

      {/* 2. Narrative Block (Single authoritative title & status) */}
      <View style={{ gap: 4 }}>
        <SafeText
          variant="tiny"
          style={{
            color: isAccessBlocked || isMaintenance ? colors.warning : colors.primary,
            fontWeight: '700',
            letterSpacing: 0.5,
          }}
        >
          {isUnitBlocked
            ? msg.adminRestricted
            : isTowerBlocked
            ? msg.towerBanActive
            : isRoleRestricted
            ? msg.ownerOnly
            : `${facility.category.toUpperCase()} · ${facility.locationName}`}
        </SafeText>
        <SafeText variant="h1" color="primary" style={{ fontSize: 24, fontWeight: '700' }}>
          {facility.name}
        </SafeText>
        <SafeText variant="body" color="secondary">
          {isUnitBlocked
            ? msg.adminRestrictedDescription
            : isTowerBlocked
            ? msg.towerBanDescription
            : isRoleRestricted
            ? msg.tenantRestrictedDescription
            : isMaintenance
            ? msg.maintenanceDescription
            : facility.description}
        </SafeText>
      </View>

      {/* 3. Availability Horizon (Time Landscape) if Open & Allowed */}
      {!isMaintenance && !isAccessBlocked ? (
        <View
          style={[
            styles.horizonContainer,
            backgroundBorderStyle(colors.surface, colors.border),
          ]}
        >
          <View style={styles.horizonHeader}>
            <SafeText variant="caption" color="primary" style={{ fontWeight: '700' }}>
              {msg.todayAvailableHours}
            </SafeText>
            <SafeText variant="tiny" color="secondary">
              {msg.selectAnHour}
            </SafeText>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeRibbonTrack}>
            {['7:00 AM', '8:00 AM', '11:00 AM', '4:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'].map((slot) => {
              const isSelected = selectedSlotHour === slot;
              return (
                <Pressable
                  key={slot}
                  onPress={() => setSelectedSlotHour(isSelected ? null : slot)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select hour ${slot}`}
                  accessibilityState={{ selected: isSelected }}
                  testID={`slot-${slot}`}
                  style={[
                    styles.timeSlotNode,
                    isSelected ? styles.timeSlotNodeSelected : null,
                    backgroundBorderStyle(
                      isSelected ? colors.primarySoft : colors.background,
                      isSelected ? colors.primary : colors.border
                    ),
                  ]}
                >
                  <SafeText variant="caption" color="primary" style={{ fontWeight: isSelected ? '700' : '500' }}>
                    {slot}
                  </SafeText>
                  <SafeText variant="tiny" style={{ color: colors.success, fontSize: 10, fontWeight: '600' }}>
                    {msg.openStatus}
                  </SafeText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      {/* 4. Unified 2x2 Architectural Facts Surface */}
      <View style={styles.factsGrid}>
        <View style={[styles.factCell, backgroundBorderStyle(colors.surface, colors.border)]}>
          <Ionicons name="location-outline" size={18} color={colors.primary} />
          <SafeText variant="tiny" color="muted">{msg.locationLabel}</SafeText>
          <SafeText variant="caption" color="primary" style={{ fontWeight: '600' }}>
            {facility.locationName} · {facility.floorOrZone}
          </SafeText>
        </View>

        <View style={[styles.factCell, backgroundBorderStyle(colors.surface, colors.border)]}>
          <Ionicons name="people-outline" size={18} color={colors.primary} />
          <SafeText variant="tiny" color="muted">{msg.capacityLabel}</SafeText>
          <SafeText variant="caption" color="primary" style={{ fontWeight: '600' }}>
            {msg.upToGuests(facility.maximumGuests)}
          </SafeText>
        </View>

        <View style={[styles.factCell, backgroundBorderStyle(colors.surface, colors.border)]}>
          <Ionicons name="time-outline" size={18} color={colors.primary} />
          <SafeText variant="tiny" color="muted">{msg.hoursLabel}</SafeText>
          <SafeText variant="caption" color="primary" style={{ fontWeight: '600' }}>
            {operatingHours}
          </SafeText>
        </View>

        <View style={[styles.factCell, backgroundBorderStyle(colors.surface, colors.border)]}>
          <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          <SafeText variant="tiny" color="muted">{msg.advanceWindowLabel}</SafeText>
          <SafeText variant="caption" color="primary" style={{ fontWeight: '600' }}>
            {msg.upToAdvanceDays(facility.maximumAdvanceBookingDays)}
          </SafeText>
        </View>
      </View>

      {/* 5. Integrated Pricing Card */}
      <AppCard variant="outlined" style={[styles.summaryCard, { padding: 16 }]}>
        <View style={styles.rowBetween}>
          <View style={{ gap: 2 }}>
            <SafeText variant="tiny" color="secondary" style={{ fontWeight: '700' }}>
              {msg.accessRate}
            </SafeText>
            <SafeText variant="title" color="primary">
              {facility.baseFeeInMinorUnits > 0
                ? formatFacilityCurrency(facility.baseFeeInMinorUnits, facility.currencyCode, locale)
                : msg.freeOfCharge}
            </SafeText>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 2 }}>
            <SafeText variant="tiny" color="muted">{msg.deposit}</SafeText>
            <SafeText variant="caption" color="secondary">
              {facility.refundableDepositInMinorUnits > 0
                ? formatFacilityCurrency(facility.refundableDepositInMinorUnits, facility.currencyCode, locale)
                : msg.noneRequired}
            </SafeText>
          </View>
        </View>
      </AppCard>

      {/* 6. Included Amenities */}
      {facility.amenities.length > 0 ? (
        <View style={{ gap: 8 }}>
          <SafeText variant="tiny" color="secondary" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
            {msg.includedAmenities}
          </SafeText>
          <View style={styles.amenityGrid}>
            {facility.amenities.map((amenity) => (
              <View key={amenity.id} style={[styles.amenity, backgroundBorderStyle(colors.surface, colors.border)]}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
                <SafeText variant="caption" color="primary">{amenity.name}</SafeText>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* 7. Space Guidelines & Rules */}
      <AppCard variant="outlined" style={styles.policyCard}>
        <View style={styles.rowBetween}>
          <SafeText variant="caption" color="primary" style={{ fontWeight: '700' }}>
            {msg.beforeYouBook(facility.rules.length)}
          </SafeText>
          {facility.rules.length > 3 ? (
            <Pressable onPress={() => setShowAllRules(!showAllRules)}>
              <SafeText variant="tiny" color="primary" style={{ fontWeight: '700' }}>
                {showAllRules ? msg.showLess : msg.viewAll}
              </SafeText>
            </Pressable>
          ) : null}
        </View>

        {visibleRules.map((rule) => (
          <View key={rule.id} style={styles.policyRow}>
            <View style={[styles.policyIcon, backgroundColorStyle(colors.primarySoft)]}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
            </View>
            <View style={styles.grow}>
              <SafeText variant="caption" color="primary" style={{ fontWeight: '600' }}>{rule.title}</SafeText>
              <SafeText variant="tiny" color="secondary">{rule.description}</SafeText>
            </View>
          </View>
        ))}
      </AppCard>
    </FacilityScreenLayout>
  );
}
