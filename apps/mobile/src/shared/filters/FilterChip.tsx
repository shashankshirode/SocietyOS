import { Pressable, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { AppIcon } from "../icons/AppIcon";
import type { AppIconName } from "../icons/icon.types";
import { SafeText } from "../components/SafeText";
import { styles, createPressableBackgroundColorBorderColorStyle, createSafeTextColorStyle, createViewBackgroundColorStyle, createSafeTextColorStyle2 } from "./styles/FilterChip.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { formatUiLiteral } from "../localization/formatUiLiteral";
export interface FilterChipProps {
    label: string;
    selected?: boolean;
    disabled?: boolean;
    count?: number;
    icon?: AppIconName;
    showClear?: boolean;
    onPress?: () => void;
    onClear?: () => void;
}
export function FilterChip({ label, selected = false, disabled = false, count, icon, showClear = false, onPress, onClear, }: FilterChipProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const bgColor = disabled
        ? colors.disabled
        : selected
            ? colors.primary
            : colors.surfaceMuted;
    const borderColor = disabled
        ? colors.border
        : selected
            ? colors.primary
            : colors.border;
    const textColor = disabled
        ? colors.textMuted
        : selected
            ? colors.textInverse
            : colors.textSecondary;
    return (<Pressable style={[styles.chip, createPressableBackgroundColorBorderColorStyle(bgColor, borderColor)]} onPress={disabled ? undefined : onPress} disabled={disabled} accessibilityRole="button" accessibilityState={{ selected, disabled }} accessibilityLabel={formatUiLiteral(localizedUiText.m_95b93310a0ba, [label, count !== undefined ? formatUiLiteral(localizedUiText.m_adf4986787f5, [count]) : ''])}>
      {icon && (<AppIcon name={icon} size={14} color={textColor}/>)}
      <SafeText variant="caption" style={[styles.chipText, createSafeTextColorStyle(textColor)]} numberOfLines={2}>
        {label}
      </SafeText>
      {count !== undefined && (<View style={[styles.badge, createViewBackgroundColorStyle(selected ? 'rgba(255,255,255,0.25)' : colors.borderStrong)]}>
          <SafeText variant="tiny" style={[styles.badgeText, createSafeTextColorStyle2(selected ? colors.textInverse : colors.textSecondary)]}>
            {count}
          </SafeText>
        </View>)}
      {showClear && selected && (<Pressable onPress={onClear} hitSlop={8} accessibilityLabel={formatUiLiteral(localizedUiText.m_7db1995ff6c0, [label])} style={styles.clearBtn}>
          <AppIcon name="close" size={12} color={textColor}/>
        </Pressable>)}
    </Pressable>);
}

