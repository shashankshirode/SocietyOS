import { View, ScrollView } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentSecureList } from "../../../../ui/patterns/ResidentSecureList";
import { SafeText } from "../../../../shared/components/SafeText";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle } from "../styles/screens/TenantDocumentsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function TenantDocumentsScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const documents = [
        { id: 't-1', title: String(localizedUiText.m_42980826f72d), subtitle: String(localizedUiText.m_86e78191b19e), isLocked: false },
        { id: 't-2', title: String(localizedUiText.m_dce07f5d58b5), subtitle: String(localizedUiText.m_f2660378983b), isLocked: false },
        { id: 't-3', title: String(localizedUiText.m_2e70821063f1), subtitle: String(localizedUiText.m_83003d646636), isLocked: true },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_1f5c0fe9e3c1}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)} align="center">{localizedUiText.m_79f9a568cc55}</SafeText>
          <SafeText variant="caption" color="muted" align="center">{localizedUiText.m_e523108292af}</SafeText>
        </View>

        <ResidentSecureList items={documents} description={localizedUiText.m_76c8bebb4fdc}/>
      </ScrollView>
    </View>);
}
export default TenantDocumentsScreen;

