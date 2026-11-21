import { View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentStatusSummary } from "../../../../ui/patterns/ResidentStatusSummary";
import { SafeText } from "../../../../shared/components/SafeText";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle } from "../styles/screens/NoticeReadStatusScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function NoticeReadStatusScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const mockResidents = [
        { id: '1', label: String(localizedUiText.m_e3d196619db8), status: 'READ', isCompleted: true },
        { id: '2', label: String(localizedUiText.m_3dc9cf47d16f), status: 'UNREAD', isCompleted: false },
        { id: '3', label: String(localizedUiText.m_21cb409cc921), status: 'READ', isCompleted: true },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_7d63e041951f}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="eye-outline" size={40} color={theme.accent}/>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)} align="center">{localizedUiText.m_b44faf04390f}</SafeText>
          <SafeText variant="caption" color="muted" align="center">{localizedUiText.m_11fa84352add}</SafeText>
        </View>

        <ResidentStatusSummary title={localizedUiText.m_c01372d405c0} items={mockResidents}/>
      </ScrollView>
    </View>);
}
export default NoticeReadStatusScreen;

