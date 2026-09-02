import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInUp, ZoomIn } from "react-native-reanimated";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ReceiptPanel } from "../../../../ui/patterns/ReceiptPanel";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { useMessages } from "../../../../shared/constants/useMessages";
import { formatCurrencyAmount } from "../../../../shared/formatters/currencyFormatter";
import { formatBillingPeriod, formatDate } from "../../../../shared/formatters/dateFormatter";
import { getResidentScreenBottomPadding } from "../../../../ui/layout/residentScreenSpacing";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import type { PaymentSuccessScreenProps } from "../../../../app/navigation/navigation.types";
import { styles, createViewBackgroundColorStyle, createScrollViewPaddingBottomStyle, createAnimatedViewBackgroundColorStyle } from "../styles/screens/PaymentSuccessScreen.styles";
export function PaymentSuccessScreen({ navigation, route }: PaymentSuccessScreenProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const insets = useSafeAreaInsets();
    const billing = messages.resident.billing;
    const { bill, paymentMethod, transactionId, receiptNumber, paymentDate } = route.params;
    const amountPaid = Math.max(0, bill.amount - (bill.paidAmount ?? 0));
    const paymentMethodLabel = paymentMethod === 'UPI'
        ? billing.paymentMethodUPI
        : paymentMethod === 'CARD'
            ? billing.paymentMethodCard
            : paymentMethod === 'NET_BANKING'
                ? billing.paymentMethodNetBanking
                : billing.paymentMethodCashCheque;
    const bottomPadding = getResidentScreenBottomPadding({
        safeAreaBottom: insets.bottom,
        hasBottomTabs: true,
        hasStickyFooter: false,
    });
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}> 
      <ResidentPageHeader title={billing.paymentSuccessTitle} titleKey="resident.billing.paymentSuccessTitle" showBackButton={true} onBackPress={() => navigation.popToTop()}/>
      <ScrollView contentContainerStyle={[styles.scrollContent, createScrollViewPaddingBottomStyle(bottomPadding)]} showsVerticalScrollIndicator={false}>
        <ContentFrame style={styles.contentStack}>
          <View style={styles.header}>
            <Animated.View entering={ZoomIn.duration(450)} style={[styles.circle, createAnimatedViewBackgroundColorStyle(theme.successSoft)]}> 
              <Ionicons name="checkmark-circle" size={54} color={theme.success}/>
            </Animated.View>
            <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.headerText}>
              <SafeText variant="title" color="primary" align="center" style={styles.title}>{billing.paymentRecordedTitle}</SafeText>
              <SafeText variant="caption" color="secondary" align="center">{billing.paymentRecordedDescription}</SafeText>
            </Animated.View>
          </View>
          <Animated.View entering={FadeInUp.delay(200).duration(450)}>
            <ReceiptPanel receiptNumber={receiptNumber} billingMonth={formatBillingPeriod(bill.billingPeriod)} amountPaid={amountPaid} paymentDate={formatDate(paymentDate)} paymentMethod={paymentMethodLabel} transactionId={transactionId} status="SUCCESS" items={bill.charges.map((charge) => ({
            label: charge.label,
            value: formatCurrencyAmount(charge.amount, charge.currencyCode),
        }))}/>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(300).duration(450)} style={styles.actions}>
            <AppButton title={billing.backToDashboard} onPress={() => navigation.popToTop()} iconLeft={<Ionicons name="home-outline" size={18} color={theme.selectedForeground}/>}/>
          </Animated.View>
        </ContentFrame>
      </ScrollView>
    </View>);
}
export default PaymentSuccessScreen;
