import { TextStyle, View, ViewStyle } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { getStatusPresentation, BadgeType } from "../utils/statusPresentation";
import { SafeText } from "./SafeText";
import { styles } from "./styles/StatusBadge.styles";
export interface StatusBadgeProps {
    label?: string;
    type?: BadgeType;
    status?: string;
    moduleType?: string;
    style?: ViewStyle;
    accessibilityLabel?: string;
}
export function StatusBadge({ label, type, status, moduleType, style, accessibilityLabel }: StatusBadgeProps) {
    const { colors } = useAppTheme();
    let finalLabel = label || '';
    let finalType: BadgeType = type || 'neutral';
    if (status && moduleType) {
        const presentation = getStatusPresentation(status, moduleType);
        finalLabel = presentation.label;
        finalType = presentation.type;
    }
    const badgeBgStyles: Record<BadgeType, ViewStyle> = {
        success: { backgroundColor: colors.successSoft },
        warning: { backgroundColor: colors.warningSoft },
        danger: { backgroundColor: colors.dangerSoft },
        info: { backgroundColor: colors.infoSoft },
        neutral: { backgroundColor: colors.surfaceSoft },
    };
    const labelTextStyles: Record<BadgeType, TextStyle> = {
        success: { color: colors.success },
        warning: { color: colors.warning },
        danger: { color: colors.danger },
        info: { color: colors.info },
        neutral: { color: colors.textSecondary },
    };
    return (<View style={[styles.badge, badgeBgStyles[finalType], style]} accessible accessibilityLabel={accessibilityLabel ?? finalLabel}>
      <SafeText variant="tiny" style={[styles.label, labelTextStyles[finalType]]} numberOfLines={2} align="center">
        {finalLabel}
      </SafeText>
    </View>);
}
const typeFor = (status: string, moduleType: string): BadgeType => getStatusPresentation(status, moduleType).type;
const typeFromMap = (status: string, map: Record<string, BadgeType>, fallback: BadgeType = 'neutral'): BadgeType => map[status.toUpperCase()] ?? fallback;
export const getVisitorBadgeType = (status: string): BadgeType => typeFor(status, 'visitor');
export const getGatePassBadgeType = (status: string): BadgeType => typeFor(status, 'gate');
export const getBillBadgeType = (status: string): BadgeType => typeFor(status, 'billing');
export const getComplaintStatusBadgeType = (status: string): BadgeType => typeFor(status, 'complaint');
export const getDocumentStatusBadgeType = (status: string): BadgeType => typeFor(status, 'document');
export const getParkingBadgeType = (status: string): BadgeType => typeFor(status, 'parking');
export const getMeetingStatusBadgeType = (status: string): BadgeType => typeFor(status, 'meeting');
export const getPollStatusBadgeType = (status: string): BadgeType => typeFor(status, 'poll');
export const getResolutionStatusBadgeType = (status: string): BadgeType => typeFor(status, 'governance');
export const getElectionStatusBadgeType = (status: string): BadgeType => typeFor(status, 'governance');
export const getClearanceStatusBadgeType = (status: string): BadgeType => typeFor(status, 'clearance');
export const getNocStatusBadgeType = (status: string): BadgeType => typeFor(status, 'noc');
export const getKycStatusBadgeType = (status: string): BadgeType => typeFromMap(status, {
    NOT_STARTED: 'neutral',
    PENDING: 'warning',
    VERIFIED: 'success',
    REJECTED: 'danger',
    EXPIRED: 'danger',
});
export const getPoliceVerificationBadgeType = (status: string): BadgeType => typeFromMap(status, {
    NOT_SUBMITTED: 'neutral',
    SUBMITTED: 'warning',
    VERIFIED: 'success',
    REJECTED: 'danger',
    EXPIRED: 'danger',
});
export const getResidentAccessBadgeType = (status: string): BadgeType => typeFromMap(status, {
    PENDING_ACTIVATION: 'warning',
    ACTIVE: 'success',
    SUSPENDED: 'danger',
    REVOKED: 'danger',
});
export const getMoveOutNocStatusBadgeType = (status: string): BadgeType => typeFromMap(status, {
    NOT_REQUIRED: 'neutral',
    PENDING: 'warning',
    APPROVED: 'success',
    GENERATED: 'success',
    REJECTED: 'danger',
    WAIVED_WITH_REASON: 'neutral',
});
export const getDuesClearanceStatusBadgeType = (status: string): BadgeType => typeFromMap(status, {
    CLEAR: 'success',
    PENDING: 'warning',
    PARTIALLY_PENDING: 'warning',
    WAIVED: 'neutral',
    DISPUTED: 'danger',
});
export const getTimelineEventStatusBadgeType = (status: string): BadgeType => typeFromMap(status, {
    COMPLETED: 'success',
    CURRENT: 'info',
    PENDING: 'warning',
    CANCELLED: 'danger',
});
export const getOccupancyStatusBadgeType = (status: string): BadgeType => typeFromMap(status, {
    OWNER_OCCUPIED: 'success',
    TENANT_OCCUPIED: 'info',
    VACANT: 'neutral',
    UNDER_RENOVATION: 'warning',
    MOVE_IN_PENDING: 'warning',
    MOVE_OUT_PENDING: 'warning',
});
export const getChatThreadStatusBadgeType = (status: string): BadgeType => typeFor(status, 'chat');
export const getModerationStatusBadgeType = (status: string): BadgeType => typeFor(status, 'moderation');
export const getStaffVerificationBadgeType = (status: string): BadgeType => typeFor(status, 'staff');
export const getPriorityBadgeType = (priority: string): BadgeType => typeFromMap(priority, {
    LOW: 'success',
    NORMAL: 'neutral',
    MEDIUM: 'warning',
    IMPORTANT: 'warning',
    HIGH: 'danger',
    URGENT: 'danger',
    CRITICAL: 'danger',
});
export const getNoticePriorityBadgeType = getPriorityBadgeType;
export const getContactRequestUrgencyBadgeType = getPriorityBadgeType;
export const getDocumentSensitivityBadgeType = (sensitivity: string): BadgeType => typeFromMap(sensitivity, {
    PUBLIC: 'success',
    RESIDENT_ONLY: 'info',
    OWNER_ONLY: 'warning',
    TENANT_ONLY: 'warning',
    COMMITTEE_ONLY: 'warning',
    ADMIN_ONLY: 'danger',
    RESTRICTED: 'danger',
});
export const getVoteStatusBadgeType = (status: string): BadgeType => typeFromMap(status, {
    NOT_VOTED: 'warning',
    VOTED: 'success',
    ABSTAINED: 'neutral',
    PROXY_DELEGATED: 'info',
    INELIGIBLE: 'danger',
});
export const getOfflineSyncBadgeType = (status: string): BadgeType => typeFromMap(status, {
    PENDING: 'warning',
    QUEUED: 'neutral',
    SYNCING: 'info',
    SYNCED: 'success',
    COMPLETED: 'success',
    FAILED: 'danger',
    CONFLICT: 'danger',
});
export const getContactRequestStatusBadgeType = (status: string): BadgeType => typeFromMap(status, {
    PENDING: 'warning',
    ACCEPTED: 'success',
    REJECTED: 'danger',
    BLOCKED: 'danger',
    REPORTED: 'danger',
    EXPIRED: 'neutral',
    CANCELLED: 'neutral',
});
export const getDirectoryVisibilityBadgeType = (status: string): BadgeType => typeFromMap(status, {
    VISIBLE: 'success',
    LIMITED: 'warning',
    HIDDEN: 'neutral',
    RESTRICTED: 'danger',
});
export const getResidentConnectionBadgeType = (status: string): BadgeType => typeFromMap(status, {
    NOT_CONNECTED: 'neutral',
    REQUEST_SENT: 'warning',
    REQUEST_RECEIVED: 'info',
    CONNECTED: 'success',
    BLOCKED_BY_ME: 'danger',
    BLOCKED_ME: 'danger',
    RESTRICTED: 'danger',
});
export default StatusBadge;
