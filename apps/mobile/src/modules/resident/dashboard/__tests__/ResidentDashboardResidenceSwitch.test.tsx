import React from 'react';
import { Text } from 'react-native';
import { act, waitFor } from '@testing-library/react-native';
import { repositorySuccess } from '../../../../core/repositories/repository.types';
import { renderWithProviders } from '../../../../test/testUtils';
import { shouldShowResidentHomeSwitcher } from '../../homeContext/components/ResidentHomeSwitcherButton';
import { activeHomeStore } from '../../homeContext/data/activeHomeStore';
import { residentDashboardRepository } from '../data/dashboard.repository';
import { getScopedDashboardData } from '../data/dashboard.mockSource';
import { useResidentDashboard } from '../hooks/useResidentDashboard';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import type { Absent } from "../../../../shared/types/absence.types";
function DashboardScopeHarness() {
    const { data, isLoading } = useResidentDashboard();
    if (isLoading || !data)
        return <Text>Dashboard switching</Text>;
    const sectionCounts = [
        data.reminders.length,
        data.visitorTimeline.length,
        data.departmentChats.length,
        data.notices.length,
        data.documents.length,
        data.amenities.length,
        data.communityServices.length,
        data.activities.length,
    ].join(':');
    return <Text>{`${data.societyName}|${data.contextKey}|${sectionCounts}`}</Text>;
}
describe('Resident dashboard residence switching', () => {
    beforeEach(() => activeHomeStore.setActiveContextId('context-001'));
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('hides for one eligible residence and appears for multiple residences', () => {
        expect(shouldShowResidentHomeSwitcher(false, 1, true)).toBe(false);
        expect(shouldShowResidentHomeSwitcher(false, 3, true)).toBe(true);
        expect(shouldShowResidentHomeSwitcher(true, 3, true)).toBe(false);
    });
    it('drops stale data and reloads the complete scoped dashboard query', async () => {
        let completeGokhaleRequest: (() => void) | Absent;
        const repositorySpy = jest
            .spyOn(residentDashboardRepository, 'getDashboardSections')
            .mockImplementation((context) => {
            const result = repositorySuccess(getScopedDashboardData(context));
            if (context.societyId !== 'society-gp')
                return Promise.resolve(result);
            return new Promise((resolve) => {
                completeGokhaleRequest = () => resolve(result);
            });
        });
        const rendered = await renderWithProviders(<DashboardScopeHarness />);
        expect(await rendered.findByText(/Green Valley Heights\|/)).toBeTruthy();
        await act(async () => {
            activeHomeStore.setActiveContextId('context-003');
            await Promise.resolve();
        });
        expect(rendered.getByText('Dashboard switching')).toBeTruthy();
        expect(rendered.queryByText(/Green Valley Heights\|/)).toBeNull();
        await act(async () => {
            completeGokhaleRequest?.();
            await Promise.resolve();
        });
        expect(await rendered.findByText(/Gokhale Park Residency\|/)).toBeTruthy();
        await waitFor(() => expect(repositorySpy).toHaveBeenCalledTimes(2));
        expect(getRequiredItem(repositorySpy.mock.calls, 1, "ResidentDashboardResidenceSwitch.test.tsx")[0]).toEqual(expect.objectContaining({
            societyId: 'society-gp',
            unitId: 'unit-gp-c-503',
            residentProfileId: 'resident-001',
            locale: 'en-IN',
            timezone: 'Asia/Kolkata',
        }));
        rendered.unmount();
        activeHomeStore.setActiveContextId('context-001');
    });
});

