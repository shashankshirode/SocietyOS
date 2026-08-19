import React from 'react';
import { screen } from '@testing-library/react-native';
import { enMessages } from '../../../../messages/en';
import { renderWithProviders } from '../../../../test/testUtils';
import { SocietyNoticeRail } from '../components/SocietyNoticeRail';
import { RESIDENT_DASHBOARD_LIMITS } from '../hooks/useResidentDashboardPersonalization';
import { dashboardNoop, getDashboardFixture } from './dashboardTestFixtures';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
describe('SocietyNoticeRail', () => {
    it('shows only recent dashboard notices with message-driven acknowledgement copy', async () => {
        const dashboard = getDashboardFixture();
        const notices = dashboard.notices.slice(0, RESIDENT_DASHBOARD_LIMITS.notices);
        await renderWithProviders(<SocietyNoticeRail notices={notices} onNoticePress={dashboardNoop} onViewAllPress={dashboardNoop} viewAllLabel={enMessages.resident.dashboard.actions.viewAllNotices} ackLabels={{ pending: enMessages.resident.dashboard.noticeCard.acknowledgementPending }}/>);
        expect(screen.getByText(enMessages.resident.dashboard.noticeCard.acknowledgementPending)).toBeTruthy();
        expect(screen.queryByText(getRequiredItem(dashboard.notices, 3, "SocietyNoticeRail.test.tsx").title)).toBeNull();
    });
});

