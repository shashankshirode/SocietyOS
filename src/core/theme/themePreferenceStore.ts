import type { ThemePreference } from './themePreference.types';


let cachedPreference: ThemePreference = 'system';

export const themePreferenceStore = {
  async getPreference(): Promise<ThemePreference> {
    return cachedPreference;
  },

  async setPreference(preference: ThemePreference): Promise<void> {
    cachedPreference = preference;
  },
};
