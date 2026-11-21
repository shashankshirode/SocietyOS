import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { AppIcon } from "../icons/AppIcon";
import { styles, createPressableBackgroundColorBorderColorStyle, createTextColorStyle, createViewBackgroundColorStyle, createTextColorStyle2 } from "./styles/FilterButton.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { formatUiLiteral } from "../localization/formatUiLiteral";
interface FilterButtonProps {
    label?: string;
    activeCount?: number;
    onPress: () => void;
}
export function FilterButton({ label = 'Filters', activeCount = 0, onPress }: FilterButtonProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const hasActive = activeCount > 0;
    return (<Pressable style={[
            styles.button,
            createPressableBackgroundColorBorderColorStyle(hasActive ? colors.primarySoft : colors.surfaceMuted, hasActive ? colors.primary : colors.border),
        ]} onPress={onPress} accessibilityRole="button" accessibilityLabel={formatUiLiteral(localizedUiText.m_c146962ec62b, [label, activeCount])}>
      <AppIcon name="filter" size={16} color={hasActive ? colors.primary : colors.textSecondary}/>
      <Text style={[styles.label, createTextColorStyle(hasActive ? colors.primary : colors.textSecondary)]}>
        {label}
      </Text>
      {hasActive && (<View style={[styles.badge, createViewBackgroundColorStyle(colors.primary)]}>
          <Text style={[styles.badgeText, createTextColorStyle2(colors.textInverse)]}>{activeCount}</Text>
        </View>)}
    </Pressable>);
}

