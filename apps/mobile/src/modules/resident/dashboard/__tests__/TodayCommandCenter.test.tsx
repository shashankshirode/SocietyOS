import React from 'react';
import { screen } from '@testing-library/react-native';
import { enMessages } from '../../../../messages/en';
import { renderWithProviders } from '../../../../test/testUtils';
import { TodayCommandCenter } from '../components/TodayCommandCenter';
import { dashboardNoop, getDashboardExperience } from './dashboardTestFixtures';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
describe('TodayCommandCenter', () => {
    it('shows only the three highest priorities and reveals View all for overflow', async () => {
        const experience = getDashboardExperience();
        await renderWithProviders(<TodayCommandCenter title={enMessages.resident.priority.title} subtitle={enMessages.resident.priority.subtitle} viewAllLabel={enMessages.resident.priority.viewAll} emptyTitle={enMessages.resident.priority.emptyTitle} emptyDescription={enMessages.resident.priority.emptyDescription} items={experience.priorities} summary={experience.prioritySummary} onActionPress={dashboardNoop} onViewAllPress={dashboardNoop}/>);
        expect(screen.getAllByText(/^(01|02|03)$/)).toHaveLength(3);
        expect(screen.getByText(enMessages.resident.priority.viewAll)).toBeTruthy();
        expect(screen.queryByText(getRequiredItem(experience.priorities, 3, "TodayCommandCenter.test.tsx").title)).toBeNull();
    });
});

