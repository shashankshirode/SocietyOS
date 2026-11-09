import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ContextualPriorityCard } from '../components/ContextualPriorityCard';
import { getDashboardFixture } from './dashboardTestFixtures';
import type { ResidentDashboardData, VisitorAccessItem } from '../data/dashboard.types';

describe('ContextualPriorityCard', () => {
  it('ranks waiting visitor as highest priority and fires action', async () => {
    const fixture = getDashboardFixture();
    const waitingVisitor: VisitorAccessItem = {
      id: 'vis-waiting-1',
      visitorName: 'Delivery Agent',
      visitorType: 'delivery',
      purpose: 'Package delivery',
      validFrom: '10:00 AM',
      validTill: '11:00 AM',
      status: 'waitingAtGate',
      accessType: 'oneDay',
      gateName: 'Main Gate',
      otpAvailable: true,
    };
    const dashboardWithWaitingVisitor: ResidentDashboardData = {
      ...fixture,
      visitorTimeline: [waitingVisitor, ...fixture.visitorTimeline],
    };

    const onAction = jest.fn();
    const onViewAllPriorities = jest.fn();

    await renderWithProviders(
      <ContextualPriorityCard
        dashboard={dashboardWithWaitingVisitor}
        canManageBills={true}
        attentionCount={2}
        attentionLabel="2 items need attention"
        sectionHeading="Needs your attention"
        onViewAllPriorities={onViewAllPriorities}
        onAction={onAction}
      />,
    );

    expect(screen.getByText('Delivery Agent is at Main Gate')).toBeTruthy();
    expect(screen.getByText('Review & Admit')).toBeTruthy();

    const cta = screen.getByLabelText('Review & Admit');
    fireEvent.press(cta);
    expect(onAction).toHaveBeenCalledWith('act-visitor');

    const viewAllBtn = screen.getByLabelText('2 items need attention');
    fireEvent.press(viewAllBtn);
    expect(onViewAllPriorities).toHaveBeenCalledTimes(1);
  });
});
