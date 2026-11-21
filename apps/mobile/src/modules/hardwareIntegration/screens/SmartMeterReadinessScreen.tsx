import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useSmartMeterReadiness } from '../hooks/useSmartMeterReadiness';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SMART_METER_READINESS'>;
export function SmartMeterReadinessScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useSmartMeterReadiness();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_09e1a7fd40c6} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.title, subtitle: formatUiLiteral(String(localizedUiText.m_aadee0429275), [item.summary, item.nextStep]), status: item.readinessStatus }));
    return (<ActionPanelScreen title={localizedUiText.m_4cc045e94053} subtitle={localizedUiText.m_67b798c91f4b} rows={rows} actionTitle="Confirm readiness workflow" actionMessage={actionMessage} onAction={() => setActionMessage(getActiveUiLiteral("m_17ca83a936af"))} onBack={() => navigation.goBack()}/>);
}

