import { useState, useMemo } from "react";
import { ScrollView, View, Pressable, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { useMessages } from "../../../../shared/constants/useMessages";
import { formatCurrencyAmount } from "../../../../shared/formatters/currencyFormatter";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import { useResidentBills } from "../hooks/useResidentBills";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BillStackParamList } from "../../../../app/navigation/navigation.types";
import { styles, createViewBackgroundColorStyle, createAnimatedViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle2, createPressableBackgroundColorBorderColorStyle, createSafeTextFontWeightStyle, createTextInputColorBorderColorBackgroundColorStyle, createAnimatedViewBackgroundColorBorderColorStyle2, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBorderBottomColorStyle, createAnimatedViewBackgroundColorBorderColorStyle3, createAnimatedViewMarginBottomStyle } from "../styles/screens/AdvancePaymentScreen.styles";
const BASE_MONTHLY_MAINTENANCE = 5000;
const MIN_CUSTOM_AMOUNT = 1000;
const MAX_CUSTOM_AMOUNT = 120000;
export function AdvancePaymentScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<BillStackParamList>>();
    const theme = useResidentTheme();
    const messages = useMessages();
    const insets = useSafeAreaInsets();
    const { activeContext } = useActiveResidentHome();
    const { summary } = useResidentBills("all");
    const billing = messages.resident.billing;
    const currentAdvanceBalance = summary?.advanceBalance ?? 0;
    const outstandingAmount = summary?.totalOutstanding ?? 0;
    const [selectedMonths, setSelectedMonths] = useState<number | 'custom'>(1);
    const [customAmountStr, setCustomAmountStr] = useState("");
    const advanceOptions: readonly {
        readonly label: string;
        readonly value: number | 'custom';
    }[] = [
        { label: billing.oneMonth, value: 1 },
        { label: billing.twoMonths, value: 2 },
        { label: billing.threeMonths, value: 3 },
        { label: billing.sixMonths, value: 6 },
        { label: billing.twelveMonths, value: 12 },
        { label: billing.customAmountOption, value: 'custom' as const },
    ];
    const calculatedAmount = useMemo(() => {
        if (selectedMonths === 'custom') {
            const parsed = parseInt(customAmountStr, 10);
            return isNaN(parsed) ? 0 : parsed;
        }
        return selectedMonths * BASE_MONTHLY_MAINTENANCE;
    }, [selectedMonths, customAmountStr]);
    const allocation = useMemo(() => {
        const totalPayment = calculatedAmount;
        const amountApplied = Math.min(totalPayment, outstandingAmount);
        const amountAdded = Math.max(0, totalPayment - outstandingAmount);
        const projectedAdvance = currentAdvanceBalance + amountAdded;
        const estimatedCovered = BASE_MONTHLY_MAINTENANCE > 0 ? Math.floor(projectedAdvance / BASE_MONTHLY_MAINTENANCE) : 0;
        return {
            totalPayment,
            amountApplied,
            amountAdded,
            projectedAdvance,
            estimatedCovered,
        };
    }, [calculatedAmount, outstandingAmount, currentAdvanceBalance]);
    const isValid = useMemo(() => {
        if (selectedMonths === 'custom') {
            return calculatedAmount >= MIN_CUSTOM_AMOUNT && calculatedAmount <= MAX_CUSTOM_AMOUNT;
        }
        return calculatedAmount > 0;
    }, [selectedMonths, calculatedAmount]);
    const handleProceed = () => {
        if (!isValid)
            return;
        const virtualBill = {
            id: `advance_payment:${Date.now()}`,
            billNumber: `ADV-${Date.now()}`,
            flatNumber: activeContext.displayUnitName,
            societyName: activeContext.societyName,
            title: messages.resident.billing.advanceMaintenance,
            amount: calculatedAmount,
            dueDate: new Date().toISOString().split('T')[0] || '',
            status: 'DRAFT' as const,
            billingPeriod: `Advance Payment`,
            charges: [
                {
                    lineItemId: `charge-advance-${Date.now()}`,
                    type: 'maintenance' as const,
                    label: messages.resident.billing.amountAddedAsAdvanceCredit,
                    labelMessageKey: 'resident.billing.amountAddedAsAdvanceCredit',
                    amount: calculatedAmount,
                    currencyCode: 'INR',
                    isCredit: false,
                }
            ],
            homeContextId: activeContext.homeContextId,
            societyId: activeContext.societyId,
        };
        navigation.navigate("MockPaymentConfirmation", { bill: virtualBill });
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={billing.advanceMaintenance} titleKey="resident.billing.advanceMaintenance" showBackButton/>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ContentFrame style={styles.contentStack}>
          
          <Animated.View entering={FadeInUp.duration(350)} style={[styles.infoCard, createAnimatedViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
            <View style={[styles.iconBox, createViewBackgroundColorStyle2(theme.accentSoft)]}>
              <Ionicons name="card-outline" size={20} color={theme.accent}/>
            </View>
            <View style={styles.viewFlex}>
              <SafeText variant="bodyStrong" color="primary">
                {billing.advanceBaseMonthlyMaintenance(formatCurrencyAmount(BASE_MONTHLY_MAINTENANCE, 'INR'))}
              </SafeText>
              <SafeText variant="caption" color="secondary" style={styles.safeTextMarginTop}>
                {billing.advanceCurrentBalance(formatCurrencyAmount(currentAdvanceBalance, 'INR'))}
              </SafeText>
            </View>
          </Animated.View>

          
          <Animated.View entering={FadeInUp.delay(100).duration(400)}>
            <SafeText variant="bodyStrong" color="primary" style={styles.safeTextMarginBottom}>
              {billing.selectAdvancePeriod}
            </SafeText>
            <View style={styles.grid}>
              {advanceOptions.map((opt) => {
            const isSelected = selectedMonths === opt.value;
            return (<Pressable key={opt.value} onPress={() => setSelectedMonths(opt.value)} style={[
                    styles.gridItem,
                    createPressableBackgroundColorBorderColorStyle(isSelected ? theme.accentSoft : theme.surface, isSelected ? theme.accent : theme.border)
                ]}>
                    <SafeText variant="body" color={isSelected ? "primary" : "secondary"} style={createSafeTextFontWeightStyle(isSelected ? '700' : '400')}>
                      {opt.label}
                    </SafeText>
                  </Pressable>);
        })}
            </View>
          </Animated.View>

          
          {selectedMonths === 'custom' && (<Animated.View entering={FadeInDown.duration(300)}>
              <SafeText variant="caption" color="secondary" style={styles.safeTextMarginBottom2}>
                {billing.customAmount} · {billing.advanceCustomAmountRange}
              </SafeText>
              <TextInput style={[
                styles.input,
                createTextInputColorBorderColorBackgroundColorStyle(theme.textPrimary, theme.border, theme.surface)
            ]} keyboardType="numeric" maxLength={6} placeholder={billing.advanceAmountPlaceholder} placeholderTextColor={theme.textMuted} value={customAmountStr} onChangeText={(text) => setCustomAmountStr(text.replace(/[^0-9]/g, ''))}/>
            </Animated.View>)}

          
          <Animated.View entering={FadeInDown.delay(100).duration(450)} style={[styles.breakdownCard, createAnimatedViewBackgroundColorBorderColorStyle2(theme.surface, theme.border)]}>
            <SafeText variant="bodyStrong" color="primary" style={styles.safeTextMarginBottom3}>
              {billing.reviewPayment}
            </SafeText>

            <View style={styles.breakdownRow}>
              <SafeText variant="caption" color="secondary">{billing.advanceTotalPayment}</SafeText>
              <SafeText variant="bodyStrong" color="primary">
                {formatCurrencyAmount(allocation.totalPayment, 'INR')}
              </SafeText>
            </View>

            {outstandingAmount > 0 && (<View style={styles.breakdownRow}>
                <SafeText variant="caption" color="secondary">{billing.amountAppliedToOutstanding}</SafeText>
                <SafeText variant="caption" style={createSafeTextColorStyle(theme.danger)}>
                  -{formatCurrencyAmount(allocation.amountApplied, 'INR')}
                </SafeText>
              </View>)}

            <View style={styles.breakdownRow}>
              <SafeText variant="caption" color="secondary">{billing.amountAddedAsAdvanceCredit}</SafeText>
              <SafeText variant="caption" style={createSafeTextColorStyle2(theme.success)}>
                +{formatCurrencyAmount(allocation.amountAdded, 'INR')}
              </SafeText>
            </View>

            <View style={[styles.divider, createViewBorderBottomColorStyle(theme.border)]}/>

            <View style={styles.breakdownRow}>
              <SafeText variant="caption" color="secondary">{billing.advanceProjectedCredit}</SafeText>
              <SafeText variant="bodyStrong" color="primary">
                {formatCurrencyAmount(allocation.projectedAdvance, 'INR')}
              </SafeText>
            </View>

            <View style={styles.breakdownRow}>
              <SafeText variant="caption" color="secondary">{billing.estimatedCoverage}</SafeText>
              <SafeText variant="caption" color="primary" style={styles.safeTextFontWeight}>
                {billing.advanceMonths(allocation.estimatedCovered)}
              </SafeText>
            </View>
          </Animated.View>

          
          <Animated.View entering={FadeInDown.delay(200).duration(450)} style={[styles.warningCard, createAnimatedViewBackgroundColorBorderColorStyle3(theme.surface, theme.border)]}>
            <Ionicons name="information-circle-outline" size={20} color={theme.accent}/>
            <SafeText variant="tiny" color="secondary" style={styles.safeTextFlex}>
              {billing.advanceVariableChargesNote}
            </SafeText>
          </Animated.View>

          
          <Animated.View entering={FadeInDown.delay(300).duration(450)} style={createAnimatedViewMarginBottomStyle(insets.bottom + 16)}>
            <AppButton title={billing.advanceProceedToPayment} disabled={!isValid} onPress={handleProceed}/>
          </Animated.View>
        </ContentFrame>
      </ScrollView>
    </View>);
}
export default AdvancePaymentScreen;

