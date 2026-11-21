import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { FormField } from '../../../shared/forms/FormField';
import type { FacilityOpsStackParamList } from '../../../app/navigation/navigation.types';
import type { InventoryTransactionType } from '../../../shared/types/inventory.types';
import { FooterActions, ParkingScreen, Selector, WarningText } from '../../resident/parking/components/ParkingUi';
import { useInventoryTransaction } from '../data/useInventoryTransaction';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'InventoryTransaction'>;
export function InventoryTransactionScreen({ navigation, route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [itemId, setItemId] = React.useState(route.params.itemId ?? '');
    const [transactionType, setTransactionType] = React.useState<InventoryTransactionType>('ISSUE');
    const [quantity, setQuantity] = React.useState('');
    const [actor, setActor] = React.useState('');
    const [purpose, setPurpose] = React.useState('');
    const [notes, setNotes] = React.useState('');
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const { submit, isSubmitting, error } = useInventoryTransaction();
    async function handleSubmit() {
        const next: Record<string, string> = {};
        const numericQuantity = Number(quantity);
        if (!itemId.trim())
            next.itemId = getActiveUiLiteral("m_b20663f44c6e");
        if (!quantity.trim() || numericQuantity <= 0)
            next.quantity = getActiveUiLiteral("m_0d517545291e");
        if (!actor.trim())
            next.actor = getActiveUiLiteral("m_b3eac06403b4");
        if (!purpose.trim())
            next.purpose = getActiveUiLiteral("m_512ba0e2a531");
        setErrors(next);
        if (Object.keys(next).length)
            return;
        const result = await submit({ itemId, transactionType, quantity: numericQuantity, actor, purpose, notes });
        if (result.ok)
            navigation.goBack();
    }
    return (<ParkingScreen title={localizedUiText.m_f3d6438cbdf3} subtitle={localizedUiText.m_e9bebc58d0a5} onBack={navigation.goBack} footer={<FooterActions primaryLabel="Submit transaction" onPrimary={handleSubmit} loading={isSubmitting}/>}>
      {error ? <ErrorState message={error.message}/> : null}
      <WarningText>{localizedUiText.m_c5872a965f18}</WarningText>
      <FormField label={localizedUiText.m_652bcc3a4784} required value={itemId} onChangeText={setItemId} {...includeWhenPresent("error", errors.itemId)}/>
      <Selector label={localizedUiText.m_303efbcfcb5d} value={transactionType} onChange={setTransactionType} options={[{ label: String(localizedUiText.m_48dc76dfa23a), value: 'ISSUE' }, { label: String(localizedUiText.m_6b0143d03864), value: 'RETURN' }, { label: String(localizedUiText.m_c416069b7f61), value: 'ADJUSTMENT' }]}/>
      <FormField label={localizedUiText.m_822bab8d41bc} required value={quantity} onChangeText={setQuantity} keyboardType="number-pad" {...includeWhenPresent("error", errors.quantity)}/>
      <FormField label={localizedUiText.m_419cb6da9433} required value={actor} onChangeText={setActor} {...includeWhenPresent("error", errors.actor)}/>
      <FormField label={localizedUiText.m_d4e8830a71c7} required value={purpose} onChangeText={setPurpose} {...includeWhenPresent("error", errors.purpose)}/>
      <FormField label={localizedUiText.m_8a7525b1492f} value={notes} onChangeText={setNotes} multiline numberOfLines={3}/>
    </ParkingScreen>);
}

