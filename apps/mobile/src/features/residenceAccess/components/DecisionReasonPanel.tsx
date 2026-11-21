import { View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages, residenceRejectionReasonLabels } from "../../../messages/en/residenceAccess.messages";
import { presentResidenceDate } from "../services/residenceAccessDateTime";
import type { ResidenceAccessDecision } from "../models/residenceAccess.types";
import { styles, createViewBackgroundColorBorderColorStyle } from "../styles/components/DecisionReasonPanel.styles";
interface DecisionReasonPanelProps {
    readonly decision: ResidenceAccessDecision;
}
function Row({ label, value }: {
    readonly label: string;
    readonly value: string;
}) {
    return (<View style={styles.row}>
      <AppText variant="caption" tone="secondary">
        {label}
      </AppText>
      <AppText variant="bodySmall" weight="700">
        {value}
      </AppText>
    </View>);
}
export function DecisionReasonPanel({ decision }: DecisionReasonPanelProps) {
    const { colors } = useAppTheme();
    const decided = presentResidenceDate(decision.decidedAt);
    const deadline = presentResidenceDate(decision.correctionDeadline);
    return (<View style={[styles.panel, createViewBackgroundColorBorderColorStyle(colors.dangerSoft, colors.danger)]}>
      <Row label={residenceAccessMessages.decision.reason} value={decision.residentVisibleReason}/>
      {decision.rejectionReasonCode ? (<Row label={residenceAccessMessages.decision.category} value={residenceRejectionReasonLabels[decision.rejectionReasonCode]}/>) : null}
      <Row label={residenceAccessMessages.decision.decidedAt} value={decided.absolute}/>
      <Row label={residenceAccessMessages.decision.decidedBy} value={decision.decisionMakerRole}/>
      {decision.correctionDeadline ? (<Row label={residenceAccessMessages.decision.correctionDeadline} value={deadline.absolute}/>) : null}
      {decision.supportingNotes ? (<Row label={residenceAccessMessages.decision.supportingNotes} value={decision.supportingNotes}/>) : null}
      <AppText variant="tiny" tone="secondary">
        {residenceAccessMessages.decision.internalPrivacy}
      </AppText>
    </View>);
}

