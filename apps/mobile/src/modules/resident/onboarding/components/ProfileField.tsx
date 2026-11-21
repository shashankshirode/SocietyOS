import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
} from '../../../../shared/theme/typography';

interface ProfileFieldProps extends TextInputProps {
  label: string;
  helperText?: string;
  error?: string | null;
  leadingIcon?: React.ReactNode;
  verifiedBadge?: boolean;
  required?: boolean;
}

export function ProfileField({
  label,
  helperText,
  error,
  leadingIcon,
  verifiedBadge = false,
  required = false,
  value,
  onChangeText,
  placeholder,
  ...rest
}: ProfileFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.labelText}>
          {label}
          {required && <Text style={styles.requiredAsterisk}> *</Text>}
        </Text>
        {verifiedBadge && (
          <View style={styles.verifiedBadge}>
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <Path
                d="m5 12 5 5L20 7"
                stroke="#1B7A4E"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      <View
        style={[
          styles.inputBox,
          isFocused && styles.inputBoxFocused,
          Boolean(error) && styles.inputBoxError,
          rest.editable === false && styles.inputBoxDisabled,
        ]}
      >
        {leadingIcon && <View style={styles.leadingIcon}>{leadingIcon}</View>}

        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#A0A5A2"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelText: {
    fontSize: 13.5,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#10201D',
  },
  requiredAsterisk: {
    color: '#D9534F',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  verifiedText: {
    fontSize: 11.5,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#1B7A4E',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EBE8DE',
    paddingHorizontal: 14,
  },
  inputBoxFocused: {
    borderColor: '#064F45',
  },
  inputBoxError: {
    borderColor: '#D9534F',
  },
  inputBoxDisabled: {
    backgroundColor: '#F7FAF9',
    borderColor: '#E5E3DC',
  },
  leadingIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#10201D',
  },
  helperText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER,
    color: '#7C8581',
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER,
    color: '#D9534F',
  },
});
