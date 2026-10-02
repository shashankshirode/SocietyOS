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
import { useMessages } from '../../../shared/constants/useMessages';
import { getActiveUiLiteral } from '../../../shared/localization/activeUiLiteral';
import { includeWhenPresent } from '../../../shared/utils/presentProperty';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SocietyAdminStackParamList } from '../../../app/navigation/navigation.types';
import { resetToAppModeSelector } from '../../../core/auth/authNavigation';

export function SocietyAdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userRole, logout, session } = useAuth();
  const { currentSociety } = useSociety();
  const { colors } = useAppTheme();
  const localizedUiText = useMessages().uiLiterals;

  if (!isAuthenticated || !['SOCIETY_ADMIN', 'CHAIRPERSON', 'SECRETARY', 'TREASURER', 'COMMITTEE_MEMBER'].includes(userRole ?? '')) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <RoleAwareAppHeader
        role="SOCIETY_ADMIN"
        title={currentSociety?.name ?? 'Society Admin'}
        subtitle={currentSociety ? `${currentSociety.city}, ${currentSociety.state}` : 'Society Command Center'}
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

interface SocietyAdminDashboardScreenProps {
  navigation: NativeStackNavigationProp<SocietyAdminStackParamList, 'SocietyAdminHome'>;
}

export function SocietyAdminDashboardScreen({ navigation }: SocietyAdminDashboardScreenProps) {
  const { colors } = useAppTheme();
  const localizedUiText = useMessages().uiLiterals;
  const messages = useMessages();

  return (
    <CommandCenter
      role="SOCIETY_ADMIN"
      title={localizedUiText.m_edde8ac83581}
      subtitle={localizedUiText.m_2c2b2a5feee9}
      contextItems={['Society Command Center', '300 units']}
      metrics={[
        { icon: 'building', label: String(localizedUiText.m_8528f505986d), value: 300, detail: getActiveUiLiteral("m_6c410b675c3f") },
        { icon: 'home', label: String(localizedUiText.m_da29f101d102), value: 280, detail: getActiveUiLiteral("m_475ff542c910") },
        { icon: 'check', label: String(localizedUiText.m_495aae902643), value: 4, detail: getActiveUiLiteral("m_702cc1785384") },
        { icon: 'complaint', label: String(localizedUiText.m_0a1b99717093), value: 9, detail: getActiveUiLiteral("m_b132f0780042") },
      ]}
      actions={[
        { id: 'department-chat', icon: 'support', label: messages.department.chat.actions.officeTitle, description: messages.department.chat.actions.officeDescription, onPress: () => navigation.navigate('DepartmentChat', { screen: 'DepartmentInbox', params: { channelId: 'society-gv-societyOffice' } }) },
        { id: 'staff-channels', icon: 'staff', label: messages.staff.registration.manageTitle, description: messages.staff.registration.manageDescription, onPress: () => navigation.navigate('StaffAttendanceStack', { screen: 'StaffAttendanceHome' }) },
        { id: 'profile', icon: 'profile', label: String(localizedUiText.m_35a900ba68e9), description: String(localizedUiText.m_868aa5f3af54), onPress: () => navigation.navigate('AdminProfile') },
        { id: 'unit', icon: 'building', label: String(localizedUiText.m_199c39763358), description: String(localizedUiText.m_ce4ff54acf65), onPress: () => navigation.navigate('UnitMaster') },
        { id: 'setup', icon: 'unit', label: String(localizedUiText.m_32428ea2bec2), description: String(localizedUiText.m_335e42ca5c8b), onPress: () => navigation.navigate('SocietySetupSummary') },
        { id: 'residents', icon: 'users', label: String(localizedUiText.m_70761c1912c0), description: String(localizedUiText.m_c92294c91c01), onPress: () => navigation.navigate('ResidentDirectory') },
        { id: 'add-resident', icon: 'person-add', label: 'Add Resident', description: 'Create new resident registration', onPress: () => navigation.navigate('AddResident') },
        { id: 'move-out', icon: 'exit', label: 'Move-Out', description: 'Manage move-out requests', onPress: () => navigation.navigate('MoveOutList') },
        { id: 'approvals', icon: 'check', label: String(localizedUiText.m_c1a070e0a89b), description: String(localizedUiText.m_5efc5b5ea4c6), badge: 'REVIEW', onPress: () => navigation.navigate('ResidentApprovalQueue') },
        { id: 'notice', icon: 'notice', label: String(localizedUiText.m_1c072121e16f), description: String(localizedUiText.m_206ec6dd4458), onPress: () => navigation.navigate('NoticeControl') },
        { id: 'complaints', icon: 'complaint', label: String(localizedUiText.m_17218d5840d0), description: String(localizedUiText.m_a4a477449a6b), onPress: () => navigation.navigate('ComplaintControl') },
        { id: 'audit', icon: 'audit', label: String(localizedUiText.m_5428d7fe5929), description: String(localizedUiText.m_f11c064e5d99), onPress: () => navigation.navigate('AdminAuditLog') },
        { id: 'flags', icon: 'settings', label: String(localizedUiText.m_c60c04dc77f9), description: String(localizedUiText.m_0681e481a414), onPress: () => navigation.navigate('FeatureConfiguration') },
        { id: 'logout', icon: 'logout', label: String(localizedUiText.m_9d0310dc0c7e), description: String(localizedUiText.m_f9321cf4f7d0), onPress: () => resetToAppModeSelector(navigation) },
      ]}
      feedTitle="Urgent admin work"
      feedItems={[
        { id: 'tenant-signup', title: String(localizedUiText.m_b62fad3c6d17), subtitle: String(localizedUiText.m_ab9aa1d3be5c), status: 'PENDING', statusTone: 'warning' },
        { id: 'complaint-sla', title: String(localizedUiText.m_41f3737f1ea7), subtitle: String(localizedUiText.m_88eb8e327a8c), status: '9 OPEN', statusTone: 'danger' },
      ]}
      testID="admin-command-center"
    />
  );
}