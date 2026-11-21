import type { ThemeMode, ThemePreference } from './themePreference.types';
import type { Absent } from "../../shared/types/absence.types";
export function resolveThemeMode(preference: ThemePreference, systemColorScheme: 'light' | 'dark' | null | Absent): ThemeMode {
    if (preference === 'light')
        return 'light';
    if (preference === 'dark')
        return 'dark';
    return systemColorScheme === 'dark' ? 'dark' : 'light';
}

