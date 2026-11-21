import React, { useState } from "react";
import { ScrollView, Text } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../../shared/components/AppHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { FilterChips } from "../../../shared/lists/FilterChips";
import { useManualPayment } from "../data/useManualPayment";
import { validateManualPayment } from "../validators/accounting.validators";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TreasurerStackParamList } from "../../../app/navigation/navigation.types";
import type { PaymentMode } from "../../../shared/types/accounting.types";
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/ManualPaymentEntryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
const manualPaymentModes = ['CHEQUE', 'CASH', 'BANK_TRANSFER'] as const satisfies readonly PaymentMode[];
type ManualPaymentMode = (typeof manualPaymentModes)[number];
function isManualPaymentMode(value: string): value is ManualPaymentMode {
    return manualPaymentModes.some((mode) => mode === value);
}
export function ManualPaymentEntryScreen({ navigation }: NativeStackScreenProps<TreasurerStackParamList, 'ManualPaymentEntry'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { recordPayment, isSubmitting, success, error, reset } = useManualPayment();
    const [unitNumber, setUnitNumber] = useState('A-1204');
    const [amount, setAmount] = useState('8025');
    const [mode, setMode] = useState<ManualPaymentMode>('CHEQUE');
    const [refNum, setRefNum] = useState('CHQ987654');
    const [bank, setBank] = useState('HDFC Bank');
    const [notes, setNotes] = useState(getActiveUiLiteral("m_c98dc264cf23"));
    const [errors, setErrors] = useState<{
        unitNumber?: string;
        amount?: string;
        refNum?: string;
    }>({});
    const handleRecord = async () => {
        const validation = validateManualPayment(unitNumber, amount, mode, refNum);
        if (!validation.isValid) {
            setErrors(validation.fieldErrors);
            return;
        }
        setErrors({});
        AppAlert.alert(String(localizedUiText.m_f14d6917450a), formatUiLiteral(String(localizedUiText.m_bb68ce981baa), [amount, mode, unitNumber]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_eebdd24a77d9),
                onPress: async () => {
                    await recordPayment({
                        unitId: 'unit-001',
                        amount: Number(amount),
                        paymentMode: mode,
                        paymentDate: getRequiredItem(new Date().toISOString().split('T'), 0, "ManualPaymentEntryScreen.tsx"),
                        referenceNumber: refNum,
                        ...includeWhenPresent("bankName", bank || undefined),
                        ...includeWhenPresent("notes", notes || undefined),
                        confirmationChecked: true
                    });
                }
            },
        ]);
    };
    React.useEffect(() => {
        if (success) {
            AppAlert.alert(String(localizedUiText.m_60f10101d5e5), formatUiLiteral(String(localizedUiText.m_8580f99eabb8), [success.receiptNumber]), [
                {
                    text: String(localizedUiText.m_7e069fcaceb9),
                    onPress: () => {
                        reset();
                        navigation.navigate('ReceiptDetail', { receiptId: success.receiptId ?? success.id });
                    }
                },
                {
                    text: String(localizedUiText.m_565339bc4d33),
                    onPress: () => {
                        reset();
                        navigation.goBack();
                    }
                },
            ]);
        }
    }, [localizedUiText, navigation, reset, success]);
    React.useEffect(() => {
        if (error) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), error.message);
            reset();
        }
    }, [error, localizedUiText, reset]);
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_8a4bbd450b02} showBack onBack={navigation.goBack}/>
      
      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        <FormField label={localizedUiText.m_8ec6f42c4090} required value={unitNumber} onChangeText={setUnitNumber} placeholder={localizedUiText.m_365af11337d5} {...includeWhenPresent("error", errors.unitNumber)}/>

        <FormField label={localizedUiText.m_a83601e74d7b} required value={amount} onChangeText={setAmount} placeholder={localizedUiText.m_97dc6e3e061d} keyboardType="numeric" {...includeWhenPresent("error", errors.amount)}/>

        <Text style={styles.sectionLbl}>{localizedUiText.m_f14417611f08}</Text>
        <FilterChips options={manualPaymentModes.map((paymentMode) => ({ label: paymentMode, value: paymentMode }))} selected={mode} onChange={(value) => {
            if (isManualPaymentMode(value)) {
                setMode(value);
            }
        }}/>

        {mode !== 'CASH' && (<FormField label={mode === 'CHEQUE' ? localizedUiText.m_33a0550ecedf : localizedUiText.m_57555f6b52e4} required value={refNum} onChangeText={setRefNum} placeholder={localizedUiText.m_cf9ee880fb5d} {...includeWhenPresent("error", errors.refNum)}/>)}

        {mode !== 'CASH' && (<FormField label={localizedUiText.m_0f331cb6ab70} value={bank} onChangeText={setBank} placeholder={localizedUiText.m_d386d67429aa}/>)}

        <FormField label={localizedUiText.m_faa3aedd0676} value={notes} onChangeText={setNotes} placeholder={localizedUiText.m_93dde550cf77} multiline numberOfLines={3}/>

        <AppButton title={localizedUiText.m_bfe431491d2f} variant="primary" onPress={handleRecord} loading={isSubmitting} style={styles.recordBtn}/>
      </ScrollView>
    </SafeAreaView>);
}

