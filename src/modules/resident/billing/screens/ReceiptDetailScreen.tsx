import React from 'react';
import { ScrollView, View, Share } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BillStackParamList } from '../../../../app/navigation/navigation.types';
import { SafeText } from '../../../../shared/components/SafeText';
import { SocietyScreen } from '../../../../shared/components/SocietyScreen';
import { SocietyDetailHeader } from '../../../../shared/components/SocietyDetailHeader';
import { SocietyButton } from '../../../../shared/components/SocietyButton';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { formatCurrencyAmount } from '../../../../shared/formatters/currencyFormatter';

type Props = NativeStackScreenProps<BillStackParamList, 'ReceiptDetail'>;

export function ReceiptDetailScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { activeContext } = useActiveResidentHome();
  const params = route.params;

  const receiptNumber = params?.receiptNumber ?? 'REC-2026-1001';
  const billingMonth = params?.billingMonth ?? 'Oct 2026';
  const amountPaid = params?.amountPaid ?? 4250;
  const paymentDate = params?.paymentDate ?? '02 Oct 2026';
  const transactionId = params?.transactionId ?? 'TXN123456';
  const societyName = activeContext.societyName ?? 'Greenwood Heights';
  const unitLabel = `${activeContext.displayUnitName} • ${activeContext.towerName ?? 'Tower A'}`;

  const charges = [
    { label: 'Maintenance Charges', amount: 3500 },
    { label: 'Sinking Fund', amount: 500 },
    { label: 'Water Charges', amount: 250 },
  ];

  const handleDownload = async () => {
    await Share.share({
      message: `${societyName} Maintenance Receipt\nPeriod: ${billingMonth}\nAmount: ₹${amountPaid.toLocaleString('en-IN')}\nPaid on: ${paymentDate}\nTxn: ${transactionId}`,
    });
  };

  return (
    <SocietyScreen testID="receipt-detail-screen">
      <SocietyDetailHeader
        title="Receipt"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 24,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Receipt Card Container */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 1,
          }}
        >
          {/* Header Mark */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#EEF5F0',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}
            >
              <Ionicons name="business" size={24} color="#064F43" />
            </View>
            <SafeText variant="bodyStrong" style={{ color: colors.textPrimary, fontSize: 17, fontWeight: '700' }}>
              {societyName}
            </SafeText>
            <SafeText variant="caption" style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
              Maintenance Receipt
            </SafeText>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 20 }} />

          {/* Unit & Month Meta */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <SafeText variant="caption" style={{ color: colors.textSecondary }}>Unit</SafeText>
            <SafeText variant="caption" style={{ color: colors.textPrimary, fontWeight: '600' }}>{unitLabel}</SafeText>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <SafeText variant="caption" style={{ color: colors.textSecondary }}>Period</SafeText>
            <SafeText variant="caption" style={{ color: colors.textPrimary, fontWeight: '600' }}>{billingMonth}</SafeText>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <SafeText variant="caption" style={{ color: colors.textSecondary }}>Receipt No.</SafeText>
            <SafeText variant="caption" style={{ color: colors.textPrimary, fontWeight: '600' }}>{receiptNumber}</SafeText>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <SafeText variant="caption" style={{ color: colors.textSecondary }}>Paid Date</SafeText>
            <SafeText variant="caption" style={{ color: colors.textPrimary, fontWeight: '600' }}>{paymentDate}</SafeText>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <SafeText variant="caption" style={{ color: colors.textSecondary }}>Transaction ID</SafeText>
            <SafeText variant="caption" style={{ color: colors.textPrimary, fontWeight: '600' }}>{transactionId}</SafeText>
          </View>

          {/* Line Items Breakdown */}
          <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 16 }} />

          <SafeText variant="tiny" style={{ color: colors.textMuted, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Breakdown
          </SafeText>

          {charges.map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <SafeText variant="caption" style={{ color: colors.textSecondary }}>{item.label}</SafeText>
              <SafeText variant="caption" style={{ color: colors.textPrimary, fontWeight: '500' }}>
                {formatCurrencyAmount(item.amount)}
              </SafeText>
            </View>
          ))}

          {/* Total Row */}
          <View style={{ height: 1, backgroundColor: colors.border, marginTop: 8, marginBottom: 16 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <SafeText variant="bodyStrong" style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '700' }}>
              Total Paid
            </SafeText>
            <SafeText variant="h2" style={{ color: '#064F43', fontSize: 22, fontWeight: '800' }}>
              {formatCurrencyAmount(amountPaid)}
            </SafeText>
          </View>
        </View>

        {/* Download PDF CTA */}
        <SocietyButton
          title="Download PDF"
          variant="primary"
          onPress={handleDownload}
          icon={<Ionicons name="download-outline" size={20} color="#FFFFFF" />}
        />
      </ScrollView>
    </SocietyScreen>
  );
}

export default ReceiptDetailScreen;
