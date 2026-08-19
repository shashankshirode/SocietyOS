import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useResidentTheme } from "../foundation/residentTheme";
import { ResponsiveGrid } from "../layout/ResponsiveGrid";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3 } from "./styles/ResidentInfoMosaic.styles";
export interface MosaicItem {
    id: string;
    label: string;
    value: string | number;
    iconName: string;
    detail?: string;
}
export interface ResidentInfoMosaicProps {
    items: MosaicItem[];
}
export function ResidentInfoMosaic({ items }: ResidentInfoMosaicProps) {
    const theme = useResidentTheme();
    return (<ResponsiveGrid gap={10}>
      {items.map((item) => (<View key={item.id} style={[styles.tile, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
          <View style={styles.header}>
            <View style={[styles.iconWrap, createViewBackgroundColorStyle(theme.accentSoft)]}>
              <Ionicons name={item.iconName as keyof typeof Ionicons.glyphMap} size={16} color={theme.accent}/>
            </View>
            <SafeText variant="tiny" style={[styles.value, createSafeTextColorStyle2(theme.accent)]}>
              {item.value}
            </SafeText>
          </View>
          <View style={styles.textContainer}>
            <SafeText variant="caption" style={[styles.label, createSafeTextColorStyle3(theme.textPrimary)]} numberOfLines={1}>
              {item.label}
            </SafeText>
            {item.detail && (<SafeText variant="tiny" style={createSafeTextColorStyle(theme.textSecondary)} numberOfLines={1}>
                {item.detail}
              </SafeText>)}
          </View>
        </View>))}
    </ResponsiveGrid>);
}
export default ResidentInfoMosaic;

