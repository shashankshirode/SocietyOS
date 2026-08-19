import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import type { AppTheme } from '../../shared/theme/theme.types';
import { lightTheme } from '../../shared/theme/lightTheme';
import { darkTheme } from '../../shared/theme/darkTheme';
import type { ThemePreference, ThemeMode } from './themePreference.types';
import { useThemePreference } from './useThemePreference';
import { resolveThemeMode } from './resolveThemeMode';
import type { Absent } from "../../shared/types/absence.types";
interface ThemeContextProps {
    theme: AppTheme;
    themeMode: ThemeMode;
    themePreference: ThemePreference;
    setThemePreference: (pref: ThemePreference) => Promise<void>;
    isDark: boolean;
}
const ThemeContext = createContext<ThemeContextProps | Absent>(undefined);
export function ThemeProvider({ children }: {
    children: React.ReactNode;
}) {
    const systemColorScheme = useColorScheme();
    const { preference, setPreference, isLoading } = useThemePreference();
    const [resolvedMode, setResolvedMode] = useState<ThemeMode>('light');
    useEffect(() => {
        const mode = resolveThemeMode(preference, systemColorScheme);
        setResolvedMode(mode);
    }, [preference, systemColorScheme]);
    const activeTheme = resolvedMode === 'dark' ? darkTheme : lightTheme;
    const isDark = activeTheme.dark;
    if (isLoading) {
        return null;
    }
    return (<ThemeContext.Provider value={{
            theme: activeTheme,
            themeMode: resolvedMode,
            themePreference: preference,
            setThemePreference: setPreference,
            isDark,
        }}>
      {children}
    </ThemeContext.Provider>);
}
export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
}
export default ThemeProvider;

