import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useStaffAttendanceReports } from '../hooks/useStaffAttendanceReports';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'STAFF_ATTENDANCE_REPORTS'>;
export function StaffAttendanceReportsScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useStaffAttendanceReports();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_a6b16cdc9955} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.title, subtitle: item.summary, metric: item.metric, status: item.status }));
    return (<ActionPanelScreen title={localizedUiText.m_42e6c796575c} subtitle={localizedUiText.m_5d206c956bbf} rows={rows} actionTitle="Apply mock report action" actionMessage={actionMessage} onAction={() => setActionMessage(getActiveUiLiteral("m_c97fb638000c"))} onBack={() => navigation.goBack()}/>);
}

