import React from "react";
import { View, ScrollView } from "react-native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentProfile } from "../hooks/useResidentProfile";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import { useResponsiveLayout } from "../../../../ui/layout/useResponsiveLayout";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { useAuthSession } from "../../../../core/auth/useAuthSession";
import { resetToAppModeSelector } from "../../../../core/auth/authNavigation";
import type { ProfileStackParamList, RootTabParamList } from "../../../../app/navigation/navigation.types";
import { useResidentRoleNavigation } from "../../navigation/useResidentRoleNavigation";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../../household/components/householdComponentUtils";
import { ConfirmModal } from "../../../../ui/modal/ConfirmModal";
import { ResidentDisplayName } from "../../../../ui/typography/ResidentDisplayName";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import { useFacilities } from "../../facilityBooking/data/useFacilities";
import { styles, createSafeTextColorStyle, createResidentDisplayNameColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle3, createViewBackgroundColorStyle4, createViewBackgroundColorStyle5, createViewBackgroundColorStyle6, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorStyle7 } from "../styles/screens/ResidentProfileScreen.styles";
type ResidentProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;
type ProfileItem = {
    id: string;
    titleKey: string;
    subtitleKey: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
};
export function ResidentProfileScreen({ navigation }: ResidentProfileScreenProps) {
    const localizedUiText = useMessages().uiLiterals;
    const theme = useResidentTheme();
    const { isTablet } = useResponsiveLayout();
    const { data: resident, isLoading } = useResidentProfile();
    const { logout } = useAuthSession();
    const { activeContext } = useActiveResidentHome();
    const messages = useMessages();
    const { data: facilities = [] } = useFacilities();
    const [isLogoutModalVisible, setLogoutModalVisible] = React.useState(false);
    const [isLoggingOut, setLoggingOut] = React.useState(false);
    const { canPerformAction } = useResidentRoleNavigation();
    const tabNavigation = navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();
    const handleLogoutPress = () => {
        setLogoutModalVisible(true);
    };
    const handleCancelLogout = () => {
        if (!isLoggingOut) {
            setLogoutModalVisible(false);
        }
    };
    const handleConfirmLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            setLogoutModalVisible(false);
            resetToAppModeSelector(navigation);
        }
        finally {
            setLoggingOut(false);
        }
    };
    if (isLoading || !resident) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={localizedUiText.m_d696a35bdd18} titleKey="resident.navigation.profile.title" subtitleKey="resident.navigation.profile.subtitle" showBackButton/>
      </View>);
    }
    const items: ProfileItem[] = [
        ...(canPerformAction('familyMemberManagement')
            ? [
                {
                    id: 'household-family',
                    titleKey: 'resident.household.profile.sections.householdFamily',
                    subtitleKey: 'resident.profile.previews.householdFamily',
                    icon: 'people-circle-outline' as const,
                    onPress: () => tabNavigation?.navigate('HomeTab', { screen: 'HouseholdOverview' }),
                },
                {
                    id: 'family-access',
                    titleKey: 'resident.household.profile.sections.accessPermissions',
                    subtitleKey: 'resident.profile.previews.familyAccess',
                    icon: 'key-outline' as const,
                    onPress: () => tabNavigation?.navigate('HomeTab', { screen: 'FamilyMemberList' }),
                },
            ]
            : []),
        ...(canPerformAction('tenantOnboarding')
            ? [
                {
                    id: 'tenant-management',
                    titleKey: 'resident.household.profile.sections.tenantManagement',
                    subtitleKey: 'resident.profile.previews.tenantManagement',
                    icon: 'home-outline' as const,
                    onPress: () => tabNavigation?.navigate('HomeTab', { screen: 'TenantManagement' }),
                },
            ]
            : []),
        {
            id: 'vault',
            titleKey: 'resident.navigation.documents.title',
            subtitleKey: 'resident.profile.previews.vault',
            icon: 'file-tray-full-outline',
            onPress: () => tabNavigation?.navigate('HomeTab', { screen: 'DocumentVaultHome' }),
        },
        {
            id: 'noc',
            titleKey: 'resident.noc.listTitle',
            subtitleKey: 'resident.profile.previews.noc',
            icon: 'ribbon-outline',
            onPress: () => tabNavigation?.navigate('HomeTab', { screen: 'NocRequestList' }),
        },
        ...(facilities.length > 0
            ? [
                {
                    id: 'facilityBooking',
                    titleKey: 'resident.navigation.facilities.title',
                    subtitleKey: 'resident.profile.previews.facilities',
                    icon: 'calendar-outline' as const,
                    onPress: () => tabNavigation?.navigate('HomeTab', {
                        screen: 'FacilityStack',
                        params: {
                            screen: 'MyFacilityBookings',
                            params: { unitId: activeContext?.unitId ?? 'unit-1' },
                        },
                    }),
                },
            ]
            : []),
        {
            id: 'privacy',
            titleKey: 'resident.privacy.directoryTitle',
            subtitleKey: 'resident.profile.previews.privacy',
            icon: 'shield-checkmark-outline',
            onPress: () => tabNavigation?.navigate('HomeTab', { screen: 'ResidentConnectStack' }),
        },
        {
            id: 'settings',
            titleKey: 'resident.navigation.settings.title',
            subtitleKey: 'resident.profile.previews.settings',
            icon: 'settings-outline',
            onPress: () => navigation.navigate('Settings'),
        },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_d696a35bdd18} titleKey="resident.navigation.profile.title" subtitleKey="resident.navigation.profile.subtitle" showBackButton/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ContentFrame style={[styles.contentGrid, isTablet ? styles.tabletContentGrid : null]}>
          <View style={[styles.profileCard, isTablet ? styles.tabletProfileCard : null, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
            <View style={[styles.avatarWrap, createViewBackgroundColorStyle3(theme.accentSoft)]}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.accent)}>
                {resident.name.charAt(0)}
              </SafeText>
            </View>
            <ResidentDisplayName displayName={resident.name} variant="bodyStrong" style={createResidentDisplayNameColorStyle(theme.textPrimary)}/>
            <SafeText variant="caption" color="secondary">
              {`${t(messages, 'resident.profile.labelFlat')} ${resident.flatNumber}${t(messages, 'resident.profile.summarySeparator')}${t(messages, 'resident.profile.labelTower')} ${resident.tower}`}
            </SafeText>
            <SafeText variant="tiny" color="muted">
              {`${resident.email ? resident.email.substring(0, 3) + '***@' + resident.email.split('@')[1] : ''}${t(messages, 'resident.profile.summarySeparator')}${resident.phone ? localizedUiText.m_5ad4c4b88687 + resident.phone.substring(resident.phone.length - 4) : ''}`}
            </SafeText>

            <View style={styles.statusRail}>
              <View style={[styles.statusRailItem, createViewBackgroundColorStyle4(theme.successSoft)]}>
                <Ionicons name="checkmark-circle-outline" size={12} color={theme.success}/>
                <SafeText variant="tiny" style={createSafeTextColorStyle2(theme.success)}>
                  {t(messages, 'resident.profile.statusRail.ownerVerified')}
                </SafeText>
              </View>
              <View style={[styles.statusRailItem, createViewBackgroundColorStyle5(theme.accentSoft)]}>
                <Ionicons name="people-outline" size={12} color={theme.accent}/>
                <SafeText variant="tiny" style={createSafeTextColorStyle3(theme.accent)}>
                  {t(messages, 'resident.profile.statusRail.familyCount')}
                </SafeText>
              </View>
              <View style={[styles.statusRailItem, createViewBackgroundColorStyle6(theme.warningSoft)]}>
                <Ionicons name="shield-checkmark-outline" size={12} color={theme.warning}/>
                <SafeText variant="tiny" style={createSafeTextColorStyle4(theme.warning)}>
                  {t(messages, 'resident.profile.statusRail.documentStatus')}
                </SafeText>
              </View>
            </View>
          </View>

          <View style={[styles.sidePanel, isTablet ? styles.tabletSidePanel : null]}>
            <View style={styles.list}>
              {items.map((item) => (<PressableScale key={item.id} onPress={item.onPress}>
                  <View style={[styles.row, createViewBackgroundColorBorderColorStyle2(theme.surface, theme.border)]}>
                    <View style={[styles.iconWrap, createViewBackgroundColorStyle7(theme.accentSoft)]}>
                      <Ionicons name={item.icon} size={20} color={theme.accent}/>
                    </View>
                    <View style={styles.info}>
                      <SafeText variant="bodyStrong" style={createSafeTextColorStyle5(theme.textPrimary)}>{t(messages, item.titleKey)}</SafeText>
                      <SafeText variant="caption" color="secondary">{t(messages, item.subtitleKey)}</SafeText>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={theme.textSecondary}/>
                  </View>
                </PressableScale>))}
            </View>

            <View style={styles.logout}>
              <AppButton title={t(messages, 'resident.profile.logout')} variant="secondary" onPress={handleLogoutPress} iconLeft={<Ionicons name="log-out-outline" size={18} color={theme.accent}/>}/>
            </View>
          </View>
        </ContentFrame>
      </ScrollView>
      <ConfirmModal visible={isLogoutModalVisible} title={t(messages, 'resident.profile.confirmLogoutTitle')} message={t(messages, 'resident.profile.confirmLogoutMessage')} confirmLabel={t(messages, 'resident.profile.confirmLogoutAction')} cancelLabel={t(messages, 'resident.profile.cancelLogoutAction')} tone="danger" loading={isLoggingOut} onConfirm={handleConfirmLogout} onCancel={handleCancelLogout}/>
    </View>);
}
export default ResidentProfileScreen;
