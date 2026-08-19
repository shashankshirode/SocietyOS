import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useBiometricPunchSyncLogs } from '../hooks/useBiometricPunchSyncLogs';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'BIOMETRIC_PUNCH_SYNC_LOGS'>;
export function BiometricPunchSyncLogsScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const hookResult = useBiometricPunchSyncLogs();
    const { data, isLoading, error, refetch } = hookResult;
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_8d782a39ec6f} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.deviceName, subtitle: formatUiLiteral(String(localizedUiText.m_0d87eaf03e32), [item.employeeCode, item.staffName ?? String(localizedUiText.m_b0d9e465f6bf), item.punchTime]), status: item.status }));
    return (<ActionPanelScreen title={localizedUiText.m_10fb8e833e04} subtitle={localizedUiText.m_612c5af15d02} rows={rows} actionTitle="Run mock action" actionMessage={actionMessage} onAction={() => { setActionMessage(getActiveUiLiteral("m_a38603c86fba")); }} onBack={() => navigation.goBack()}/>);
}

