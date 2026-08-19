import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { resolveResponsiveLayout } from '../../../../ui/layout/useResponsiveLayout';
import { resolveResidentTabBarLayout } from '../useResidentTabBarLayout';
import { ResidentPageHeader } from '../../../../ui/patterns/ResidentPageHeader';

describe('resident tablet navigation layout', () => {
  it('uses a wide tablet content frame and tablet tab dock', () => {
    const layout = resolveResponsiveLayout(1024, 768);
    const tabBarLayout = resolveResidentTabBarLayout(1024, 0, 'ios');

    expect(layout.layoutSize).toBe('tabletWide');
    expect(layout.contentMaxWidth).toBe(1240);
    expect(layout.columns).toBe(4);
    expect(tabBarLayout.isTabletDock).toBe(true);
  });

  it('keeps phone layout full-width with phone tab behavior', () => {
    const layout = resolveResponsiveLayout(390, 844);
    const tabBarLayout = resolveResidentTabBarLayout(390, 0, 'ios');

    expect(layout.layoutSize).toBe('phone');
    expect(layout.contentMaxWidth).toBe(390);
    expect(layout.columns).toBe(2);
    expect(tabBarLayout.isTabletDock).toBe(false);
  });

  it('renders the common resident back button label from messages', async () => {
    const onBackPress = jest.fn();

    await renderWithProviders(
      <ResidentPageHeader
        title="Bills"
        titleKey="resident.billing.screenTitle"
        showBackButton
        onBackPress={onBackPress}
      />
    );

    fireEvent.press(screen.getByRole('button', { name: 'Go back' }));

    expect(onBackPress).toHaveBeenCalledTimes(1);
  });
});
