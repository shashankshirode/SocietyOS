import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useSocietyList } from '../hooks/useSocietyList';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SOCIETY_LIST'>;
export function SocietyListScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useSocietyList();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_609b9c92888a} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.name, subtitle: formatUiLiteral(String(localizedUiText.m_436726f65c3c), [item.city, item.state, item.planCode]), metric: `Units: ${item.totalUnits} / Active users: ${item.activeUsers}`, status: item.status }));
    return (<ActionPanelScreen title={localizedUiText.m_ad45e943f3ce} subtitle={localizedUiText.m_fab2593c4ca5} rows={rows} actionTitle="Apply society list filter" actionMessage={actionMessage} onAction={() => setActionMessage(getActiveUiLiteral("m_33f1b6621914"))} onBack={() => navigation.goBack()}/>);
}

