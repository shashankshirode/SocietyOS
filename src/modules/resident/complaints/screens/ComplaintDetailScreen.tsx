import { AppAlert } from "../../../../ui/modal/AppAlert";
import { View, ScrollView, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { Screen } from "../../../../design-system/layouts";
import { Button } from "../../../../design-system/components";
import { Card } from "../../../../design-system/components";
import { useMessages } from "../../../../shared/constants/useMessages";
import { ComplaintStatus } from "../data/complaints.enums";
import { StackActions } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMockStore } from "../../../../core/mockStore/useMockStore";
import type { ComplaintDetailScreenProps } from "../../../../app/navigation/navigation.types";
import { ComplaintProgressPanel } from "../../../../ui/patterns/ComplaintProgressPanel";
import { ResidentTimeline } from "../../../../ui/patterns/ResidentTimeline";
import { ResidentProgressCoach, type ProgressStep } from "../../../../ui/patterns/ResidentProgressCoach";
import type { ComplaintPriority as ProgressComplaintPriority } from "../../dashboard/data/dashboard.types";

function toProgressPriority(priority: string): 'critical' | 'high' | 'medium' | 'low' {
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
    const { colors, dark } = useAppTheme();
    const themeColors = require('../../../../design-system/tokens/premium-colors').getColors(dark ? 'dark' : 'light');
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
    const coachSteps: { title: string; description: string; status: 'completed' | 'current' | 'pending' | 'blocked' }[] = [
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
    return (
        <Screen
            title={messages.complaints.detailTitle || complaint.title}
            subtitle={`${complaint.category} \u00b7 ${complaint.status.replace(/_/g, ' ')}`}
            showBackButton
            onBack={() => navigation.goBack()}
        >
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.viewPaddingHorizontal}>
                    <Card variant="elevated" padding="md">
                        <ComplaintProgressPanel {...progressProps} interactive={false} />
                    </Card>
                </View>

                <View style={styles.viewPaddingHorizontal2}>
                    <Card variant="elevated" padding="md">
                        <ResidentProgressCoach steps={coachSteps} instruction={complaint.status !== ComplaintStatus.RESOLVED && complaint.status !== ComplaintStatus.CLOSED
                            ? getActiveUiLiteral("m_10abd13583ec") : getActiveUiLiteral("m_9cc813680d11")} />
                    </Card>
                </View>

                <View style={styles.section}>
                    <SafeText variant="bodyStrong" style={styles.sectionTitle}>{messages.complaints.timelineSection}</SafeText>
                    <ResidentTimeline items={timelineItems} />
                </View>

                <View style={styles.actions}>
                    {complaint.status !== ComplaintStatus.RESOLVED && complaint.status !== ComplaintStatus.CLOSED && (
                        <Button
                            title="Mark Done"
                            onPress={handleResolve}
                            variant="primary"
                            leftIcon={<Ionicons name="checkmark-circle-outline" size={18} color={themeColors.text.inverse} />}
                        />
                    )}

                    {complaint.status === ComplaintStatus.RESOLVED && (
                        <View style={styles.buttonStack}>
                            <Button
                                title="Feedback"
                                onPress={handleFeedback}
                                variant="primary"
                                leftIcon={<Ionicons name="star-outline" size={18} color={themeColors.text.inverse} />}
                            />
                            <Button
                                title="Reopen"
                                variant="outline"
                                onPress={handleReopen}
                                leftIcon={<Ionicons name="refresh-outline" size={18} color="#3B82F6" />}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
        </Screen>
    );
}

function formatUiLiteral(template: string, args: string[]): string {
    return args.reduce((acc, arg, i) => acc.replace(`{${i}}`, arg), template);
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    safe: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
        gap: 16,
    },
    viewPaddingHorizontal: {
        paddingHorizontal: 16,
    },
    viewPaddingHorizontal2: {
        paddingHorizontal: 16,
        marginTop: 16,
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginTop: 24,
    },
    buttonStack: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    progressCard: {
        marginBottom: 16,
    },
    coachCard: {
        marginBottom: 16,
    },
});

export default ComplaintDetailScreen;
