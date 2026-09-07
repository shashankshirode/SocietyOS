import { Pressable } from "react-native";
import { WrapRow } from "../layout/WrapRow";
import { Spacing } from "../theme/spacing";
import { useAppTheme } from "../theme/useAppTheme";
import { SafeText } from "./SafeText";
import { styles, createPressableBackgroundColorBorderColorStyle } from "./styles/FilterChipBar.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { formatUiLiteral } from "../localization/formatUiLiteral";
export type EliteFilterOption<T extends string = string> = {
    label: string;
    value: T;
    count?: number;
};
type FilterChipBarProps<T extends string = string> = {
    options: EliteFilterOption<T>[];
    value: T;
    onChange: (value: T) => void;
};
export function FilterChipBar<T extends string = string>({ options, value, onChange }: FilterChipBarProps<T>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    return (<WrapRow gap={Spacing.sm}>
      {options.map((option) => {
            const selected = option.value === value;
            return (<Pressable key={option.value} onPress={() => onChange(option.value)} accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={formatUiLiteral(localizedUiText.m_77d53878eaef, [option.label])} style={[styles.chip, createPressableBackgroundColorBorderColorStyle(selected ? colors.primary : colors.surface, selected ? colors.primary : colors.border)]}>
            <SafeText variant="caption" color={selected ? 'inverse' : 'secondary'} numberOfLines={2}>
              {option.label}{option.count !== undefined ? ` (${option.count})` : ''}
            </SafeText>
          </Pressable>);
        })}
    </WrapRow>);
}

