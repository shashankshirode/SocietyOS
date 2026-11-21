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
import { useVisitorLifecycle } from '../../resident/visitors/data/visitorLifecycle.store';

export function GuardHomeScreen({ navigation }: GuardHomeScreenProps) {
    const localizedUiText = useMessages().uiLiterals;
    const messages = useMessages();
    const { data: dashboard, isLoading, error, refetch } = useGuardDashboard();
    const { data: expectedVisitors } = useExpectedVisitors();
    const { data: staffMembers } = useStaffToday();
    const { currentlyInside, getPendingApprovals, offlineQueue, gateLogs } = useVisitorLifecycle();

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
    const pendingApprovalsCount = getPendingApprovals().length;
    const offlineTotal = offlinePendingCount + offlineQueue.length;

    const mergedFeedItems = [
        ...gateLogs.slice(0, 4).map((log) => ({
            id: log.id,
            title: log.visitorName,
            subtitle: `${log.eventType} · ${log.gateName || log.gateId} · ${new Date(log.timestampIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            status: log.eventType === 'ENTRY' ? 'CHECKED_IN' : log.eventType === 'EXIT' ? 'CHECKED_OUT' : 'LOGGED',
            statusTone: log.eventType === 'ENTRY' ? ('success' as const) : ('info' as const),
        })),
        ...activityLogs.slice(0, 3).map((log) => ({
            id: log.id,
            title: log.personName,
            subtitle: `${log.activityType} · ${log.gateName} · ${log.time}`,
            status: log.status,
            statusTone: 'info' as const,
        })),
    ].slice(0, 6);

    return (<CommandCenter
        role="SECURITY_GUARD"
        title={localizedUiText.m_af41a5436623}
        subtitle={formatUiLiteral(localizedUiText.m_07131bc00ae0, [profile.shiftName])}
        contextItems={[profile.gateName, `Shift: ${profile.shiftName}`]}
        metrics={[
            { icon: 'visitor', label: String(localizedUiText.m_5b77796c9884), value: expectedCount, detail: getActiveUiLiteral("m_c54fcd5bd264") },
            { icon: 'gate', label: 'Inside Campus', value: currentlyInside.length, detail: `${currentlyInside.length} active` },
            { icon: 'clock', label: 'Approvals', value: pendingApprovalsCount, detail: pendingApprovalsCount > 0 ? 'Action needed' : 'Clear' },
            { icon: 'staff', label: String(localizedUiText.m_6c22682ae55f), value: staffCheckedIn, detail: getActiveUiLiteral("m_75baf043976a") },
            { icon: 'refresh', label: String(localizedUiText.m_ea36956de639), value: offlineTotal, detail: offlineTotal > 0 ? 'Queued' : 'Synced' },
        ]}
        actions={[
            { id: 'verify', icon: 'qr', label: String(localizedUiText.m_f27f1e6e6d72), description: String(localizedUiText.m_928475118571), badge: 'LIVE', onPress: () => navigation.navigate('PassSearch') },
            { id: 'manual', icon: 'visitor', label: 'Walk-in Visitor', description: 'Register unexpected guest & request approval', onPress: () => navigation.navigate('ManualEntry') },
            { id: 'inside', icon: 'building', label: 'Currently Inside', description: 'Campus occupancy & visitor exit recording', badge: `${currentlyInside.length}`, onPress: () => navigation.navigate('GuardCurrentVisitors') },
            { id: 'delivery', icon: 'support', label: 'Delivery & Parcels', description: 'Food, grocery & custody desk parcel logging', onPress: () => navigation.navigate('DeliveryEntry') },
            { id: 'cab', icon: 'vehicle', label: 'Cab Entry', description: 'Fast drop-off / pickup cab pass recording', onPress: () => navigation.navigate('CabEntry') },
            { id: 'staff', icon: 'staff', label: String(localizedUiText.m_2061f406a0df), description: String(localizedUiText.m_2b0b4b134210), onPress: () => navigation.navigate('StaffCheckIn') },
            { id: 'handover', icon: 'clock', label: 'Shift Handover', description: 'End shift summary & incoming guard transfer', onPress: () => navigation.navigate('ShiftHandover') },
            { id: 'messages', icon: 'support', label: messages.guard.chat.inbox.title, description: messages.guard.chat.inbox.subtitle, onPress: () => navigation.navigate('GuardChatInbox') },
            { id: 'vehicle', icon: 'search', label: String(localizedUiText.m_fe428a3493c6), description: String(localizedUiText.m_f4353dbd90a7), onPress: () => navigation.navigate('GuardVehicleLookup') },
            { id: 'sos', icon: 'warning', label: String(localizedUiText.m_910a2f556251), description: String(localizedUiText.m_029e7a5e6e98), badge: 'SOS', onPress: () => navigation.navigate('EmergencyAlert') },
        ]}
        feedTitle="Recent Gate Activity"
        feedItems={mergedFeedItems}
        emptyTitle="No recent gate activity"
        emptySubtitle="Verified passes and manual entries will appear here."
        testID="guard-command-center"
    />);
}
