import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Switch } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { HapticFeedback } from '../../../../shared/utils/haptics';

export interface DeliveryBrand {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  enabled: boolean;
}

export function DeliveryPreApprovalPanel() {
  const { colors } = useAppTheme();
  const [leaveAtGate, setLeaveAtGate] = useState(false);
  const [autoApproveAll, setAutoApproveAll] = useState(true);
  const [brands, setBrands] = useState<DeliveryBrand[]>([
    { id: 'swiggy', name: 'Swiggy', icon: 'fast-food-outline', color: '#FC8019', enabled: true },
    { id: 'zomato', name: 'Zomato', icon: 'restaurant-outline', color: '#E23744', enabled: true },
    { id: 'amazon', name: 'Amazon', icon: 'cube-outline', color: '#FF9900', enabled: true },
    { id: 'blinkit', name: 'Blinkit', icon: 'flash-outline', color: '#F8CB46', enabled: true },
    { id: 'courier', name: 'Courier', icon: 'mail-outline', color: '#3B82F6', enabled: true },
  ]);

  const toggleBrand = (id: string) => {
    HapticFeedback.light();
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]} testID="delivery-pre-approval-panel">
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <View style={[styles.iconBadge, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}>
            <Ionicons name="bicycle-outline" size={20} color="#2563EB" />
          </View>
          <View>
            <SafeText variant="bodyStrong" color="primary">Delivery Pre-Approval</SafeText>
            <SafeText variant="caption" color="muted">Seamless gate entry without security calls</SafeText>
          </View>
        </View>
        <Switch
          value={autoApproveAll}
          onValueChange={(val) => {
            HapticFeedback.medium();
            setAutoApproveAll(val);
          }}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#FFF"
        />
      </View>

      {autoApproveAll ? (
        <View style={styles.body}>
          <View style={styles.brandsRow}>
            {brands.map((brand) => (
              <Pressable
                key={brand.id}
                onPress={() => toggleBrand(brand.id)}
                style={[
                  styles.brandChip,
                  {
                    backgroundColor: brand.enabled ? `${brand.color}15` : colors.background,
                    borderColor: brand.enabled ? brand.color : colors.border,
                  },
                ]}
              >
                <Ionicons name={brand.icon} size={15} color={brand.enabled ? brand.color : colors.textSecondary} />
                <SafeText
                  variant="tiny"
                  style={{
                    color: brand.enabled ? brand.color : colors.textSecondary,
                    fontWeight: brand.enabled ? '700' : '500',
                  }}
                >
                  {brand.name}
                </SafeText>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={() => {
              HapticFeedback.light();
              setLeaveAtGate(!leaveAtGate);
            }}
            style={[
              styles.leaveAtGateRow,
              { backgroundColor: leaveAtGate ? 'rgba(16, 185, 129, 0.1)' : colors.background, borderColor: leaveAtGate ? colors.success : colors.border }
            ]}
          >
            <View style={styles.leaveAtGateLeft}>
              <Ionicons
                name={leaveAtGate ? 'checkbox' : 'square-outline'}
                size={20}
                color={leaveAtGate ? colors.success : colors.textSecondary}
              />
              <View>
                <SafeText variant="caption" color="primary" style={{ fontWeight: '700' }}>Leave at Security Gate</SafeText>
                <SafeText variant="tiny" color="muted">Guard will hold package in parcel zone</SafeText>
              </View>
            </View>
            <SafeText variant="tiny" style={{ color: leaveAtGate ? colors.success : colors.textSecondary, fontWeight: '700' }}>
              {leaveAtGate ? 'ACTIVE' : 'OFF'}
            </SafeText>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    marginTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
    paddingTop: 10,
  },
  brandsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  brandChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  leaveAtGateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  leaveAtGateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
