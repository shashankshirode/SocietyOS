import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useFinancialReports } from '../hooks/useFinancialReports';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'FINANCIAL_REPORTS'>;
export function FinancialReportsScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useFinancialReports();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_8c96d0741905} onRetry={refetch}/>;
    const rows = data.map((item) => ({
        id: item.id,
        title: item.reportName,
        subtitle: formatUiLiteral(String(localizedUiText.m_482c7d173305), [item.month]),
        metric: `Collected: Rs. ${item.collectedAmount} / Outstanding: Rs. ${item.outstandingAmount}`,
        status: item.outstandingAmount > 100000 ? 'NEEDS_REVIEW' : 'READY',
    }));
    return (<ActionPanelScreen title={localizedUiText.m_c56ce178b67c} subtitle={localizedUiText.m_af3f14c83c1f} rows={rows} actionTitle="Apply mock report action" actionMessage={actionMessage} onAction={() => setActionMessage(getActiveUiLiteral("m_3b16a4f82410"))} onBack={() => navigation.goBack()}/>);
}

