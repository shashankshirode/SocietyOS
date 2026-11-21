import { useThemeContext } from './ThemeProvider';

export function useAppTheme() {
  const { theme, themeMode, themePreference, setThemePreference, isDark } = useThemeContext();
  return {
    ...theme,
    theme,
    themeMode,
    themePreference,
    setThemePreference,
    isDark,
  };
}
