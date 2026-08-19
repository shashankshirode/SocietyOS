import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useBiometricDevices } from '../hooks/useBiometricDevices';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'BIOMETRIC_DEVICE_REGISTRY'>;
export function BiometricDeviceRegistryScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch, registerDevice, isRegistering } = useBiometricDevices();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_0c9e16c9cf35} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.deviceName, subtitle: formatUiLiteral(String(localizedUiText.m_8e05a312a5c1), [item.location, item.lastSyncTime]), status: item.status }));
    async function handleRegister() {
        const result = await registerDevice({ deviceName: 'New Gate Biometric Terminal', location: 'Tower A Lobby', vendorName: 'SecureGate Services' });
        if (result.ok)
            setActionMessage(`Registered ${result.data.deviceName}.`);
    }
    return (<ActionPanelScreen title={localizedUiText.m_df29e9dbfa25} subtitle={localizedUiText.m_05a52c72a96b} rows={rows} actionTitle={isRegistering ? 'Registering...' : getActiveUiLiteral("m_074dd5a91461")} actionMessage={actionMessage} onAction={handleRegister} onBack={() => navigation.goBack()}/>);
}

