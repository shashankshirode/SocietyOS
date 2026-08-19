import React from 'react';
import { AppIcon } from '../AppIcon';
import type { AppIconName } from '../icon.types';
import { renderWithProviders } from '../../../test/testUtils';

describe('AppIcon', () => {
  test('renders known icon from registry successfully', async () => {
    const screen = await renderWithProviders(<AppIcon name="home" />);
    expect(screen.getByLabelText('icon-home')).toBeTruthy();
  });

  test('handles unknown icon safely using fallback', async () => {
    const unknownIconName = 'non-existent-icon' as AppIconName;

    
    const screen = await renderWithProviders(<AppIcon name={unknownIconName} />);
    expect(screen.getByLabelText('icon-non-existent-icon')).toBeTruthy();
  });
});
