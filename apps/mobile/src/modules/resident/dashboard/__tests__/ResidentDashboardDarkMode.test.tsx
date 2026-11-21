import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { HomePulsePanel } from '../components/HomePulsePanel';
import { getDashboardExperience } from './dashboardTestFixtures';
import { createDarkModeHarnessStyle } from '../styles/__tests__/ResidentDashboardDarkMode.test.styles';

function DarkModeHarness() {
  const { themeMode, colors, setThemePreference } = useAppTheme();
  return (
    <View testID="dark-dashboard-surface" style={createDarkModeHarnessStyle(colors.background)}>
      <Pressable accessibilityRole="button" onPress={() => setThemePreference('dark')}>
        <Text>Enable dark dashboard</Text>
      </Pressable>
      <Text testID="dashboard-theme-mode">{themeMode}</Text>
      <HomePulsePanel pulse={getDashboardExperience().pulse} />
    </View>
  );
}

describe('Resident dashboard dark mode', () => {
  it('rerenders dashboard surfaces using the dark semantic theme', async () => {
    await renderWithProviders(<DarkModeHarness />);
    fireEvent.press(screen.getByText('Enable dark dashboard'));
    expect(await screen.findByText('dark')).toBeTruthy();
    expect(screen.getByTestId('residence-pulse-panel')).toBeTruthy();
  });
});
