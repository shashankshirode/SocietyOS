import React from 'react';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TreasurerStackParamList } from '../../../app/navigation/navigation.types';
import { resetToAppModeSelector } from '../../../core/auth/authNavigation';
import { CommandCenter } from '../../../ui/patterns/CommandCenter';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ScreenScaffold } from '../../../shared/layout/ScreenScaffold';
import { useTreasurerDashboard } from '../data/useTreasurerDashboard';
import { useMessages } from '../../../shared/constants/useMessages';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<TreasurerStackParamList, 'TreasurerHome'>;
const money = (amount: number) => `Rs ${amount.toLocaleString('en-IN')}`;
export function TreasurerDashboardScreen({ navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const messages = useMessages();
    const { data: dashboard, isLoading, error, refetch } = useTreasurerDashboard();
    if (isLoading) {
        return (<ScreenScaffold>
        <LoadingState message={localizedUiText.m_e9df1e770a25}/>
      </ScreenScaffold>);
    }
    if (error) {
        return (<ScreenScaffold>
        <ErrorState message={error.message} onRetry={refetch}/>
      </ScreenScaffold>);
    }
    const efficiency = dashboard?.collectionEfficiency ?? 84.6;
    const totalBilled = dashboard?.totalBilledThisMonth ?? 1843000;
    const totalCollected = dashboard?.totalCollectedThisMonth ?? 1560000;
    const outstanding = dashboard?.outstandingDues ?? 520000;
    const pendingReceipts = dashboard?.pendingManualEntries ?? 0;
    return (<CommandCenter role="TREASURER" title={localizedUiText.m_d21f1607411d} subtitle={formatUiLiteral(localizedUiText.m_2b8e896fffa1, [efficiency])} contextItems={['Treasury & Finance', `${efficiency}% efficiency`, `${pendingReceipts} pending`]} metrics={[
            { icon: 'bill', label: String(localizedUiText.m_3f88b9003138), value: money(totalBilled), detail: getActiveUiLiteral("m_adbb511d7ac2") },
            { icon: 'receipt', label: String(localizedUiText.m_1533d367e933), value: money(totalCollected), detail: String(localizedUiText.m_0abe25a847ee) },
            { icon: 'wallet', label: String(localizedUiText.m_e681b89952c4), value: money(outstanding), detail: getActiveUiLiteral("m_cc40c08667b5") },
            { icon: 'payment', label: String(localizedUiText.m_f4abfce10f9b), value: pendingReceipts, detail: String(localizedUiText.m_b05093f40747) },
        ]} actions={[
            { id: 'department-chat', icon: 'support', label: messages.department.chat.actions.accountsTitle, description: messages.department.chat.actions.accountsDescription, onPress: () => navigation.navigate('DepartmentChat', { screen: 'DepartmentInbox', params: { channelId: 'society-gv-accounts' } }) },
            { id: 'profile', icon: 'profile', label: String(localizedUiText.m_ea40c4373eed), description: String(localizedUiText.m_4b863aa24b92), onPress: () => navigation.navigate('TreasurerProfile') },
            { id: 'cycles', icon: 'calendar', label: String(localizedUiText.m_fdba78afbadc), description: String(localizedUiText.m_c12d2aeabd16), onPress: () => navigation.navigate('BillingCycles') },
            { id: 'ledger', icon: 'audit', label: String(localizedUiText.m_3a7ee5724404), description: String(localizedUiText.m_c43e4beb31b6), onPress: () => navigation.navigate('FlatLedger', {}) },
            { id: 'manual', icon: 'payment', label: String(localizedUiText.m_bfe431491d2f), description: String(localizedUiText.m_a9178b9f2f32), ...includeWhenPresent("badge", pendingReceipts > 0 ? 'VERIFY' : undefined), onPress: () => navigation.navigate('ManualPaymentEntry') },
            { id: 'charges', icon: 'bill', label: String(localizedUiText.m_62f117c4bb29), description: String(localizedUiText.m_0067113909f6), onPress: () => navigation.navigate('ChargeHeads') },
            { id: 'defaulters', icon: 'warning', label: String(localizedUiText.m_8d3e6ec5592c), description: String(localizedUiText.m_68d79f2643f3), onPress: () => navigation.navigate('DefaulterReport') },
            { id: 'logout', icon: 'logout', label: String(localizedUiText.m_9d0310dc0c7e), description: String(localizedUiText.m_f9321cf4f7d0), onPress: () => resetToAppModeSelector(navigation as NavigationProp<ParamListBase>) },
        ]} feedTitle="Finance alerts" feedItems={pendingReceipts > 0 ? [
            { id: 'pending-receipts', title: String(localizedUiText.m_447e8bc61746), subtitle: formatUiLiteral(String(localizedUiText.m_e391c4d5135e), [pendingReceipts]), status: 'ACTION', statusTone: 'warning' },
        ] : []} emptyTitle="Finance queue is clear" emptySubtitle="Manual receipts and collection exceptions will appear here." testID="treasurer-command-center"/>);
}

