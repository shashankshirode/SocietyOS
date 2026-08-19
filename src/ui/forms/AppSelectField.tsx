import { Pressable, type ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useMessages } from "../../messages";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { PickerModal, useModalController } from "../modal";
import { FormFieldContainer } from "./FormFieldContainer";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createPressableBorderColorBackgroundColorSpread3Style } from "./styles/AppSelectField.styles";
export interface SelectOption<T extends string = string> {
    label: string;
    value: T;
}
export interface AppSelectFieldProps<T extends string = string> {
    label: string;
    value: T;
    options: SelectOption<T>[];
    onChange: (value: T) => void;
    error?: string;
    helperText?: string;
    required?: boolean;
    containerStyle?: ViewStyle;
}
export function AppSelectField<T extends string = string>({ label, value, options, onChange, error, helperText, required, containerStyle, }: AppSelectFieldProps<T>) {
    const { colors, shadows } = useAppTheme();
    const messages = useMessages();
    const picker = useModalController();
    const selectedOption = options.find((option) => option.value === value);
    return (<>
      <FormFieldContainer label={label} {...includeWhenPresent("error", error)} {...includeWhenPresent("helperText", helperText)} {...includeWhenPresent("required", required)} {...includeWhenPresent("style", containerStyle)}>
        <Pressable onPress={picker.open} style={[
            styles.selectWrapper,
            createPressableBorderColorBackgroundColorSpread3Style(error ? colors.danger : colors.border, colors.inputBackground, shadows.soft),
        ]} accessibilityRole="button" accessibilityLabel={`${label}: ${selectedOption?.label ?? messages.common.selectOption}`}>
          <SafeText style={[styles.valueText, createSafeTextColorStyle(selectedOption ? colors.textPrimary : colors.textMuted)]}>
            {selectedOption?.label ?? messages.common.selectOption}
          </SafeText>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary}/>
        </Pressable>
      </FormFieldContainer>

      <PickerModal visible={picker.isOpen} title={label} options={options} selectedValue={value} onSelect={(nextValue) => {
            const option = options.find((candidate) => candidate.value === nextValue);
            if (option)
                onChange(option.value);
        }} onClose={picker.close}/>
    </>);
}
export default AppSelectField;

