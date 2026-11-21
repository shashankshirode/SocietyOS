import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { AppText } from "../../../../shared/components/AppText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { SupportedCountry } from "../data/membership.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, createViewBorderColorBackgroundColorBorderWidthStyle, createPressableBorderRightColorStyle, createAppTextColorStyle, createTextInputColorStyle, createAppTextColorStyle2 } from "../styles/components/PhoneIdentityField.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
interface PhoneIdentityFieldProps {
    country: SupportedCountry;
    value: string;
    onChangeText: (text: string) => void;
    onCountryPress: () => void;
    error?: string;
    editable?: boolean;
}
export function PhoneIdentityField({ country, value, onChangeText, onCountryPress, error, editable = true, }: PhoneIdentityFieldProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);
    const handleTextChange = (text: string) => {
        const numeric = text.replace(/[^0-9]/g, '');
        if (numeric.length <= country.phoneNumberMaxLength) {
            onChangeText(numeric);
        }
    };
    const focusBorderColor = error
        ? colors.danger
        : isFocused
            ? colors.primary
            : colors.inputBorder;
    return (<View style={styles.container}>
      <View style={[
            styles.inputContainer,
            createViewBorderColorBackgroundColorBorderWidthStyle(focusBorderColor, colors.inputBackground, isFocused || error ? 1.5 : 1),
        ]}>
        <Pressable style={[styles.countryTrigger, createPressableBorderRightColorStyle(colors.divider)]} onPress={onCountryPress} disabled={!editable} accessibilityRole="button" accessibilityLabel={formatUiLiteral(localizedUiText.m_36635581f518, [country.displayName, country.callingCode])}>
          <AppText style={styles.flag}>{country.flag}</AppText>
          <AppText variant="body" style={[styles.code, createAppTextColorStyle(colors.textPrimary)]}>
            {country.callingCode}
          </AppText>
          <Ionicons name="chevron-down" size={12} color={colors.textMuted} style={styles.chevron}/>
        </Pressable>

        <TextInput style={[styles.input, createTextInputColorStyle(colors.inputText)]} value={value} onChangeText={handleTextChange} placeholder={country.phoneNumberExample} placeholderTextColor={colors.inputPlaceholder} keyboardType="phone-pad" editable={editable} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} accessibilityLabel={localizedUiText.m_ae7f82ff75a6}/>

        {value.length >= country.phoneNumberMinLength && !error && (<View style={styles.validBadge}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success}/>
          </View>)}
      </View>

      
      <View style={styles.errorContainer}>
        {!!error && (<AppText variant="caption" style={[styles.errorText, createAppTextColorStyle2(colors.danger)]}>
            {error}
          </AppText>)}
      </View>
    </View>);
}
