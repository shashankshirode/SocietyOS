import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useAutomationAuditLog } from '../hooks/useAutomationAuditLog';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'AUTOMATION_AUDIT_LOG'>;
export function AutomationAuditLogScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useAutomationAuditLog();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_82c0b2a00b31} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.automationName, subtitle: formatUiLiteral(String(localizedUiText.m_fc27c86d75ef), [item.action, item.actorName]), metric: item.createdAt }));
    return (<ActionPanelScreen title={localizedUiText.m_93c2e8aa10ec} subtitle={localizedUiText.m_096e5db393bd} rows={rows} actionTitle="Refresh audit log filter" actionMessage={actionMessage} onAction={() => setActionMessage(getActiveUiLiteral("m_7a821180f8d2"))} onBack={() => navigation.goBack()}/>);
}

