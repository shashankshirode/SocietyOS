import { View, ScrollView } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentSecureList } from "../../../../ui/patterns/ResidentSecureList";
import { SafeText } from "../../../../shared/components/SafeText";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle } from "../styles/screens/MoveOutDocumentsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function MoveOutDocumentsScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const documents = [
        { id: 'mo-1', title: String(localizedUiText.m_9835748614a6), subtitle: String(localizedUiText.m_d247ce5e8403), isLocked: true },
        { id: 'mo-2', title: String(localizedUiText.m_e97dd9537b87), subtitle: String(localizedUiText.m_4f7838402f37), isLocked: false },
        { id: 'mo-3', title: String(localizedUiText.m_c2c017e4016c), subtitle: String(localizedUiText.m_331551b0de41), isLocked: true },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_b84361d0db2e}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)} align="center">{localizedUiText.m_e899c165cfb1}</SafeText>
          <SafeText variant="caption" color="muted" align="center">{localizedUiText.m_a46491f389ee}</SafeText>
        </View>

        <ResidentSecureList items={documents} description={localizedUiText.m_a9dfac802103}/>
      </ScrollView>
    </View>);
}
export default MoveOutDocumentsScreen;

