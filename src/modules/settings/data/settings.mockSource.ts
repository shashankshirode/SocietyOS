import type {
  ResidentSettings,
  UpdateLanguageInput,
  UpdateAppearanceInput,
  UpdateAccessibilityInput,
  UpdateNotificationPreferencesInput,
} from '../domain/settings.types';
import type { ResidentSettingsRepository } from './settings.repository.contract';
import { SupportedLocale } from '../../../shared/localization/language.models';
import { readStoredLocale, writeStoredLocale } from '../../../shared/localization/language.storage';

let mockSettingsStore: ResidentSettings = {
  userId: 'resident-001',
  languageCode: SupportedLocale.EnglishIndia,
  appearance: 'system',
  accessibility: {
    textScale: 'default',
    reduceMotion: false,
    highContrast: false,
    simplifiedNavigation: false,
    screenReaderEnhancements: false,
  },
  notifications: {
    emergencyAlerts: true,
    visitorActivity: true,
    complaints: true,
    billing: true,
    notices: true,
    chat: true,
    communityUpdates: true,
  },
};

export const settingsMockSource: ResidentSettingsRepository = {
  async getSettings(userId: string): Promise<ResidentSettings> {
    const storedLocale = await readStoredLocale();
    if (storedLocale) {
      mockSettingsStore = { ...mockSettingsStore, languageCode: storedLocale };
    }
    return { ...mockSettingsStore, userId };
  },

  async updateLanguage(input: UpdateLanguageInput): Promise<ResidentSettings> {
    await writeStoredLocale(input.languageCode);
    mockSettingsStore = {
      ...mockSettingsStore,
      languageCode: input.languageCode,
    };
    return mockSettingsStore;
  },

  async updateAppearance(input: UpdateAppearanceInput): Promise<ResidentSettings> {
    mockSettingsStore = {
      ...mockSettingsStore,
      appearance: input.appearance,
    };
    return mockSettingsStore;
  },

  async updateAccessibility(input: UpdateAccessibilityInput): Promise<ResidentSettings> {
    mockSettingsStore = {
      ...mockSettingsStore,
      accessibility: {
        ...mockSettingsStore.accessibility,
        ...input.accessibility,
      },
    };
    return mockSettingsStore;
  },

  async updateNotifications(input: UpdateNotificationPreferencesInput): Promise<ResidentSettings> {
    mockSettingsStore = {
      ...mockSettingsStore,
      notifications: {
        ...mockSettingsStore.notifications,
        ...input.notifications,
      },
    };
    return mockSettingsStore;
  },

  async logout(): Promise<void> {},
};

export default settingsMockSource;
