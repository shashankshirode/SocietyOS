import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { styles, createPressableBorderColorBackgroundColorOpacityStyle, createViewBackgroundColorStyle } from "../styles/components/DocumentUploadTile.styles";
interface DocumentUploadTileProps {
    readonly icon: keyof typeof Ionicons.glyphMap;
    readonly title: string;
    readonly subtitle?: string;
    readonly onPress: () => void;
    readonly disabled?: boolean;
}
export function DocumentUploadTile({ icon, title, subtitle, onPress, disabled = false, }: DocumentUploadTileProps) {
    const { colors } = useAppTheme();
    return (<Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={title} style={({ pressed }) => [
            styles.tile,
            createPressableBorderColorBackgroundColorOpacityStyle(colors.border, pressed ? colors.cardPressed : colors.surface, disabled ? 0.45 : 1),
        ]}>
      <View style={[styles.icon, createViewBackgroundColorStyle(colors.primarySoft)]}>
        <Ionicons name={icon} size={22} color={colors.primary}/>
      </View>
      <View style={styles.text}>
        <AppText variant="bodySmall" weight="800">
          {title}
        </AppText>
        {subtitle ? (<AppText variant="caption" tone="secondary">
            {subtitle}
          </AppText>) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted}/>
    </Pressable>);
}

