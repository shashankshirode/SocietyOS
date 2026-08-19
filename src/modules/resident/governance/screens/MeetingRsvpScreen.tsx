import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CommonActions } from "@react-navigation/native";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useMeetingDetail } from "../data/useMeetingDetail";
import { useMeetingRsvp } from "../hooks/useMeetingRsvp";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import type { MeetingRsvpInput } from "../data/governance.dto";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorBorderColorStyle3 } from "../styles/screens/MeetingRsvpScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type RsvpChoice = 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE';
type AttendanceMode = 'IN_PERSON' | 'ONLINE';
const choices: {
    id: RsvpChoice;
    label: string;
    description: string;
}[] = [
    { id: 'ATTENDING', get label() {
            return getActiveUiLiteral("m_a8efe09b47c7");
        }, get description() {
            return getActiveUiLiteral("m_62958dbcf315");
        } },
    { id: 'MAYBE', get label() {
            return getActiveUiLiteral("m_da318d11754e");
        }, get description() {
            return getActiveUiLiteral("m_3b84ca42189e");
        } },
    { id: 'NOT_ATTENDING', get label() {
            return getActiveUiLiteral("m_ed838cd51182");
        }, get description() {
            return getActiveUiLiteral("m_90cfef52609b");
        } },
];
type MeetingRsvpProps = {
    navigation: {
        goBack: () => void;
        dispatch: (action: ReturnType<typeof CommonActions.navigate>) => void;
    };
    route?: {
        params?: {
            meetingId?: string;
        };
    };
};
export function MeetingRsvpScreen({ navigation, route }: MeetingRsvpProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { activeContext } = useActiveResidentHome();
    const meetingId = route?.params?.meetingId ?? '';
    const { data: meeting, isLoading, error, refetch } = useMeetingDetail(meetingId);
    const { submit, isSubmitting } = useMeetingRsvp();
    const [choice, setChoice] = useState<RsvpChoice | null>(null);
    const [mode, setMode] = useState<AttendanceMode>('IN_PERSON');
    if (isLoading)
        return <LoadingState message={localizedUiText.m_e9caebde6fe3} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!meeting)
        return <ErrorState message={localizedUiText.m_deddf705666c} onRetry={refetch}/>;
    const isOpen = meeting.status === 'SCHEDULED' || meeting.status === 'RSVP_OPEN' || meeting.status === 'NOTICE_PUBLISHED';
    const canAssignProxy = activeContext.residentRole === 'owner' || activeContext.residentRole === 'coOwner';
    const handleSubmit = async () => {
        if (!choice || isSubmitting)
            return;
        const input: MeetingRsvpInput = {
            meetingId,
            rsvpStatus: choice,
            ...includeWhenPresent("attendanceMode", choice === 'ATTENDING' ? mode : undefined)
        };
        const result = await submit(input);
        if (!result.ok) {
            AppAlert.alert(String(localizedUiText.m_94407011d13d), result.error.message);
            return;
        }
        await refetch();
        AppAlert.alert(String(localizedUiText.m_aef285a2fbd3), String(localizedUiText.m_6e3af4a88951), [
            { text: String(localizedUiText.m_11a6767d5674), onPress: navigation.goBack },
        ]);
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_9b593914eda5} showBackButton/>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{meeting.title}</SafeText>
          <SafeText variant="caption" color="secondary">{formatResidentDate(meeting.scheduledDate)} · {meeting.scheduledTime}</SafeText>
          {meeting.myRsvpStatus && meeting.myRsvpStatus !== 'PENDING' ? (<SafeText variant="caption" style={createSafeTextColorStyle2(theme.accent)}>{localizedUiText.m_915b6e4315c3}{meeting.myRsvpStatus.replaceAll('_', ' ')}
            </SafeText>) : null}
        </View>

        {!isOpen ? (<View style={[styles.notice, createViewBackgroundColorBorderColorStyle2(theme.surfaceRaised, theme.border)]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary}/>
            <SafeText variant="caption" color="secondary" style={styles.flexText}>{localizedUiText.m_0f4aed0ef69d}</SafeText>
          </View>) : (<>
            <View style={styles.section}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>{localizedUiText.m_f737f86b121f}</SafeText>
              {choices.map((item) => {
                const selected = choice === item.id;
                return (<Pressable key={item.id} onPress={() => setChoice(item.id)} accessibilityRole="radio" accessibilityState={{ checked: selected }}>
                    <View style={[styles.option, createViewBackgroundColorBorderColorStyle3(selected ? theme.accentSoft : theme.surface, selected ? theme.accent : theme.border)]}>
                      <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={20} color={selected ? theme.accent : theme.textSecondary}/>
                      <View style={styles.flexText}>
                        <SafeText variant="bodyStrong" style={createSafeTextColorStyle4(theme.textPrimary)}>{item.label}</SafeText>
                        <SafeText variant="tiny" color="secondary">{item.description}</SafeText>
                      </View>
                    </View>
                  </Pressable>);
            })}
            </View>

            {choice === 'ATTENDING' ? (<View style={styles.section}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle5(theme.textPrimary)}>{localizedUiText.m_4584e763ed1b}</SafeText>
                <View style={styles.modeRow}>
                  {(['IN_PERSON', 'ONLINE'] as const).map((value) => (<AppButton key={value} title={value === 'IN_PERSON' ? localizedUiText.m_5cf02dbb1e63 : localizedUiText.m_0d21bd52022c} variant={mode === value ? 'primary' : 'outline'} onPress={() => setMode(value)} style={styles.modeButton}/>))}
                </View>
              </View>) : null}

            <AppButton title={localizedUiText.m_5c563035f42f} onPress={() => void handleSubmit()} disabled={!choice || isSubmitting} loading={isSubmitting}/>
            {canAssignProxy ? (<AppButton title={localizedUiText.m_f557675914b3} variant="ghost" onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'ProxyAuthorization', params: { meetingId } }))}/>) : null}
          </>)}
      </ScrollView>
    </View>);
}

