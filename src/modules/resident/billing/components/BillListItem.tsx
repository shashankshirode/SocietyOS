import React from 'react';
import { View, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { PressableScale } from '../../../../shared/motion/PressableScale';
import { useMessages } from '../../../../shared/constants/useMessages';
import { formatCurrencyAmount } from '../../../../shared/formatters/currencyFormatter';
import { formatBillingPeriod, formatDate } from '../../../../shared/formatters/dateFormatter';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import type { Bill } from '../../../../shared/types/bill.types';
import { styles } from '../styles/components/BillListItem.styles';

export type BillListItemProps = {
  bill: Bill;
  onPress: () => void;
  onDownloadReceipt?: (bill: Bill) => void;
};

export function BillListItem({ bill, onPress, onDownloadReceipt }: BillListItemProps) {
  const { colors } = useAppTheme();
  const messages = useMessages();
  const currencyCode = bill.charges[0]?.currencyCode ?? 'INR';
  const isPaid = bill.status === 'PAID';
  const isOverdue = bill.status === 'OVERDUE';

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${messages.residentAccessibility.billing.billCard}: ${bill.title}`}
      style={styles.pressable}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 3,
            elevation: 1,
          },
        ]}
      >
        {/* Left Status Icon */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: isPaid ? '#EEF5F0' : isOverdue ? '#FEE2E2' : '#EEF5F0',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name={isPaid ? 'checkmark-circle' : isOverdue ? 'alert-circle-outline' : 'document-text-outline'}
            size={24}
            color={isPaid ? '#064F43' : isOverdue ? '#DC2626' : '#064F43'}
          />
        </View>

        {/* Center Details */}
        <View style={{ flex: 1, gap: 4 }}>
          <SafeText
            variant="caption"
            style={{ color: colors.textSecondary, fontWeight: '500', fontSize: 13 }}
            numberOfLines={1}
          >
            {bill.title}
          </SafeText>

          <SafeText
            variant="h2"
            style={{ color: colors.textPrimary, fontWeight: '800', fontSize: 20 }}
          >
            {formatCurrencyAmount(bill.amount, currencyCode)}
          </SafeText>

          <SafeText
            variant="tiny"
            style={{
              color: isPaid ? colors.textMuted : isOverdue ? '#DC2626' : '#DC2626',
              fontWeight: isPaid ? '400' : '600',
              fontSize: 12,
            }}
          >
            {isPaid
              ? `${formatBillingPeriod(bill.billingPeriod)} · Paid on ${formatDate(bill.paidDate || bill.dueDate)}`
              : `${formatBillingPeriod(bill.billingPeriod)} · Due on ${formatDate(bill.dueDate)}`}
          </SafeText>
        </View>

        {/* Right Action */}
        {isPaid ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Download Receipt"
            onPress={(e) => {
              e.stopPropagation();
              if (onDownloadReceipt) onDownloadReceipt(bill);
              else onPress();
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: colors.surfaceMuted,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="download-outline" size={20} color={colors.textSecondary} />
          </Pressable>
        ) : (
          <View
            style={{
              backgroundColor: '#064F43',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SafeText variant="tiny" style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>
              Pay now
            </SafeText>
          </View>
        )}
      </View>
    </PressableScale>
  );
}

export default BillListItem;
