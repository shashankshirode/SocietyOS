import { View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle } from "../styles/screens/PrivateComplaintPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
export function PrivateComplaintPlaceholderScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_e73d55170afc}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="eye-off-outline" size={48} color={theme.accent}/>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)} align="center">{localizedUiText.m_371e012b81d8}</SafeText>
          <SafeText variant="caption" color="secondary" align="center">{localizedUiText.m_4681c9493a4d}</SafeText>
        </View>

        <PrivacyNoticePanel title={localizedUiText.m_97fa0e0db0fa} description={localizedUiText.m_3946b1702ffb} points={[
            getActiveUiLiteral("m_93f50f043141"),
            getActiveUiLiteral("m_bd850f6622f1"),
            getActiveUiLiteral("m_8f34ad2a1875"),
        ]}/>

        <View style={styles.action}>
          <AppButton title={localizedUiText.m_dba374edce89} onPress={() => navigation.navigate('CreateComplaint')} iconLeft={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF"/>}/>
        </View>
      </ScrollView>
    </View>);
}
export default PrivateComplaintPlaceholderScreen;

