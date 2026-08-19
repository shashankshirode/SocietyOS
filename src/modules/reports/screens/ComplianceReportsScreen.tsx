import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useComplianceReports } from '../hooks/useComplianceReports';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'COMPLIANCE_REPORTS'>;
export function ComplianceReportsScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useComplianceReports();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_1a320772eac9} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.title, subtitle: item.summary, metric: item.metric, status: item.status }));
    return (<ActionPanelScreen title={localizedUiText.m_02f61b55c9a4} subtitle={localizedUiText.m_6a1e240903b4} rows={rows} actionTitle="Apply mock report action" actionMessage={actionMessage} onAction={() => setActionMessage(getActiveUiLiteral("m_b8ea3b49b8fc"))} onBack={() => navigation.goBack()}/>);
}

