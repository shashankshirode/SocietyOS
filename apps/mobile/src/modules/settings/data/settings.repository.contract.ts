import type {
  ResidentSettings,
  UpdateAccessibilityInput,
  UpdateAppearanceInput,
  UpdateLanguageInput,
  UpdateNotificationPreferencesInput,
} from '../domain/settings.types';

export interface ResidentSettingsRepository {
  getSettings(userId: string): Promise<ResidentSettings>;
  updateLanguage(input: UpdateLanguageInput): Promise<ResidentSettings>;
  updateAppearance(input: UpdateAppearanceInput): Promise<ResidentSettings>;
  updateAccessibility(input: UpdateAccessibilityInput): Promise<ResidentSettings>;
  updateNotifications(input: UpdateNotificationPreferencesInput): Promise<ResidentSettings>;
  logout(): Promise<void>;
}
