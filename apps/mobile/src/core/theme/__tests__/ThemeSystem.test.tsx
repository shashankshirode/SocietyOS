import React from 'react';
import { Text } from 'react-native';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { resolveThemeMode } from '../resolveThemeMode';
import { ThemeProvider } from '../ThemeProvider';
import { useAppTheme } from '../useAppTheme';
import { AppScreen } from '../../../shared/layouts/AppScreen';
import { AppButton } from '../../../shared/components/AppButton';
import { AppCard } from '../../../shared/cards/AppCard';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { FormField } from '../../../shared/forms/FormField';
import { AppearanceSettingsScreen } from '../../../modules/profile/screens/AppearanceSettingsScreen';

describe('Theme Core Resolver', () => {
  it('resolves theme mode correctly based on preference and system scheme', () => {
                        
    expect(resolveThemeMode('system', 'light')).toBe('light');
                       
    expect(resolveThemeMode('system', 'dark')).toBe('dark');
                          
    expect(resolveThemeMode('light', 'dark')).toBe('light');
                         
    expect(resolveThemeMode('dark', 'light')).toBe('dark');
                       
    expect(resolveThemeMode('system', null)).toBe('light');
  });
});

const DummyThemeComponent = () => {
  const { themeMode, themePreference, setThemePreference } = useAppTheme();
  return (
    <Text
      testID="mode-txt"
      onPress={() => setThemePreference('dark')}
    >
      Pref: {themePreference}, Mode: {themeMode}
    </Text>
  );
};

describe('Theme Context & UI Rendering', () => {
  it('toggles theme preference correctly inside ThemeProvider', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <DummyThemeComponent />
      </ThemeProvider>
    );

    const txt = screen.getByTestId('mode-txt');
    expect(txt.props.children.join('')).toContain('Pref: system');

    fireEvent.press(txt);
    expect(await screen.findByText(/Mode: dark/)).toBeOnTheScreen();
  });

  it('renders AppScreen correctly in light and dark mode', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <AppScreen>
          <Text>Screen Body</Text>
        </AppScreen>
      </ThemeProvider>
    );
    expect(screen.getByText('Screen Body')).toBeOnTheScreen();
  });

  it('renders theme-safe AppButton and AppCard', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <AppCard>
          <AppButton title="Submit Theme" onPress={jest.fn()} />
        </AppCard>
      </ThemeProvider>
    );
    expect(screen.getByText('Submit Theme')).toBeOnTheScreen();
  });

  it('renders theme-aware StatusBadge and FormField', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <StatusBadge status="ACTIVE" moduleType="visitor" />
        <FormField label="Themed Form" value="" onChangeText={jest.fn()} />
      </ThemeProvider>
    );
    expect(screen.getByText('Active')).toBeOnTheScreen();
    expect(screen.getByText('Themed Form')).toBeOnTheScreen();
  });

  it('triggers setting updates inside AppearanceSettingsScreen', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <AppearanceSettingsScreen navigation={{ goBack: jest.fn() }} />
      </ThemeProvider>
    );

    const darkBtn = screen.getByText('Dark mode');
    expect(darkBtn).toBeOnTheScreen();
    fireEvent.press(darkBtn);
  });
});
