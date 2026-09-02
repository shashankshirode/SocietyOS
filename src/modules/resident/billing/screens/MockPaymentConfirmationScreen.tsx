import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { useMessages } from "../../../../shared/constants/useMessages";
import { formatCurrencyAmount } from "../../../../shared/formatters/currencyFormatter";
import { formatBillingPeriod } from "../../../../shared/formatters/dateFormatter";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { StatusModal } from "../../../../ui/modal/StatusModal";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import { StickyFooter } from "../../../../ui/layout/StickyFooter";
import { getResidentScreenBottomPadding } from "../../../../ui/layout/residentScreenSpacing";
import type { MockPaymentConfirmationScreenProps } from "../../../../app/navigation/navigation.types";
import type { PaymentMethod } from "../../../../shared/types/bill.types";
import { useMockPayment } from "../data/useMockPayment";
import { BillingVisualBadge } from "../components/BillingVisualBadge";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createScrollViewPaddingBottomStyle, createViewBackgroundColorBorderColorStyle, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorStyle2, createViewBorderColorStyle, createViewBackgroundColorStyle3 } from "../styles/screens/MockPaymentConfirmationScreen.styles";
type PaymentMethodOption = {
    key: PaymentMethod;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    description: string;
};
export function MockPaymentConfirmationScreen({ navigation, route }: MockPaymentConfirmationScreenProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const insets = useSafeAreaInsets();
    const { bill } = route.params;
    const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod | null>(null);
    const [footerHeight, setFooterHeight] = React.useState(76);
    const { submit, isSubmitting } = useMockPayment();
    const [errorVisible, setErrorVisible] = React.useState(false);
    const billing = messages.resident.billing;
    const checkout = billing.checkout;
    const remainingAmount = Math.max(0, bill.amount - (bill.paidAmount ?? 0));
    const currencyCode = bill.charges[0]?.currencyCode ?? 'INR';
    const formattedAmount = formatCurrencyAmount(remainingAmount, currencyCode);
    const paymentMethods: PaymentMethodOption[] = [
        { key: 'UPI', label: checkout.methods.upiLabel, icon: 'phone-portrait-outline', description: checkout.methods.upiDescription },
        { key: 'CARD', label: checkout.methods.cardLabel, icon: 'card-outline', description: checkout.methods.cardDescription },
        { key: 'NET_BANKING', label: checkout.methods.netBankingLabel, icon: 'business-outline', description: checkout.methods.netBankingDescription },
        { key: 'CASH_CHEQUE', label: checkout.methods.cashChequeLabel, icon: 'cash-outline', description: checkout.methods.cashChequeDescription },
    ];
    const contentBottomPadding = getResidentScreenBottomPadding({
        safeAreaBottom: insets.bottom,
        hasBottomTabs: false,
        hasStickyFooter: true,
        stickyFooterHeight: Math.max(footerHeight - insets.bottom, 0),
    });
    const handleConfirmPayment = async () => {
        if (!selectedMethod)
            return;
        const result = await submit({
            billId: bill.id,
            paymentMethod: selectedMethod,
            amount: remainingAmount,
        });
        if (!result.ok) {
            setErrorVisible(true);
            return;
        }
        navigation.navigate('PaymentSuccess', {
            bill,
            paymentMethod: selectedMethod,
            transactionId: result.data.transactionId,
            receiptNumber: result.data.receiptNumber,
            paymentDate: result.data.paymentDate,
        });
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}> 
      <ResidentPageHeader title={checkout.title} titleKey="resident.billing.checkout.title"/>
      <ScrollView testID="payment-checkout-scroll" contentContainerStyle={[styles.scrollContent, createScrollViewPaddingBottomStyle(contentBottomPadding)]} showsVerticalScrollIndicator={false}>
        <ContentFrame style={styles.contentStack}>
          <Animated.View entering={FadeInUp.duration(350)}>
            <View style={[styles.amountBox, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}> 
              <BillingVisualBadge type="maintenance" isPaid size={52}/>
              <SafeText variant="tiny" color="muted">{checkout.totalOutstanding}</SafeText>
              <SafeText variant="display" color="primary" style={styles.amount}>{formattedAmount}</SafeText>
              <SafeText variant="caption" color="secondary" style={styles.periodLabel}>
                {checkout.maintenanceFor(formatBillingPeriod(bill.billingPeriod))}
              </SafeText>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(450)} style={styles.methodSection}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{checkout.selectPaymentMethod}</SafeText>
            <View style={styles.methodList}>
              {paymentMethods.map((method) => {
            const selected = selectedMethod === method.key;
            return (<Pressable key={method.key} accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={`${messages.residentAccessibility.billing.paymentMethod}: ${method.label}`} onPress={() => setSelectedMethod(method.key)} style={[
                    styles.methodRow,
                    createPressableBackgroundColorBorderColorStyle(selected ? theme.accentSoft : theme.surface, selected ? theme.accent : theme.border),
                ]}>
                    <View style={[styles.methodIcon, createViewBackgroundColorStyle2(selected ? theme.selectedBackground : theme.background)]}>
                      <Ionicons name={method.icon} size={20} color={selected ? theme.selectedForeground : theme.textPrimary}/>
                    </View>
                    <View style={styles.methodInfo}>
                      <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textPrimary)}>{method.label}</SafeText>
                      <SafeText variant="tiny" style={createSafeTextColorStyle3(theme.textSecondary)}>{method.description}</SafeText>
                    </View>
                    <View style={[styles.radio, createViewBorderColorStyle(selected ? theme.selectedBorder : theme.border)]}>
                      {selected ? <View style={[styles.radioInner, createViewBackgroundColorStyle3(theme.selectedBackground)]}/> : null}
                    </View>
                  </Pressable>);
        })}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(450)} testID="payment-test-mode-card">
            <PrivacyNoticePanel title={checkout.testModeTitle} description={checkout.testModeDescription} points={[checkout.testModePointMethods, checkout.testModePointLedger, checkout.testModePointReceipt]}/>
          </Animated.View>
        </ContentFrame>
      </ScrollView>

      <StickyFooter onHeightChange={setFooterHeight} testID="payment-sticky-footer">
        <AppButton title={checkout.confirmPayment(formattedAmount)} onPress={() => void handleConfirmPayment()} loading={isSubmitting} disabled={!selectedMethod} accessibilityLabel={checkout.confirmPayment(formattedAmount)} iconLeft={<Ionicons name="shield-checkmark-outline" size={18} color={theme.selectedForeground}/>}/>
      </StickyFooter>

      <StatusModal visible={errorVisible} type="error" title={checkout.paymentFailed} message={checkout.verificationFailed} actionLabel={checkout.dismissError} onClose={() => setErrorVisible(false)}/>
    </View>);
}
export default MockPaymentConfirmationScreen;
