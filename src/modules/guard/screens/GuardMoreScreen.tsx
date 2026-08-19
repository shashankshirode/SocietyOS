import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { resetToAppModeSelector } from "../../../core/auth/authNavigation";
import { useAuthSession } from "../../../core/auth/useAuthSession";
import { ScreenScaffold } from "../../../shared/layout/ScreenScaffold";
import { Stack } from "../../../shared/layout/Stack";
import { Box } from "../../../shared/layout/Box";
import { SectionBlock } from "../../../shared/layout/SectionBlock";
import { AppText } from "../../../shared/components/AppText";
import { AppCard } from "../../../shared/cards/AppCard";
import { ProfileMenuItem } from "../../../shared/cards/ProfileMenuItem";
import { LogoutButton } from "../../../shared/components/LogoutButton";
import type { GuardMoreScreenProps, GuardStackParamList } from "../../../app/navigation/navigation.types";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { styles, createBoxBackgroundColorBorderRadiusStyle, createAppTextColorStyle, createAppTextColorStyle2, createAppTextColorStyle3 } from "../styles/screens/GuardMoreScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function GuardMoreScreen({ navigation }: GuardMoreScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors, radius } = useAppTheme();
    const { session, logout } = useAuthSession();
    const handleNavigation = (screenName: keyof Pick<GuardStackParamList, 'StaffCheckIn' | 'OfflineQueue' | 'EmergencyAlert' | 'ShiftHandover'>) => {
        navigation.navigate(screenName);
    };
    async function handleLogout() {
        await logout();
        resetToAppModeSelector(navigation as NavigationProp<ParamListBase>);
    }
    return (<ScreenScaffold scroll edges={['top', 'bottom']} style={styles.container}>
      <Stack gap="lg">
        
        <Animated.View entering={FadeInUp.duration(400)}>
          <AppCard style={styles.summaryCard}>
            <Box alignItems="center">
              <Box px="md" py="xxs" style={createBoxBackgroundColorBorderRadiusStyle(colors.primarySoft, radius.pill)} mb="sm">
                <AppText variant="caption" style={createAppTextColorStyle(colors.primary)}>{localizedUiText.m_10a2bd06edd1}</AppText>
              </Box>
              <AppText variant="sectionTitle" style={createAppTextColorStyle2(colors.textPrimary)}>{localizedUiText.m_edde8ac83581}</AppText>
              <AppText variant="caption" style={createAppTextColorStyle3(colors.textMuted)}>
                {session?.name ?? localizedUiText.m_5354c1199901} · {session?.shiftLabel ?? localizedUiText.m_d8bc63a7a982}
              </AppText>
            </Box>
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(100).duration(450)}>
          <SectionBlock title={localizedUiText.m_029100d8b958}>
            <AppCard style={styles.appCardPaddingHorizontalPaddingVertical}>
              <ProfileMenuItem label={localizedUiText.m_6efdc5f2dedb} description={localizedUiText.m_3dff3b83dc77} iconName="staff" onPress={() => handleNavigation('StaffCheckIn')}/>
              <ProfileMenuItem label={localizedUiText.m_0141f7ae4495} description={localizedUiText.m_7db63863b847} iconName="gate" onPress={() => handleNavigation('OfflineQueue')}/>
              <ProfileMenuItem label={localizedUiText.m_f6bbc91fab3a} description={localizedUiText.m_7057a1a89472} iconName="warning" tone="danger" onPress={() => handleNavigation('EmergencyAlert')}/>
              <ProfileMenuItem label={localizedUiText.m_598512128e45} description={localizedUiText.m_2deaa6e7b80c} iconName="refresh" onPress={() => handleNavigation('ShiftHandover')} showChevron={false}/>
            </AppCard>
          </SectionBlock>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(200).duration(450)}>
          <AppCard>
            <AppText variant="cardTitle" tone="primary" style={styles.appTextFontWeightMarginBottom}>{localizedUiText.m_56ee43b499ab}</AppText>
            <AppText variant="bodySmall" tone="secondary" style={styles.appTextMarginBottom}>{localizedUiText.m_b2ccf00ff5df}</AppText>
            <LogoutButton onConfirmLogout={handleLogout}/>
          </AppCard>
        </Animated.View>
      </Stack>
    </ScreenScaffold>);
}
export default GuardMoreScreen;

