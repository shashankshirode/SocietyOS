import { View, ScrollView } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentSecureList } from "../../../../ui/patterns/ResidentSecureList";
import { SafeText } from "../../../../shared/components/SafeText";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle } from "../styles/screens/MoveInDocumentsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function MoveInDocumentsScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const documents = [
        { id: 'mi-1', title: String(localizedUiText.m_a22e2db4f131), subtitle: String(localizedUiText.m_aa93086b5896), isLocked: false },
        { id: 'mi-2', title: String(localizedUiText.m_b9c4399cae6b), subtitle: String(localizedUiText.m_69dec78bb8ce), isLocked: false },
        { id: 'mi-3', title: String(localizedUiText.m_c80e4acb81d6), subtitle: String(localizedUiText.m_77491f372956), isLocked: true },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_7bf827709fad}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)} align="center">{localizedUiText.m_bcd2b005579d}</SafeText>
          <SafeText variant="caption" color="muted" align="center">{localizedUiText.m_e6c253a0242a}</SafeText>
        </View>

        <ResidentSecureList items={documents} description={localizedUiText.m_8ebe892634a1}/>
      </ScrollView>
    </View>);
}
export default MoveInDocumentsScreen;

