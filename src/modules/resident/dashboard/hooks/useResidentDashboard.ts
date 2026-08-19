import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { residentDashboardRepository } from '../data/dashboard.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { mockStore } from '../../../../core/mockStore/mockStore';
import { useMessages } from '../../../../shared/constants/useMessages';
import { mapDashboardToViewModel } from '../mappers/dashboardViewModel.mapper';
import { useResidentGreeting } from './useResidentGreeting';
import { resolveLocale } from '../../../../core/localization/localeResolver';
import { resolveTimezone } from '../../../../core/localization/timezoneResolver';
import type { ContactRequestStatus } from '../data/dashboard.types';
import type { ResidentDashboardViewModel } from '../data/dashboard.viewModel.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";

export function useResidentDashboard() {
    const { activeContext } = useActiveResidentHome();
    const messages = useMessages();
    const greeting = useResidentGreeting(activeContext);
    const locale = resolveLocale({
        ...includeWhenPresent("preferencesLocale", activeContext.locale),
        ...includeWhenPresent("societyCountry", activeContext.country)
    });
    const timezone = resolveTimezone({
        ...includeWhenPresent("preferencesTimezone", activeContext.timezone),
        ...includeWhenPresent("societyCountry", activeContext.country)
    });
    const context = {
        activeHome: activeContext,
        dataScopeKey: activeContext.dataScopeKey,
        societyId: activeContext.societyId,
        unitId: activeContext.unitId,
        residentProfileId: activeContext.residentId,
        locale,
        timezone
    };
    
    const [mockStateSignature, setMockStateSignature] = useState(() => {
        const state = mockStore.getState();
        const billsCount = state.bills.length;
        const unpaidAmount = state.bills.reduce((sum, b) => sum + (b.amount - (b.paidAmount ?? 0)), 0);
        const visitorsCount = state.visitors.filter(v => v.status === 'EXPECTED').length;
        return `${billsCount}-${unpaidAmount}-${visitorsCount}`;
    });

    useEffect(() => {
        const unsubscribe = mockStore.subscribe(() => {
            const state = mockStore.getState();
            const billsCount = state.bills.length;
            const unpaidAmount = state.bills.reduce((sum, b) => sum + (b.amount - (b.paidAmount ?? 0)), 0);
            const visitorsCount = state.visitors.filter(v => v.status === 'EXPECTED').length;
            setMockStateSignature(`${billsCount}-${unpaidAmount}-${visitorsCount}`);
        });
        return unsubscribe;
    }, []);

    const result = useRepositoryResult(() => residentDashboardRepository.getDashboardSections(context), [context.dataScopeKey, mockStateSignature]);
    const [contactRequestOverride, setContactRequestOverride] = useState<{
        scopeKey: string;
        status: ContactRequestStatus;
    } | null>(null);
    const acceptContactRequest = useCallback((_id: string) => {
        setContactRequestOverride({ scopeKey: context.dataScopeKey, status: 'accepted' });
    }, [context.dataScopeKey]);
    const rejectContactRequest = useCallback((_id: string) => {
        setContactRequestOverride({ scopeKey: context.dataScopeKey, status: 'rejected' });
    }, [context.dataScopeKey]);
    const scopedData = result.data &&
        (!result.data.contextKey || result.data.contextKey === context.dataScopeKey)
        ? result.data
        : undefined;
    const getRoleLabel = useCallback((role: string) => {
        switch (role) {
            case 'owner':
            case 'coOwner':
                return messages.resident.homeContext.owner;
            case 'tenant':
                return messages.resident.homeContext.tenant;
            case 'familyMember':
            case 'authorizedOccupant':
                return messages.resident.homeContext.familyMember;
            default:
                return messages.resident.homeContext.owner;
        }
    }, [messages.resident.homeContext]);
    const viewModel: ResidentDashboardViewModel | Absent = useMemo(() => {
        if (!scopedData)
            return undefined;
        const roleLabel = getRoleLabel(activeContext.residentRole);
        const unitLabel = `${activeContext.displayUnitName} · ${roleLabel}`;
        const mapped = mapDashboardToViewModel(scopedData, {
            greeting,
            unitLabel,
            societyName: activeContext.societyName,
            roleLabel,
            pendingActionCount: activeContext.pendingCount ?? scopedData.pendingActionCount ?? 0
        });
        const contactRequestStatus = contactRequestOverride?.scopeKey === context.dataScopeKey
            ? contactRequestOverride.status
            : null;
        if (contactRequestStatus && mapped.contactRequest) {
            const statusPresentation = {
                label: contactRequestStatus === 'accepted'
                    ? messages.resident.dashboard.connect.accepted
                    : messages.resident.dashboard.connect.rejected,
                tone: contactRequestStatus === 'accepted' ? 'success' as const : 'neutral' as const
            };
            mapped.contactRequest = {
                ...mapped.contactRequest,
                statusLabel: statusPresentation.label,
                statusTone: statusPresentation.tone
            };
        }
        return mapped;
    }, [scopedData, activeContext, contactRequestOverride, context.dataScopeKey, getRoleLabel, greeting, messages]);
    const dashboardData = viewModel
        ? {
            ...scopedData!,
            residentName: viewModel.activeHome.residentName,
            unitLabel: viewModel.activeHome.unitLabel,
            societyName: viewModel.activeHome.societyName,
            roleLabel: viewModel.activeHome.roleLabel,
            unreadNoticeCount: viewModel.activeHome.unreadNoticeCount,
            pendingActionCount: viewModel.activeHome.pendingActionCount,
            ...includeWhenPresent("contactRequest", scopedData!.contactRequest
                ? {
                    ...scopedData!.contactRequest,
                    status: contactRequestOverride?.scopeKey === context.dataScopeKey
                        ? contactRequestOverride.status
                        : scopedData!.contactRequest.status
                }
                : undefined)
        }
        : undefined;
    return {
        ...result,
        data: dashboardData,
        isLoading: result.isLoading || (!!result.data && !scopedData),
        viewModel,
        acceptContactRequest,
        rejectContactRequest
    };
}
