import { useRef, useCallback } from "react";
import { TextInput, View, Platform } from "react-native";
import { AppText } from "../../../../shared/components/AppText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { styles, createViewBorderColorBackgroundColorStyle, createAppTextColorStyle, createViewBackgroundColorStyle } from "../styles/components/OtpCodeInput.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
interface OtpCodeInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onComplete?: (code: string) => void;
    length?: number;
    error?: boolean;
    disabled?: boolean;
}
export function OtpCodeInput({ value, onChangeText, onComplete, length = 6, error = false, disabled = false, }: OtpCodeInputProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const inputRef = useRef<TextInput>(null);
    const handleChange = useCallback((text: string) => {
        const sanitized = text.replace(/[^0-9]/g, '').slice(0, length);
        onChangeText(sanitized);
        if (sanitized.length === length && onComplete) {
            onComplete(sanitized);
        }
    }, [length, onChangeText, onComplete]);
    const handlePress = () => {
        inputRef.current?.focus();
    };
    const digits = Array.from({ length }, (_, i) => value[i] ?? '');
    return (<View style={styles.container} accessibilityLabel={formatUiLiteral(localizedUiText.m_a53e6d3f6ba6, [length])}>
      <View style={styles.slotsRow} onTouchEnd={handlePress}>
        {digits.map((digit, index) => {
            const isCurrent = index === value.length;
            const isFilled = digit !== '';
            const borderColor = error
                ? colors.danger
                : isCurrent
                    ? colors.primary
                    : isFilled
                        ? colors.primary
                        : colors.inputBorder;
            return (<View key={index} style={[
                    styles.slot,
                    createViewBorderColorBackgroundColorStyle(borderColor, isFilled ? colors.primarySoft : colors.inputBackground),
                ]}>
              {isFilled ? (<AppText variant="h2" style={[styles.digit, createAppTextColorStyle(colors.textPrimary)]}>
                  {digit}
                </AppText>) : isCurrent ? (<View style={[styles.cursor, createViewBackgroundColorStyle(colors.primary)]}/>) : null}
            </View>);
        })}
      </View>
      <TextInput ref={inputRef} value={value} onChangeText={handleChange} keyboardType="number-pad" maxLength={length} style={styles.hiddenInput} caretHidden autoFocus editable={!disabled} textContentType={Platform.OS === 'ios' ? 'oneTimeCode' : undefined} autoComplete={Platform.OS === 'android' ? 'sms-otp' : undefined} importantForAccessibility="no"/>
    </View>);
}

