import { TextInput, View, type TextInputProps, type ViewStyle, type TextStyle } from "react-native";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { FormFieldContainer } from "./FormFieldContainer";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createViewHeightStyle, createTextInputColorStyle, createViewBorderColorBackgroundColorSpread3Style } from "./styles/AppTextField.styles";
export interface AppTextFieldProps extends Omit<TextInputProps, 'style'> {
    label: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
}
export function AppTextField({ label, error, helperText, required, containerStyle, inputStyle, multiline, numberOfLines = 1, ...props }: AppTextFieldProps) {
    const { colors, shadows } = useAppTheme();
    return (<FormFieldContainer label={label} {...includeWhenPresent("error", error)} {...includeWhenPresent("helperText", helperText)} {...includeWhenPresent("required", required)} {...includeWhenPresent("style", containerStyle)}>
      <View style={[
            styles.inputWrapper,
            createViewBorderColorBackgroundColorSpread3Style(error ? colors.danger : colors.border, props.editable === false ? colors.backgroundSoft : colors.inputBackground, shadows.soft),
            multiline && createViewHeightStyle(Math.max(88, numberOfLines * 24 + 20)),
        ]}>
        <TextInput style={[
            styles.input,
            createTextInputColorStyle(colors.inputText),
            multiline && styles.multilineInput,
            inputStyle,
        ]} placeholderTextColor={colors.inputPlaceholder} {...includeWhenPresent("multiline", multiline)} numberOfLines={numberOfLines} textAlignVertical={multiline ? 'top' : 'center'} {...props}/>
      </View>
    </FormFieldContainer>);
}
export default AppTextField;

