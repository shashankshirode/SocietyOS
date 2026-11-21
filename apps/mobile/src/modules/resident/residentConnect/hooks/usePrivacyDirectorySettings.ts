import { useState } from 'react';

export function usePrivacyDirectorySettings() {
  const [settings, setSettings] = useState({
    showName: true,
    showFlat: true,
    showPhone: false,
    allowFirstContactRequests: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  return {
    settings,
    isLoading: false,
    error: null as Error | null,
    toggle,
  };
}
