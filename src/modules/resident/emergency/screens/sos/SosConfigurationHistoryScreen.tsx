import { ScrollView, View } from "react-native";
import { SafeText } from "../../../../../shared/components/SafeText";
import { EmptyState } from "../../../../../shared/feedback/EmptyState";
import { ErrorState } from "../../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../../shared/feedback/LoadingState";
import { formatResidentDateTime } from "../../../../../core/localization/dateTimeFormatters";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { useSosResidenceContext } from "../../hooks/useSosResidenceContext";
import { useSosResponsePlans } from "../../hooks/useSosResponsePlans";
import { styles, createScrollViewBackgroundColorStyle, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle } from "../../styles/screens/sos/SosConfigurationHistoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
export function SosConfigurationHistoryScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const context = useSosResidenceContext();
    const { plans, isLoading, error, refresh } = useSosResponsePlans(context);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_1ba6d3b737f9} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refresh}/>;
    const entries = plans
        .flatMap((plan) => [
        {
            id: `${plan.id}:updated`,
            title: formatUiLiteral(String(localizedUiText.m_2715f7d802f5), [plan.sosType.replace(/([A-Z])/g, ' $1')]),
            description: formatUiLiteral(String(localizedUiText.m_489fa8194f05), [plan.mode === 'custom' ? String(localizedUiText.m_494ca78f7374) : String(localizedUiText.m_d70604e84304), plan.version]),
            timestamp: plan.updatedAt,
        },
        ...(plan.lastTestedAt ? [{
                id: `${plan.id}:tested`,
                title: formatUiLiteral(String(localizedUiText.m_8524c39f48be), [plan.sosType.replace(/([A-Z])/g, ' $1')]),
                description: String(localizedUiText.m_4325a3bb710f),
                timestamp: plan.lastTestedAt,
            }] : []),
    ])
        .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime());
    return (<ScrollView style={createScrollViewBackgroundColorStyle(colors.background)} contentContainerStyle={styles.content}>
      {entries.length === 0 ? (<EmptyState title={localizedUiText.m_86972f1d8e81} description={localizedUiText.m_f57764f68a1a} iconName="time-outline"/>) : entries.map((entry) => (<View key={entry.id} style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)}>{entry.title}</SafeText>
          <SafeText variant="caption" color="secondary">{entry.description}</SafeText>
          <SafeText variant="tiny" color="muted">{formatResidentDateTime(entry.timestamp)}</SafeText>
        </View>))}
    </ScrollView>);
}

