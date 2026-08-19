import React from 'react';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SocietyAdminStackParamList } from '../../../app/navigation/navigation.types';
import { resetToAppModeSelector } from '../../../core/auth/authNavigation';
import { CommandCenter } from '../../../ui/patterns/CommandCenter';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ScreenScaffold } from '../../../shared/layout/ScreenScaffold';
import { useAdminDashboard } from '../data/useAdminDashboard';
import { useMessages } from '../../../shared/constants/useMessages';
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
interface Props {
    navigation: NativeStackNavigationProp<SocietyAdminStackParamList, 'SocietyAdminHome'>;
}
export function SocietyAdminDashboardScreen({ navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const messages = useMessages();
    const { data: dashboard, isLoading, error, refetch } = useAdminDashboard();
    if (isLoading) {
        return (<ScreenScaffold>
        <LoadingState message={localizedUiText.m_706c05a6c578}/>
      </ScreenScaffold>);
    }
    if (error) {
        return (<ScreenScaffold>
        <ErrorState message={error.message} onRetry={refetch}/>
      </ScreenScaffold>);
    }
    return (<CommandCenter role="SOCIETY_ADMIN" title={localizedUiText.m_edde8ac83581} subtitle={localizedUiText.m_2c2b2a5feee9} contextItems={['Society Command Center', `${dashboard?.totalUnits ?? 300} units`]} metrics={[
            { icon: 'building', label: String(localizedUiText.m_8528f505986d), value: dashboard?.totalUnits ?? 300, detail: getActiveUiLiteral("m_6c410b675c3f") },
            { icon: 'home', label: String(localizedUiText.m_da29f101d102), value: dashboard?.occupiedUnits ?? 280, detail: getActiveUiLiteral("m_475ff542c910") },
            { icon: 'check', label: String(localizedUiText.m_495aae902643), value: dashboard?.pendingApprovalsCount ?? 4, detail: getActiveUiLiteral("m_702cc1785384") },
            { icon: 'complaint', label: String(localizedUiText.m_0a1b99717093), value: dashboard?.openComplaintsCount ?? 9, detail: getActiveUiLiteral("m_b132f0780042") },
        ]} actions={[
            { id: 'department-chat', icon: 'support', label: messages.department.chat.actions.officeTitle, description: messages.department.chat.actions.officeDescription, onPress: () => navigation.navigate('DepartmentChat', { screen: 'DepartmentInbox', params: { channelId: 'society-gv-societyOffice' } }) },
            { id: 'staff-channels', icon: 'staff', label: messages.staff.registration.manageTitle, description: messages.staff.registration.manageDescription, onPress: () => navigation.navigate('StaffAttendanceStack', { screen: 'StaffAttendanceHome' }) },
            { id: 'profile', icon: 'profile', label: String(localizedUiText.m_35a900ba68e9), description: String(localizedUiText.m_868aa5f3af54), onPress: () => navigation.navigate('AdminProfile') },
            { id: 'unit', icon: 'building', label: String(localizedUiText.m_199c39763358), description: String(localizedUiText.m_ce4ff54acf65), onPress: () => navigation.navigate('UnitMaster') },
            { id: 'setup', icon: 'unit', label: String(localizedUiText.m_32428ea2bec2), description: String(localizedUiText.m_335e42ca5c8b), onPress: () => navigation.navigate('SocietySetupSummary') },
            { id: 'residents', icon: 'users', label: String(localizedUiText.m_70761c1912c0), description: String(localizedUiText.m_c92294c91c01), onPress: () => navigation.navigate('ResidentDirectoryNew') },
            { id: 'approvals', icon: 'check', label: String(localizedUiText.m_c1a070e0a89b), description: String(localizedUiText.m_5efc5b5ea4c6), badge: 'REVIEW', onPress: () => navigation.navigate('ResidentApprovalQueue') },
            { id: 'notice', icon: 'notice', label: String(localizedUiText.m_1c072121e16f), description: String(localizedUiText.m_206ec6dd4458), onPress: () => navigation.navigate('NoticeControl') },
            { id: 'complaints', icon: 'complaint', label: String(localizedUiText.m_17218d5840d0), description: String(localizedUiText.m_a4a477449a6b), onPress: () => navigation.navigate('ComplaintControl') },
            { id: 'audit', icon: 'audit', label: String(localizedUiText.m_5428d7fe5929), description: String(localizedUiText.m_f11c064e5d99), onPress: () => navigation.navigate('AdminAuditLog') },
            { id: 'flags', icon: 'settings', label: String(localizedUiText.m_c60c04dc77f9), description: String(localizedUiText.m_0681e481a414), onPress: () => navigation.navigate('FeatureConfiguration') },
            { id: 'logout', icon: 'logout', label: String(localizedUiText.m_9d0310dc0c7e), description: String(localizedUiText.m_f9321cf4f7d0), onPress: () => resetToAppModeSelector(navigation as NavigationProp<ParamListBase>) },
        ]} feedTitle="Urgent admin work" feedItems={[
            { id: 'tenant-signup', title: String(localizedUiText.m_b62fad3c6d17), subtitle: String(localizedUiText.m_ab9aa1d3be5c), status: 'PENDING', statusTone: 'warning' },
            { id: 'complaint-sla', title: String(localizedUiText.m_41f3737f1ea7), subtitle: String(localizedUiText.m_88eb8e327a8c), status: '9 OPEN', statusTone: 'danger' },
        ]} testID="admin-command-center"/>);
}

