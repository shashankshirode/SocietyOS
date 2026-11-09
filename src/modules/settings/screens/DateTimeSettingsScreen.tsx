import { useMemo, useState, useCallback } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { ResidentPageHeader } from '../../../ui/patterns/ResidentPageHeader';
import { AppCard } from '../../../shared/cards/AppCard';
import { SafeText } from '../../../shared/components/SafeText';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useDateTimePreferences } from '../../../shared/datetime/useDateTimePreferences';
import { formatAppDateTime } from '../../../shared/datetime/date-time-formatter';
import {
  UserDateFormatPreference,
  UserTimeFormatPreference,
} from '../../../shared/datetime/date-time-preferences.types';
import { createDateTimeSettingsStyles } from '../styles/DateTimeSettingsScreen.styles';

interface DateTimeSettingsNavigation {
  goBack: () => void;
}

interface DateTimeSettingsScreenProps {
  navigation: DateTimeSettingsNavigation;
}

interface DateOption {
  value: UserDateFormatPreference;
  label: string;
  sample: string;
}

interface TimeOption {
  value: UserTimeFormatPreference;
  label: string;
  sample: string;
}

const SAMPLE_PREVIEW_INSTANT = '2026-07-09T03:30:00.000Z'; // 9 Jul 2026, 9:00 AM IST

const DATE_FORMAT_OPTIONS: readonly DateOption[] = [
  { value: 'D_MMM_YYYY', label: 'D MMM YYYY', sample: '9 Jul 2026' },
  { value: 'DD_MM_YYYY', label: 'DD/MM/YYYY', sample: '09/07/2026' },
  { value: 'MM_DD_YYYY', label: 'MM/DD/YYYY', sample: '07/09/2026' },
  { value: 'MMM_D_YYYY', label: 'MMM D, YYYY', sample: 'Jul 9, 2026' },
];

const TIME_FORMAT_OPTIONS: readonly TimeOption[] = [
  { value: 'TWELVE_HOUR', label: '12-hour', sample: '9:00 AM' },
  { value: 'TWENTY_FOUR_HOUR', label: '24-hour', sample: '09:00' },
];

export function DateTimeSettingsScreen({ navigation }: DateTimeSettingsScreenProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createDateTimeSettingsStyles(colors), [colors]);
  const { preferences, updateDateFormat, updateTimeFormat } = useDateTimePreferences();

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectDateFormat = useCallback(
    async (format: UserDateFormatPreference) => {
      setErrorMessage('');
      setSaving(true);
      try {
        await updateDateFormat(format);
      } catch {
        setErrorMessage('Failed to save date format preference. Please try again.');
      } finally {
        setSaving(false);
      }
    },
    [updateDateFormat],
  );

  const handleSelectTimeFormat = useCallback(
    async (format: UserTimeFormatPreference) => {
      setErrorMessage('');
      setSaving(true);
      try {
        await updateTimeFormat(format);
      } catch {
        setErrorMessage('Failed to save time format preference. Please try again.');
      } finally {
        setSaving(false);
      }
    },
    [updateTimeFormat],
  );

  const livePreview = useMemo(() => {
    return formatAppDateTime(SAMPLE_PREVIEW_INSTANT, {
      dateFormat: preferences.dateFormat,
      timeFormat: preferences.timeFormat,
      includeYear: true,
      timeZone: 'Asia/Kolkata',
    });
  }, [preferences.dateFormat, preferences.timeFormat]);

  return (
    <View style={styles.root}>
      <ResidentPageHeader
        title="Date & Time"
        subtitle="Display preferences"
        onBackPress={navigation.goBack}
        showBackButton={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {errorMessage ? (
          <SafeText style={styles.errorMessage}>{errorMessage}</SafeText>
        ) : null}

        {/* Live Preview Section */}
        <AppCard style={styles.sectionCard}>
          <SafeText variant="bodyStrong" style={styles.sectionTitle}>
            Preview
          </SafeText>
          <SafeText variant="caption" style={styles.sectionDescription}>
            Live preview of timestamps formatted across the app
          </SafeText>
          <View style={styles.previewCard}>
            <View style={styles.previewRow}>
              <SafeText style={styles.previewLabel}>Sample</SafeText>
              <SafeText style={styles.previewValue}>{livePreview}</SafeText>
            </View>
          </View>
        </AppCard>

        {/* Date Format Section */}
        <AppCard style={styles.sectionCard}>
          <SafeText variant="bodyStrong" style={styles.sectionTitle}>
            Date format
          </SafeText>
          <SafeText variant="caption" style={styles.sectionDescription}>
            Choose how dates are displayed in activities and lists
          </SafeText>

          {DATE_FORMAT_OPTIONS.map((option) => {
            const isSelected = preferences.dateFormat === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => void handleSelectDateFormat(option.value)}
                style={styles.optionItem}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${option.label}, sample: ${option.sample}`}
              >
                <View style={styles.optionContent}>
                  <SafeText variant="body" style={styles.optionLabel}>
                    {option.sample}
                  </SafeText>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected ? styles.radioCircleSelected : undefined,
                    ]}
                  >
                    {isSelected ? <View style={styles.radioDot} /> : null}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </AppCard>

        {/* Time Format Section */}
        <AppCard style={styles.sectionCard}>
          <SafeText variant="bodyStrong" style={styles.sectionTitle}>
            Time format
          </SafeText>
          <SafeText variant="caption" style={styles.sectionDescription}>
            Choose between 12-hour clock (AM/PM) or 24-hour clock
          </SafeText>

          {TIME_FORMAT_OPTIONS.map((option) => {
            const isSelected = preferences.timeFormat === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => void handleSelectTimeFormat(option.value)}
                style={styles.optionItem}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${option.label}, sample: ${option.sample}`}
              >
                <View style={styles.optionContent}>
                  <SafeText variant="body" style={styles.optionLabel}>
                    {option.sample}
                  </SafeText>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected ? styles.radioCircleSelected : undefined,
                    ]}
                  >
                    {isSelected ? <View style={styles.radioDot} /> : null}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </AppCard>
      </ScrollView>

      {saving ? (
        <View style={styles.overlay} accessibilityRole="progressbar" accessibilityLabel="Saving...">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}
    </View>
  );
}

export default DateTimeSettingsScreen;
