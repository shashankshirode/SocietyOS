import { AppAlert } from "../../../../ui/modal/AppAlert";
import { View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ComplaintProgressPanel } from "../../../../ui/patterns/ComplaintProgressPanel";
import { ResidentTimeline } from "../../../../ui/patterns/ResidentTimeline";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { useMockStore } from "../../../../core/mockStore/useMockStore";
import type { ComplaintDetailScreenProps } from "../../../../app/navigation/navigation.types";
import { useMessages } from "../../../../shared/constants/useMessages";
import { ComplaintStatus } from "../data/complaints.enums";
import { ResidentProgressCoach, type ProgressStep } from "../../../../ui/patterns/ResidentProgressCoach";
import type { ComplaintPriority as ProgressComplaintPriority } from "../../dashboard/data/dashboard.types";
import { StackActions } from "@react-navigation/native";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle } from "../styles/screens/ComplaintDetailScreen.styles";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
function toProgressPriority(priority: string): ProgressComplaintPriority {
    if (priority === 'URGENT')
        return 'critical';
    if (priority === 'HIGH')
        return 'high';
    if (priority === 'MEDIUM')
        return 'medium';
    return 'low';
}
export function ComplaintDetailScreen(props: ComplaintDetailScreenProps) {
    const localizedUiText = useMessages().uiLiterals;
    const { navigation, route } = props;
    const theme = useResidentTheme();
    const messages = useMessages();
    const focusCopy = messages.resident.experience.focus;
    const { complaint: initialComplaint } = route.params;
    const { state, updateComplaint } = useMockStore();
    const complaint = state.complaints.find((c) => c.id === initialComplaint.id) || initialComplaint;
    const handleResolve = () => {
        updateComplaint(complaint.id, {
            status: ComplaintStatus.RESOLVED,
            updatedAt: new Date().toISOString(),
            resolutionNote: getActiveUiLiteral("m_6b4b88ea9f43"),
        });
        AppAlert.alert(messages.common.update || String(localizedUiText.m_8b2d0675b4b0), messages.resident.success.updated || String(localizedUiText.m_8522d7a3d99b));
    };
    const handleReopen = () => {
        navigation.dispatch(StackActions.push('ComplaintReopen', { complaintId: complaint.id }));
    };
    const handleFeedback = () => {
        navigation.dispatch(StackActions.push('ComplaintFeedback', { complaintId: complaint.id }));
    };
    const timelineItems = [
        {
            id: 'step-created',
            title: messages.complaints.timelineRaised,
            description: `${messages.complaints.formCategory}: ${complaint.category}`,
            timestamp: complaint.createdAt || getActiveUiLiteral("m_66f53417d3b7"),
            iconName: 'document-text-outline',
            status: ComplaintStatus.OPEN,
            statusTone: 'warning' as const,
        },
        ...(complaint.assignedTo
            ? [
                {
                    id: 'step-assigned',
                    title: messages.complaints.labelAssignedTo,
                    description: messages.complaints.timelineAssigned(complaint.assignedTo),
                    timestamp: complaint.updatedAt || getActiveUiLiteral("m_66f53417d3b7"),
                    iconName: 'people-outline',
                    status: ComplaintStatus.ASSIGNED,
                    statusTone: 'info' as const,
                },
            ]
            : []),
        ...(complaint.status === ComplaintStatus.RESOLVED || complaint.status === ComplaintStatus.CLOSED
            ? [
                {
                    id: 'step-resolved',
                    title: messages.complaints.timelineResolved,
                    description: complaint.resolutionNote || messages.complaints.timelineResolved,
                    timestamp: complaint.updatedAt || getActiveUiLiteral("m_66f53417d3b7"),
                    iconName: 'checkmark-circle-outline',
                    status: ComplaintStatus.RESOLVED,
                    statusTone: 'success' as const,
                },
            ]
            : []),
    ];
    const steps = [
        { id: '1', label: messages.complaints.statusOpen, status: 'done' as const },
        {
            id: '2',
            label: messages.complaints.statusInProgress,
            status: complaint.assignedTo ? ('done' as const) : ('current' as const),
        },
        {
            id: '3',
            label: messages.complaints.statusResolved,
            status: complaint.status === ComplaintStatus.IN_PROGRESS
                ? ('current' as const)
                : complaint.status === ComplaintStatus.RESOLVED || complaint.status === ComplaintStatus.CLOSED
                    ? ('done' as const)
                    : ('pending' as const),
        },
        {
            id: '4',
            label: messages.complaints.statusClosed,
            status: complaint.status === ComplaintStatus.RESOLVED
                ? ('current' as const)
                : complaint.status === ComplaintStatus.CLOSED
                    ? ('done' as const)
                    : ('pending' as const),
        },
    ];
    const coachSteps: ProgressStep[] = [
        {
            title: messages.complaints.statusOpen,
            description: String(localizedUiText.m_2c2265169b74),
            status: 'completed',
        },
        {
            title: messages.complaints.statusInProgress,
            description: complaint.assignedTo ? formatUiLiteral(String(localizedUiText.m_c63b6e287d60), [complaint.assignedTo]) : String(localizedUiText.m_eb618401fd43),
            status: complaint.assignedTo ? 'completed' : 'current',
        },
        {
            title: messages.complaints.statusResolved,
            description: complaint.resolutionNote || String(localizedUiText.m_26eeab0ad89c),
            status: complaint.status === ComplaintStatus.RESOLVED || complaint.status === ComplaintStatus.CLOSED
                ? 'completed'
                : complaint.assignedTo
                    ? 'current'
                    : 'pending',
        },
        {
            title: messages.complaints.statusClosed,
            description: String(localizedUiText.m_78d4e1d369e0),
            status: complaint.status === ComplaintStatus.CLOSED ? 'completed' : 'pending',
        },
    ];
    const progressProps = {
        complaintId: complaint.id,
        title: complaint.title,
        priority: toProgressPriority(complaint.priority),
        assignedTo: complaint.assignedTo || messages.common.unknown || 'Unassigned',
        slaRemainingLabel: complaint.slaText || getActiveUiLiteral("m_b46361e7a199"),
        slaProgressPercent: complaint.status === ComplaintStatus.RESOLVED || complaint.status === ComplaintStatus.CLOSED ? 100 : 45,
        steps,
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader
        contextLabel={focusCopy.issues}
        title={complaint.assignedTo ? focusCopy.issueAssigned(complaint.title.toLowerCase()) : focusCopy.issueReported(complaint.title)}
        subtitle={`${complaint.category} · ${complaint.status.replace(/_/g, ' ')}`}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.viewPaddingHorizontal}>
          <ComplaintProgressPanel {...progressProps} interactive={false}/>
        </View>

        <View style={styles.viewPaddingHorizontal2}>
          <ResidentProgressCoach steps={coachSteps} instruction={complaint.status !== ComplaintStatus.RESOLVED && complaint.status !== ComplaintStatus.CLOSED
            ? getActiveUiLiteral("m_10abd13583ec") : getActiveUiLiteral("m_9cc813680d11")}/>
        </View>

        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle(theme.textPrimary)]}>
            {messages.complaints.timelineSection}
          </SafeText>
          <ResidentTimeline items={timelineItems}/>
        </View>

        <View style={styles.actions}>
          {complaint.status !== ComplaintStatus.RESOLVED && complaint.status !== ComplaintStatus.CLOSED && (<AppButton title={messages.common.done || localizedUiText.m_7ee5fb78c07d} onPress={handleResolve} iconLeft={<Ionicons name="checkmark-circle-outline" size={18} color={theme.selectedForeground}/>}/>)}

          {complaint.status === ComplaintStatus.RESOLVED && (<View style={styles.buttonStack}>
              <AppButton title={messages.complaints.feedbackButton} onPress={handleFeedback} iconLeft={<Ionicons name="star-outline" size={18} color={theme.selectedForeground}/>}/>
              <AppButton title={messages.complaints.reopenButton} variant="secondary" onPress={handleReopen} iconLeft={<Ionicons name="refresh-outline" size={18} color={theme.accent}/>}/>
            </View>)}
        </View>
      </ScrollView>
    </View>);
}
export default ComplaintDetailScreen;
