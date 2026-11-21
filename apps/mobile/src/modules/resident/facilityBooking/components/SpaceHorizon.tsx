import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useMessages } from '../../../../messages/useMessages';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import type { Facility } from '../models/facilityBooking.models';
import { FacilityAvailabilityStatus } from '../models/facilityBooking.enums';
import type { ResidentHomeRole } from '../../homeContext/data/residentHomeContext.types';
import { backgroundBorderStyle, facilityBookingStyles as styles, } from '../styles/facilityBooking.styles';
export interface SpaceHorizonItem {
    id: string;
    name: string;
    category: string;
    statusTone: 'success' | 'warning' | 'info' | 'neutral' | 'danger';
    statusLabel: string;
    timeHighlight: string;
    isAvailableNow: boolean;
}
interface SpaceHorizonProps {
    facilities: readonly Facility[];
    onSelectFacility: (facilityId: string) => void;
}
export function SpaceHorizon({ facilities, onSelectFacility }: SpaceHorizonProps) {
    const { colors } = useAppTheme();
    const { activeContext } = useActiveResidentHome();
    const msg = useMessages().resident.facilityBooking.spaces;
    const horizonItems: SpaceHorizonItem[] = facilities.slice(0, 6).map((f) => {
        const isRoleRestricted = !f.eligibilityPolicy.allowedRoles.includes(activeContext.residentRole as ResidentHomeRole);
        const isUnitBlocked = f.eligibilityPolicy.blockedUnitIds?.includes(activeContext.unitId) || false;
        const isTowerBlocked = f.eligibilityPolicy.blockedTowersOrWings?.some((t) => activeContext.displayUnitName.toLowerCase().includes(t.toLowerCase()) ||
            (activeContext.towerName && activeContext.towerName.toLowerCase().includes(t.toLowerCase()))) || false;
        const isMaintenance = f.availabilityStatus === FacilityAvailabilityStatus.UnderMaintenance;
        const isAvailable = f.availabilityStatus === FacilityAvailabilityStatus.Available;
        const isPartial = f.availabilityStatus === FacilityAvailabilityStatus.LimitedSlots;
        let statusTone: SpaceHorizonItem['statusTone'] = 'neutral';
        let statusLabel: string = msg.unavailable;
        let timeHighlight: string = '6 AM – 10 PM';
        let isAvailableNow = false;
        if (isUnitBlocked) {
            statusTone = 'danger';
            statusLabel = msg.restricted;
            timeHighlight = msg.adminHold;
        }
        else if (isTowerBlocked) {
            statusTone = 'danger';
            statusLabel = msg.towerBanActive;
            timeHighlight = msg.sectorHold;
        }
        else if (isRoleRestricted) {
            statusTone = 'warning';
            statusLabel = activeContext.residentRole === 'tenant' ? msg.ownerOnly : msg.restricted;
            timeHighlight = msg.tenantRestricted;
        }
        else if (isMaintenance) {
            statusTone = 'warning';
            statusLabel = msg.maintenanceToday;
            timeHighlight = msg.pausedToday;
        }
        else if (isAvailable) {
            statusTone = 'success';
            statusLabel = msg.openNow;
            timeHighlight = msg.slotsAvailable;
            isAvailableNow = true;
        }
        else if (isPartial) {
            statusTone = 'info';
            statusLabel = msg.eveningOpen;
            timeHighlight = msg.slotsAvailable;
            isAvailableNow = true;
        }
        return {
            id: f.id,
            name: f.name,
            category: f.category,
            statusTone,
            statusLabel,
            timeHighlight,
            isAvailableNow,
        };
    });
    return (<View style={[
            styles.horizonContainer,
            backgroundBorderStyle(colors.surface, colors.border),
        ]} accessible={true} accessibilityRole="summary" accessibilityLabel={msg.availabilityHorizonTitle}>
      <View style={styles.horizonHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="time-outline" size={16} color={colors.primary}/>
          <SafeText variant="caption" color="primary" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
            {msg.availabilityHorizonTitle}
          </SafeText>
        </View>
        <SafeText variant="tiny" color="secondary">
          {msg.liveSchedule}
        </SafeText>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizonTrack}>
        {horizonItems.map((item) => {
            const toneColor = item.statusTone === 'success'
                ? colors.success
                : item.statusTone === 'warning'
                    ? colors.warning
                    : item.statusTone === 'danger'
                        ? colors.danger
                        : item.statusTone === 'info'
                            ? colors.primary
                            : colors.textSecondary;
            return (<Pressable key={item.id} onPress={() => onSelectFacility(item.id)} accessibilityRole="button" accessibilityLabel={`${item.name}, ${item.statusLabel}, ${item.timeHighlight}`} style={({ pressed }) => [
                    styles.horizonNode,
                    backgroundBorderStyle(pressed ? colors.primarySoft : colors.background, colors.border),
                ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <SafeText variant="caption" color="primary" style={{ fontWeight: '700' }} numberOfLines={1}>
                  {item.name}
                </SafeText>
                <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: toneColor,
                }}/>
              </View>

              <SafeText variant="tiny" style={{ color: toneColor, fontWeight: '600' }}>
                {item.statusLabel}
              </SafeText>

              <SafeText variant="tiny" color="secondary" numberOfLines={1}>
                {item.timeHighlight}
              </SafeText>
            </Pressable>);
        })}
      </ScrollView>
    </View>);
}

