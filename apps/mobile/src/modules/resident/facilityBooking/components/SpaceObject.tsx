import React from 'react';
import { View, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { ResponsiveImage } from '../../../../ui/components/ResponsiveImage';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useMessages } from '../../../../messages/useMessages';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import type { Facility } from '../models/facilityBooking.models';
import { FacilityAvailabilityStatus } from '../models/facilityBooking.enums';
import type { ResidentHomeRole } from '../../homeContext/data/residentHomeContext.types';
import { resolveFacilityImage } from '../media/resolveFacilityImage';
import { backgroundBorderStyle, facilityBookingStyles as styles, } from '../styles/facilityBooking.styles';
interface SpaceObjectProps {
    facility: Facility;
    variant?: 'featured' | 'compact';
    onPress: () => void;
}
export function SpaceObject({ facility, variant = 'compact', onPress }: SpaceObjectProps) {
    const { colors } = useAppTheme();
    const { activeContext } = useActiveResidentHome();
    const msg = useMessages().resident.facilityBooking.spaces;
    const isMaintenance = facility.availabilityStatus === FacilityAvailabilityStatus.UnderMaintenance;
    const isAvailable = facility.availabilityStatus === FacilityAvailabilityStatus.Available;
    const isRoleRestricted = !facility.eligibilityPolicy.allowedRoles.includes(activeContext.residentRole as ResidentHomeRole);
    const isUnitBlocked = facility.eligibilityPolicy.blockedUnitIds?.includes(activeContext.unitId) || false;
    const isTowerBlocked = facility.eligibilityPolicy.blockedTowersOrWings?.some((t) => activeContext.displayUnitName.toLowerCase().includes(t.toLowerCase()) ||
        (activeContext.towerName && activeContext.towerName.toLowerCase().includes(t.toLowerCase()))) || false;
    let statusTone: string = colors.primary;
    let statusText: string = msg.availableToday;
    if (isUnitBlocked) {
        statusTone = colors.danger;
        statusText = msg.adminRestricted;
    }
    else if (isTowerBlocked) {
        statusTone = colors.danger;
        statusText = msg.towerBanActive;
    }
    else if (isRoleRestricted) {
        statusTone = colors.warning;
        statusText = activeContext.residentRole === 'tenant' ? msg.ownerOnly : msg.roleRestricted;
    }
    else if (isMaintenance) {
        statusTone = colors.warning;
        statusText = msg.maintenanceToday;
    }
    else if (isAvailable) {
        statusTone = colors.success;
        statusText = msg.availableToday;
    }
    else {
        statusTone = colors.primary;
        statusText = msg.eveningOpen;
    }
    const rateText = facility.baseFeeInMinorUnits > 0
        ? `₹${Math.round(facility.baseFeeInMinorUnits / 100)} / hr`
        : msg.freeAccess;
    if (variant === 'featured') {
        return (<Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${facility.name}, ${statusText}, ${facility.locationName}, ${rateText}`} style={({ pressed }) => [
                styles.spaceFeatureCard,
                backgroundBorderStyle(pressed ? colors.surfaceMuted : colors.surface, isMaintenance || isRoleRestricted || isUnitBlocked || isTowerBlocked ? statusTone : colors.border),
            ]}>
        <ResponsiveImage image={resolveFacilityImage(facility)} aspectRatio={16 / 8} style={styles.spaceFeatureImage}/>
        <View style={styles.spaceFeatureBody}>
          <View style={styles.rowBetween}>
            <View style={{ gap: 2 }}>
              <SafeText variant="tiny" style={{ color: statusTone, fontWeight: '700', textTransform: 'uppercase' }}>
                {statusText}
              </SafeText>
              <SafeText variant="h2" color="primary" style={{ fontSize: 20, fontWeight: '700' }}>
                {facility.name}
              </SafeText>
            </View>
            <View style={[styles.statusPill, backgroundBorderStyle(colors.background, colors.border)]}>
              <SafeText variant="tiny" color="primary" style={{ fontWeight: '700' }}>
                {rateText}
              </SafeText>
            </View>
          </View>

          <SafeText variant="caption" color="secondary" numberOfLines={2}>
            {isUnitBlocked
                ? msg.adminRestrictedDescription
                : isTowerBlocked
                    ? msg.towerBanDescription
                    : isRoleRestricted
                        ? msg.tenantRestrictedDescription
                        : facility.description || facility.locationName}
          </SafeText>

          <View style={[styles.rowBetween, { marginTop: 4 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="people-outline" size={15} color={colors.textSecondary}/>
              <SafeText variant="tiny" color="secondary">
                {msg.upToGuests(facility.capacity || 4)}
              </SafeText>
              <SafeText variant="tiny" color="muted">·</SafeText>
              <Ionicons name="location-outline" size={15} color={colors.textSecondary}/>
              <SafeText variant="tiny" color="secondary">
                {facility.locationName}
              </SafeText>
            </View>
            <Ionicons name="arrow-forward" size={16} color={colors.primary}/>
          </View>
        </View>
      </Pressable>);
    }
    return (<Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${facility.name}, ${statusText}, ${rateText}`} style={({ pressed }) => [
            styles.spaceCompactCard,
            backgroundBorderStyle(pressed ? colors.primarySoft : colors.surface, isMaintenance || isRoleRestricted || isUnitBlocked || isTowerBlocked ? statusTone : colors.border),
        ]}>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <SafeText variant="bodyStrong" color="primary" numberOfLines={1}>
            {facility.name}
          </SafeText>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusTone }}/>
        </View>
        <SafeText variant="tiny" color="secondary" numberOfLines={1}>
          {isUnitBlocked
            ? msg.adminRestricted
            : isTowerBlocked
                ? msg.towerBanActive
                : isRoleRestricted
                    ? msg.tenantRestricted
                    : isMaintenance
                        ? msg.maintenanceDescription
                        : `${facility.locationName} · ${rateText}`}
        </SafeText>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <SafeText variant="tiny" style={{ color: statusTone, fontWeight: '600' }}>
          {isMaintenance ? msg.unavailable : isRoleRestricted || isUnitBlocked || isTowerBlocked ? msg.restricted : msg.viewSpace}
        </SafeText>
      </View>
    </Pressable>);
}

