import React from 'react';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FacilityOpsStackParamList } from '../../../app/navigation/navigation.types';
import { resetToAppModeSelector } from '../../../core/auth/authNavigation';
import { CommandCenter } from '../../../ui/patterns/CommandCenter';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ScreenScaffold } from '../../../shared/layout/ScreenScaffold';
import { useFacilityOpsHome } from '../data/useFacilityOpsHome';
import { useMessages } from '../../../shared/constants/useMessages';
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'FacilityOpsHome'>;
export function FacilityOpsHomeScreen({ navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const messages = useMessages();
    const { data, isLoading, error, refetch } = useFacilityOpsHome();
    if (isLoading) {
        return (<ScreenScaffold>
        <LoadingState message={localizedUiText.m_018a7e309cd8}/>
      </ScreenScaffold>);
    }
    if (error || !data) {
        return (<ScreenScaffold>
        <ErrorState message={error?.message || localizedUiText.m_94a19bb7d97e} onRetry={refetch}/>
      </ScreenScaffold>);
    }
    return (<CommandCenter role="FACILITY_MANAGER" title={formatUiLiteral(localizedUiText.m_96a6c4a4bbf9, [data.managerName])} subtitle={formatUiLiteral(localizedUiText.m_b2335ff598cc, [data.assignedAreas.join(', ')])} contextItems={[data.societyName, `${data.assignedAreas.length} areas`, `${data.openWorkOrders} work orders`]} metrics={[
            { icon: 'audit', label: String(localizedUiText.m_7d2d17130467), value: data.openWorkOrders, detail: getActiveUiLiteral("m_c2ddc2f1c3e2") },
            { icon: 'calendar', label: String(localizedUiText.m_dfa1755aad3b), value: data.amcRenewalsDue, detail: getActiveUiLiteral("m_fd8ec0c0f429") },
            { icon: 'warning', label: String(localizedUiText.m_bf57b5b6ddb5), value: data.assetBreakdowns, detail: getActiveUiLiteral("m_73dc247138ef") },
            { icon: 'info', label: String(localizedUiText.m_72efd5481a7d), value: data.complianceExpiring, detail: getActiveUiLiteral("m_868cf6f35a73") },
        ]} actions={[
            { id: 'department-chat', icon: 'support', label: messages.department.chat.actions.facilityTitle, description: messages.department.chat.actions.facilityDescription, onPress: () => navigation.navigate('DepartmentChat', { screen: 'DepartmentInbox', params: { channelId: 'society-gv-facilityHelpdesk' } }) },
            { id: 'profile', icon: 'profile', label: String(localizedUiText.m_a889f2b6b07d), description: String(localizedUiText.m_3e2dafcc2b78), onPress: () => navigation.navigate('FacilityProfile') },
            { id: 'workorders', icon: 'audit', label: String(localizedUiText.m_079483a4f2b0), description: String(localizedUiText.m_dfa68eec952a), onPress: () => navigation.navigate('WorkOrderList') },
            { id: 'staff', icon: 'staff', label: String(localizedUiText.m_26c13b50a9cc), description: String(localizedUiText.m_54983536344d), onPress: () => navigation.navigate('StaffAttendanceStack', { screen: 'StaffAttendanceHome' }) },
            { id: 'attendance', icon: 'edit', label: String(localizedUiText.m_7121eb43d39a), description: String(localizedUiText.m_bf836aeea2c8), onPress: () => navigation.navigate('StaffAttendanceStack', { screen: 'ManualAttendanceEntry' }) },
            { id: 'vendors', icon: 'users', label: String(localizedUiText.m_a6def7eea0ce), description: String(localizedUiText.m_bc157a1ecf15), onPress: () => navigation.navigate('VendorDirectory') },
            { id: 'assets', icon: 'facility', label: String(localizedUiText.m_516ca51864c3), description: String(localizedUiText.m_f1b7e103be35), onPress: () => navigation.navigate('AssetRegister') },
            { id: 'inventory', icon: 'wallet', label: String(localizedUiText.m_d0ee8d86e427), description: String(localizedUiText.m_249e5b36b6a0), onPress: () => navigation.navigate('InventoryList') },
            { id: 'breakdown', icon: 'warning', label: String(localizedUiText.m_568044357ad1), description: String(localizedUiText.m_2e2b098cc968), badge: 'NEW', onPress: () => navigation.navigate('AssetBreakdownReport', {}) },
            { id: 'logout', icon: 'logout', label: String(localizedUiText.m_9d0310dc0c7e), description: String(localizedUiText.m_f9321cf4f7d0), onPress: () => resetToAppModeSelector(navigation as NavigationProp<ParamListBase>) },
        ]} feedTitle="Operations watchlist" feedItems={[
            { id: 'amc-renewal', title: String(localizedUiText.m_821b78936ed9), subtitle: formatUiLiteral(String(localizedUiText.m_04e5a17f77b4), [data.amcRenewalsDue]), status: 'AMC', statusTone: 'warning' },
            { id: 'inventory-alerts', title: String(localizedUiText.m_19737706af70), subtitle: formatUiLiteral(String(localizedUiText.m_d0d35cc2214b), [data.lowInventoryAlerts]), status: 'STOCK', statusTone: 'danger' },
        ]} testID="facility-command-center"/>);
}

