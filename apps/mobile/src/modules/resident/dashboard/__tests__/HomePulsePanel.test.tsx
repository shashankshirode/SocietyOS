import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { HomePulsePanel } from '../components/HomePulsePanel';
import { getDashboardExperience } from './dashboardTestFixtures';

describe('HomePulsePanel', () => {
  it('derives a meaningful status from exactly six residence indicators', async () => {
    const pulse = getDashboardExperience().pulse;
    expect(pulse.items).toHaveLength(6);
    await renderWithProviders(<HomePulsePanel pulse={pulse} />);
    expect(screen.getByText(pulse.centerValue)).toBeTruthy();
    expect(screen.getByText(pulse.recommendedAction!)).toBeTruthy();
    pulse.items.forEach((item) => expect(screen.getByText(item.label)).toBeTruthy());
  });
});
