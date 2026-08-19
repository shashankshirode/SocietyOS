import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState } from "react";
import { View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { useFeatureFlags } from "../../../../core/featureFlags/useFeatureFlag";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { SafeText } from "../../../../shared/components/SafeText";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorShadowColorStyle, createSafeTextColorStyle4, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle3 } from "../styles/screens/EmergencySosScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
export function EmergencySosScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { isEnabled } = useFeatureFlags();
    const [sosFired, setSosFired] = useState(false);
    if (!isEnabled('emergencyVolunteers')) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={localizedUiText.m_8116591e7e70} showBackButton/>
        <View style={styles.unavailableContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={theme.textSecondary}/>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_5031e0f31a53}</SafeText>
          <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textSecondary)}>{localizedUiText.m_22898ed1f2aa}</SafeText>
        </View>
      </View>);
    }
    const triggerSos = () => {
        AppAlert.alert(String(localizedUiText.m_24d87333cf0e), String(localizedUiText.m_c5e71df087cf), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_9bb24d2627de),
                style: 'destructive',
                onPress: () => {
                    setSosFired(true);
                    AppAlert.alert(String(localizedUiText.m_91a909f35c34), String(localizedUiText.m_669dc70a6342));
                },
            },
        ]);
    };
    const contacts = [
        { id: 'gate', name: String(localizedUiText.m_aa1bf16130e4), number: '+91 22 2849 0100', icon: 'shield-outline' },
        { id: 'treas', name: String(localizedUiText.m_dfc1d6f2f34a), number: '+91 22 2849 0101', icon: 'business-outline' },
        { id: 'hosp', name: String(localizedUiText.m_d8aea80b91e8), number: '102', icon: 'medical-outline' },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_69871b9127e2}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.sosSection}>
          <PressableScale onPress={triggerSos}>
            <View style={[styles.sosButton, createViewBackgroundColorShadowColorStyle(theme.danger, theme.danger)]}>
              <Ionicons name="alert-circle-outline" size={48} color="#FFFFFF"/>
              <SafeText variant="bodyStrong" style={styles.safeTextColorFontWeightMarginTop}>
                {sosFired ? localizedUiText.m_826f1680e5ae : localizedUiText.m_20c991649dba}
              </SafeText>
            </View>
          </PressableScale>
          <SafeText variant="tiny" color="muted" align="center" style={styles.safeTextMarginTop}>{localizedUiText.m_c2e71e393f52}</SafeText>
        </View>

        <PrivacyNoticePanel title={localizedUiText.m_b7ce0cb3b002} description={localizedUiText.m_e053320ecb6e}/>

        
        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle4(theme.textPrimary)]}>{localizedUiText.m_b45455c32144}</SafeText>
          <View style={styles.list}>
            {contacts.map((c) => (<PressableScale key={c.id} onPress={() => AppAlert.alert(String(localizedUiText.m_978a1e579ade), formatUiLiteral(String(localizedUiText.m_d80b375c2a08), [c.name, c.number]))}>
                <View style={[styles.row, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
                  <View style={[styles.iconWrap, createViewBackgroundColorStyle3(theme.surface)]}>
                    <Ionicons name={c.icon as keyof typeof Ionicons.glyphMap} size={20} color={theme.danger}/>
                  </View>
                  <View style={styles.info}>
                    <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>{c.name}</SafeText>
                    <SafeText variant="caption" color="secondary">{c.number}</SafeText>
                  </View>
                  <Ionicons name="call-outline" size={18} color={theme.danger}/>
                </View>
              </PressableScale>))}
          </View>
        </View>
      </ScrollView>
    </View>);
}
export default EmergencySosScreen;

