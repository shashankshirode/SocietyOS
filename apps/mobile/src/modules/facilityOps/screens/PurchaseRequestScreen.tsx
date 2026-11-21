import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { FormField } from '../../../shared/forms/FormField';
import type { FacilityOpsStackParamList } from '../../../app/navigation/navigation.types';
import { FooterActions, ParkingScreen, Selector, WarningText } from '../../resident/parking/components/ParkingUi';
import { usePurchaseRequest } from '../data/usePurchaseRequest';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'PurchaseRequest'>;
type Urgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export function PurchaseRequestScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [itemOrCategory, setItemOrCategory] = React.useState('');
    const [requiredQuantity, setRequiredQuantity] = React.useState('');
    const [reason, setReason] = React.useState('');
    const [estimatedAmount, setEstimatedAmount] = React.useState('');
    const [urgency, setUrgency] = React.useState<Urgency>('MEDIUM');
    const [preferredVendor, setPreferredVendor] = React.useState('');
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const { submit, isSubmitting, error } = usePurchaseRequest();
    async function handleSubmit() {
        const next: Record<string, string> = {};
        if (!itemOrCategory.trim())
            next.itemOrCategory = getActiveUiLiteral("m_86fe34ceb6b3");
        if (!requiredQuantity.trim())
            next.requiredQuantity = getActiveUiLiteral("m_911bafb0a4a6");
        if (!reason.trim())
            next.reason = getActiveUiLiteral("m_f948e02bfa3e");
        if (!estimatedAmount.trim())
            next.estimatedAmount = getActiveUiLiteral("m_07ca94e30b2f");
        setErrors(next);
        if (Object.keys(next).length)
            return;
        const result = await submit({ itemOrCategory, requiredQuantity: Number(requiredQuantity), reason, estimatedAmount: Number(estimatedAmount), urgency, preferredVendor });
        if (result.ok)
            navigation.goBack();
    }
    return (<ParkingScreen title={localizedUiText.m_aee5092ce316} subtitle={localizedUiText.m_d2e694f592a0} onBack={navigation.goBack} footer={<FooterActions primaryLabel="Submit mock request" onPrimary={handleSubmit} loading={isSubmitting}/>}>
      {error ? <ErrorState message={error.message}/> : null}
      <WarningText>{localizedUiText.m_cf10856fd6e3}</WarningText>
      <FormField label={localizedUiText.m_beec03201aff} required value={itemOrCategory} onChangeText={setItemOrCategory} {...includeWhenPresent("error", errors.itemOrCategory)}/>
      <FormField label={localizedUiText.m_d841f514dcdc} required value={requiredQuantity} onChangeText={setRequiredQuantity} keyboardType="number-pad" {...includeWhenPresent("error", errors.requiredQuantity)}/>
      <FormField label={localizedUiText.m_f81ab834de5f} required value={reason} onChangeText={setReason} {...includeWhenPresent("error", errors.reason)} multiline numberOfLines={3}/>
      <FormField label={localizedUiText.m_e75203f70d38} required value={estimatedAmount} onChangeText={setEstimatedAmount} keyboardType="number-pad" {...includeWhenPresent("error", errors.estimatedAmount)}/>
      <Selector label={localizedUiText.m_03d37e9a5379} value={urgency} onChange={setUrgency} options={[{ label: String(localizedUiText.m_f793de205ead), value: 'LOW' }, { label: String(localizedUiText.m_8e588cd18774), value: 'MEDIUM' }, { label: String(localizedUiText.m_c4ebc6d4a583), value: 'HIGH' }, { label: String(localizedUiText.m_1b015904cc17), value: 'URGENT' }]}/>
      <FormField label={localizedUiText.m_00cb05250ea7} value={preferredVendor} onChangeText={setPreferredVendor}/>
    </ParkingScreen>);
}

