import React, { useMemo } from "react";
import { Pressable, ScrollView, View, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown, FadeInUp, useSharedValue, withTiming, withDelay, useAnimatedStyle, withSpring } from "react-native-reanimated";
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
    gradient: [string, string];
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function MockPaymentConfirmationScreen({ navigation, route }: MockPaymentConfirmationScreenProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const insets = useSafeAreaInsets();
    const { bill } = route.params;
    const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod | null>(null);
    const [footerHeight, setFooterHeight] = React.useState(76);
    const { submit, isSubmitting } = useMockPayment();
    const [errorVisible, setErrorVisible] = React.useState(false);
    const [successAnim, setSuccessAnim] = React.useState(false);
    const billing = messages.resident.billing;
    const checkout = billing.checkout;
    const remainingAmount = Math.max(0, bill.amount - (bill.paidAmount ?? 0));
    const currencyCode = bill.charges[0]?.currencyCode ?? 'INR';
    const formattedAmount = formatCurrencyAmount(remainingAmount, currencyCode);

    const paymentMethods: PaymentMethodOption[] = [
        { key: 'UPI', label: checkout.methods.upiLabel, icon: 'phone-portrait-outline', description: checkout.methods.upiDescription, gradient: ['#4285F4', '#34A853'] },
        { key: 'CARD', label: checkout.methods.cardLabel, icon: 'card-outline', description: checkout.methods.cardDescription, gradient: ['#5F259F', '#E91E63'] },
        { key: 'NET_BANKING', label: checkout.methods.netBankingLabel, icon: 'business-outline', description: checkout.methods.netBankingDescription, gradient: ['#00BAF2', '#00796B'] },
        { key: 'CASH_CHEQUE', label: checkout.methods.cashChequeLabel, icon: 'cash-outline', description: checkout.methods.cashChequeDescription, gradient: ['#F59E0B', '#D97706'] },
    ];

    const contentBottomPadding = getResidentScreenBottomPadding({
        safeAreaBottom: insets.bottom,
        hasBottomTabs: false,
        hasStickyFooter: true,
        stickyFooterHeight: Math.max(footerHeight - insets.bottom, 0),
    });

    const handleConfirmPayment = async () => {
        if (!selectedMethod) return;
        const result = await submit({
            billId: bill.id,
            paymentMethod: selectedMethod,
            amount: remainingAmount,
        });
        if (!result.ok) {
            setErrorVisible(true);
            return;
        }
        setSuccessAnim(true);
        setTimeout(() => {
            navigation.navigate('PaymentSuccess', {
                bill,
                paymentMethod: selectedMethod,
                transactionId: result.data.transactionId,
                receiptNumber: result.data.receiptNumber,
                paymentDate: result.data.paymentDate,
            });
        }, 600);
    };

    const selectedMethodData = paymentMethods.find(m => m.key === selectedMethod);

    return (
        <View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
            <ResidentPageHeader title={checkout.title} titleKey="resident.billing.checkout.title" />
            
            <ScrollView 
                testID="payment-checkout-scroll" 
                contentContainerStyle={[styles.scrollContent, createScrollViewPaddingBottomStyle(contentBottomPadding)]}
                showsVerticalScrollIndicator={false}
            >
                <ContentFrame style={styles.contentStack}>
                    {/* Amount Hero Card */}
                    <Animated.View entering={FadeInUp.duration(400).springify()}>
                        <View style={[styles.amountBox, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
                            <View style={styles.amountBadgeWrapper}>
                                <BillingVisualBadge type="maintenance" isPaid={false} size={56} />
                            </View>
                            <SafeText variant="tiny" color="muted" style={styles.amountLabel}>{checkout.totalOutstanding}</SafeText>
                            <Animated.View
                                style={styles.amountValue}
                                entering={FadeIn.delay(200).duration(500)}
                            >
                                <SafeText variant="display" style={[styles.amountText, { color: selectedMethodData?.gradient[0] || theme.accent }]}>
                                    {formattedAmount}
                                </SafeText>
                            </Animated.View>
                            <SafeText variant="caption" color="secondary" style={styles.periodLabel}>
                                {checkout.maintenanceFor(formatBillingPeriod(bill.billingPeriod))}
                            </SafeText>
                            {selectedMethodData && (
                                <View style={styles.selectedMethodBadge}>
                                    <Ionicons name={selectedMethodData.icon} size={14} color={selectedMethodData.gradient[0]} />
                                    <SafeText variant="tiny" style={{ color: selectedMethodData.gradient[0], fontWeight: '700', marginLeft: 4 }}>
                                        {selectedMethodData.label} Selected
                                    </SafeText>
                                </View>
                            )}
                        </View>
                    </Animated.View>

                    {/* Payment Methods */}
                    <Animated.View entering={FadeInUp.delay(100).duration(450).springify()} style={styles.methodSection}>
                        <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{checkout.selectPaymentMethod}</SafeText>
                        <View style={styles.methodList}>
                            {paymentMethods.map((method, index) => {
                                const selected = selectedMethod === method.key;

                                return (
                                    <Animated.View
                                        key={method.key}
                                        entering={FadeInUp.delay(index * 70).duration(350)}
                                    >
                                        <Pressable
                                            accessibilityRole="radio"
                                            accessibilityState={{ selected }}
                                            accessibilityLabel={`${messages.residentAccessibility.billing.paymentMethod}: ${method.label}`}
                                            onPress={() => setSelectedMethod(method.key)}
                                            style={[
                                                styles.methodRow,
                                                createPressableBackgroundColorBorderColorStyle(
                                                    selected ? method.gradient[0] + '15' : theme.surface,
                                                    selected ? method.gradient[0] : theme.border
                                                ),
                                            ]}
                                        >
                                            <View style={[
                                                styles.methodIcon,
                                                { backgroundColor: selected ? method.gradient[0] + '20' : theme.background },
                                            ]}>
                                                <Ionicons name={method.icon} size={22} color={selected ? method.gradient[0] : theme.textPrimary} />
                                            </View>
                                            <View style={styles.methodInfo}>
                                                <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textPrimary)}>{method.label}</SafeText>
                                                <SafeText variant="tiny" style={createSafeTextColorStyle3(theme.textSecondary)}>{method.description}</SafeText>
                                            </View>
                                            <View
                                                style={[
                                                    styles.radio,
                                                    createViewBorderColorStyle(selected ? method.gradient[0] : theme.border),
                                                ]}
                                            >
                                                {selected && (
                                                    <View
                                                        style={[
                                                            styles.radioInner,
                                                            createViewBackgroundColorStyle3(selected ? method.gradient[0] : theme.selectedBackground),
                                                        ]}
                                                    />
                                                )}
                                            </View>
                                        </Pressable>
                                    </Animated.View>
                                );
                            })}
                        </View>
                    </Animated.View>

                    {/* Security Notice */}
                    <Animated.View entering={FadeInUp.delay(200).duration(450).springify()} testID="payment-test-mode-card" style={styles.securityCard}>
                        <View style={styles.securityHeader}>
                            <View style={[styles.securityIcon, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                                <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                            </View>
                            <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{checkout.testModeTitle}</SafeText>
                        </View>
                        <PrivacyNoticePanel 
                            title="" 
                            description={checkout.testModeDescription} 
                            points={[checkout.testModePointMethods, checkout.testModePointLedger, checkout.testModePointReceipt]}
                        />
                    </Animated.View>
                </ContentFrame>
            </ScrollView>

            <StickyFooter onHeightChange={setFooterHeight} testID="payment-sticky-footer">
                <AppButton
                    title={checkout.confirmPayment(formattedAmount)}
                    onPress={() => void handleConfirmPayment()}
                    loading={isSubmitting}
                    disabled={!selectedMethod}
                    accessibilityLabel={checkout.confirmPayment(formattedAmount)}
                    iconLeft={<Ionicons name="shield-checkmark-outline" size={18} color={theme.selectedForeground} />}
                    style={selectedMethodData ? { backgroundColor: selectedMethodData.gradient[0] } : {}}
                />
            </StickyFooter>

            <StatusModal
                visible={errorVisible}
                type="error"
                title={checkout.paymentFailed}
                message={checkout.verificationFailed}
                actionLabel={checkout.dismissError}
                onClose={() => setErrorVisible(false)}
            />
        </View>
    );
}

export default MockPaymentConfirmationScreen;
