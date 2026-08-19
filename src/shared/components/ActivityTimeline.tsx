import { View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { SafeText } from "./SafeText";
import { StatusPill } from "./StatusPill";
import { styles, createViewBackgroundColorStyle } from "./styles/ActivityTimeline.styles";
export type ActivityTimelineItem = {
    id: string;
    title: string;
    subtitle?: string;
    status?: string;
};
export function ActivityTimeline({ items }: {
    items: ActivityTimelineItem[];
}) {
    const { colors } = useAppTheme();
    return (<View style={styles.container}>
      {items.map((item) => (<View key={item.id} style={styles.item}>
          <View style={[styles.dot, createViewBackgroundColorStyle(colors.primary)]}/>
          <View style={styles.copy}>
            <SafeText variant="bodyStrong" numberOfLines={2}>{item.title}</SafeText>
            {item.subtitle ? <SafeText variant="caption" color="secondary" numberOfLines={2}>{item.subtitle}</SafeText> : null}
          </View>
          {item.status ? <StatusPill label={item.status} tone="info"/> : null}
        </View>))}
    </View>);
}

