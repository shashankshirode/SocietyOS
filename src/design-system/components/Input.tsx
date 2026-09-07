import React, { forwardRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextStyle, ViewStyle, NativeSyntheticEvent, TextInputFocusEventData, type TextInputProps, } from 'react-native';
import { HapticFeedback } from '../../shared/utils/haptics';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { getColors } from '../tokens/premium-colors';
import { radius } from '../tokens/premium-radius';
import { shadows } from '../tokens/premium-shadows';
import { motion } from '../tokens/premium-motion';
import { spacing } from '../tokens/premium-spacing';
import { typography } from '../tokens/premium-typography';
import type { Absent } from "../../shared/types/absence.types";
export type InputType = 'text' | 'email' | 'password' | 'number' | 'phone' | 'decimal-pad' | 'numeric';
export interface InputProps extends TextInputProps {
    label?: string | Absent;
    error?: string | Absent;
    helperText?: string | Absent;
    leftIcon?: React.ReactNode | Absent;
    rightIcon?: React.ReactNode | Absent;
    type?: InputType | Absent;
    required?: boolean | Absent;
}
const typeKeyboardMap: Record<InputType, InputProps['keyboardType']> = {
    text: 'default',
    email: 'email-address',
    password: 'default',
    number: 'numeric',
    phone: 'phone-pad',
    'decimal-pad': 'decimal-pad',
    numeric: 'numeric',
};
export const Input = forwardRef<TextInput, InputProps>(({ label, placeholder, error, helperText, leftIcon, rightIcon, type = 'text', secureTextEntry = false, style, testID, onFocus, onBlur, onChangeText, value, ...props }, ref) => {
    const { dark } = useAppTheme();
    const tc = getColors(dark ? 'dark' : 'light');
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(!secureTextEntry);
    const isPasswordType = type === 'password';
    const effectiveSecure = isPasswordType && !showPassword;
    const baseStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tc.surface.primary,
        borderWidth: 1,
        borderColor: error ? tc.brand.danger : focused ? tc.brand.primary : tc.border.default,
        borderRadius: radius.md,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        gap: spacing[3],
    };
    const inputStyle: TextStyle = {
        flex: 1,
        fontSize: typography.fontSize.base,
        color: tc.text.primary,
        fontFamily: typography.fontFamily.mono,
    };
    const labelStyle: TextStyle = {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: tc.text.secondary,
        marginBottom: spacing[2],
    };
    const errorStyle: TextStyle = {
        fontSize: typography.fontSize.xs,
        color: tc.brand.danger,
        marginTop: spacing[1],
    };
    const handleFocus: TextInputProps['onFocus'] = (e) => {
        setFocused(true);
        onFocus?.(e);
        HapticFeedback.light();
    };
    const handleBlur: TextInputProps['onBlur'] = (e) => {
        setFocused(false);
        onBlur?.(e);
    };
    const handleChangeText = (text: string) => {
        onChangeText?.(text);
    };
    return (<View style={[styles.container, style]} testID={testID}>
        {label && <Text style={labelStyle}>{label}</Text>}
        <View style={baseStyle}>
          {leftIcon && <View style={styles.iconWrapper}>{leftIcon}</View>}
          <TextInput ref={ref} placeholder={placeholder} placeholderTextColor={tc.text.placeholder} secureTextEntry={effectiveSecure} keyboardType={typeKeyboardMap[type]} style={inputStyle} value={value} onChangeText={handleChangeText} onFocus={handleFocus} onBlur={handleBlur} selectionColor={tc.brand.primary} {...props}/>
          {isPasswordType && (<TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconWrapper} testID="input-toggle-password">
              <Text style={{ color: tc.text.tertiary }}>{showPassword ? '👁' : '🔒'}</Text>
            </TouchableOpacity>)}
          {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>}
        </View>
        {(error || helperText) && (<Text style={errorStyle}>{error || helperText}</Text>)}
      </View>);
});
Input.displayName = 'Input';
const styles = StyleSheet.create({
    container: {
        gap: 4,
        width: '100%',
    },
    iconWrapper: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default Input;

