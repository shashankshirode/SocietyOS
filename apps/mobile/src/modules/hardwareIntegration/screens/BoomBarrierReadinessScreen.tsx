import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useBoomBarrierReadiness } from '../hooks/useBoomBarrierReadiness';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'BOOM_BARRIER_READINESS'>;
export function BoomBarrierReadinessScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useBoomBarrierReadiness();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_9c1e7b164acc} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.title, subtitle: formatUiLiteral(String(localizedUiText.m_aadee0429275), [item.summary, item.nextStep]), status: item.readinessStatus }));
    return (<ActionPanelScreen title={localizedUiText.m_9788eeddeb97} subtitle={localizedUiText.m_388f1952d6ca} rows={rows} actionTitle="Confirm readiness workflow" actionMessage={actionMessage} onAction={() => setActionMessage(getActiveUiLiteral("m_51ca69f1d2b5"))} onBack={() => navigation.goBack()}/>);
}

