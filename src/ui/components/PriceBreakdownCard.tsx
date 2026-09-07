import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeText } from '../../shared/components/SafeText';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import type { Absent } from "../../shared/types/absence.types";
export interface PriceBreakdownItem {
    label: string;
    amountFormatted: string;
    isDiscount?: boolean | Absent;
    isDeposit?: boolean | Absent;
    isTax?: boolean | Absent;
    hint?: string | Absent;
}
export interface PriceBreakdownCardProps {
    title?: string | Absent;
    items: PriceBreakdownItem[];
    totalLabel?: string | Absent;
    totalFormatted: string;
    depositNotice?: string | Absent;
    style?: ViewStyle | Absent;
    testID?: string | Absent;
}
export function PriceBreakdownCard({ title = 'Price Summary', items, totalLabel = 'Total Payable', totalFormatted, depositNotice, style, testID = 'price-breakdown-card', }: PriceBreakdownCardProps) {
    const { colors, dark } = useAppTheme();
    return (<View style={[
            styles.card,
            {
                backgroundColor: dark ? '#1E293B' : '#FFFFFF',
                borderColor: dark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
            },
            style,
        ]} testID={testID}>
      <SafeText variant="bodyStrong" style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 16, marginBottom: 12 }}>
        {title}
      </SafeText>

      <View style={styles.itemList}>
        {items.map((item, index) => (<View key={index} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <SafeText variant="body" style={{ color: colors.textSecondary, fontSize: 14 }}>
                {item.label}
              </SafeText>
              {item.hint ? (<SafeText variant="tiny" style={{ color: colors.textMuted, fontSize: 11 }}>
                  {item.hint}
                </SafeText>) : null}
            </View>
            <SafeText variant="body" style={{
                color: item.isDiscount
                    ? colors.success
                    : item.isDeposit
                        ? colors.info
                        : colors.textPrimary,
                fontWeight: '600',
                fontSize: 14,
            }}>
              {item.isDiscount ? `- ${item.amountFormatted}` : item.amountFormatted}
            </SafeText>
          </View>))}
      </View>

      <View style={[
            styles.divider,
            { backgroundColor: dark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0' },
        ]}/>

      <View style={styles.totalRow}>
        <SafeText variant="bodyStrong" style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 16 }}>
          {totalLabel}
        </SafeText>
        <SafeText variant="h2" style={{ color: colors.primary, fontWeight: '800', fontSize: 20 }}>
          {totalFormatted}
        </SafeText>
      </View>

      {depositNotice ? (<View style={[
                styles.noticeBox,
                { backgroundColor: colors.infoSoft, borderColor: colors.info },
            ]}>
          <SafeText variant="tiny" style={{ color: colors.info, fontWeight: '600', fontSize: 12 }}>
            ℹ️ {depositNotice}
          </SafeText>
        </View>) : null}
    </View>);
}
const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    itemList: {
        gap: 8,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    divider: {
        height: 1,
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    noticeBox: {
        marginTop: 12,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
});
export default PriceBreakdownCard;

