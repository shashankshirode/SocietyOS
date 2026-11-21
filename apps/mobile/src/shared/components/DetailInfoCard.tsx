import { View, StyleProp, ViewStyle } from "react-native";
import { AppText } from "./AppText";
import { AppCard } from "../cards/AppCard";
import { AppIcon } from "../icons/AppIcon";
import { AppIconName } from "../icons/icon.types";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewBorderTopColorStyle } from "./styles/DetailInfoCard.styles";
export interface InfoItem {
    label: string;
    value: string;
    icon?: AppIconName;
}
export interface DetailInfoCardProps {
    title?: string;
    items: InfoItem[];
    style?: StyleProp<ViewStyle>;
}
export function DetailInfoCard({ title, items, style }: DetailInfoCardProps) {
    const { colors } = useAppTheme();
    return (<AppCard variant="default" style={[styles.card, style]}>
      {title && (<AppText variant="subtitle" weight="bold" style={styles.title}>
          {title}
        </AppText>)}
      <View style={styles.list}>
        {items.map((item, index) => (<View key={index} style={[
                styles.item,
                index > 0 && createViewBorderTopColorStyle(colors.divider),
            ]}>
            {item.icon && (<View style={styles.iconContainer}>
                <AppIcon name={item.icon} size={18} color={colors.textSecondary}/>
              </View>)}
            <View style={styles.textContainer}>
              <AppText variant="caption" color="muted">
                {item.label}
              </AppText>
              <AppText variant="bodyMedium" weight="medium" style={styles.value}>
                {item.value}
              </AppText>
            </View>
          </View>))}
      </View>
    </AppCard>);
}
export default DetailInfoCard;

