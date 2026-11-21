import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { resetToAppModeSelector } from '../../../core/auth/authNavigation';
import { useAuthSession } from '../../../core/auth/useAuthSession';
import { AppButton } from '../../../shared/components/AppButton';
import { SafeText } from '../../../shared/components/SafeText';
import { useMessages } from '../../../shared/constants/useMessages';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { AppBottomSheet } from '../../../ui/bottomSheet';
import { ResidentHomeSwitcherSheet } from '../homeContext/components/ResidentHomeSwitcherSheet';
import { useActiveResidentHome } from '../homeContext/hooks/useActiveResidentHome';
import { useSocietyExperience } from './SocietyExperienceContext';
import { PersonaSwitcherSheet } from './PersonaSwitcherSheet';
import { createBackgroundStyle, createBorderStyle, createColorStyle, styles } from './styles/IdentityCenter.styles';

type Destination = 'ProfileHome' | 'Notifications' | 'Privacy' | 'Language' | 'Settings';

const rowIcons: Record<Destination | 'Residences' | 'Personas' | 'Help' | 'SignOut', keyof typeof Ionicons.glyphMap> = {
  ProfileHome: 'person-outline',
  Personas: 'swap-horizontal-outline',
  Residences: 'business-outline',
  Notifications: 'notifications-outline',
  Privacy: 'shield-checkmark-outline',
  Language: 'language-outline',
  Settings: 'options-outline',
  Help: 'help-circle-outline',
  SignOut: 'log-out-outline',
};

export function IdentityCenterHost({ navigation }: { navigation: BottomTabBarProps['navigation'] }) {
  const theme = useAppTheme();
  const messages = useMessages();
  const copy = messages.resident.experience.identityCenter;
  const { session, logout } = useAuthSession();
  const { activeContext } = useActiveResidentHome();
  const {
    identityCenterVisible,
    residenceSwitcherVisible,
    closeIdentityCenter,
    closeResidenceSwitcher,
    openResidenceSwitcher,
  } = useSocietyExperience();
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [personaSwitcherVisible, setPersonaSwitcherVisible] = useState(false);

  const close = () => {
    setConfirmingSignOut(false);
    closeIdentityCenter();
  };

  const navigateTo = (screen: Destination) => {
    close();
    navigation.navigate('HomeTab', {
      screen: 'ProfileTab',
      params: { screen },
    });
  };

  const navigateToHelp = () => {
    close();
    navigation.navigate('HomeTab', { screen: 'Helpdesk' });
  };

  const showResidences = () => {
    setConfirmingSignOut(false);
    openResidenceSwitcher();
  };

  const confirmSignOut = async () => {
    setSigningOut(true);
    try {
      await logout();
      close();
      resetToAppModeSelector(navigation);
    } finally {
      setSigningOut(false);
    }
  };

  const renderRow = (
    id: Destination | 'Residences' | 'Personas' | 'Help' | 'SignOut',
    title: string,
    description: string,
    onPress: () => void,
    danger = false,
  ) => (
    <Pressable
      key={id}
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.row, createBorderStyle(theme.semantic.border.subtle)]}
    >
      <View style={[styles.rowIcon, createBackgroundStyle(danger ? theme.semantic.status.dangerSurface : theme.semantic.surface.soft)]}>
        <Ionicons name={rowIcons[id]} size={20} color={danger ? theme.semantic.status.danger : theme.semantic.text.secondary} />
      </View>
      <View style={styles.rowCopy}>
        <SafeText variant="bodyStrong" style={danger ? createColorStyle(theme.semantic.status.danger) : undefined}>{title}</SafeText>
        <SafeText variant="caption" color="secondary">{description}</SafeText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.semantic.text.tertiary} />
    </Pressable>
  );

  const header = (
    <View style={styles.header}>
      <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.accent.moss)]}>{copy.eyebrow}</SafeText>
      <SafeText variant="h2">{copy.title}</SafeText>
      <SafeText variant="caption" color="secondary">{copy.description}</SafeText>
    </View>
  );

  return (
    <>
      <AppBottomSheet visible={identityCenterVisible} onClose={close} header={header} sheetStyle={styles.sheet} testID="identity-center-sheet" preventDismiss={signingOut}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.identity, createBackgroundStyle(theme.semantic.surface.soft)]}>
            <SafeText variant="h3">{session?.name ?? copy.title}</SafeText>
            <SafeText variant="bodyStrong">{activeContext.societyName}</SafeText>
            <View style={styles.identityMeta}>
              <SafeText variant="caption" color="secondary">{activeContext.displayUnitName}</SafeText>
              <SafeText variant="caption" color="secondary">· {copy[activeContext.residentRole]}</SafeText>
            </View>
          </View>

          {confirmingSignOut ? (
            <View style={[styles.confirmation, createBackgroundStyle(theme.semantic.status.dangerSurface)]}>
              <SafeText variant="h3">{copy.signOutTitle}</SafeText>
              <SafeText variant="body" color="secondary">{copy.signOutConfirmation}</SafeText>
              <View style={styles.confirmationActions}>
                <AppButton title={copy.confirmSignOut} variant="danger" fullWidth loading={signingOut} onPress={() => { void confirmSignOut(); }} />
                <AppButton title={copy.cancelSignOut} variant="ghost" fullWidth disabled={signingOut} onPress={() => setConfirmingSignOut(false)} />
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <SafeText variant="tiny" color="muted" style={styles.sectionLabel}>{copy.youSection}</SafeText>
              {renderRow('ProfileHome', copy.profile, copy.profileDescription, () => navigateTo('ProfileHome'))}
              {renderRow('Language', copy.language, copy.languageDescription, () => navigateTo('Language'))}

              <SafeText variant="tiny" color="muted" style={styles.sectionLabel}>{copy.homesSection}</SafeText>
              {renderRow('Residences', copy.residences, copy.residencesDescription, showResidences)}
              {renderRow('Personas', 'Switch Persona / Role', 'Test Rohan, Sunita, Amit, Guard, etc.', () => setPersonaSwitcherVisible(true))}

              <SafeText variant="tiny" color="muted" style={styles.sectionLabel}>{copy.controlSection}</SafeText>
              {renderRow('Notifications', copy.notifications, copy.notificationsDescription, () => navigateTo('Notifications'))}
              {renderRow('Privacy', copy.privacy, copy.privacyDescription, () => navigateTo('Privacy'))}
              {renderRow('Settings', copy.settings, copy.settingsDescription, () => navigateTo('Settings'))}

              <SafeText variant="tiny" color="muted" style={styles.sectionLabel}>{copy.supportSection}</SafeText>
              {renderRow('Help', copy.help, copy.helpDescription, navigateToHelp)}
              <View style={styles.signOut}>{renderRow('SignOut', copy.signOut, copy.signOutDescription, () => setConfirmingSignOut(true), true)}</View>
            </View>
          )}
        </ScrollView>
      </AppBottomSheet>
      <ResidentHomeSwitcherSheet visible={residenceSwitcherVisible} onClose={closeResidenceSwitcher} />
      <PersonaSwitcherSheet visible={personaSwitcherVisible} onClose={() => setPersonaSwitcherVisible(false)} />
    </>
  );
}
