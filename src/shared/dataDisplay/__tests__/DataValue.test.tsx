import React from 'react';
import { renderWithProviders } from '../../../test/testUtils';
import { DataValue } from '../DataValue';

describe('DataValue Component', () => {
  it('renders standard text values safely', async () => {
    const screen = await renderWithProviders(<DataValue value="Verified Content" />);
    expect(screen.getByText('Verified Content')).toBeOnTheScreen();
  });

  it('renders long society values through the safe text path', async () => {
    const longValue = 'A-1204 / Tower B / East Wing / Basement Parking P2-184';
    const screen = await renderWithProviders(<DataValue value={longValue} />);
    expect(screen.getByText(longValue)).toBeOnTheScreen();
  });

  it('renders empty fallback placeholder for null or empty values', async () => {
    const screenNull = await renderWithProviders(<DataValue value={null} />);
    expect(screenNull.getByText('Not available')).toBeOnTheScreen();

    const screenEmpty = await renderWithProviders(<DataValue value="" />);
    expect(screenEmpty.getByText('Not available')).toBeOnTheScreen();
  });
});
