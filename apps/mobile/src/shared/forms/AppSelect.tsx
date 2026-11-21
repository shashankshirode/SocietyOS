import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createTextColorStyle, createTextColorStyle2, createTextColorStyle3, createTextColorStyle4, createPressableBackgroundColorBorderColorOpacityShadowColorSpread5Style } from "./styles/AppSelect.styles";
type SelectOption<T extends string> = {
    label: string;
    value: T;
};
type AppSelectProps<T extends string> = {
    label: string;
    value: T | '';
    options: SelectOption<T>[];
    onChange: (value: T) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
};
export function AppSelect<T extends string>({ label, value, options, onChange, error, required = false, disabled = false, }: AppSelectProps<T>) {
    const { colors, shadows } = useAppTheme();
    return (<View style={styles.container}>
      <Text style={[styles.label, createTextColorStyle2(colors.textPrimary)]}>
        {label}
        {required ? <Text style={createTextColorStyle(colors.danger)}> *</Text> : null}
      </Text>
      <View style={styles.options}>
        {options.map((option) => {
            const selected = value === option.value;
            return (<Pressable key={option.value} onPress={disabled ? undefined : () => onChange(option.value)} accessibilityRole="button" accessibilityLabel={option.label} accessibilityState={{ selected, disabled }} style={[
                    styles.option,
                    createPressableBackgroundColorBorderColorOpacityShadowColorSpread5Style(selected ? colors.primary : colors.surface, selected ? colors.primary : colors.border, disabled ? 0.5 : 1, colors.shadow, shadows.soft),
                ]}>
              <Text style={[styles.optionText, createTextColorStyle3(selected ? colors.textOnPrimary : colors.textSecondary)]}>{option.label}</Text>
            </Pressable>);
        })}
      </View>
      {error ? <Text style={[styles.error, createTextColorStyle4(colors.danger)]}>{error}</Text> : null}
    </View>);
}
export default AppSelect;

