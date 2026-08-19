import { Pressable, View } from "react-native";
import { AppText } from "../components/AppText";
import { AppIcon } from "../icons/AppIcon";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewBorderColorStyle, createViewBackgroundColorStyle } from "./styles/AppCheckbox.styles";
export interface AppCheckboxProps {
    checked: boolean;
    onPress?: () => void;
    label: string;
    disabled?: boolean;
    testID?: string;
}
export function AppCheckbox({ checked, onPress, label, disabled = false, testID, }: AppCheckboxProps) {
    const { colors } = useAppTheme();
    return (<Pressable testID={testID} onPress={disabled || !onPress ? undefined : onPress} style={[styles.container, (disabled || !onPress) && styles.disabled]} accessibilityRole="checkbox" accessibilityState={{ checked, disabled: disabled || !onPress }} accessibilityLabel={label}>
      <View style={[
            styles.checkbox,
            createViewBorderColorStyle(checked ? colors.primary : colors.border),
            checked && createViewBackgroundColorStyle(colors.primary),
        ]}>
        {checked && <AppIcon name="check" size={14} color={colors.white}/>}
      </View>
      <AppText variant="body" tone="primary" style={styles.labelText}>
        {label}
      </AppText>
    </Pressable>);
}
export default AppCheckbox;

