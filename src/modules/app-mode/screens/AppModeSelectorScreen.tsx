import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useAuthSession } from "../../../core/auth/useAuthSession";
import type { AppModeStackParamList, RootStackParamList } from "../../../app/navigation/navigation.types";
import { ScreenScaffold } from "../../../shared/layout/ScreenScaffold";
import { Stack } from "../../../shared/layout/Stack";
import { Box } from "../../../shared/layout/Box";
import { AppText } from "../../../shared/components/AppText";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppIconBubble } from "../../../shared/icons/AppIconBubble";
import { ResponsiveGrid } from "../../../shared/layout/ResponsiveGrid";
import type { AppIconName } from "../../../shared/icons/icon.types";
import { styles, createAppTextColorStyle, createAppTextColorStyle2, createAppTextColorStyle3, createAppTextColorStyle4, createAppTextColorStyle5 } from "../styles/screens/AppModeSelectorScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function AppModeSelectorScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { startMockSessionForRoute } = useAuthSession();
    const navigation = useNavigation<NativeStackNavigationProp<AppModeStackParamList>>();
    const handleSelectMode = async (mode: keyof RootStackParamList) => {
        if (mode !== 'ResidentApp')
            await startMockSessionForRoute(mode);
        navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.reset({
            index: 0,
            routes: [{ name: mode }],
        });
    };
    const modes: {
        name: keyof RootStackParamList;
        title: string;
        description: string;
        icon: AppIconName;
        color: string;
        bgColor: string;
    }[] = [
        {
            name: 'ResidentApp',
            title: String(localizedUiText.m_1c027aeecfa8),
            description: String(localizedUiText.m_495e13ae2b3d),
            icon: 'home',
            color: colors.primary,
            bgColor: colors.primarySoft,
        },
        {
            name: 'GuardApp',
            title: String(localizedUiText.m_02ab0a462c44),
            description: String(localizedUiText.m_bc3b7a8cd0d8),
            icon: 'guard',
            color: colors.guard || '#0F766E',
            bgColor: `${colors.guard || '#0F766E'}15`,
        },
        {
            name: 'FacilityManagerApp',
            title: String(localizedUiText.m_4a8d62d44425),
            description: String(localizedUiText.m_09b2d5d95f7d),
            icon: 'facility',
            color: colors.facility || '#2563EB',
            bgColor: `${colors.facility || '#2563EB'}15`,
        },
        {
            name: 'SocietyAdminApp',
            title: String(localizedUiText.m_9afa86a9b9b7),
            description: String(localizedUiText.m_272a8fb26ed0),
            icon: 'admin',
            color: colors.admin || '#7C3AED',
            bgColor: `${colors.admin || '#7C3AED'}15`,
        },
        {
            name: 'TreasurerApp',
            title: String(localizedUiText.m_2b1738725852),
            description: String(localizedUiText.m_6314a1858307),
            icon: 'treasurer',
            color: colors.treasurer || '#B45309',
            bgColor: `${colors.treasurer || '#B45309'}15`,
        },
    ];
    return (<ScreenScaffold scroll edges={['top', 'bottom']} style={styles.container}>
      <Stack gap="xl">
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <AppText variant="displayMedium" style={[styles.brandTitle, createAppTextColorStyle2(colors.primary)]}>{localizedUiText.m_3b9e6a63dc72}</AppText>
          <AppText variant="screenSubtitle" style={createAppTextColorStyle(colors.textSecondary)}>{localizedUiText.m_8cc873d5ca4c}</AppText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <ResponsiveGrid columnsPhone={1} columnsTablet={2} gap={16}>
            {modes.map((mode) => (<AppCard key={mode.name} pressable onPress={() => handleSelectMode(mode.name)} style={styles.modeCard}>
                <Box alignItems="center" style={styles.boxWidth}>
                  <AppIconBubble name={mode.icon} size={60} iconSize={28} color={mode.color} backgroundColor={mode.bgColor}/>
                  <AppText variant="sectionTitle" style={[styles.modeTitle, createAppTextColorStyle3(colors.textPrimary)]}>
                    {mode.title}
                  </AppText>
                  <AppText variant="bodySmall" style={[styles.modeDesc, createAppTextColorStyle4(colors.textSecondary)]}>
                    {mode.description}
                  </AppText>
                </Box>
              </AppCard>))}
          </ResponsiveGrid>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.footer}>
          <AppText variant="caption" style={[styles.footerText, createAppTextColorStyle5(colors.textMuted)]}>{localizedUiText.m_fe6a819a8ef4}</AppText>
        </Animated.View>
      </Stack>
    </ScreenScaffold>);
}
