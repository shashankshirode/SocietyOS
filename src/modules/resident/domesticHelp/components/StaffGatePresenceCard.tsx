import React from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { HapticFeedback } from '../../../../shared/utils/haptics';

export interface DomesticStaffItem {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  isInside: boolean;
  gateName?: string;
  entryTime?: string;
  rating: string;
  flatsWorkingCount: number;
  phone?: string;
}

export interface StaffGatePresenceCardProps {
  staff: DomesticStaffItem;
  onPress?: () => void;
  onCall?: () => void;
}

export function StaffGatePresenceCard({ staff, onPress, onCall }: StaffGatePresenceCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={() => {
        HapticFeedback.light();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.9 : 1 }
      ]}
      testID="staff-gate-presence-card"
    >
      <View style={styles.topRow}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: staff.avatarUrl }} style={styles.avatar} />
          <View
            style={[
              styles.presenceDot,
              { backgroundColor: staff.isInside ? colors.success : colors.textSecondary }
            ]}
          />
        </View>

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <SafeText variant="bodyStrong" color="primary">{staff.name}</SafeText>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={11} color="#F59E0B" />
              <SafeText variant="tiny" style={styles.ratingText}>{staff.rating}</SafeText>
            </View>
          </View>

          <SafeText variant="caption" color="muted">{staff.role} • Works in {staff.flatsWorkingCount} flats</SafeText>

          <View style={styles.statusRow}>
            <Ionicons
              name={staff.isInside ? 'log-in-outline' : 'log-out-outline'}
              size={14}
              color={staff.isInside ? colors.success : colors.textSecondary}
            />
            <SafeText
              variant="tiny"
              style={{
                color: staff.isInside ? colors.success : colors.textSecondary,
                fontWeight: '600',
              }}
            >
              {staff.isInside
                ? `Inside Society (Gate ${staff.gateName ?? '2'} at ${staff.entryTime ?? '09:15 AM'})`
                : 'Currently Outside Society'}
            </SafeText>
          </View>
        </View>

        {onCall ? (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              HapticFeedback.light();
              onCall();
            }}
            style={[styles.callBtn, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}
          >
            <Ionicons name="call" size={18} color="#2563EB" />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  presenceDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  ratingText: {
    color: '#92400E',
    fontWeight: '700',
    fontSize: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
