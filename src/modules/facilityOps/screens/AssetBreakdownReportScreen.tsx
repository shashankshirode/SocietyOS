import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { FormField } from '../../../shared/forms/FormField';
import type { FacilityOpsStackParamList } from '../../../app/navigation/navigation.types';
import type { BreakdownSeverity, OperationalImpact } from '../../../shared/types/workOrder.types';
import { FooterActions, MockFilePicker, ParkingScreen, Selector, WarningText } from '../../resident/parking/components/ParkingUi';
import { useAssetBreakdown } from '../data/useAssetBreakdown';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'AssetBreakdownReport'>;
export function AssetBreakdownReportScreen({ navigation, route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [assetId, setAssetId] = React.useState(route.params.assetId ?? '');
    const [location, setLocation] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [severity, setSeverity] = React.useState<BreakdownSeverity>('MEDIUM');
    const [operationalImpact, setOperationalImpact] = React.useState<OperationalImpact>('PARTIAL_IMPACT');
    const [immediateActionTaken, setImmediateActionTaken] = React.useState('');
    const [evidenceLabel, setEvidenceLabel] = React.useState('');
    const [notifyVendor, setNotifyVendor] = React.useState<'NO' | 'YES'>('YES');
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const { submit, isSubmitting, error } = useAssetBreakdown();
    async function handleSubmit() {
        const next: Record<string, string> = {};
        if (!assetId.trim())
            next.assetId = getActiveUiLiteral("m_51552fc4b095");
        if (!location.trim())
            next.location = getActiveUiLiteral("m_e56d59f22012");
        if (description.trim().length < 15)
            next.description = getActiveUiLiteral("m_db47c49ae0bb");
        setErrors(next);
        if (Object.keys(next).length)
            return;
        const result = await submit({ assetId, location, description, severity, operationalImpact, immediateActionTaken, evidenceLabel, vendorNotificationRequired: notifyVendor === 'YES' });
        if (result.ok)
            navigation.goBack();
    }
    return (<ParkingScreen title={localizedUiText.m_b6c1a8399f08} subtitle={localizedUiText.m_66d7be774af4} onBack={navigation.goBack} footer={<FooterActions primaryLabel="Report breakdown" onPrimary={handleSubmit} loading={isSubmitting} danger/>}>
      {error ? <ErrorState message={error.message}/> : null}
      <WarningText>{localizedUiText.m_1803d8c9e464}</WarningText>
      <FormField label={localizedUiText.m_80d298c9f240} required value={assetId} onChangeText={setAssetId} {...includeWhenPresent("error", errors.assetId)}/>
      <FormField label={localizedUiText.m_15b61974b270} required value={location} onChangeText={setLocation} {...includeWhenPresent("error", errors.location)}/>
      <FormField label={localizedUiText.m_6fdf4c7fb5a1} required value={description} onChangeText={setDescription} {...includeWhenPresent("error", errors.description)} multiline numberOfLines={4}/>
      <Selector label={localizedUiText.m_5e9f98120dbe} value={severity} onChange={setSeverity} options={[{ label: String(localizedUiText.m_f793de205ead), value: 'LOW' }, { label: String(localizedUiText.m_8e588cd18774), value: 'MEDIUM' }, { label: String(localizedUiText.m_c4ebc6d4a583), value: 'HIGH' }, { label: String(localizedUiText.m_427dd2969bd1), value: 'CRITICAL' }]}/>
      <Selector label={localizedUiText.m_e4456f3e5ed6} value={operationalImpact} onChange={setOperationalImpact} options={[{ label: String(localizedUiText.m_554567e142cb), value: 'NO_IMPACT' }, { label: String(localizedUiText.m_7506ae340c90), value: 'PARTIAL_IMPACT' }, { label: String(localizedUiText.m_7e86f70f3894), value: 'SERVICE_DOWN' }, { label: String(localizedUiText.m_85dd2ec7b2b0), value: 'SAFETY_RISK' }]}/>
      <FormField label={localizedUiText.m_d3f6cfa270af} value={immediateActionTaken} onChangeText={setImmediateActionTaken} multiline numberOfLines={3}/>
      <MockFilePicker label={localizedUiText.m_3dd3bba7b09a} fileName={evidenceLabel} helper="Tap to attach mock evidence" onPress={() => setEvidenceLabel('asset-breakdown-photo.jpg')}/>
      <Selector label={localizedUiText.m_2ba3aac291eb} value={notifyVendor} onChange={setNotifyVendor} options={[{ label: String(localizedUiText.m_85a39ab345d6), value: 'YES' }, { label: String(localizedUiText.m_1ea442a134b2), value: 'NO' }]}/>
    </ParkingScreen>);
}

