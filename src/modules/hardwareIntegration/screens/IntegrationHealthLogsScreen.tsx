import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useIntegrationHealthLogs } from '../hooks/useIntegrationHealthLogs';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'INTEGRATION_HEALTH_LOGS'>;
export function IntegrationHealthLogsScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useIntegrationHealthLogs();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_2ff6f94c4057} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.integrationName, subtitle: `${item.detail} / ${item.timestamp}`, status: item.status }));
    return (<ActionPanelScreen title={localizedUiText.m_89660c35c82e} subtitle={localizedUiText.m_f804481187dc} rows={rows} actionTitle="Apply health log filter" actionMessage={actionMessage} onAction={() => setActionMessage(getActiveUiLiteral("m_1e77a0dd9cbf"))} onBack={() => navigation.goBack()}/>);
}

