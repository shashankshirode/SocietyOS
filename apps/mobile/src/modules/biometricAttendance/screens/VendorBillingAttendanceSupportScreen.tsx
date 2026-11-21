import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useVendorBillingAttendanceSupport } from '../hooks/useVendorBillingAttendanceSupport';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'VENDOR_BILLING_ATTENDANCE_SUPPORT'>;
export function VendorBillingAttendanceSupportScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const hookResult = useVendorBillingAttendanceSupport();
    const { data, isLoading, error, refetch } = hookResult;
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_62e86fd57953} onRetry={refetch}/>;
    const rows = data.map((item) => ({ id: item.id, title: item.vendorName, subtitle: formatUiLiteral(String(localizedUiText.m_370cdce17d4e), [item.invoiceMonth]), metric: `Payable days: ${item.payableDays} / Disputed days: ${item.disputedDays}`, status: item.verificationStatus }));
    return (<ActionPanelScreen title={localizedUiText.m_ebbd8d05b911} subtitle={localizedUiText.m_f5843bdfeac7} rows={rows} actionTitle="Run mock action" actionMessage={actionMessage} onAction={() => { setActionMessage(getActiveUiLiteral("m_a307b72a14e0")); }} onBack={() => navigation.goBack()}/>);
}

