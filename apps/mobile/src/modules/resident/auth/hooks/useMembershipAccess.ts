import { useState, useEffect, useCallback } from 'react';
import type { ResidenceMembership, ResidenceAccessTimelineEvent } from '../data/membership.types';
import { membershipMockSource } from '../data/membership.mockSource';
import type { Absent } from "../../../../shared/types/absence.types";
export function useMembershipAccess() {
    const [memberships, setMemberships] = useState<readonly ResidenceMembership[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | Absent>();
    const [selectedMembership, setSelectedMembership] = useState<ResidenceMembership | null>(null);
    const [timeline, setTimeline] = useState<readonly ResidenceAccessTimelineEvent[]>([]);
    const [isTimelineLoading, setIsTimelineLoading] = useState(false);
    const fetchMemberships = useCallback(async () => {
        setIsLoading(true);
        setError(undefined);
        try {
            const data = await membershipMockSource.getMemberships();
            setMemberships(data);
        }
        catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : 'Failed to load residence memberships.');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchMemberships();
    }, [fetchMemberships]);
    const fetchTimeline = useCallback(async (membershipId: string) => {
        setIsTimelineLoading(true);
        try {
            const events = await membershipMockSource.getAccessTimeline(membershipId);
            setTimeline(events);
        }
        catch {
            setTimeline([]);
        }
        finally {
            setIsTimelineLoading(false);
        }
    }, []);
    const sendReminder = useCallback(async (membershipId: string, note: string) => {
        const result = await membershipMockSource.sendAccessReminder(membershipId, { note });
        if (result.sent) {
            await fetchMemberships();
        }
        return result;
    }, [fetchMemberships]);
    const withdrawRequest = useCallback(async (membershipId: string) => {
        setIsLoading(true);
        try {
            await membershipMockSource.withdrawAccessRequest(membershipId, {});
            await fetchMemberships();
            return true;
        }
        catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : 'Failed to withdraw access request.');
            return false;
        }
        finally {
            setIsLoading(false);
        }
    }, [fetchMemberships]);
    return {
        memberships,
        isLoading,
        error,
        selectedMembership,
        setSelectedMembership,
        timeline,
        isTimelineLoading,
        fetchTimeline,
        sendReminder,
        withdrawRequest,
        refresh: fetchMemberships,
    };
}

