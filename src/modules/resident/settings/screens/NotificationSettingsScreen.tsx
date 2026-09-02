import { useMemo, useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotificationPermission } from '../../../../core/notifications/useNotificationPermission';
import { useLocalNotificationTest } from '../../../../core/notifications/useLocalNotificationTest';
import { getCachedNotificationPreferences, updateNotificationPreference } from '../../../../core/notifications/notificationPreferences';
import type { NotificationPreference } from '../../../../core/notifications/notification.types';
import { resolvePermissionDeniedError } from '../../../../core/device/deviceCapabilityError';
import { SafeText } from '../../../../shared/components/SafeText';
import { useMessages } from '../../../../shared/constants/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { AppAlert } from '../../../../ui/modal/AppAlert';
import { SocietySwitch } from '../../../../ui/controls/SocietySwitch';
import { SocietyScreen } from '../../../../ui/layout/SocietyScreen';
import { useResponsiveLayout } from '../../../../ui/layout/useResponsiveLayout';
import { AmbientPageChrome } from '../../experience/AmbientPageChrome';
import { SocietyExperienceFrame } from '../../experience/SocietyExperienceFrame';
import {
  createBorderStyle,
  createMutedSurfaceStyle,
  createScrollInsetStyle,
  styles,
} from '../styles/screens/NotificationSettingsScreen.styles';

type NotificationSectionKey = 'aroundHome' | 'yourSociety' | 'money' | 'safety' | 'other';

const preferenceSections: Record<string, NotificationSectionKey> = {
  visitorAlerts: 'aroundHome',
  gateEntryAlerts: 'aroundHome',
  staffAttendanceAlerts: 'aroundHome',
  noticeAnnouncements: 'yourSociety',
  complaintUpdates: 'yourSociety',
  documentNocUpdates: 'yourSociety',
  billingReminders: 'money',
  emergencyAlerts: 'safety',
};

function settingLabel(pref: NotificationPreference, labels: Record<string, string>): string {
  return labels[pref.key] ?? pref.label;
}

export function NotificationSettingsScreen({ navigation }: BackOnlyScreenProps) {
  const messages = useMessages();
  const copy = messages.settings.notificationExperience;
  const { semantic } = useAppTheme();
  const insets = useSafeAreaInsets();
  const responsive = useResponsiveLayout();
  const { status, loading, askPermission } = useNotificationPermission();
  const { triggerTest, isSending } = useLocalNotificationTest();
  const [preferences, setPreferences] = useState(getCachedNotificationPreferences);
  const [showHelp, setShowHelp] = useState(false);
  const grouped = useMemo(() => {
    const result: Record<NotificationSectionKey, NotificationPreference[]> = { aroundHome: [], yourSociety: [], money: [], safety: [], other: [] };
    preferences.forEach((pref) => result[preferenceSections[pref.key] ?? 'other'].push(pref));
    return result;
  }, [preferences]);

  function handleToggle(key: string, value: boolean) {
    updateNotificationPreference(key, value);
    setPreferences(getCachedNotificationPreferences());
  }

  async function handleSendTest() {
    const result = await triggerTest();
    if (!result.success) AppAlert.alert(copy.testErrorTitle, copy.testErrorMessage);
  }

  async function handlePermissionAction() {
    if (status === 'denied') {
      await Linking.openSettings();
      return;
    }
    const nextStatus = await askPermission();
    if (nextStatus.status === 'denied') AppAlert.alert(copy.permissionDeniedTitle, resolvePermissionDeniedError('notifications'));
  }

  const renderSection = (key: NotificationSectionKey, title: string) => {
    const sectionPreferences = grouped[key];
    if (sectionPreferences.length === 0) return null;
    return (
      <View key={key} style={[styles.section, responsive.isTablet && styles.sectionWide, createBorderStyle(semantic.border.subtle)]}>
        <SafeText variant="tiny" style={styles.sectionTitle}>{title}</SafeText>
        {sectionPreferences.map((pref, index) => {
          const required = pref.important === true;
          return (
            <View key={pref.key} style={[styles.settingRow, index < sectionPreferences.length - 1 && createBorderStyle(semantic.border.subtle)]}>
              <View style={styles.settingCopy}>
                <SafeText variant="bodyStrong" color="primary">{settingLabel(pref, copy.labels)}</SafeText>
                {required ? <SafeText variant="caption" color="muted">{copy.requiredForSafety}</SafeText> : null}
              </View>
              {required ? (
                <View style={[styles.requiredState, createMutedSurfaceStyle(semantic.surface.soft)]} accessibilityLabel={`${settingLabel(pref, copy.labels)}, ${copy.alwaysOn}`}>
                  <Ionicons name="lock-closed-outline" size={14} color={semantic.accent.moss} />
                  <SafeText variant="tiny" color="success">{copy.alwaysOn}</SafeText>
                </View>
              ) : <SocietySwitch accessibilityLabel={settingLabel(pref, copy.labels)} value={pref.enabled} onValueChange={(value) => handleToggle(pref.key, value)} />}
            </View>
          );
        })}
      </View>
    );
  };

  const permissionGranted = status === 'granted';
  return (
    <SocietyExperienceFrame showAmbientChrome={false}>
      <View style={styles.root}>
        <AmbientPageChrome
          titleKey="settings.notificationExperience.title"
          subtitleKey="settings.notificationExperience.subtitle"
          contextLabelKey="settings.notificationExperience.context"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <SocietyScreen scroll layoutMode="full" edges={['left', 'right', 'bottom']} contentStyle={createScrollInsetStyle(insets.bottom)} testID="notification-settings-screen">
          <View style={[styles.deviceSection, createBorderStyle(semantic.border.subtle)]}>
            <SafeText variant="tiny" style={styles.sectionTitle}>{copy.device}</SafeText>
            <View style={styles.deviceBody}>
              <View style={styles.deviceCopy}>
                <SafeText variant="h3" color="primary">{loading ? copy.permissionLoading : permissionGranted ? copy.permissionOn : copy.permissionOff}</SafeText>
                <SafeText variant="body" color="muted">{permissionGranted ? copy.permissionOnDescription : copy.permissionOffDescription}</SafeText>
              </View>
              <Pressable
                onPress={permissionGranted ? handleSendTest : handlePermissionAction}
                disabled={loading || isSending}
                accessibilityRole="button"
                style={styles.deviceCommand}
              >
                <SafeText variant="bodyStrong" color="success">
                  {permissionGranted ? copy.test : status === 'denied' ? copy.openSettings : copy.enable} →
                </SafeText>
              </Pressable>
            </View>
          </View>

          <View style={[styles.sections, responsive.isTablet && styles.sectionsWide]}>
            {renderSection('aroundHome', copy.aroundHome)}
            {renderSection('yourSociety', copy.yourSociety)}
            {renderSection('money', copy.money)}
            {renderSection('safety', copy.safety)}
            {renderSection('other', copy.other)}
          </View>

          <View style={[styles.helpSection, createBorderStyle(semantic.border.subtle)]}>
            <Pressable onPress={() => setShowHelp((current) => !current)} accessibilityRole="button" accessibilityState={{ expanded: showHelp }} style={styles.helpTrigger}>
              <SafeText variant="bodyStrong" color="secondary">{copy.help}</SafeText>
              <Ionicons name={showHelp ? 'chevron-up' : 'chevron-forward'} size={18} color={semantic.text.secondary} />
            </Pressable>
            {showHelp ? <SafeText variant="caption" color="muted" style={styles.helpCopy}>{copy.helpDescription}</SafeText> : null}
          </View>
        </SocietyScreen>
      </View>
    </SocietyExperienceFrame>
  );
}
