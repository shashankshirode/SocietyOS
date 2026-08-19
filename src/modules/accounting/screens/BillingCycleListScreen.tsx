import { useState } from "react";
import { FlatList, Text, View, ActivityIndicator, ScrollView } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { FormField } from "../../../shared/forms/FormField";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useBillingCycles } from "../data/useBillingCycles";
import { validateBillingCycle } from "../validators/accounting.validators";
import type { BillingCycle } from "../../../shared/types/accounting.types";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/BillingCycleListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
export function BillingCycleListScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: cycles = [], isLoading, error, generateBills, isSubmitting, } = useBillingCycles();
    const [isCreating, setIsCreating] = useState(false);
    const [month, setMonth] = useState('August 2026');
    const [start, setStart] = useState('2026-08-01');
    const [end, setEnd] = useState('2026-08-31');
    const [dueDate, setDueDate] = useState('2026-08-15');
    const [errors, setErrors] = useState<{
        month?: string;
        start?: string;
        end?: string;
        dueDate?: string;
    }>({});
    const handleGenerate = async () => {
        const validation = validateBillingCycle(month, start, end, dueDate);
        if (!validation.isValid) {
            setErrors(validation.fieldErrors);
            return;
        }
        setErrors({});
        AppAlert.alert(String(localizedUiText.m_2592f9f7b690), formatUiLiteral(String(localizedUiText.m_be7bdc4df979), [month]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_eebdd24a77d9),
                onPress: async () => {
                    await generateBills({
                        billingCycleMonth: month,
                        billingPeriodStart: start,
                        billingPeriodEnd: end,
                        dueDate,
                        applicableTowers: ['A Wing', 'B Wing', 'C Wing'],
                        chargeHeadIds: ['ch-001', 'ch-002', 'ch-003'],
                        includeParkingCharges: true,
                        includePenalties: true,
                        includePreviousDues: true
                    });
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_e3bb8722f0be));
                    setIsCreating(false);
                }
            },
        ]);
    };
    const renderItem = ({ item, index }: {
        item: BillingCycle;
        index: number;
    }) => (<Animated.View entering={FadeInLeft.delay(index * 30).duration(300)}>
      <AppCard style={styles.card} onPress={() => navigation.navigate('DraftBillReview', { cycleId: item.id })}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{item.cycleName}</Text>
          <StatusBadge label={item.status} type={item.status === 'PUBLISHED' ? 'success' : 'warning'}/>
        </View>

        <Text style={styles.dateRange}>{localizedUiText.m_d4ba2180987a}{item.billingPeriodStart}{" " + localizedUiText.m_663ea1bfffe5 + " "}{item.billingPeriodEnd}
        </Text>
        <Text style={styles.dueText}>{localizedUiText.m_c66908c1431f + " "}{item.dueDate}</Text>

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.lbl}>{localizedUiText.m_809d0fb61b4a}</Text>
            <Text style={styles.val}>₹{item.totalAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.viewAlignItems}>
            <Text style={styles.lbl}>{localizedUiText.m_1533d367e933}</Text>
            <Text style={[styles.val, styles.textColor]}>
              ₹{item.collectedAmount.toLocaleString()}
            </Text>
          </View>
        </View>
      </AppCard>
    </Animated.View>);
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={isCreating ? localizedUiText.m_4f3be394348f : localizedUiText.m_bbf9a4d6e664} showBack onBack={isCreating ? () => setIsCreating(false) : navigation.goBack}/>

      {isCreating ? (<ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
          <FormField label={localizedUiText.m_1b2416d96ea9} required value={month} onChangeText={setMonth} placeholder={localizedUiText.m_9a6e7e28e182} {...includeWhenPresent("error", errors.month)}/>
          <FormField label={localizedUiText.m_c684c2cd1717} required value={start} onChangeText={setStart} placeholder={localizedUiText.m_6c48580bf8e9} {...includeWhenPresent("error", errors.start)}/>
          <FormField label={localizedUiText.m_d35a05d3e45e} required value={end} onChangeText={setEnd} placeholder={localizedUiText.m_6c48580bf8e9} {...includeWhenPresent("error", errors.end)}/>
          <FormField label={localizedUiText.m_57870fd03032} required value={dueDate} onChangeText={setDueDate} placeholder={localizedUiText.m_6c48580bf8e9} {...includeWhenPresent("error", errors.dueDate)}/>

          <View style={styles.buttonRow}>
            <AppButton title={localizedUiText.m_19766ed6ccb2} variant="secondary" onPress={() => setIsCreating(false)} disabled={isSubmitting} style={styles.appButtonFlex}/>
            <AppButton title={localizedUiText.m_cfe10438c973} variant="primary" onPress={handleGenerate} loading={isSubmitting} style={styles.appButtonFlex2}/>
          </View>
        </ScrollView>) : (<View style={styles.viewFlex}>
          <View style={styles.topActions}>
            <AppButton title={localizedUiText.m_82624fdd49cd} variant="primary" onPress={() => setIsCreating(true)}/>
          </View>

          {isLoading ? (<View style={styles.centered}>
              <ActivityIndicator size="large" color={Colors.primary}/>
            </View>) : error ? (<EmptyState title={localizedUiText.m_d434e971b2ff} description={error.message} iconName="alert-circle-outline"/>) : cycles.length === 0 ? (<EmptyState title={localizedUiText.m_3625f93ad2ea} description={localizedUiText.m_7b204ad09eea} iconName="calendar-outline"/>) : (<FlatList data={cycles} renderItem={renderItem} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/>)}
        </View>)}
    </SafeAreaView>);
}

