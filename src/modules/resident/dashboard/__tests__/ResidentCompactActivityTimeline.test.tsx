import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { enMessages } from '../../../../messages/en';
import { ResidentCompactActivityTimeline } from '../../../../ui/patterns/ResidentCompactActivityTimeline';
import { residentDashboardMockData } from '../data/dashboard.mockData';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
const noop = () => undefined;
describe('ResidentCompactActivityTimeline', () => {
    it('renders the activity items passed to it', async () => {
        const threeActivities = residentDashboardMockData.activities.slice(0, 3);
        await renderWithProviders(<ResidentCompactActivityTimeline title={enMessages.resident.experience.activityTitle} subtitle={enMessages.resident.experience.activitySubtitle} activities={threeActivities} onActivityPress={noop}/>);
        expect(screen.getByTestId('resident-compact-activity-timeline')).toBeTruthy();
        expect(screen.getByText(getRequiredItem(threeActivities, 0, "ResidentCompactActivityTimeline.test.tsx").title)).toBeTruthy();
        expect(screen.queryByText(getRequiredItem(residentDashboardMockData.activities, 3, "ResidentCompactActivityTimeline.test.tsx").title)).toBeNull();
    });
});

