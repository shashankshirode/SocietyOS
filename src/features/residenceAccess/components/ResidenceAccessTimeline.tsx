import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import { presentResidenceDate } from "../services/residenceAccessDateTime";
import type { ResidenceAccessTimelineEvent } from "../models/residenceAccess.types";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "../styles/components/ResidenceAccessTimeline.styles";
interface ResidenceAccessTimelineProps {
    readonly events: readonly ResidenceAccessTimelineEvent[];
    readonly initiallyExpanded?: boolean;
}
export function ResidenceAccessTimeline({ events, initiallyExpanded = false, }: ResidenceAccessTimelineProps) {
    const { colors } = useAppTheme();
    const [expanded, setExpanded] = useState(initiallyExpanded);
    const visibleEvents = expanded ? events : events.slice(0, 3);
    if (events.length === 0) {
        return (<View style={styles.empty}>
        <AppText variant="body" weight="700">
          {residenceAccessMessages.statusSheet.noHistory}
        </AppText>
        <AppText variant="bodySmall" tone="secondary">
          {residenceAccessMessages.statusSheet.noHistoryBody}
        </AppText>
      </View>);
    }
    return (<View style={styles.container}>
      {visibleEvents.map((event, index) => {
            const date = presentResidenceDate(event.occurredAt);
            return (<View key={event.eventId} style={styles.eventRow} accessible accessibilityLabel={residenceAccessMessages.accessibility.timelineEvent(event.title, date.absolute)}>
            <View style={styles.markerColumn}>
              <View style={[styles.marker, createViewBackgroundColorStyle(colors.info)]}/>
              {index < visibleEvents.length - 1 ? (<View style={[styles.line, createViewBackgroundColorStyle2(colors.divider)]}/>) : null}
            </View>
            <View style={styles.eventContent}>
              <AppText variant="bodySmall" weight="700">
                {event.title}
              </AppText>
              <AppText variant="caption" tone="secondary">
                {event.residentVisibleDescription}
              </AppText>
              <AppText variant="tiny" tone="muted">
                {`${date.absolute} · ${event.actorDisplayRole}`}
              </AppText>
            </View>
          </View>);
        })}
      {events.length > 3 ? (<Pressable onPress={() => setExpanded((value) => !value)} style={styles.expandButton} accessibilityRole="button" accessibilityLabel={expanded
                ? residenceAccessMessages.accessibility.collapseHistory
                : residenceAccessMessages.accessibility.expandHistory}>
          <AppText variant="bodySmall" color={colors.primary} weight="700">
            {expanded
                ? residenceAccessMessages.statusSheet.timelineHide
                : residenceAccessMessages.statusSheet.timelineShow}
          </AppText>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.primary}/>
        </Pressable>) : null}
    </View>);
}

