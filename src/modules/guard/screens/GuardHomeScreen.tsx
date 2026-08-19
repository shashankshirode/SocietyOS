import React from 'react';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ScreenScaffold } from '../../../shared/layout/ScreenScaffold';
import { CommandCenter } from '../../../ui/patterns/CommandCenter';
import type { GuardHomeScreenProps } from '../../../app/navigation/navigation.types';
import { useExpectedVisitors } from '../data/useExpectedVisitors';
import { useGuardDashboard } from '../data/useGuardDashboard';
import { useStaffToday } from '../data/useStaffCheckIn';
import { useMessages } from '../../../shared/constants/useMessages';
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function GuardHomeScreen({ navigation }: GuardHomeScreenProps) {
    const localizedUiText = useMessages().uiLiterals;
    const messages = useMessages();
    const { data: dashboard, isLoading, error, refetch } = useGuardDashboard();
    const { data: expectedVisitors } = useExpectedVisitors();
    const { data: staffMembers } = useStaffToday();
    if (isLoading) {
        return (<ScreenScaffold>
        <LoadingState message={localizedUiText.m_fc720684da61}/>
      </ScreenScaffold>);
    }
    if (error || !dashboard?.profile) {
        return (<ScreenScaffold>
        <ErrorState message={error?.message || localizedUiText.m_4c9759bd9ce2} onRetry={refetch}/>
      </ScreenScaffold>);
    }
    const { profile, activityLogs = [], offlinePendingCount = 0 } = dashboard;
    const expectedCount = expectedVisitors?.length ?? 0;
    const staffCheckedIn = staffMembers?.filter((staff) => staff.attendanceStatus === 'CHECKED_IN').length ?? 0;
    return (<CommandCenter role="SECURITY_GUARD" title={localizedUiText.m_af41a5436623} subtitle={formatUiLiteral(localizedUiText.m_07131bc00ae0, [profile.shiftName])} contextItems={[profile.gateName, `Shift: ${profile.shiftName}`]} metrics={[
            { icon: 'visitor', label: String(localizedUiText.m_5b77796c9884), value: expectedCount, detail: getActiveUiLiteral("m_c54fcd5bd264") },
            { icon: 'staff', label: String(localizedUiText.m_6c22682ae55f), value: staffCheckedIn, detail: getActiveUiLiteral("m_75baf043976a") },
            { icon: 'refresh', label: String(localizedUiText.m_ea36956de639), value: offlinePendingCount, detail: getActiveUiLiteral("m_3f1c2d2d372e") },
        ]} actions={[
            { id: 'messages', icon: 'support', label: messages.guard.chat.inbox.title, description: messages.guard.chat.inbox.subtitle, onPress: () => navigation.navigate('GuardChatInbox') },
            { id: 'verify', icon: 'qr', label: String(localizedUiText.m_f27f1e6e6d72), description: String(localizedUiText.m_928475118571), badge: 'LIVE', onPress: () => navigation.navigate('PassSearch') },
            { id: 'manual', icon: 'visitor', label: String(localizedUiText.m_9ee9273d35d2), description: String(localizedUiText.m_74ff34bc6f39), onPress: () => navigation.navigate('ManualEntry') },
            { id: 'quick', icon: 'vehicle', label: String(localizedUiText.m_c6cebf27c828), description: String(localizedUiText.m_4e8c8692c4c3), onPress: () => navigation.navigate('QuickEntry') },
            { id: 'staff', icon: 'staff', label: String(localizedUiText.m_2061f406a0df), description: String(localizedUiText.m_2b0b4b134210), onPress: () => navigation.navigate('StaffCheckIn') },
            { id: 'vehicle', icon: 'search', label: String(localizedUiText.m_fe428a3493c6), description: String(localizedUiText.m_f4353dbd90a7), onPress: () => navigation.navigate('GuardVehicleLookup') },
            { id: 'sos', icon: 'warning', label: String(localizedUiText.m_910a2f556251), description: String(localizedUiText.m_029e7a5e6e98), badge: 'SOS', onPress: () => navigation.navigate('EmergencyAlert') },
        ]} feedTitle="Recent Gate Activity" feedItems={activityLogs.slice(0, 5).map((log) => ({
            id: log.id,
            title: log.personName,
            subtitle: `${log.activityType} · ${log.gateName} · ${log.time}`,
            status: log.status,
            statusTone: 'info' as const,
        }))} emptyTitle="No recent gate activity" emptySubtitle="Verified passes and manual entries will appear here." testID="guard-command-center"/>);
}

