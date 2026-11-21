import React from 'react';
import { StyleSheet } from 'react-native';
import { screen } from '@testing-library/react-native';
import { enMessages } from '../../../../messages/en';
import { renderWithProviders } from '../../../../test/testUtils';
import { resolveSosCommandDockLayout } from '../../emergency/hooks/useSosCommandDockLayout';
import { ResidentCommandDock } from '../components/ResidentCommandDock';
import { dashboardNoop, getDashboardExperience } from './dashboardTestFixtures';

describe('Resident dashboard accessibility', () => {
  it('labels command controls and gives primary actions at least 44 points', async () => {
    const experience = getDashboardExperience();
    await renderWithProviders(
      <ResidentCommandDock
        title={enMessages.resident.dashboard.sections.commandDock}
        subtitle={enMessages.resident.dashboard.sections.commandDockSubtitle}
        actions={experience.commandActions}
        onActionPress={dashboardNoop}
      />,
    );
    const visitorAction = screen.getByRole('button', {
      name: enMessages.resident.experience.createVisitor,
    });
    const style = StyleSheet.flatten(visitorAction.props.style);
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(visitorAction.props.accessibilityState.disabled).toBeFalsy();
  });

  it('keeps phone and tablet SOS controls above safe-area and dock obstructions', () => {
    const phone = resolveSosCommandDockLayout(390, 844, { top: 47, right: 0, bottom: 34, left: 0 }, 'ios');
    const tablet = resolveSosCommandDockLayout(1024, 1366, { top: 24, right: 0, bottom: 20, left: 0 }, 'ios');
    expect(phone.bottomOffset).toBe(phone.tabBarObstruction + 20);
    expect(phone.bottomOffset).toBeGreaterThan(phone.tabBarObstruction);
    expect(tablet.bottomOffset).toBe(tablet.tabBarObstruction + 20);
    expect(tablet.bottomOffset).toBeGreaterThan(tablet.tabBarObstruction);
  });
});
