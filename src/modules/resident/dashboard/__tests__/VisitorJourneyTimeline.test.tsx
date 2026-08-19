import React from 'react';
import { screen } from '@testing-library/react-native';
import { enMessages } from '../../../../messages/en';
import { renderWithProviders } from '../../../../test/testUtils';
import { VisitorJourneyTimeline } from '../components/VisitorJourneyTimeline';
import { RESIDENT_DASHBOARD_LIMITS } from '../hooks/useResidentDashboardPersonalization';
import { dashboardNoop, getDashboardFixture } from './dashboardTestFixtures';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
describe('VisitorJourneyTimeline', () => {
    it('renders action-priority ordering and the dashboard visitor limit', async () => {
        const dashboard = getDashboardFixture();
        const items = dashboard.visitorTimeline.slice(0, RESIDENT_DASHBOARD_LIMITS.visitors);
        expect(getRequiredItem(items, 0, "VisitorJourneyTimeline.test.tsx").status).toBe('exitConfirmationRequired');
        await renderWithProviders(<VisitorJourneyTimeline items={items} onCreateVisitorPress={dashboardNoop} onVisitorPress={dashboardNoop} title={enMessages.resident.dashboard.sections.visitors} noVisitorsLabel={enMessages.resident.dashboard.empty.visitorsTitle} noVisitorsCtaLabel={enMessages.resident.dashboard.actions.createVisitor} otpLabel={enMessages.resident.dashboard.status.otp}/>);
        items.forEach((item) => expect(screen.getByText(item.visitorName)).toBeTruthy());
        expect(screen.queryByText(getRequiredItem(dashboard.visitorTimeline, 4, "VisitorJourneyTimeline.test.tsx").visitorName)).toBeNull();
    });
});

