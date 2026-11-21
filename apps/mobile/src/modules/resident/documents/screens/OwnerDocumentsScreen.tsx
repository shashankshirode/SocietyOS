import { View, ScrollView } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentSecureList } from "../../../../ui/patterns/ResidentSecureList";
import { SafeText } from "../../../../shared/components/SafeText";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle } from "../styles/screens/OwnerDocumentsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function OwnerDocumentsScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const documents = [
        { id: 'o-1', title: String(localizedUiText.m_d6332ed7b9fb), subtitle: String(localizedUiText.m_9ab2800ba869), isLocked: false },
        { id: 'o-2', title: String(localizedUiText.m_86191ab2e3fd), subtitle: String(localizedUiText.m_47747e8aade0), isLocked: false },
        { id: 'o-3', title: String(localizedUiText.m_df6c2332e780), subtitle: String(localizedUiText.m_5010be794e98), isLocked: true },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_6d66521dec6c}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)} align="center">{localizedUiText.m_4a180a9ea4a5}</SafeText>
          <SafeText variant="caption" color="muted" align="center">{localizedUiText.m_9c6b925a1876}</SafeText>
        </View>

        <ResidentSecureList items={documents} description={localizedUiText.m_d46dc69b191c}/>
      </ScrollView>
    </View>);
}
export default OwnerDocumentsScreen;

