import { useMemo } from "react";
import { View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useInterFlatHome } from "../../data/useInterFlatHome";
import { useResidentTheme } from "../../../../../ui/foundation/residentTheme";
import { useFeatureFlags } from "../../../../../core/featureFlags/useFeatureFlag";
import { ResidentPageHeader } from "../../../../../ui/patterns/ResidentPageHeader";
import { PrivacyNoticePanel } from "../../../../../ui/patterns/PrivacyNoticePanel";
import { ResidentInfoMosaic } from "../../../../../ui/patterns/ResidentInfoMosaic";
import { SafeText } from "../../../../../shared/components/SafeText";
import { PressableScale } from "../../../../../shared/motion/PressableScale";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle3 } from "../../styles/screens/interFlat_screens/InterFlatHomeScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function InterFlatHomeScreen({ navigation }: InterFlatScreenProps<'InterFlatHome'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { isEnabled } = useFeatureFlags();
    const { data } = useInterFlatHome();
    const info = useMemo(() => data || {
        societyName: 'Green Valley Heights',
        myOpenIssuesCount: 3,
        awaitingMyResponseCount: 1,
        pendingRuleAcknowledgementsCount: 2,
    }, [data]);
    const stats = useMemo(() => {
        return [
            { id: 'open', label: String(localizedUiText.m_c262ec7dea92), value: info.myOpenIssuesCount, iconName: 'chatbubble-ellipses-outline' },
            { id: 'await', label: String(localizedUiText.m_b6d58de9f2ba), value: info.awaitingMyResponseCount, iconName: 'alert-circle-outline' },
            { id: 'rules', label: String(localizedUiText.m_2c88970337cb), value: info.pendingRuleAcknowledgementsCount, iconName: 'document-text-outline' },
        ];
    }, [info, localizedUiText]);
    const links = [
        {
            id: 'issues',
            title: String(localizedUiText.m_90c573dd2c6f),
            subtitle: String(localizedUiText.m_c46a05499731),
            icon: 'people-outline' as const,
            onPress: () => navigation.navigate('MyInterFlatIssues'),
        },
        {
            id: 'rules',
            title: String(localizedUiText.m_345ddc055ce3),
            subtitle: String(localizedUiText.m_f09b133ae2a7),
            icon: 'library-outline' as const,
            onPress: () => navigation.navigate('RuleLibrary'),
        },
        {
            id: 'new',
            title: String(localizedUiText.m_aeafb7f7d409),
            subtitle: String(localizedUiText.m_87eefeee2f01),
            icon: 'add-circle-outline' as const,
            onPress: () => navigation.navigate('IssueTypeSelection'),
        },
    ];
    if (!isEnabled('interFlatIssues')) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={localizedUiText.m_767331fd40eb} showBackButton/>
        <View style={styles.unavailableContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={theme.textSecondary}/>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_5031e0f31a53}</SafeText>
          <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textSecondary)}>{localizedUiText.m_8baca42ef33a}</SafeText>
        </View>
      </View>);
    }
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_767331fd40eb} subtitle={localizedUiText.m_f3c3c5686d3a} showBackButton/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PrivacyNoticePanel title={localizedUiText.m_ee3711a4c0be} description={localizedUiText.m_7d0bf12ea137}/>

        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle4(theme.textPrimary)]}>{localizedUiText.m_2c188cde6b9c}</SafeText>
          <ResidentInfoMosaic items={stats}/>
        </View>

        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle5(theme.textPrimary)]}>{localizedUiText.m_179400317a39}</SafeText>
          <View style={styles.list}>
            {links.map((link) => (<PressableScale key={link.id} onPress={link.onPress}>
                <View style={[styles.row, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
                  <View style={[styles.iconWrap, createViewBackgroundColorStyle3(theme.accentSoft)]}>
                    <Ionicons name={link.icon} size={20} color={theme.accent}/>
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
export default InterFlatHomeScreen;
