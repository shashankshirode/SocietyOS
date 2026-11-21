import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useAnprIntegrationReadiness } from '../hooks/useAnprIntegrationReadiness';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'ANPR_INTEGRATION_READINESS'>;
export function AnprIntegrationReadinessScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useAnprIntegrationReadiness();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_041c14bee826} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.title, subtitle: formatUiLiteral(String(localizedUiText.m_aadee0429275), [item.summary, item.nextStep]), status: item.readinessStatus }));
    return (<ActionPanelScreen title={localizedUiText.m_2ebe0a5cd6b3} subtitle={localizedUiText.m_f8c24026752c} rows={rows} actionTitle="Confirm readiness workflow" actionMessage={actionMessage} onAction={() => setActionMessage(getActiveUiLiteral("m_8e9704af3673"))} onBack={() => navigation.goBack()}/>);
}

