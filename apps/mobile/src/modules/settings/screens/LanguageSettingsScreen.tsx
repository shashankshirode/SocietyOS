import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ResidentPageHeader } from '../../../ui/patterns/ResidentPageHeader';
import { AppCard } from '../../../shared/cards/AppCard';
import { SafeText } from '../../../shared/components/SafeText';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages } from '../../../shared/constants/useMessages';
import { getMessagesForLocale, SupportedLocale, useLanguage } from '../../../shared/localization';
import { settingsRepository } from '../data/settings.repository';
import { AppAlert } from '../../../ui/modal/AppAlert';
import { createLanguageSettingsStyles } from '../styles/LanguageSettingsScreen.styles';

type LanguageSettingsNavigation = {
  goBack: () => void;
};

type LanguageSettingsScreenProps = {
  navigation: LanguageSettingsNavigation;
};

export function LanguageSettingsScreen({ navigation }: LanguageSettingsScreenProps) {
  const messages = useMessages();
  const theme = useAppTheme();
  const { locale, setLocale } = useLanguage();
  const styles = useMemo(() => createLanguageSettingsStyles(theme.theme), [theme.theme]);
  const [savingLocale, setSavingLocale] = useState<SupportedLocale | null>(null);
  const copy = messages.settings.language;

  const languageOptions = useMemo(() => [
    { locale: SupportedLocale.EnglishIndia, label: copy.options.english },
    { locale: SupportedLocale.HindiIndia, label: copy.options.hindi },
    { locale: SupportedLocale.MarathiIndia, label: copy.options.marathi },
  ], [copy.options.english, copy.options.hindi, copy.options.marathi]);

  const handleSelect = async (nextLocale: SupportedLocale) => {
    if (nextLocale === locale || savingLocale) return;
    const previousLocale = locale;
    setSavingLocale(nextLocale);
    await setLocale(nextLocale);
    try {
      await settingsRepository.updateLanguage({
        userId: 'resident-001',
        languageCode: nextLocale,
      });
      const localizedMessages = getMessagesForLocale(nextLocale);
      AppAlert.alert(
        localizedMessages.settings.language.feedback.updatedTitle,
        localizedMessages.settings.language.feedback.updatedMessage,
        [{ text: localizedMessages.common.ok }],
      );
    } catch {
      await setLocale(previousLocale);
      const fallbackMessages = getMessagesForLocale(previousLocale);
      AppAlert.alert(
        fallbackMessages.settings.language.feedback.errorTitle,
        fallbackMessages.settings.language.feedback.errorMessage,
        [{ text: fallbackMessages.common.ok }],
      );
    } finally {
      setSavingLocale(null);
    }
  };

  return (
    <View style={styles.root}>
      <ResidentPageHeader
        title={copy.title}
        subtitle={copy.description}
        onBackPress={navigation.goBack}
      />

      <View style={styles.content}>
        {languageOptions.map((option) => {
          const isSelected = locale === option.locale;
          return (
            <Pressable
              key={option.locale}
              onPress={() => void handleSelect(option.locale)}
              disabled={savingLocale !== null}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityHint={isSelected
                ? copy.selectedAccessibilityHint
                : copy.selectAccessibilityHint}
              accessibilityState={{ selected: isSelected, disabled: savingLocale !== null }}
              style={styles.languageItem}
            >
              <AppCard
                selected={isSelected}
                variant={isSelected ? 'default' : 'outlined'}
                style={[styles.card, isSelected ? styles.selectedCard : styles.unselectedCard]}
              >
                <View style={styles.cardContent}>
                  <SafeText variant="bodyStrong" style={styles.label}>
                    {option.label}
                  </SafeText>
                  {isSelected ? (
                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                  ) : null}
                </View>
              </AppCard>
            </Pressable>
          );
        })}
      </View>

      {savingLocale ? (
        <View
          style={styles.overlay}
          accessibilityRole="progressbar"
          accessibilityLabel={copy.savingAccessibilityLabel}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : null}
    </View>
  );
}

export default LanguageSettingsScreen;
