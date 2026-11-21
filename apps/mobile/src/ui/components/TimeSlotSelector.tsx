import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../shared/components/SafeText';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { HapticFeedback } from '../../shared/utils/haptics';
import type { Absent } from "../../shared/types/absence.types";
export interface TimeSlotOption {
    id: string;
    timeRangeLabel: string;
    status: 'AVAILABLE' | 'HELD' | 'BOOKED' | 'MAINTENANCE' | 'CLOSED';
    statusLabel?: string | Absent;
    priceLabel?: string | Absent;
    remainingCapacity?: number | Absent;
}
export interface TimeSlotSelectorProps {
    slots: TimeSlotOption[];
    selectedSlotId: string | null;
    onSelectSlot: (slotId: string) => void;
    style?: ViewStyle | Absent;
    testID?: string | Absent;
}
export function TimeSlotSelector({ slots, selectedSlotId, onSelectSlot, style, testID = 'time-slot-selector', }: TimeSlotSelectorProps) {
    const { colors, dark } = useAppTheme();
    return (<View style={[styles.grid, style]} testID={testID}>
      {slots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;
            const isAvailable = slot.status === 'AVAILABLE';
            const isHeld = slot.status === 'HELD';
            const isUnavailable = !isAvailable && !isHeld;
            return (<Pressable key={slot.id} disabled={isUnavailable} onPress={() => {
                    HapticFeedback.light();
                    onSelectSlot(slot.id);
                }} accessibilityRole="button" accessibilityState={{ selected: isSelected, disabled: isUnavailable }} accessibilityLabel={`${slot.timeRangeLabel}, ${slot.statusLabel ?? slot.status}`} testID={`slot-option-${slot.id}`} style={[
                    styles.slotCard,
                    {
                        backgroundColor: isSelected
                            ? colors.primarySoft
                            : dark
                                ? '#1E293B'
                                : '#FFFFFF',
                        borderColor: isSelected
                            ? colors.primary
                            : dark
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.08)',
                        opacity: isUnavailable ? 0.45 : 1,
                    },
                ]}>
            <View style={styles.topRow}>
              <Ionicons name="time-outline" size={16} color={isSelected ? colors.primary : colors.textMuted}/>
              <SafeText variant="bodyStrong" style={{
                    color: isSelected ? colors.primary : colors.textPrimary,
                    fontWeight: isSelected ? '700' : '600',
                    fontSize: 14,
                }}>
                {slot.timeRangeLabel}
              </SafeText>
            </View>

            <View style={styles.bottomRow}>
              <View style={[
                    styles.statusPill,
                    {
                        backgroundColor: isAvailable
                            ? colors.successSoft
                            : isHeld
                                ? colors.warningSoft
                                : dark
                                    ? 'rgba(255,255,255,0.08)'
                                    : '#F1F5F9',
                    },
                ]}>
                <SafeText variant="tiny" style={{
                    color: isAvailable
                        ? colors.success
                        : isHeld
                            ? colors.warning
                            : colors.textMuted,
                    fontWeight: '700',
                    fontSize: 11,
                }}>
                  {slot.statusLabel ?? (isAvailable ? 'Available' : isHeld ? 'On Hold' : 'Unavailable')}
                </SafeText>
              </View>

              {slot.priceLabel ? (<SafeText variant="tiny" style={{
                        color: isSelected ? colors.primary : colors.textSecondary,
                        fontWeight: '600',
                    }}>
                  {slot.priceLabel}
                </SafeText>) : null}
            </View>
          </Pressable>);
        })}
    </View>);
}
const styles = StyleSheet.create({
    grid: {
        gap: 10,
    },
    slotCard: {
        padding: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        gap: 8,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusPill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
});
export default TimeSlotSelector;

