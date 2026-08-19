import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useRfidIntegrationReadiness } from '../hooks/useRfidIntegrationReadiness';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'RFID_INTEGRATION_READINESS'>;
export function RfidIntegrationReadinessScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useRfidIntegrationReadiness();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_5b0c807dcf61} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.title, subtitle: formatUiLiteral(String(localizedUiText.m_aadee0429275), [item.summary, item.nextStep]), status: item.readinessStatus }));
    return (<ActionPanelScreen title={localizedUiText.m_6543d0520c21} subtitle={localizedUiText.m_5395bba00aa6} rows={rows} actionTitle="Confirm readiness workflow" actionMessage={actionMessage} onAction={() => setActionMessage(getActiveUiLiteral("m_72f6c94ad005"))} onBack={() => navigation.goBack()}/>);
}

