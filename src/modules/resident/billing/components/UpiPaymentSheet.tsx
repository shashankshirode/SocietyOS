import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { AppModal } from '../../../../ui/modal/AppModal';
import { HapticFeedback } from '../../../../shared/utils/haptics';
import { useMockPayment } from '../data/useMockPayment';

export interface UpiPaymentSheetProps {
  visible: boolean;
  amount: number;
  billId: string;
  billMonth?: string;
  onClose: () => void;
  onPaymentComplete: (method: string, transactionId: string, receiptNumber: string) => void;
}

export function UpiPaymentSheet({
  visible,
  amount,
  billId,
  billMonth = 'August 2026',
  onClose,
  onPaymentComplete,
}: UpiPaymentSheetProps) {
  const { colors } = useAppTheme();
  const [splitCount, setSplitCount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const splitAmount = Math.round(amount / splitCount);
  const { submit } = useMockPayment();

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: 'logo-google' as const, color: '#4285F4' },
    { id: 'phonepe', name: 'PhonePe', icon: 'phone-portrait-outline' as const, color: '#5F259F' },
    { id: 'paytm', name: 'Paytm UPI', icon: 'wallet-outline' as const, color: '#00BAF2' },
    { id: 'bhim', name: 'BHIM / Any UPI', icon: 'qr-code-outline' as const, color: '#00796B' },
  ];

  const handlePay = async (appName: string, method: 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH_CHEQUE') => {
    HapticFeedback.success();
    setIsProcessing(true);
    try {
      const result = await submit({
        billId,
        paymentMethod: method,
        amount: splitCount > 1 ? splitAmount : amount,
      });
      if (!result.ok) {
        setErrorMessage(result.error?.message || 'Payment failed');
        setErrorVisible(true);
        setIsProcessing(false);
        return;
      }
      onPaymentComplete(appName, result.data.transactionId, result.data.receiptNumber);
    } catch (err) {
      setErrorMessage('An unexpected error occurred');
      setErrorVisible(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppModal visible={visible} onClose={onClose} testID="upi-payment-sheet">
      <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.shieldIcon, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            </View>
            <View>
              <SafeText variant="bodyStrong" color="primary">Instant Society Dues Payment</SafeText>
              <SafeText variant="caption" color="muted">Secure UPI • 0% Convenience Fee</SafeText>
            </View>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={[styles.amountCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <SafeText variant="caption" color="muted">Maintenance & Sinking Fund ({billMonth})</SafeText>
          <SafeText variant="h1" color="primary" style={styles.amountText}>
            ₹{amount.toLocaleString('en-IN')}
          </SafeText>

          <View style={styles.splitRow}>
            <SafeText variant="caption" color="muted">Split with Roommates / Co-owners:</SafeText>
            <View style={styles.splitBtns}>
              {[1, 2, 3, 4].map((n) => (
                <Pressable
                  key={n}
                  onPress={() => {
                    HapticFeedback.light();
                    setSplitCount(n);
                  }}
                  style={[
                    styles.splitBtn,
                    {
                      backgroundColor: splitCount === n ? colors.primary : colors.surface,
                      borderColor: splitCount === n ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <SafeText
                    variant="tiny"
                    style={{ color: splitCount === n ? '#FFF' : colors.textPrimary, fontWeight: '700' }}
                  >
                    {n === 1 ? 'Full' : `${n} Ways`}
                  </SafeText>
                </Pressable>
              ))}
            </View>
          </View>

          {splitCount > 1 ? (
            <View style={[styles.splitResult, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <SafeText variant="caption" style={{ color: '#2563EB', fontWeight: '700' }}>
                Your Share: ₹{splitAmount.toLocaleString('en-IN')}
              </SafeText>
              <SafeText variant="tiny" style={{ color: '#3B82F6' }}>
                (Remaining ₹{(amount - splitAmount).toLocaleString('en-IN')} assigned to co-residents)
              </SafeText>
            </View>
          ) : null}
        </View>

        <SafeText variant="caption" color="primary" style={[styles.sectionTitle, { fontWeight: '700' }]}>
          Choose Payment Method
        </SafeText>

        <View style={styles.appsList}>
          {upiApps.map((app) => (
            <Pressable
              key={app.id}
              onPress={() => handlePay(app.name, 'UPI')}
              disabled={isProcessing}
              style={({ pressed }) => [
                styles.appRow,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={styles.appRowLeft}>
                <View style={[styles.appIconWrap, { backgroundColor: `${app.color}15` }]}>
                  <Ionicons name={app.icon} size={20} color={app.color} />
                </View>
                <SafeText variant="bodyStrong" color="primary">{app.name}</SafeText>
              </View>
              {isProcessing ? (
                <Ionicons name="refresh" size={18} color={colors.primary} />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.otherMethods}>
          <SafeText variant="caption" color="muted" style={styles.otherLabel}>Other Methods</SafeText>
          <View style={styles.otherApps}>
            <Pressable
              onPress={() => handlePay('Credit/Debit Card', 'CARD')}
              disabled={isProcessing}
              style={styles.otherAppBtn}
            >
              <Ionicons name="card-outline" size={20} color={colors.primary} />
              <SafeText variant="bodyStrong" color="primary">Credit / Debit Card</SafeText>
            </Pressable>
            <Pressable
              onPress={() => handlePay('Net Banking', 'NET_BANKING')}
              disabled={isProcessing}
              style={styles.otherAppBtn}
            >
              <Ionicons name="business-outline" size={20} color={colors.primary} />
              <SafeText variant="bodyStrong" color="primary">Net Banking</SafeText>
            </Pressable>
          </View>
        </View>

        {errorVisible ? (
          <View style={[styles.errorBanner, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: colors.danger }]}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <SafeText variant="caption" style={{ color: colors.danger, flex: 1 }}>
              {errorMessage}
            </SafeText>
            <Pressable onPress={() => setErrorVisible(false)} hitSlop={8}>
              <Ionicons name="close" size={16} color={colors.danger} />
            </Pressable>
          </View>
        ) : null}

        <View style={styles.stampFooter}>
          <Ionicons name="checkmark-done-circle-outline" size={16} color={colors.success} />
          <SafeText variant="tiny" color="muted">
            Official Society Stamp Receipt generated instantly upon payment
          </SafeText>
        </View>
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 4,
  },
  amountCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  amountText: {
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 4,
  },
  splitRow: {
    width: '100%',
    marginTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
    paddingTop: 10,
  },
  splitBtns: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  splitBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  splitResult: {
    width: '100%',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: 10,
    marginTop: 20,
  },
  appsList: {
    gap: 8,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  appRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherMethods: {
    marginTop: 16,
  },
  otherLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },
  otherApps: {
    flexDirection: 'row',
    gap: 10,
  },
  otherAppBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  stampFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
});

