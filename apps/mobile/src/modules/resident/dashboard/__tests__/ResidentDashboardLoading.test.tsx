import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { DashboardSkeleton } from '../../../../ui/loading/DashboardSkeleton';

describe('Resident dashboard loading composition', () => {
  it('uses a component-shaped, accessibility-hidden dashboard skeleton', async () => {
    await renderWithProviders(<DashboardSkeleton />);
    const skeleton = screen.getByTestId('resident-dashboard-skeleton', { includeHiddenElements: true });
    expect(skeleton.props.accessibilityElementsHidden).toBe(true);
    expect(skeleton.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});
