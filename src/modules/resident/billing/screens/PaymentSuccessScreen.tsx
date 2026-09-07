import React from "react";
import { ScrollView, View, Dimensions, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInUp, ZoomIn, useSharedValue, withTiming, withDelay, useAnimatedStyle, withSpring } from "react-native-reanimated";
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

    const successAnim = useSharedValue(0);
    const particleAnim = useSharedValue(0);

    React.useEffect(() => {
        successAnim.value = withDelay(100, withTiming(1, { duration: 600 }));
        particleAnim.value = withDelay(500, withTiming(1, { duration: 800 }));
    }, []);

    const bottomPadding = getResidentScreenBottomPadding({
        safeAreaBottom: insets.bottom,
        hasBottomTabs: true,
        hasStickyFooter: false,
    });

    const successCircleStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: successAnim.value },
        ],
        opacity: successAnim.value,
    }), [successAnim]);

    const particleStyle = useAnimatedStyle(() => ({
        opacity: particleAnim.value,
    }), [particleAnim]);

    return (
        <View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
            <ResidentPageHeader 
                title={billing.paymentSuccessTitle} 
                titleKey="resident.billing.paymentSuccessTitle" 
                showBackButton={true} 
                onBackPress={() => navigation.popToTop()}
            />
            
            <ScrollView 
                contentContainerStyle={[styles.scrollContent, createScrollViewPaddingBottomStyle(bottomPadding)]}
                showsVerticalScrollIndicator={false}
            >
                <ContentFrame style={styles.contentStack}>
                    {/* Success Animation Hero */}
                    <Animated.View style={successCircleStyle} entering={ZoomIn.duration(500).springify()}>
                        <View style={styles.heroContainer}>
                            {/* Particle Effects */}
                            <Animated.View style={[styles.particleContainer, particleStyle]}>
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <View key={i} style={[
                                        styles.particle,
                                        { 
                                            transform: [{ rotate: `${i * 60}deg` }],
                                            top: -80,
                                        }
                                    ]}>
                                        <View style={styles.particleDot} />
                                    </View>
                                ))}
                            </Animated.View>
                            
                            {/* Main Success Circle */}
                            <View style={[styles.successCircle, createAnimatedViewBackgroundColorStyle(theme.successSoft)]}>
                                <Animated.View
                                    style={[
                                        styles.checkmarkWrapper,
                                        { borderColor: theme.success }
                                    ]}
                                    entering={ZoomIn.delay(200).duration(400).springify()}
                                >
                                    <Ionicons name="checkmark" size={48} color={theme.success} />
                                </Animated.View>
                            </View>

                            {/* Amount Display */}
                            <Animated.View entering={FadeInUp.delay(300).duration(500)}>
                                <SafeText variant="tiny" color="muted" style={styles.amountLabel}>{billing.amountPaidLabel}</SafeText>
                                <SafeText variant="display" color="primary" style={styles.amountValue}>
                                    {formatCurrencyAmount(amountPaid, bill.charges[0]?.currencyCode ?? 'INR')}
                                </SafeText>
                            </Animated.View>

                            {/* Payment Method Badge */}
                            <Animated.View entering={FadeInUp.delay(350).duration(400)} style={styles.methodBadge}>
                                <Ionicons name={paymentMethod === 'UPI' ? 'phone-portrait' : paymentMethod === 'CARD' ? 'card' : paymentMethod === 'NET_BANKING' ? 'business' : 'cash'} size={16} color={theme.accent} />
                                <SafeText variant="tiny" style={{ color: theme.accent, fontWeight: '700', marginLeft: 6 }}>
                                    {`Paid via ${paymentMethodLabel}`}
                                </SafeText>
                            </Animated.View>
                        </View>
                    </Animated.View>

                    {/* Success Message */}
                    <Animated.View entering={FadeInUp.delay(400).duration(450)}>
                        <SafeText variant="title" color="primary" align="center" style={styles.successTitle}>{billing.paymentRecordedTitle}</SafeText>
                        <SafeText variant="caption" color="secondary" align="center" style={styles.successSubtitle}>{billing.paymentRecordedDescription}</SafeText>
                    </Animated.View>

                    {/* Receipt Panel */}
                    <Animated.View entering={FadeInUp.delay(500).duration(500)}>
                        <ReceiptPanel 
                            receiptNumber={receiptNumber} 
                            billingMonth={formatBillingPeriod(bill.billingPeriod)} 
                            amountPaid={amountPaid} 
                            paymentDate={formatDate(paymentDate)} 
                            paymentMethod={paymentMethodLabel} 
                            transactionId={transactionId} 
                            status="SUCCESS" 
                            items={bill.charges.map((charge) => ({
                                label: charge.label,
                                value: formatCurrencyAmount(charge.amount, charge.currencyCode),
                            }))}
                        />
                    </Animated.View>

                    {/* Action Buttons */}
                    <Animated.View entering={FadeInUp.delay(600).duration(450)} style={styles.actions}>
                        <AppButton 
                            title={billing.backToDashboard} 
                            onPress={() => navigation.popToTop()} 
                            iconLeft={<Ionicons name="home-outline" size={18} color={theme.selectedForeground}/>}
                            style={styles.primaryAction}
                        />
                        <AppButton 
                            title={billing.viewReceipt} 
                            variant="secondary" 
                            onPress={() => navigation.navigate('ReceiptDetail' as any, { receiptNumber } as any)} 
                            iconLeft={<Ionicons name="document-text-outline" size={18} color={theme.accent}/>}
                            style={styles.secondaryAction}
                        />
                    </Animated.View>

                    {/* Share / Download */}
                    <Animated.View entering={FadeInUp.delay(700).duration(400)} style={styles.secondaryActions}>
                        <Pressable 
                            onPress={() => { /* Share receipt */ }} 
                            style={styles.shareButton}
                        >
                            <Ionicons name="share-social-outline" size={18} color={theme.accent} />
                            <SafeText variant="caption" style={{ color: theme.accent, fontWeight: '600', marginLeft: 6 }}>
                                Share
                            </SafeText>
                        </Pressable>
                        <Pressable 
                            onPress={() => { /* Download PDF */ }} 
                            style={styles.downloadButton}
                        >
                            <Ionicons name="download-outline" size={18} color={theme.textSecondary} />
                            <SafeText variant="caption" style={{ color: theme.textSecondary, fontWeight: '600', marginLeft: 6 }}>
                                Download
                            </SafeText>
                        </Pressable>
                    </Animated.View>
                </ContentFrame>
            </ScrollView>
        </View>
    );
}

export default PaymentSuccessScreen;
