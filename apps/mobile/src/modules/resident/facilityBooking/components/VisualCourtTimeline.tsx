import React, { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { HapticFeedback } from '../../../../shared/utils/haptics';

export interface TimeSlot {
  id: string;
  time: string;
  isPeak: boolean;
  status: 'available' | 'booked' | 'maintenance';
  price: number;
}

export interface CourtOption {
  id: string;
  name: string;
  type: string;
}

export interface VisualCourtTimelineProps {
  courts?: CourtOption[];
  onSelectSlot?: (court: CourtOption, slot: TimeSlot) => void;
}

export const defaultCourts: CourtOption[] = [
  { id: 'court-1', name: 'Badminton Court 1 (Wooden)', type: 'Indoor' },
  { id: 'court-2', name: 'Badminton Court 2 (Synthetic)', type: 'Indoor' },
];

export const sampleSlots: TimeSlot[] = [
  { id: 's1', time: '06:00 AM - 07:00 AM', isPeak: false, status: 'available', price: 0 },
  { id: 's2', time: '07:00 AM - 08:00 AM', isPeak: true, status: 'booked', price: 150 },
  { id: 's3', time: '08:00 AM - 09:00 AM', isPeak: true, status: 'available', price: 150 },
  { id: 's4', time: '09:00 AM - 10:00 AM', isPeak: false, status: 'available', price: 0 },
  { id: 's5', time: '05:00 PM - 06:00 PM', isPeak: true, status: 'available', price: 150 },
  { id: 's6', time: '06:00 PM - 07:00 PM', isPeak: true, status: 'booked', price: 150 },
  { id: 's7', time: '07:00 PM - 08:00 PM', isPeak: true, status: 'available', price: 150 },
  { id: 's8', time: '08:00 PM - 09:00 PM', isPeak: false, status: 'available', price: 0 },
];

export function VisualCourtTimeline({
  courts = defaultCourts,
  onSelectSlot,
}: VisualCourtTimelineProps) {
  const { colors } = useAppTheme();
  const [selectedCourt, setSelectedCourt] = useState<CourtOption>(courts[0]!);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>('s3');

  const handleSlotPress = (slot: TimeSlot) => {
    if (slot.status === 'booked' || slot.status === 'maintenance') return;
    HapticFeedback.light();
    setSelectedSlotId(slot.id);
    onSelectSlot?.(selectedCourt, slot);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]} testID="visual-court-timeline">
      <View style={styles.header}>
        <SafeText variant="bodyStrong" color="primary">Court & Time Slot Selection</SafeText>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <SafeText variant="tiny" color="muted">Available</SafeText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
            <SafeText variant="tiny" color="muted">Booked</SafeText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <SafeText variant="tiny" color="muted">Selected</SafeText>
          </View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.courtsRow}>
        {courts.map((court) => {
          const isSelected = selectedCourt.id === court.id;
          return (
            <Pressable
              key={court.id}
              onPress={() => {
                HapticFeedback.light();
                setSelectedCourt(court);
              }}
              style={[
                styles.courtTab,
                {
                  backgroundColor: isSelected ? colors.primary : colors.background,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <Ionicons
                name="tennisball-outline"
                size={14}
                color={isSelected ? '#FFF' : colors.textSecondary}
              />
              <SafeText
                variant="caption"
                style={{ color: isSelected ? '#FFF' : colors.textPrimary, fontWeight: '700' }}
              >
                {court.name}
              </SafeText>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.slotsGrid}>
        {sampleSlots.map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          const isBooked = slot.status === 'booked';

          return (
            <Pressable
              key={slot.id}
              disabled={isBooked}
              onPress={() => handleSlotPress(slot)}
              style={({ pressed }) => [
                styles.slotChip,
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : isBooked
                    ? colors.background
                    : `${colors.success}10`,
                  borderColor: isSelected
                    ? colors.primary
                    : isBooked
                    ? colors.border
                    : colors.success,
                  opacity: isBooked ? 0.45 : pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={styles.slotTimeRow}>
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : isBooked ? 'lock-closed-outline' : 'time-outline'}
                  size={14}
                  color={isSelected ? '#FFF' : isBooked ? colors.textSecondary : colors.success}
                />
                <SafeText
                  variant="caption"
                  style={{
                    color: isSelected ? '#FFF' : isBooked ? colors.textSecondary : colors.textPrimary,
                    fontWeight: '700',
                  }}
                >
                  {slot.time}
                </SafeText>
              </View>

              <View style={styles.slotPriceRow}>
                <SafeText
                  variant="tiny"
                  style={{
                    color: isSelected ? 'rgba(255,255,255,0.85)' : colors.textSecondary,
                  }}
                >
                  {slot.price === 0 ? 'Free Slot' : `₹${slot.price} (Peak)`}
                </SafeText>
                {isBooked ? (
                  <SafeText variant="tiny" style={{ color: colors.danger, fontWeight: '700' }}>
                    BOOKED
                  </SafeText>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  courtsRow: {
    gap: 8,
    marginBottom: 14,
  },
  courtTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  slotsGrid: {
    gap: 8,
  },
  slotChip: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  slotTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slotPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginLeft: 20,
  },
});
