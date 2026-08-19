import React from 'react';
import { screen } from '@testing-library/react-native';
import { enMessages } from '../../../../messages/en';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentActivityStream } from '../components/ResidentActivityStream';
import { RESIDENT_DASHBOARD_LIMITS } from '../hooks/useResidentDashboardPersonalization';
import { dashboardNoop, getDashboardFixture } from './dashboardTestFixtures';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
describe('ResidentActivityStream', () => {
    it('shows five grouped activities and progressive disclosure', async () => {
        const dashboard = getDashboardFixture();
        await renderWithProviders(<ResidentActivityStream title={enMessages.resident.dashboard.sections.activity} subtitle={enMessages.resident.dashboard.sections.activitySubtitle} activities={dashboard.activities.slice(0, RESIDENT_DASHBOARD_LIMITS.activities)} onActivityPress={dashboardNoop} viewAllLabel={enMessages.resident.dashboard.actions.viewAllActivity} onViewAllPress={dashboardNoop}/>);
        expect(screen.getByText(enMessages.resident.dashboard.actions.viewAllActivity)).toBeTruthy();
        expect(screen.queryByText(getRequiredItem(dashboard.activities, 5, "ResidentActivityStream.test.tsx").title)).toBeNull();
    });
});

