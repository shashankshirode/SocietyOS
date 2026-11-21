import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useSocietyHealthScore } from '../hooks/useSocietyHealthScore';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SOCIETY_HEALTH_SCORE_DASHBOARD'>;
export function SocietyHealthScoreDashboardScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useSocietyHealthScore();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_f71769073fd9} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.societyName, subtitle: formatUiLiteral(String(localizedUiText.m_74bed25c48a3), [item.weakestDimension, item.improvementSuggestion]), metric: `Score: ${item.score} / Trend: ${item.trend}` }));
    return (<ActionPanelScreen title={localizedUiText.m_e63aa1ea1ea6} subtitle={localizedUiText.m_3fd6259298ba} rows={rows} actionTitle="Apply mock report action" actionMessage={actionMessage} onAction={() => setActionMessage(getActiveUiLiteral("m_e7102633dc79"))} onBack={() => navigation.goBack()}/>);
}

