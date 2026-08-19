import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { t } from "../../household/components/householdComponentUtils";
import type { Visitor } from "../../../../shared/types/visitor.types";
import { ensureVisitorExitTracking } from "../utils/visitorExitPolicyResolver";
import { formatVisitorExitTime, resolveAlertStatusLabel, resolveExitStatusLabel } from "./visitorExitFormatters";
import { VisitorExitTimeline } from "./VisitorExitTimeline";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorBorderColorStyle } from "../styles/components/VisitorExitTrackingPanel.styles";
export interface VisitorExitTrackingPanelProps {
    visitor: Visitor;
}
export function VisitorExitTrackingPanel({ visitor }: VisitorExitTrackingPanelProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const tracking = ensureVisitorExitTracking(visitor);
    return (<View style={[styles.panel, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
      <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
        {t(messages, 'visitor.exitAssurance.title')}
      </SafeText>
      <InfoRow label={t(messages, 'visitor.exitAssurance.entryStatus')} value={visitor.actualEntryTime ? t(messages, 'visitor.exitAssurance.inside') : t(messages, 'visitor.exitAssurance.notEntered')}/>
      <InfoRow label={t(messages, 'visitor.exitAssurance.actualEntryTime')} value={formatVisitorExitTime(tracking.actualEntryAtIso)}/>
      <InfoRow label={t(messages, 'visitor.exitAssurance.expectedExitTime')} value={formatVisitorExitTime(tracking.expectedExitAtIso)}/>
      <InfoRow label={t(messages, 'visitor.exitAssurance.gracePeriod')} value={t(messages, 'visitor.exitAssurance.minutesLabel', tracking.gracePeriodMinutes)}/>
      <InfoRow label={t(messages, 'visitor.exitAssurance.exitStatus')} value={resolveExitStatusLabel(messages, tracking.exitStatus)}/>
      <InfoRow label={t(messages, 'visitor.exitAssurance.actualExitTime')} value={formatVisitorExitTime(tracking.actualExitAtIso)}/>
      <InfoRow label={t(messages, 'visitor.exitAssurance.alertStatus')} value={resolveAlertStatusLabel(messages, tracking.alertStatus)}/>
      {tracking.residentResponse ? (<InfoRow label={t(messages, 'visitor.exitAssurance.residentResponse')} value={resolveExitStatusLabel(messages, tracking.exitStatus)}/>) : null}
      <SafeText variant="tiny" style={createSafeTextColorStyle2(theme.textSecondary)}>
        {t(messages, 'visitor.exitAssurance.residentConfirmationNote')}
      </SafeText>
      <VisitorExitTimeline events={tracking.timeline}/>
    </View>);
}
function InfoRow({ label, value }: {
    label: string;
    value: string;
}) {
    const theme = useResidentTheme();
    return (<View style={styles.infoRow}>
      <SafeText variant="tiny" style={createSafeTextColorStyle3(theme.textSecondary)}>
        {label}
      </SafeText>
      <SafeText variant="tiny" style={createSafeTextColorStyle4(value ? theme.textPrimary : theme.textSecondary)}>
        {value || '-'}
      </SafeText>
    </View>);
}

