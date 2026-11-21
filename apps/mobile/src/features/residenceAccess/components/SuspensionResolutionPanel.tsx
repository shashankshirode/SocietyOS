import { View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages, restrictedFeatureLabels } from "../../../messages/en/residenceAccess.messages";
import { presentResidenceDate } from "../services/residenceAccessDateTime";
import type { ResidenceSuspensionRecord } from "../models/residenceAccess.types";
import { styles, createViewBackgroundColorBorderColorStyle } from "../styles/components/SuspensionResolutionPanel.styles";
interface SuspensionResolutionPanelProps {
    readonly suspension: ResidenceSuspensionRecord;
}
function List({ title, items }: {
    readonly title: string;
    readonly items: readonly string[];
}) {
    return (<View style={styles.section}>
      <AppText variant="bodySmall" weight="800">
        {title}
      </AppText>
      {items.map((item) => (<AppText key={item} variant="caption" tone="secondary">
          {`• ${item}`}
        </AppText>))}
    </View>);
}
export function SuspensionResolutionPanel({ suspension }: SuspensionResolutionPanelProps) {
    const { colors } = useAppTheme();
    const suspendedAt = presentResidenceDate(suspension.suspendedAt);
    const expected = presentResidenceDate(suspension.expectedReviewAt);
    return (<View style={[styles.panel, createViewBackgroundColorBorderColorStyle(colors.dangerSoft, colors.danger)]}>
      <View style={styles.section}>
        <AppText variant="caption" tone="secondary">
          {residenceAccessMessages.suspension.reason}
        </AppText>
        <AppText variant="body" weight="700">
          {suspension.residentVisibleReason}
        </AppText>
      </View>
      <View style={styles.metadata}>
        <AppText variant="caption" tone="secondary">
          {`${residenceAccessMessages.suspension.suspendedAt}: ${suspendedAt.absolute}`}
        </AppText>
        <AppText variant="caption" tone="secondary">
          {`${residenceAccessMessages.suspension.authority}: ${suspension.authorityRole}`}
        </AppText>
        <AppText variant="caption" tone="secondary">
          {`${residenceAccessMessages.suspension.duration}: ${suspension.temporary ? residenceAccessMessages.suspension.temporary : residenceAccessMessages.suspension.indefinite}`}
        </AppText>
        {suspension.expectedReviewAt ? (<AppText variant="caption" tone="secondary">
            {`${residenceAccessMessages.suspension.reviewDate}: ${expected.absolute}`}
          </AppText>) : null}
      </View>
      <List title={residenceAccessMessages.suspension.affected} items={suspension.affectedFeatures.map((feature) => restrictedFeatureLabels[feature])}/>
      <List title={residenceAccessMessages.suspension.available} items={suspension.stillAvailableFeatures}/>
      <List title={residenceAccessMessages.suspension.steps} items={suspension.resolutionSteps}/>
    </View>);
}

