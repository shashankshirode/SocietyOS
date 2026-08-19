import { View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceAccessDecision, ResidenceDocumentRequirement } from "../models/residenceAccess.types";
import { styles } from "../styles/components/CorrectionRequiredPanel.styles";
interface CorrectionRequiredPanelProps {
    readonly decision: ResidenceAccessDecision;
    readonly requirements: readonly ResidenceDocumentRequirement[];
}
export function CorrectionRequiredPanel({ decision, requirements, }: CorrectionRequiredPanelProps) {
    const affected = requirements.filter((requirement) => decision.affectedRequirementIds.includes(requirement.requirementId));
    return (<View style={styles.container}>
      <AppText variant="sectionTitle" weight="800">
        {residenceAccessMessages.decision.affectedItems}
      </AppText>
      {affected.map((requirement) => (<View key={requirement.requirementId} style={styles.item}>
          <AppText variant="bodySmall" weight="700">
            {requirement.title}
          </AppText>
          <AppText variant="caption" tone="danger">
            {requirement.rejectionReason?.residentVisibleReason ?? decision.residentVisibleReason}
          </AppText>
        </View>))}
    </View>);
}

