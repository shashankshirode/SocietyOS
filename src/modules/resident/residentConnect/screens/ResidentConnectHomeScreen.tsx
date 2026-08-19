import { useMemo } from "react";
import { View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentConnectHome } from "../data/useResidentConnectHome";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { useFeatureFlags } from "../../../../core/featureFlags/useFeatureFlag";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { ResidentInfoMosaic } from "../../../../ui/patterns/ResidentInfoMosaic";
import { SafeText } from "../../../../shared/components/SafeText";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import type { ResidentConnectHomeScreenProps } from "../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle3 } from "../styles/screens/ResidentConnectHomeScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ResidentConnectHomeScreen({ navigation }: ResidentConnectHomeScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { isEnabled } = useFeatureFlags();
    const { data } = useResidentConnectHome();
    const stats = useMemo(() => {
        return [
            { id: 'chats', label: String(localizedUiText.m_bd59a6157e63), value: data?.activeChatsCount || 0, iconName: 'chatbubbles-outline' },
            { id: 'incoming', label: String(localizedUiText.m_5681118013c3), value: data?.pendingIncomingCount || 0, iconName: 'download-outline' },
            { id: 'outgoing', label: String(localizedUiText.m_128387839c5b), value: data?.pendingOutgoingCount || 0, iconName: 'paper-plane-outline' },
        ];
    }, [data, localizedUiText]);
    const links = [
        {
            id: 'dir',
            title: String(localizedUiText.m_acb2d231d94a),
            subtitle: String(localizedUiText.m_c93923078eba),
            icon: 'people-outline',
            onPress: () => navigation.navigate('ResidentDirectory'),
        },
        {
            id: 'threads',
            title: String(localizedUiText.m_9bfcca9bc934),
            subtitle: String(localizedUiText.m_a6b9055ad5fa),
            icon: 'chatbubble-ellipses-outline',
            onPress: () => navigation.navigate('ChatThreadList'),
        },
        {
            id: 'reqs',
            title: String(localizedUiText.m_c34f16ffb8aa),
            subtitle: String(localizedUiText.m_5f50a7acb539),
            icon: 'key-outline',
            onPress: () => navigation.navigate('IncomingContactRequests'),
        },
    ];
    if (!isEnabled('publicResidentDirectory')) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={localizedUiText.m_4c20f72beb96} showBackButton/>
        <View style={styles.unavailableContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={theme.textSecondary}/>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_5031e0f31a53}</SafeText>
          <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textSecondary)}>{localizedUiText.m_cc54a8edba0c}</SafeText>
        </View>
      </View>);
    }
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_4c20f72beb96} subtitle={localizedUiText.m_fb02e307a7d5} showBackButton/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <PrivacyNoticePanel title={localizedUiText.m_f40eeb566489} description={localizedUiText.m_d91e252b0224}/>

        
        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle4(theme.textPrimary)]}>{localizedUiText.m_e0b0c18c7e84}</SafeText>
          <ResidentInfoMosaic items={stats}/>
        </View>

        
        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle5(theme.textPrimary)]}>{localizedUiText.m_70713c24d192}</SafeText>
          <View style={styles.list}>
            {links.map((link) => (<PressableScale key={link.id} onPress={link.onPress}>
                <View style={[styles.row, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
                  <View style={[styles.iconWrap, createViewBackgroundColorStyle3(theme.accentSoft)]}>
                    <Ionicons name={link.icon as keyof typeof Ionicons.glyphMap} size={22} color={theme.accent}/>
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
export default ResidentConnectHomeScreen;
