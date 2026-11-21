import { View, ScrollView } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentTimeline } from "../../../../ui/patterns/ResidentTimeline";
import { SafeText } from "../../../../shared/components/SafeText";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle } from "../styles/screens/DocumentVersionHistoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function DocumentVersionHistoryScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const versions = [
        {
            id: 'v-2',
            title: String(localizedUiText.m_0087aa84daca),
            description: String(localizedUiText.m_066d4aa04509),
            timestamp: 'Today, 10:15 AM',
            iconName: 'document-text-outline',
            status: 'VERIFIED',
            statusTone: 'success' as const,
        },
        {
            id: 'v-1',
            title: String(localizedUiText.m_a2118846eb29),
            description: String(localizedUiText.m_00f75dc5db1b),
            timestamp: '1 Year ago',
            iconName: 'archive-outline',
            status: 'EXPIRED',
            statusTone: 'muted' as const,
        },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_2eba52c01705}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)} align="center">{localizedUiText.m_e89f92d2c3c8}</SafeText>
          <SafeText variant="caption" color="muted" align="center">{localizedUiText.m_20430099ed38}</SafeText>
        </View>

        <ResidentTimeline items={versions}/>
      </ScrollView>
    </View>);
}
export default DocumentVersionHistoryScreen;

