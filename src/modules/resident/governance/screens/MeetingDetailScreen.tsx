import { View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMeetingDetail } from "../data/useMeetingDetail";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { StatusPill } from "../../../../ui/components/StatusPill";
import type { MeetingDetailScreenProps } from "../../../../app/navigation/navigation.types";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle3, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorStyle4, createViewWidthBackgroundColorStyle } from "../styles/screens/MeetingDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function MeetingDetailScreen({ navigation, route }: MeetingDetailScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { meetingId } = route.params;
    const { data: meeting, isLoading } = useMeetingDetail(meetingId);
    if (isLoading || !meeting) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={localizedUiText.m_0337c71d5ccc}/>
      </View>);
    }
    const quorumPercent = meeting.totalMembers > 0 ? Math.round(((meeting.presentCount + meeting.proxyCount) / meeting.totalMembers) * 100) : 0;
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_0337c71d5ccc}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
          <View style={styles.headerRow}>
            <StatusPill label={meeting.meetingType} tone="info" small/>
            <StatusPill label={meeting.status} tone={meeting.status === 'SCHEDULED' ? 'warning' : 'success'} small/>
          </View>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
            {meeting.title}
          </SafeText>
          <SafeText variant="caption" color="secondary">{localizedUiText.m_2097ae1207af}{meeting.organizer}
          </SafeText>

          <View style={[styles.divider, createViewBackgroundColorStyle3(theme.border)]}/>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color={theme.accent}/>
              <SafeText variant="tiny" color="secondary">{formatResidentDate(meeting.scheduledDate)} • {meeting.scheduledTime}</SafeText>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color={theme.accent}/>
              <SafeText variant="tiny" color="secondary">{meeting.venue}</SafeText>
            </View>
          </View>
        </View>

        
        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)}>{localizedUiText.m_ade527dbf973}</SafeText>
          <View style={[styles.card, createViewBackgroundColorBorderColorStyle2(theme.surface, theme.border)]}>
            <View style={styles.quorumHeader}>
              <SafeText variant="caption" style={createSafeTextColorStyle3(theme.textPrimary)}>{localizedUiText.m_c917c6f52551}{quorumPercent}%
              </SafeText>
              <SafeText variant="tiny" color="muted">{localizedUiText.m_5de693b9430f}{meeting.quorumRequired}%
              </SafeText>
            </View>

            <View style={[styles.progressBg, createViewBackgroundColorStyle4(theme.border)]}>
              <View style={[styles.progressFill, createViewWidthBackgroundColorStyle(`${Math.min(quorumPercent, 100)}%`, theme.accent)]}/>
            </View>

            <SafeText variant="tiny" color="muted">{localizedUiText.m_b979e4b21faf}{meeting.confirmedCount}{" " + localizedUiText.m_b738f38fbac9 + " "}{meeting.presentCount}{" " + localizedUiText.m_dcc449773735 + " "}{meeting.proxyCount}
            </SafeText>
          </View>
        </View>

        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle4(theme.textPrimary)}>{localizedUiText.m_a7814719e6ca}</SafeText>
          <SafeText variant="caption" color="secondary">
            {meeting.description}
          </SafeText>
        </View>

        <View style={styles.action}>
          <AppButton title={localizedUiText.m_2e290853a7e5} variant="outline" onPress={() => navigation.navigate('MeetingAgenda', { meetingId })}/>
          {meeting.status === 'SCHEDULED' && (<AppButton title={localizedUiText.m_68d29da4d493} onPress={() => navigation.navigate('MeetingRsvp', { meetingId })} iconLeft={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF"/>}/>)}
          <AppButton title={localizedUiText.m_9b83942821bc} variant="ghost" onPress={() => navigation.navigate('QuestionSubmission', { meetingId })}/>
          {meeting.hasMinutes ? (<AppButton title={localizedUiText.m_3214437c9e16} variant="ghost" onPress={() => navigation.navigate('MeetingMinutesDetail', { meetingId })}/>) : null}
        </View>
      </ScrollView>
    </View>);
}
export default MeetingDetailScreen;

