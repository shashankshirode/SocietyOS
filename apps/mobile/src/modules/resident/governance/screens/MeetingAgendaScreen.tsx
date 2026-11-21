import { ScrollView, View } from "react-native";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { useMeetingAgenda } from "../hooks/useMeetingAgenda";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle2 } from "../styles/screens/MeetingAgendaScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type MeetingAgendaProps = {
    navigation?: {
        goBack: () => void;
    };
    route?: {
        params?: {
            meetingId?: string;
        };
    };
};
export function MeetingAgendaScreen({ route }: MeetingAgendaProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { data: agenda = [], isLoading, error, refetch } = useMeetingAgenda(route?.params?.meetingId ?? '');
    if (isLoading)
        return <LoadingState message={localizedUiText.m_9dda198a023d} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_07d60ca4be2d} showBackButton/>
      <ScrollView contentContainerStyle={styles.content}>
        {agenda.length === 0 ? (<EmptyState title={localizedUiText.m_30ade868ca11} description={localizedUiText.m_5758584d3596} iconName="list-outline"/>) : agenda.map((item) => (<View key={item.id} style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
            <View style={styles.headerRow}>
              <View style={[styles.orderBadge, createViewBackgroundColorStyle2(theme.accentSoft)]}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.accent)}>{item.order}</SafeText>
              </View>
              <View style={styles.heading}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)}>{item.title}</SafeText>
                <SafeText variant="tiny" color="secondary">
                  {item.presenter} · {item.durationMinutes}{localizedUiText.m_90e63d85fa1a}</SafeText>
              </View>
              <StatusBadge label={item.status.replaceAll('_', ' ')} type={item.status === 'APPROVED' ? 'success' : 'info'}/>
            </View>
            <SafeText variant="caption" color="secondary">{item.description}</SafeText>
            {item.isOwnerOnly ? (<SafeText variant="tiny" style={createSafeTextColorStyle3(theme.warning)}>{localizedUiText.m_be3c79b21e1f}</SafeText>) : null}
          </View>))}
      </ScrollView>
    </View>);
}

