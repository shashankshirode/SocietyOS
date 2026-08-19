import { View, ScrollView } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentTimeline } from "../../../../ui/patterns/ResidentTimeline";
import { useComplaintTimeline } from "../hooks/useComplaintTimeline";
import { AppButton } from "../../../../shared/components/AppButton";
import { styles, createViewBackgroundColorStyle } from "../styles/screens/ComplaintTimelineScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
export function ComplaintTimelineScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { data = [], isRefreshing, refresh } = useComplaintTimeline();
    const timelineItems = data.map((event) => ({
        id: event.id,
        title: event.title,
        description: formatUiLiteral(String(localizedUiText.m_307c174a0be5), [event.actor]),
        timestamp: event.timestamp,
        iconName: 'git-commit-outline',
        status: event.status,
        statusTone: 'info' as const,
    }));
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_d52b403962aa}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ResidentTimeline items={timelineItems}/>

        <View style={styles.action}>
          <AppButton title={localizedUiText.m_dcec48258a8e} onPress={refresh} loading={isRefreshing}/>
        </View>
      </ScrollView>
    </View>);
}
export default ComplaintTimelineScreen;

