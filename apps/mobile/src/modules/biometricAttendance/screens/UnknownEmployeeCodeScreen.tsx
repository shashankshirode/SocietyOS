import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useUnknownEmployeeCodeReview } from '../hooks/useUnknownEmployeeCodeReview';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'UNKNOWN_EMPLOYEE_CODE'>;
export function UnknownEmployeeCodeScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch, resolveUnknownEmployeeCode, isResolving } = useUnknownEmployeeCodeReview();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_e579536dabdc} onRetry={refetch}/>;
    const records = data;
    const rows = records.map((item) => ({ id: item.id, title: item.employeeCode, subtitle: formatUiLiteral(String(localizedUiText.m_e798b21ef354), [item.deviceName, item.firstSeenAt]), status: item.resolutionStatus }));
    async function handleResolve() {
        const target = records.find((item) => item.resolutionStatus === 'OPEN') ?? getRequiredItem(records, 0, "UnknownEmployeeCodeScreen.tsx");
        const result = await resolveUnknownEmployeeCode({ unknownCodeId: target.id, staffName: 'Mapped Staff Member' });
        if (result.ok)
            setActionMessage(`Resolved employee code ${result.data.employeeCode}.`);
    }
    return (<ActionPanelScreen title={localizedUiText.m_80d2409d8620} subtitle={localizedUiText.m_b14c9b51a731} rows={rows} actionTitle={isResolving ? 'Resolving...' : getActiveUiLiteral("m_56194cfa70e4")} actionMessage={actionMessage} onAction={handleResolve} onBack={() => navigation.goBack()}/>);
}

