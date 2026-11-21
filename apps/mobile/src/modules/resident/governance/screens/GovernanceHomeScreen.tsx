import { useMemo } from "react";
import { View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGovernanceHome } from "../data/useGovernanceHome";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { useFeatureFlags } from "../../../../core/featureFlags/useFeatureFlag";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { ResidentInfoMosaic } from "../../../../ui/patterns/ResidentInfoMosaic";
import { SafeText } from "../../../../shared/components/SafeText";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import type { GovernanceHomeScreenProps } from "../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle3 } from "../styles/screens/GovernanceHomeScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function GovernanceHomeScreen({ navigation }: GovernanceHomeScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { isEnabled } = useFeatureFlags();
    const { data } = useGovernanceHome();
    const stats = useMemo(() => {
        return [
            { id: 'meet', label: String(localizedUiText.m_bca705b63a3c), value: data?.upcomingMeetingsCount || 0, iconName: 'calendar-outline' },
            { id: 'poll', label: String(localizedUiText.m_9c834e74d637), value: data?.activePollsCount || 0, iconName: 'bar-chart-outline' },
            { id: 'res', label: String(localizedUiText.m_78de8e0e2f07), value: data?.pendingResolutionsCount || 0, iconName: 'document-text-outline' },
            { id: 'elec', label: String(localizedUiText.m_56ac9256e35a), value: data?.activeElectionsCount || 0, iconName: 'people-outline' },
        ];
    }, [data, localizedUiText]);
    const links = [
        {
            id: 'meetings',
            title: String(localizedUiText.m_32667b8d8d7e),
            subtitle: String(localizedUiText.m_294203b2c14a),
            icon: 'calendar-outline',
            onPress: () => navigation.navigate('MeetingList'),
        },
        {
            id: 'polls',
            title: String(localizedUiText.m_b11eb723fa39),
            subtitle: String(localizedUiText.m_300afd8ddfe8),
            icon: 'bar-chart-outline',
            onPress: () => navigation.navigate('PollList'),
        },
        {
            id: 'resolutions',
            title: String(localizedUiText.m_794706028a6d),
            subtitle: String(localizedUiText.m_5699f66da690),
            icon: 'document-text-outline',
            onPress: () => navigation.navigate('ResolutionList'),
        },
    ];
    if (!isEnabled('governance')) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={localizedUiText.m_b6c68c3d97c5} showBackButton/>
        <View style={styles.unavailableContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={theme.textSecondary}/>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_5031e0f31a53}</SafeText>
          <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textSecondary)}>{localizedUiText.m_1015bb141cd1}</SafeText>
        </View>
      </View>);
    }
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_b6c68c3d97c5} subtitle={localizedUiText.m_d9cc2e9be3c8} showBackButton/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <PrivacyNoticePanel title={localizedUiText.m_bb800c7997b9} description={localizedUiText.m_cb648745ca02}/>

        
        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle4(theme.textPrimary)]}>{localizedUiText.m_5b7afabe39eb}</SafeText>
          <ResidentInfoMosaic items={stats}/>
        </View>

        
        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle5(theme.textPrimary)]}>{localizedUiText.m_59f333aff49e}</SafeText>
          <View style={styles.list}>
            {links.map((link) => (<PressableScale key={link.id} onPress={link.onPress}>
                <View style={[styles.row, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
                  <View style={[styles.iconWrap, createViewBackgroundColorStyle3(theme.accentSoft)]}>
                    <Ionicons name={link.icon as keyof typeof Ionicons.glyphMap} size={20} color={theme.accent}/>
                  </View>
                  <View style={styles.info}>
                    <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>{link.title}</SafeText>
                    <SafeText variant="caption" color="secondary">{link.subtitle}</SafeText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textSecondary}/>
                </View>
              </PressableScale>))}
          </View>
        </View>
      </ScrollView>
    </View>);
}
export default GovernanceHomeScreen;
