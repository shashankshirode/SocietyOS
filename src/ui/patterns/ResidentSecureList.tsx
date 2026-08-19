import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useResidentTheme } from "../foundation/residentTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorBorderColorStyle, createViewBorderBottomColorStyle, createViewBorderBottomColorStyle2, createViewBackgroundColorStyle } from "./styles/ResidentSecureList.styles";
export interface SecureListItem {
    id: string;
    title: string;
    subtitle?: string;
    isLocked?: boolean;
    onPress?: () => void;
}
export interface ResidentSecureListProps {
    items: SecureListItem[];
    description?: string;
}
export function ResidentSecureList({ items, description }: ResidentSecureListProps) {
    const theme = useResidentTheme();
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
      {description && (<View style={[styles.header, createViewBorderBottomColorStyle(theme.border)]}>
          <Ionicons name="lock-closed-outline" size={14} color={theme.textSecondary}/>
          <SafeText variant="tiny" style={createSafeTextColorStyle(theme.textSecondary)}>
            {description}
          </SafeText>
        </View>)}

      {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (<PressableScale key={item.id} onPress={item.onPress} disabled={!item.onPress}>
            <View style={[styles.row, !isLast && createViewBorderBottomColorStyle2(theme.border)]}>
              <View style={[styles.iconWrap, createViewBackgroundColorStyle(theme.accentSoft)]}>
                <Ionicons name={item.isLocked ? "lock-closed" : "lock-open"} size={16} color={theme.accent}/>
              </View>
              <View style={styles.textWrap}>
                <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textPrimary)} numberOfLines={1}>
                  {item.title}
                </SafeText>
                {item.subtitle && (<SafeText variant="tiny" style={createSafeTextColorStyle3(theme.textSecondary)} numberOfLines={1}>
                    {item.subtitle}
                  </SafeText>)}
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.textSecondary}/>
            </View>
          </PressableScale>);
        })}
    </View>);
}
export default ResidentSecureList;

