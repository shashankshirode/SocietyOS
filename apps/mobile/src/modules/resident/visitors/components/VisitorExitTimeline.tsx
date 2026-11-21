import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { t } from "../../household/components/householdComponentUtils";
import type { VisitorExitTimelineEvent } from "../../../../shared/types/visitor.types";
import { formatVisitorExitTime } from "./visitorExitFormatters";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle } from "../styles/components/VisitorExitTimeline.styles";
export interface VisitorExitTimelineProps {
    events: VisitorExitTimelineEvent[];
}
export function VisitorExitTimeline({ events }: VisitorExitTimelineProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    return (<View style={styles.container}>
      {events.map((event) => (<View key={event.id} style={styles.row}>
          <View style={[styles.dot, createViewBackgroundColorStyle(theme.accent)]}/>
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <SafeText variant="caption" style={createSafeTextColorStyle(theme.textPrimary)}>
                {t(messages, event.titleKey)}
              </SafeText>
              <SafeText variant="tiny" style={createSafeTextColorStyle2(theme.textSecondary)}>
                {formatVisitorExitTime(event.occurredAtIso)}
              </SafeText>
            </View>
            <SafeText variant="tiny" style={createSafeTextColorStyle3(theme.textSecondary)}>
              {t(messages, event.descriptionKey)}
            </SafeText>
          </View>
        </View>))}
    </View>);
}

