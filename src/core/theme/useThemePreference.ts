import { useState, useEffect } from 'react';
import type { ThemePreference } from './themePreference.types';
import { themePreferenceStore } from './themePreferenceStore';

export function useThemePreference() {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPreference() {
      try {
        const stored = await themePreferenceStore.getPreference();
        setPreference(stored);
      } finally {
        setIsLoading(false);
      }
    }
    loadPreference();
  }, []);

  async function updatePreference(newPref: ThemePreference) {
    setPreference(newPref);
    await themePreferenceStore.setPreference(newPref);
  }

  return {
    preference,
    setPreference: updatePreference,
    isLoading,
  };
}
