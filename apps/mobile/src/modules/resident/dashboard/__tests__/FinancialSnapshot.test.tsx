import React from 'react';
import { screen } from '@testing-library/react-native';
import { enMessages } from '../../../../messages/en';
import { renderWithProviders } from '../../../../test/testUtils';
import { FinancialSnapshot } from '../components/FinancialSnapshot';
import { dashboardNoop, getDashboardFixture } from './dashboardTestFixtures';

describe('FinancialSnapshot', () => {
  it('formats Indian currency and summarizes additional pending bills', async () => {
    const payment = getDashboardFixture().maintenancePayment;
    await renderWithProviders(
      <FinancialSnapshot
        {...payment}
        sectionTitle={enMessages.resident.dashboard.sections.finance}
        onPayNowPress={dashboardNoop}
        onBillPress={dashboardNoop}
        onLedgerPress={dashboardNoop}
      />,
    );
    expect(screen.getByText('6,525')).toBeTruthy();
    expect(screen.getByText('₹')).toBeTruthy();
    expect(screen.getByText('+2 more pending')).toBeTruthy();
  });
});
