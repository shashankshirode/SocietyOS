import { useState } from 'react';
import { StyleSheet, View, Pressable, Switch } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { HapticFeedback } from '../../../../shared/utils/haptics';
import { getColors } from '../../../../design-system/tokens/premium-colors';
import { DeliveryBrandId, LeaveAtGateState } from '../data/visitors.enums';

export interface DeliveryBrandItem {
  id: DeliveryBrandId;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  enabled: boolean;
}

const DEFAULT_BRANDS: DeliveryBrandItem[] = [
  { id: DeliveryBrandId.SWIGGY, name: 'Swiggy', icon: 'fast-food-outline', color: '#FC8019', enabled: true },
  { id: DeliveryBrandId.ZOMATO, name: 'Zomato', icon: 'restaurant-outline', color: '#E23744', enabled: true },
  { id: DeliveryBrandId.AMAZON, name: 'Amazon', icon: 'cube-outline', color: '#FF9900', enabled: true },
  { id: DeliveryBrandId.BLINKIT, name: 'Blinkit', icon: 'flash-outline', color: '#F8CB46', enabled: true },
  { id: DeliveryBrandId.COURIER, name: 'Courier', icon: 'mail-outline', color: '#3B82F6', enabled: true },
];

export function DeliveryPreApprovalPanel() {
  const { dark } = useAppTheme();
  const themeColors = getColors(dark ? 'dark' : 'light');
  const [leaveAtGateMode, setLeaveAtGateMode] = useState<LeaveAtGateState>(LeaveAtGateState.OFF);
  const [autoApproveAll, setAutoApproveAll] = useState(true);
  const [brands, setBrands] = useState<DeliveryBrandItem[]>(DEFAULT_BRANDS);

  const toggleBrand = (id: DeliveryBrandId) => {
    HapticFeedback.light();
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
  };

  const isLeaveAtGateActive = leaveAtGateMode === LeaveAtGateState.ACTIVE;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.surface.primary,
          borderColor: themeColors.border.default,
        },
      ]}
      testID="delivery-pre-approval-panel"
    >
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <View style={[styles.iconBadge, { backgroundColor: `${themeColors.brand.primary}18` }]}>
            <Ionicons name="bicycle-outline" size={20} color={themeColors.brand.primary} />
          </View>
          <View style={styles.headerTextCol}>
            <SafeText variant="bodyStrong" style={{ color: themeColors.text.primary }}>
              Delivery Pre-Approval
            </SafeText>
            <SafeText variant="caption" style={{ color: themeColors.text.secondary }}>
              Seamless gate entry without security calls
            </SafeText>
          </View>
        </View>
        <Switch
          value={autoApproveAll}
          onValueChange={(val) => {
            HapticFeedback.medium();
            setAutoApproveAll(val);
          }}
          trackColor={{ false: themeColors.border.default, true: themeColors.brand.primary }}
          thumbColor="#FFFFFF"
        />
      </View>

      {autoApproveAll ? (
        <View style={[styles.body, { borderTopColor: themeColors.border.default }]}>
          <View style={styles.brandsRow}>
            {brands.map((brand) => (
              <Pressable
                key={brand.id}
                onPress={() => toggleBrand(brand.id)}
                style={[
                  styles.brandChip,
                  {
                    backgroundColor: brand.enabled ? `${brand.color}18` : themeColors.surface.secondary,
                    borderColor: brand.enabled ? brand.color : themeColors.border.default,
                  },
                ]}
              >
                <Ionicons
                  name={brand.icon}
                  size={15}
                  color={brand.enabled ? brand.color : themeColors.text.secondary}
                />
                <SafeText
                  variant="tiny"
                  style={{
                    color: brand.enabled ? brand.color : themeColors.text.secondary,
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
              setLeaveAtGateMode(isLeaveAtGateActive ? LeaveAtGateState.OFF : LeaveAtGateState.ACTIVE);
            }}
            style={[
              styles.leaveAtGateRow,
              {
                backgroundColor: isLeaveAtGateActive ? `${themeColors.brand.success}15` : themeColors.surface.secondary,
                borderColor: isLeaveAtGateActive ? themeColors.brand.success : themeColors.border.default,
              },
            ]}
          >
            <View style={styles.leaveAtGateLeft}>
              <Ionicons
                name={isLeaveAtGateActive ? 'checkbox' : 'square-outline'}
                size={20}
                color={isLeaveAtGateActive ? themeColors.brand.success : themeColors.text.secondary}
              />
              <View>
                <SafeText variant="caption" style={{ color: themeColors.text.primary, fontWeight: '700' }}>
                  Leave at Security Gate
                </SafeText>
                <SafeText variant="tiny" style={{ color: themeColors.text.secondary }}>
                  Guard will hold package in parcel zone
                </SafeText>
              </View>
            </View>
            <SafeText
              variant="tiny"
              style={{
                color: isLeaveAtGateActive ? themeColors.brand.success : themeColors.text.secondary,
                fontWeight: '700',
              }}
            >
              {leaveAtGateMode}
            </SafeText>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTextCol: {
    flex: 1,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    marginTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
  },
  brandsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  brandChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  leaveAtGateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  leaveAtGateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
});

