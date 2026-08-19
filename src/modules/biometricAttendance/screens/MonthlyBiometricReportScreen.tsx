import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useMonthlyBiometricReport } from '../hooks/useMonthlyBiometricReport';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'MONTHLY_BIOMETRIC_REPORT'>;
export function MonthlyBiometricReportScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const hookResult = useMonthlyBiometricReport();
    const { data, isLoading, error, refetch } = hookResult;
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_5f583016b21c} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.staffName, subtitle: `${item.vendorName} / ${item.location}`, metric: `Present days: ${item.presentDays} / Missing punches: ${item.missingPunches}` }));
    return (<ActionPanelScreen title={localizedUiText.m_29a92f35c05f} subtitle={localizedUiText.m_ce206936021e} rows={rows} actionTitle="Run mock action" actionMessage={actionMessage} onAction={() => { setActionMessage(getActiveUiLiteral("m_308305d941bb")); }} onBack={() => navigation.goBack()}/>);
}

