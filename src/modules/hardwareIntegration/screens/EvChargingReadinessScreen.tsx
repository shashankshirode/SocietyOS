import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useEvChargingReadiness } from '../hooks/useEvChargingReadiness';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'EV_CHARGING_READINESS'>;
export function EvChargingReadinessScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useEvChargingReadiness();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_9b639b168747} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.title, subtitle: formatUiLiteral(String(localizedUiText.m_aadee0429275), [item.summary, item.nextStep]), status: item.readinessStatus }));
    return (<ActionPanelScreen title={localizedUiText.m_fa3c85c8ac50} subtitle={localizedUiText.m_65ee71ba873c} rows={rows} actionTitle="Confirm readiness workflow" actionMessage={actionMessage} onAction={() => setActionMessage(getActiveUiLiteral("m_29afe700359c"))} onBack={() => navigation.goBack()}/>);
}

