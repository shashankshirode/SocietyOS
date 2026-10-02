import React, { useMemo, useState, useCallback } from 'react';
import { ActivityIndicator, Pressable, View, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ResidentPageHeader } from '../../../ui/patterns/ResidentPageHeader';
import { AppCard } from '../../../shared/cards/AppCard';
import { SafeText } from '../../../shared/components/SafeText';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages } from '../../../shared/constants/useMessages';
import { useTemporalContext, useViewerTime } from '../../../../core/temporal/useTemporalContext.tsx';
import { settingsRepository } from '../data/settings.repository';
import { AppAlert } from '../../../ui/modal/AppAlert';
import { createDateTimeSettingsStyles } from '../styles/DateTimeSettingsScreen.styles';

type DateTimeSettingsNavigation = {
  goBack: () => void;
};

type DateTimeSettingsScreenProps = {
  navigation: DateTimeSettingsNavigation;
};

const DATE_FORMAT_OPTIONS: Array<{ value: 'SYSTEM_LOCALE' | 'DD_MM_YYYY' | 'MM_DD_YYYY' | 'DD_MMM_YYYY' | 'YYYY_MM_DD'; label: string }> = [
  { value: 'SYSTEM_LOCALE', label: 'System Default' },
  { value: 'DD_MMM_YYYY', label: 'DD MMM YYYY (02 Oct 2026)' },
  { value: 'DD_MM_YYYY', label: 'DD/MM/YYYY (02/10/2026)' },
  { value: 'MM_DD_YYYY', label: 'MM/DD/YYYY (10/02/2026)' },
  { value: 'YYYY_MM_DD', label: 'YYYY-MM-DD (2026-10-02)' },
];

const TIME_FORMAT_OPTIONS: Array<{ value: 'SYSTEM_LOCALE' | 'TWELVE_HOUR' | 'TWENTY_FOUR_HOUR'; label: string }> = [
  { value: 'SYSTEM_LOCALE', label: 'System Default' },
  { value: 'TWELVE_HOUR', label: '12-hour (7:30 PM)' },
  { value: 'TWENTY_FOUR_HOUR', label: '24-hour (19:30)' },
];

const DISPLAY_MODE_OPTIONS: Array<{ value: 'SOCIETY' | 'DEVICE' | 'CUSTOM' | 'DUAL_WHEN_DIFFERENT'; label: string; description: string }> = [
  { value: 'SOCIETY', label: 'Society Time Only', description: 'Always show society local time' },
  { value: 'DEVICE', label: 'Device Time', description: 'Use your device local time' },
  { value: 'CUSTOM', label: 'Custom Timezone', description: 'Choose a specific timezone' },
  { value: 'DUAL_WHEN_DIFFERENT', label: 'Both When Different', description: 'Show both times when they differ' },
];

type DateTimeSettingsNavigation = {
  goBack: () => void;
};

export function DateTimeSettingsScreen({ navigation }: DateTimeSettingsScreenProps) {
  const messages = useMessages();
  const theme = useAppTheme();
  const { 
    preferences, 
    updatePreferences, 
    formatSocietyDateTime,
    formatViewerDateTime,
    isCrossTimezone,
  } = useTemporalContext();
  const { formatSocietyDateTime: formatSocietyDateTimeHook, formatViewerDateTime: formatViewerDateTimeHook } = useViewerTime();
  const styles = useMemo(() => createDateTimeSettingsStyles(theme.theme), [theme.theme]);
  const [saving, setSaving] = useState(false);
  const [customTimeZone, setCustomTimeZone] = useState<string>('');
  const [showTimezoneSearch, setShowTimezoneSearch] = useState(false);
  const copy = messages.settings.dateTime;

  const handleUpdate = useCallback(async (prefs: Partial<any>) => {
    try {
      await Promise.resolve(); // Mock async
      await updatePreferences(prefs);
    } catch (error) {
      console.error('Failed to save temporal preferences:', error);
    }
  }, [updatePreferences]);

  const handleDateFormatChange = useCallback(async (value: any) => {
    await handleUpdate({ dateFormat: value });
  }, [handleUpdate]);

  const handleTimeFormatChange = useCallback(async (value: any) => {
    await handleUpdate({ timeFormat: value });
  }, [handleUpdate]);

  const handleDisplayModeChange = useCallback(async (value: any) => {
    await handleUpdate({ displayTimezoneMode: value });
    if (value !== 'CUSTOM') {
      await handleUpdate({ customTimeZone: null });
      setCustomTimeZone('');
    }
  }, [handleUpdate]);

  const handleCustomTimeZoneChange = useCallback(async (timezone: string) => {
    await handleUpdate({ customTimeZone: timezone });
  }, [handleUpdate]);

  // Preview values
  const now = new Date().toISOString();
  const societyPreview = formatSocietyDateTimeHook(now);
  const viewerPreview = formatViewerDateTimeHook(now);

  return (
    <View style={styles.root}>
      <ResidentPageHeader
        title={copy.title}
        subtitle={copy.subtitle}
        onBackPress={navigation.goBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Date Format Section */}
        <AppCard style={styles.sectionCard}>
          <SafeText variant="bodyStrong" style={styles.sectionTitle}>
            {copy.dateFormatTitle}
          </SafeText>
          <SafeText variant="caption" color="muted" style={styles.sectionDescription}>
            {copy.dateFormatDescription}
          </SafeText>
          {DATE_FORMAT_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => handleDateFormatChange(option.value)}
              style={styles.optionItem}
              accessibilityRole="radio"
              accessibilityState={{ selected: preferences.dateFormat === option.value }}
            >
              <View style={styles.optionContent}>
                <SafeText variant="body" style={styles.optionLabel}>{option.label}</SafeText>
                {preferences.dateFormat === option.value && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                )}
              </View>
            </Pressable>
          ))}
        </AppCard>

        {/* Time Format Section */}
        <AppCard style={[styles.sectionCard, styles.sectionCardWithTopBorder]}>
          <SafeText variant="bodyStrong" style={styles.sectionTitle}>
            {copy.timeFormatTitle}
          </SafeText>
          <SafeText variant="caption" color="muted" style={styles.sectionDescription}>
            {copy.timeFormatDescription}
          </SafeText>
          {TIME_FORMAT_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => handleTimeFormatChange(option.value)}
              style={styles.optionItem}
              accessibilityRole="radio"
              accessibilityState={{ selected: preferences.timeFormat === option.value }}
            >
              <View style={styles.optionContent}>
                <SafeText variant="body" style={styles.optionLabel}>{option.label}</SafeText>
                {preferences.timeFormat === option.value && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                )}
              </View>
            </Pressable>
          ))}
        </AppCard>

        {/* Display Timezone Mode Section */}
        <AppCard style={[styles.sectionCard, styles.sectionCardWithTopBorder]}>
          <SafeText variant="bodyStrong" style={styles.sectionTitle}>
            {copy.displayModeTitle}
          </SafeText>
          <SafeText variant="caption" color="muted" style={styles.sectionDescription}>
            {copy.displayModeDescription}
          </SafeText>
          {DISPLAY_MODE_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => handleDisplayModeChange(option.value)}
              style={styles.optionItem}
              accessibilityRole="radio"
              accessibilityState={{ selected: preferences.displayTimezoneMode === option.value }}
            >
              <View style={styles.optionContent}>
                <View style={styles.modeContent}>
                  <SafeText variant="bodyStrong" style={styles.optionLabel}>{option.label}</SafeText>
                  <SafeText variant="caption" color="muted" style={styles.optionDescription}>
                    {option.description}
                  </SafeText>
                </View>
                {preferences.displayTimezoneMode === option.value && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                )}
              </View>
            </Pressable>
          ))}
        </AppCard>

        {/* Custom Timezone Section */}
        {preferences.displayTimezoneMode === 'CUSTOM' && (
          <AppCard style={[styles.sectionCard, styles.sectionCardWithTopBorder]}>
            <SafeText variant="bodyStrong" style={styles.sectionTitle}>
              {copy.customTimezoneTitle}
            </SafeText>
            <SafeText variant="caption" color="muted" style={styles.sectionDescription}>
              {copy.customTimezoneDescription}
            </SafeText>
            <Pressable
              onPress={() => setShowTimezoneSearch(true)}
              style={styles.customTimezoneButton}
              accessibilityLabel={copy.selectTimezone}
            >
              <SafeText variant="body" style={styles.customTimezoneValue}>
                {customTimeZone || copy.selectTimezonePlaceholder}
              </SafeText>
              <Ionicons name="search" size={24} color={theme.colors.textSecondary} />
            </Pressable>
            {customTimeZone && (
              <SafeText variant="caption" color="muted" style={styles.customTimezoneHint}>
                {copy.currentTimezone(customTimeZone)}
              </SafeText>
            )}
          </AppCard>
        )}

        {/* Preview Section */}
        <AppCard style={[styles.sectionCard, styles.sectionCardWithTopBorder]}>
          <SafeText variant="bodyStrong" style={styles.sectionTitle}>
            {copy.previewTitle}
          </SafeText>
          <SafeText variant="caption" color="muted" style={styles.sectionDescription}>
            {copy.previewDescription}
          </SafeText>
          
          <View style={styles.previewCard}>
            <View style={styles.previewRow}>
              <SafeText variant="caption" color="muted" style={styles.previewLabel}>
                {copy.societyTimeLabel}
              </SafeText>
              <SafeText variant="bodyStrong" style={styles.previewValue}>
                {societyPreview.date}
              </SafeText>
            </View>
            <View style={styles.previewRow}>
              <SafeText variant="caption" color="muted" style={styles.previewLabel}>
                {copy.viewerTimeLabel}
              </SafeText>
              <SafeText variant="bodyStrong" style={styles.previewValue}>
                {viewerPreview.date}
              </SafeText>
            </View>
            {isCrossTimezone && (
              <>
                <View style={styles.divider} />
                <SafeText variant="caption" color="muted" style={styles.crossTimezoneNote}>
                  {copy.crossTimezoneNote}
                </SafeText>
              </>
            )}
          </View>
        </AppCard>
      </ScrollView>

      {saving && (
        <View style={styles.overlay} accessibilityRole="progressbar" accessibilityLabel={messages.common.saving}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      {showTimezoneSearch && (
        <TimezoneSearchModal
          onSelect={handleCustomTimeZoneChange}
          onClose={() => setShowTimezoneSearch(false)}
          initialValue={customTimeZone}
        />
      )}
    </View>
  );
}

function TimezoneSearchModal({ 
  onSelect, 
  onClose, 
  initialValue 
}: { 
  onSelect: (tz: string) => void; 
  onClose: () => void;
  initialValue: string;
}) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<Array<{ ianaId: string; displayName: string }>>([]);
  
  const theme = useAppTheme();
  const messages = useMessages();
  
  useMemo(() => {
    // Simple timezone search - in production would use a proper IANA database
    const commonTimezones = [
      { ianaId: 'America/New_York', displayName: 'New York, USA (EST/EDT)' },
      { ianaId: 'America/Chicago', displayName: 'Chicago, USA (CST/CDT)' },
      { ianaId: 'America/Denver', displayName: 'Denver, USA (MST/MDT)' },
      { ianaId: 'America/Los_Angeles', displayName: 'Los Angeles, USA (PST/PDT)' },
      { ianaId: 'Europe/London', displayName: 'London, UK (GMT/BST)' },
      { ianaId: 'Europe/Paris', displayName: 'Paris, France (CET/CEST)' },
      { ianaId: 'Europe/Berlin', displayName: 'Berlin, Germany (CET/CEST)' },
      { ianaId: 'Asia/Dubai', displayName: 'Dubai, UAE (GST)' },
      { ianaId: 'Asia/Singapore', displayName: 'Singapore (SGT)' },
      { ianaId: 'Asia/Tokyo', displayName: 'Tokyo, Japan (JST)' },
      { ianaId: 'Australia/Sydney', displayName: 'Sydney, Australia (AEST/AEDT)' },
      { ianaId: 'Asia/Kolkata', displayName: 'Kolkata, India (IST)' },
    ];
    
    if (!query) {
      setResults(commonTimezones);
    } else {
      const lowerQuery = query.toLowerCase();
      setResults(commonTimezones.filter(tz => 
        tz.displayName.toLowerCase().includes(lowerQuery) ||
        tz.ianaId.toLowerCase().includes(lowerQuery)
      ));
    }
  }, [query]);

  return (
    <View style={styles.modalOverlay} onTouchStart={onClose}>
      <View style={styles.modalContent} onTouchStart={() => {}}>
        <View style={styles.modalHeader}>
          <SafeText variant="title" style={styles.modalTitle}>
            {useMessages().settings.dateTime.selectTimezone}
          </SafeText>
          <Pressable onPress={onClose} accessibilityLabel="Close">
            <Ionicons name="close" size={28} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
        <View style={styles.modalSearch}>
          <Ionicons name="search" size={24} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <Pressable
            style={styles.searchInput}
            onPress={() => {}}
          >
            <SafeText variant="body" style={styles.searchInputText} placeholder={useMessages().settings.dateTime.searchPlaceholder}>
              {query}
            </SafeText>
          </Pressable>
        </View>
        <ScrollView style={styles.resultsList} showsVerticalScrollIndicator={false}>
          {results.map((tz) => (
            <Pressable
              key={tz.ianaId}
              onPress={() => { onSelect(tz.ianaId); onClose(); }}
              style={styles.resultItem}
            >
              <SafeText variant="body" style={styles.resultLabel}>
                {tz.displayName}
              </SafeText>
              <SafeText variant="caption" color="muted" style={styles.resultId}>
                {tz.ianaId}
              </SafeText>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const DATE_FORMAT_OPTIONS: Array<{ value: 'SYSTEM_LOCALE' | 'DD_MM_YYYY' | 'MM_DD_YYYY' | 'DD_MMM_YYYY' | 'YYYY_MM_DD'; label: string }> = [
  { value: 'SYSTEM_LOCALE', label: 'System Default' },
  { value: 'DD_MMM_YYYY', label: 'DD MMM YYYY (02 Oct 2026)' },
  { value: 'DD_MM_YYYY', label: 'DD/MM/YYYY (02/10/2026)' },
  { value: 'MM_DD_YYYY', label: 'MM/DD/YYYY (10/02/2026)' },
  { value: 'YYYY_MM_DD', label: 'YYYY-MM-DD (2026-10-02)' },
];

const TIME_FORMAT_OPTIONS: Array<{ value: 'SYSTEM_LOCALE' | 'TWELVE_HOUR' | 'TWENTY_FOUR_HOUR'; label: string }> = [
  { value: 'SYSTEM_LOCALE', label: 'System Default' },
  { value: 'TWELVE_HOUR', label: '12-hour (7:30 PM)' },
  { value: 'TWENTY_FOUR_HOUR', label: '24-hour (19:30)' },
];

const DISPLAY_MODE_OPTIONS: Array<{ value: 'SOCIETY' | 'DEVICE' | 'CUSTOM' | 'DUAL_WHEN_DIFFERENT'; label: string; description: string }> = [
  { value: 'SOCIETY', label: 'Society Time Only', description: 'Always show society local time' },
  { value: 'DEVICE', label: 'Device Time', description: 'Use your device local time' },
  { value: 'CUSTOM', label: 'Custom Timezone', description: 'Choose a specific timezone' },
  { value: 'DUAL_WHEN_DIFFERENT', label: 'Both When Different', description: 'Show both times when they differ' },
];

export default DateTimeSettingsScreen;
