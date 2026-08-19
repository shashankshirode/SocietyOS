import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { PressableScale } from "../../shared/motion/PressableScale";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import type { ResidentCommandTone, ResidentModuleShelfItem } from "../../modules/resident/dashboard/data/dashboard.types";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "./styles/ResidentModuleShelf.styles";
export interface ResidentModuleShelfProps {
    title: string;
    subtitle: string;
    items: ResidentModuleShelfItem[];
    onModulePress: (id: string) => void;
}
const toneColors: Record<ResidentCommandTone, {
    light: string;
    dark: string;
}> = {
    primary: { light: '#4338CA', dark: '#818CF8' },
    neutral: { light: '#475467', dark: '#CBD5E1' },
    success: { light: '#0D7A3E', dark: '#4ADE80' },
    warning: { light: '#A96207', dark: '#FBBF24' },
    danger: { light: '#B91C1C', dark: '#F87171' },
};
export function ResidentModuleShelf({ title, subtitle, items, onModulePress }: ResidentModuleShelfProps) {
    const { colors, dark } = useAppTheme();
    return (<View style={styles.container} testID="resident-module-shelf">
      <View style={styles.titleBlock}>
        <SafeText variant="title" color="primary" numberOfLines={1}>
          {title}
        </SafeText>
        <SafeText variant="caption" color="muted" numberOfLines={2}>
          {subtitle}
        </SafeText>
      </View>
      <View style={styles.grid}>
        {items.map((item) => {
            const color = dark ? toneColors[item.tone].dark : toneColors[item.tone].light;
            return (<PressableScale key={item.id} onPress={() => onModulePress(item.id)} style={styles.gridItem}>
              <View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
                <View style={[styles.iconWrap, createViewBackgroundColorStyle(dark ? `${color}1F` : `${color}12`)]}>
                  <Ionicons name={item.iconName} size={19} color={color}/>
                </View>
                <View style={styles.textBlock}>
                  <SafeText variant="bodyStrong" color="primary" numberOfLines={1}>
                    {item.label}
                  </SafeText>
                  <SafeText variant="tiny" color="secondary" numberOfLines={2}>
                    {item.description}
                  </SafeText>
                  {item.countLabel ? (<SafeText variant="tiny" style={createSafeTextColorStyle(color)} numberOfLines={1}>
                      {item.countLabel}
                    </SafeText>) : null}
                </View>
              </View>
            </PressableScale>);
        })}
      </View>
    </View>);
}

