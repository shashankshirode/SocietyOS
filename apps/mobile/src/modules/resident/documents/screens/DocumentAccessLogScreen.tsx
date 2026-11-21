import { ScrollView, View } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentTimelineInsight } from "../../../../ui/patterns/ResidentTimelineInsight";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { formatResidentDateTime } from "../../../../core/localization/dateTimeFormatters";
import { useDocumentAccessLogs } from "../data/useDocumentAccessLogs";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle } from "../styles/screens/DocumentAccessLogScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type DocumentAccessLogRoute = {
    route?: {
        params?: {
            documentId?: string;
        };
    };
};
export function DocumentAccessLogScreen({ route }: DocumentAccessLogRoute) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { data: logs = [], isLoading, error, refetch } = useDocumentAccessLogs(route?.params?.documentId);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_41013b532bef} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    const logItems = logs.map((log) => ({
        id: log.id,
        title: log.action.replaceAll('_', ' '),
        description: `${log.actorName} · ${log.actorRole}${log.reason ? ` · ${log.reason}` : ''}`,
        timestamp: formatResidentDateTime(log.timestamp),
    }));
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_10f904f2852a} showBackButton/>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)} align="center">{localizedUiText.m_2e13592162d7}</SafeText>
          <SafeText variant="caption" color="muted" align="center">{localizedUiText.m_a462306e961d}</SafeText>
        </View>
        {logItems.length > 0 ? (<ResidentTimelineInsight items={logItems}/>) : (<EmptyState title={localizedUiText.m_53abd6eb19c2} description={localizedUiText.m_92adae3ab96a} iconName="shield-checkmark-outline"/>)}
      </ScrollView>
    </View>);
}
export default DocumentAccessLogScreen;

