import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useComplaintSlaReport } from '../hooks/useComplaintSlaReport';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'COMPLAINT_SLA_REPORT'>;
export function ComplaintSlaReportScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useComplaintSlaReport();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_cddb386464b2} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.title, subtitle: item.summary, metric: item.metric, status: item.status }));
    return (<ActionPanelScreen title={localizedUiText.m_ab79314cd811} subtitle={localizedUiText.m_bcd049fa591e} rows={rows} actionTitle="Apply mock report action" actionMessage={actionMessage} onAction={() => setActionMessage(getActiveUiLiteral("m_09efb4879c42"))} onBack={() => navigation.goBack()}/>);
}

