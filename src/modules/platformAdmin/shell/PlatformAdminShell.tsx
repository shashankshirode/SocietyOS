import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RoleAwareAppHeader } from '../../../app/navigation/RoleAwareAppHeader';
import { CommandCenter } from '../../../ui/patterns/CommandCenter';
import { ScreenScaffold } from '../../../shared/layout/ScreenScaffold';
import { useAuth } from '../../../core/auth/AuthProvider';
import { useSociety } from '../../../core/auth/SocietyProvider';
import { AppButton } from '../../../shared/components/AppButton';
import { AppIcon } from '../../../shared/icons/AppIcon';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { formatUiLiteral } from '../../../shared/localization/formatUiLiteral';
import { getActiveUiLiteral } from '../../../shared/localization/activeUiLiteral';
import { includeWhenPresent } from '../../../shared/utils/presentProperty';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';

export function PlatformAdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userRole, logout, session } = useAuth();
  const { currentSociety } = useSociety();
  const { colors } = useAppTheme();
  const localizedUiText = useGeneratedUiMessages().uiLiterals;

  if (!isAuthenticated || userRole !== 'SUPER_ADMIN') {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <RoleAwareAppHeader
        role="SUPER_ADMIN"
        title="Platform Admin"
        subtitle={currentSociety ? `Society: ${currentSociety.name}` : 'Platform Overview'}
      />
      <ScreenScaffold style={styles.content}>
        {children}
      </ScreenScaffold>
      <View style={styles.footer}>
        <AppButton
          title={localizedUiText.m_9d0310dc0c7e}
          onPress={handleLogout}
          variant="outline"
          size="md"
          iconLeft={<AppIcon name="logout" size={18} color={colors.primary} />}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  footer: { padding: 16, borderTopWidth: 1, borderColor: '#E5E7EB' },
});

interface PlatformAdminDashboardScreenProps {
  navigation: NativeStackNavigationProp<SuperAdminStackParamList, 'SuperAdminHome'>;
}

export function PlatformAdminDashboardScreen({ navigation }: PlatformAdminDashboardScreenProps) {
  const { colors } = useAppTheme();
  const localizedUiText = useGeneratedUiMessages().uiLiterals;

  const mockData = {
    currentAdmin: { name: 'SuperAdmin' },
    platformName: 'Society OS Platform',
    activeSocieties: 12,
    onboardingSocieties: 3,
    openSupportTickets: 5,
    criticalAlerts: 2,
  };

  return (
    <CommandCenter
      role="SUPER_ADMIN"
      title={localizedUiText.m_59011ae626a4}
      subtitle={formatUiLiteral(localizedUiText.m_d1fb3b681b63, [mockData.currentAdmin.name])}
      contextItems={[mockData.platformName, `${mockData.activeSocieties} societies`, `${mockData.openSupportTickets} tickets`]}
      metrics={[
        { icon: 'building', label: String(localizedUiText.m_97d04342608b), value: mockData.activeSocieties, detail: getActiveUiLiteral("m_c5aede3e6faa") },
        { icon: 'add', label: String(localizedUiText.m_a2198f472ce2), value: mockData.onboardingSocieties, detail: getActiveUiLiteral("m_64c6314ef551") },
        { icon: 'support', label: String(localizedUiText.m_fb8fb2a2745d), value: mockData.openSupportTickets, detail: getActiveUiLiteral("m_86fb8488c671") },
        { icon: 'warning', label: String(localizedUiText.m_b5c9bf80e506), value: mockData.criticalAlerts, detail: getActiveUiLiteral("m_db1cae99279b") },
      ]}
      actions={[
        { id: 'platform', icon: 'audit', label: String(localizedUiText.m_27d17a1cb51b), description: String(localizedUiText.m_c063bd5cf47d), onPress: () => navigation.navigate('PlatformDashboard') },
        { id: 'directory', icon: 'building', label: String(localizedUiText.m_acb2d231d94a), description: String(localizedUiText.m_802092ee9450), onPress: () => navigation.navigate('SocietyDirectory') },
        { id: 'onboard', icon: 'add', label: String(localizedUiText.m_54f5e6613f85), description: String(localizedUiText.m_99cd5b8d1226), onPress: () => navigation.navigate('SocietyOnboarding') },
        { id: 'flags', icon: 'settings', label: String(localizedUiText.m_c60c04dc77f9), description: String(localizedUiText.m_0f80eca88649), onPress: () => navigation.navigate('FeatureFlagManagement') },
        { id: 'support', icon: 'support', label: String(localizedUiText.m_bc5ea409794b), description: String(localizedUiText.m_07124e99ceeb), badge: mockData.openSupportTickets > 0 ? 'OPEN' : '', onPress: () => navigation.navigate('SupportConsole') },
        { id: 'lookup', icon: 'search', label: String(localizedUiText.m_a206732601a4), description: String(localizedUiText.m_0058a3162c8e), onPress: () => navigation.navigate('PlatformUserLookup') },
        { id: 'alerts', icon: 'warning', label: String(localizedUiText.m_56de8fa8e7f6), description: String(localizedUiText.m_648ace464d71), badge: mockData.criticalAlerts > 0 ? 'ALERT' : '', onPress: () => navigation.navigate('OperationalAlerts') },
        { id: 'audit', icon: 'audit', label: String(localizedUiText.m_6dc67772f004), description: String(localizedUiText.m_320f469c65c6), onPress: () => navigation.navigate('PlatformAuditLog') },
        { id: 'settings', icon: 'settings', label: String(localizedUiText.m_b18b122ea1b3), description: String(localizedUiText.m_70176d25b99c), onPress: () => navigation.navigate('PlatformSettings') },
        { id: 'blueprint', icon: 'check', label: String(localizedUiText.m_5a5997709e54), description: String(localizedUiText.m_29d4e046e2b5), onPress: () => navigation.navigate('BlueprintFeatureCoverage') },
      ]}
      feedTitle="Platform watchlist"
      feedItems={[
        { id: 'critical-alerts', title: String(localizedUiText.m_68600cfa7124), subtitle: formatUiLiteral(String(localizedUiText.m_bc3c7ec404db), [mockData.criticalAlerts]), status: 'ALERT', statusTone: 'danger' },
        { id: 'support-tickets', title: String(localizedUiText.m_1fceb2ce4985), subtitle: formatUiLiteral(String(localizedUiText.m_8e64c29bab3f), [mockData.openSupportTickets]), status: 'SUPPORT', statusTone: 'warning' },
      ]}
      testID="super-admin-command-center"
    />
  );
}