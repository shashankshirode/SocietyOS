import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppBottomSheet } from '../../../../ui/bottomSheet';
import { ModalHeader } from '../../../../ui/modal';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { PressableScale } from '../../../../shared/motion/PressableScale';
import type { LocalAdvisoryType, ContextualInsightPriority } from '../data/residentContextualInsights.types';
import {
  getAutoIconForCategory,
  addUserReportedAdvisory,
  checkReportRateLimit,
} from '../state/userReportedInsights.store';

export interface ReportDailyInsightModalProps {
  visible: boolean;
  onClose: () => void;
  societyId: string;
  unitId: string;
  userRole?: 'resident' | 'admin' | 'guard';
  userName?: string;
  userId?: string;
  onSuccess?: () => void;
}

const CATEGORY_OPTIONS: { type: LocalAdvisoryType; label: string; defaultIcon: keyof typeof Ionicons.glyphMap }[] = [
  { type: 'roadBlock', label: 'Road Block', defaultIcon: 'warning-outline' },
  { type: 'waterlogging', label: 'Waterlogging', defaultIcon: 'water-outline' },
  { type: 'gateCongestion', label: 'Gate Delay', defaultIcon: 'people-outline' },
  { type: 'liftOutage', label: 'Lift Outage', defaultIcon: 'arrow-down-outline' },
  { type: 'powerCut', label: 'Power Outage', defaultIcon: 'flash-outline' },
  { type: 'securityAlert', label: 'Security Alert', defaultIcon: 'shield-outline' },
  { type: 'parkingCongestion', label: 'Parking Issue', defaultIcon: 'car-outline' },
  { type: 'maintenanceWork', label: 'Maintenance', defaultIcon: 'construct-outline' },
  { type: 'societyEvent', label: 'Society Event', defaultIcon: 'calendar-outline' },
];

const DURATION_OPTIONS = [
  { hours: 2, label: '2 Hours' },
  { hours: 4, label: '4 Hours' },
  { hours: 8, label: '8 Hours' },
  { hours: 24, label: '24 Hours' },
];

const PRIORITY_OPTIONS: { priority: ContextualInsightPriority; label: string; color: string }[] = [
  { priority: 'low', label: 'Low', color: '#10B981' },
  { priority: 'medium', label: 'Medium', color: '#F59E0B' },
  { priority: 'high', label: 'High', color: '#EF4444' },
  { priority: 'critical', label: 'Urgent', color: '#DC2626' },
];

export function ReportDailyInsightModal({
  visible,
  onClose,
  societyId,
  unitId,
  userRole = 'resident',
  userName = 'Resident',
  userId = 'usr-current',
  onSuccess,
}: ReportDailyInsightModalProps) {
  const { colors } = useAppTheme();
  
  const [selectedType, setSelectedType] = useState<LocalAdvisoryType>('roadBlock');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ContextualInsightPriority>('medium');
  const [durationHours, setDurationHours] = useState(4);
  
  const [errorText, setErrorText] = useState<string | null>(null);

  const autoIcon = getAutoIconForCategory(selectedType, title);

  const handleSubmit = () => {
    setErrorText(null);

    // Rate limiting check
    const rateCheck = checkReportRateLimit(userId);
    if (!rateCheck.allowed) {
      setErrorText(`Please wait ${rateCheck.waitSecondsRemaining} seconds before reporting another insight.`);
      return;
    }

    // Validation checks
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 4) {
      setErrorText('Title must be at least 4 characters long.');
      return;
    }

    const trimmedDesc = description.trim();
    if (trimmedDesc.length < 10) {
      setErrorText('Please provide a detailed description (at least 10 characters).');
      return;
    }

    // Add advisory
    addUserReportedAdvisory(
      {
        societyId,
        areaId: societyId,
        type: selectedType,
        priority,
        title: trimmedTitle,
        description: trimmedDesc,
        durationHours,
        reporterRole: userRole,
        reporterName: userName,
      },
      userId
    );

    // Reset form
    setTitle('');
    setDescription('');
    setSelectedType('roadBlock');
    setPriority('medium');
    setDurationHours(4);

    onSuccess?.();
    onClose();
  };

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      testID="report-daily-insight-modal"
      header={<ModalHeader title="Report Daily Insight" onClose={onClose} />}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Verification / Trust Badge Banner */}
        <View
          style={[
            styles.trustBanner,
            {
              backgroundColor: userRole === 'resident' ? colors.surfaceMuted : colors.surfaceAccent,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name={userRole === 'resident' ? 'people-outline' : 'shield-checkmark-outline'}
            size={18}
            color={colors.primary}
          />
          <View style={styles.trustBannerText}>
            <SafeText variant="caption" style={{ color: colors.textPrimary, fontWeight: '700' }}>
              {userRole === 'admin'
                ? 'Society Office Report (Auto-Verified)'
                : userRole === 'guard'
                ? 'Security Team Report (Auto-Verified)'
                : 'Resident Report (Community Verification Enabled)'}
            </SafeText>
            <SafeText variant="tiny" color="muted">
              {userRole === 'resident'
                ? 'Your advisory will be published with resident status. Other residents can confirm it.'
                : 'Your advisory will be instantly highlighted as a verified update.'}
            </SafeText>
          </View>
        </View>

        {/* Error banner */}
        {errorText && (
          <View style={[styles.errorBanner, { backgroundColor: colors.dangerSoft }]}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
            <SafeText variant="tiny" style={{ color: colors.danger, fontWeight: '600', flex: 1 }}>
              {errorText}
            </SafeText>
          </View>
        )}

        {/* Category Picker */}
        <View style={styles.section}>
          <SafeText variant="caption" color="secondary" style={styles.sectionTitle}>
            Category / Issue Type
          </SafeText>
          <View style={styles.categoryGrid}>
            {CATEGORY_OPTIONS.map((cat) => {
              const isSelected = selectedType === cat.type;
              return (
                <Pressable
                  key={cat.type}
                  onPress={() => setSelectedType(cat.type)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={cat.defaultIcon}
                    size={16}
                    color={isSelected ? '#FFFFFF' : colors.textPrimary}
                  />
                  <SafeText
                    variant="tiny"
                    style={{
                      color: isSelected ? '#FFFFFF' : colors.textPrimary,
                      fontWeight: isSelected ? '700' : '500',
                    }}
                  >
                    {cat.label}
                  </SafeText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Auto Icon Preview Badge */}
        <View style={[styles.autoIconPreview, { backgroundColor: colors.surfaceMuted }]}>
          <Ionicons name={autoIcon} size={20} color={colors.primary} />
          <SafeText variant="tiny" color="secondary">
            Auto-assigned icon: <SafeText variant="tiny" style={{ fontWeight: '700', color: colors.primary }}>{autoIcon}</SafeText> (Automatically selected based on category)
          </SafeText>
        </View>

        {/* Title Input */}
        <View style={styles.section}>
          <SafeText variant="caption" color="secondary" style={styles.sectionTitle}>
            Title / Short Headline
          </SafeText>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Waterlogging at Gate 2 or Elevator B Servicing"
            placeholderTextColor={colors.inputPlaceholder}
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.inputText,
              },
            ]}
            maxLength={60}
          />
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <SafeText variant="caption" color="secondary" style={styles.sectionTitle}>
            Detailed Advisory / Instructions
          </SafeText>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Provide clear details for neighbors or visitors..."
            placeholderTextColor={colors.inputPlaceholder}
            multiline
            numberOfLines={3}
            style={[
              styles.input,
              styles.multilineInput,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.inputText,
              },
            ]}
            maxLength={200}
          />
        </View>

        {/* Priority & Urgency */}
        <View style={styles.section}>
          <SafeText variant="caption" color="secondary" style={styles.sectionTitle}>
            Urgency Level
          </SafeText>
          <View style={styles.optionRow}>
            {PRIORITY_OPTIONS.map((p) => {
              const isSelected = priority === p.priority;
              return (
                <Pressable
                  key={p.priority}
                  onPress={() => setPriority(p.priority)}
                  style={[
                    styles.optionChip,
                    {
                      backgroundColor: isSelected ? p.color : colors.surface,
                      borderColor: isSelected ? p.color : colors.border,
                    },
                  ]}
                >
                  <SafeText
                    variant="tiny"
                    style={{
                      color: isSelected ? '#FFFFFF' : colors.textPrimary,
                      fontWeight: isSelected ? '700' : '500',
                    }}
                  >
                    {p.label}
                  </SafeText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Active Duration / Expiry */}
        <View style={styles.section}>
          <SafeText variant="caption" color="secondary" style={styles.sectionTitle}>
            Active Duration (Auto-Expires After)
          </SafeText>
          <View style={styles.optionRow}>
            {DURATION_OPTIONS.map((d) => {
              const isSelected = durationHours === d.hours;
              return (
                <Pressable
                  key={d.hours}
                  onPress={() => setDurationHours(d.hours)}
                  style={[
                    styles.optionChip,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <SafeText
                    variant="tiny"
                    style={{
                      color: isSelected ? '#FFFFFF' : colors.textPrimary,
                      fontWeight: isSelected ? '700' : '500',
                    }}
                  >
                    {d.label}
                  </SafeText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Submit Button */}
        <PressableScale
          onPress={handleSubmit}
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          testID="submit-daily-insight-btn"
        >
          <Ionicons name="megaphone-outline" size={18} color="#FFFFFF" />
          <SafeText variant="bodyStrong" style={{ color: '#FFFFFF' }}>
            Publish Advisory
          </SafeText>
        </PressableScale>
      </ScrollView>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  trustBannerText: {
    flex: 1,
    gap: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  autoIconPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  multilineInput: {
    height: 80,
    paddingTop: 10,
    paddingBottom: 10,
    textAlignVertical: 'top',
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 24,
    marginTop: 8,
  },
});

export default ReportDailyInsightModal;
