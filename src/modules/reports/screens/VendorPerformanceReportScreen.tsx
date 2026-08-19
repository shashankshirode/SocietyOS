import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useVendorPerformanceReport } from '../hooks/useVendorPerformanceReport';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'VENDOR_PERFORMANCE_REPORT'>;
export function VendorPerformanceReportScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useVendorPerformanceReport();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_45c1892e1f75} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.title, subtitle: item.summary, metric: item.metric, status: item.status }));
    return (<ActionPanelScreen title={localizedUiText.m_a819605f3d90} subtitle={localizedUiText.m_5f6dc87f1dba} rows={rows} actionTitle="Apply mock report action" actionMessage={actionMessage} onAction={() => setActionMessage(getActiveUiLiteral("m_f617366902e0"))} onBack={() => navigation.goBack()}/>);
}

