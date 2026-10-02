import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ImageStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { SocietyOSLogo } from '../../../../shared/components/SocietyOSLogo';
import { useAuth } from '../../../../core/auth/AuthProvider';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
  FONT_FAMILY_SERIF,
  FONT_FAMILY_SERIF_ITALIC,
} from '../../../../shared/theme/typography';

interface ResidentLoginScreenProps {
  onBack?: () => void;
  onSuccess?: () => void;
  onNeedHelp?: () => void;
  onRegister?: () => void;
}

export function ResidentLoginScreen({
  onBack,
  onSuccess,
  onNeedHelp,
  onRegister,
}: ResidentLoginScreenProps) {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [role, setRole] = useState<'resident' | 'staff'>('resident');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topPadding = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 20);
  const bottomPadding = Math.max(insets.bottom, 12);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (role === 'resident') {
        await login('RESIDENT_OWNER');
      } else {
        await login('SOCIETY_ADMIN');
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding + 4, paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* 1. TOP BAR */}
        <View style={styles.topBar}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={12}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M19 12H5M12 19l-7-7 7-7"
                  stroke="#10201D"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          ) : (
            <View style={{ width: 32 }} />
          )}

          <Pressable
            onPress={onNeedHelp}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Need help?"
          >
            <Text style={styles.helpText}>Need help?</Text>
          </Pressable>
        </View>

        {/* 2. BRAND LOGO */}
        <View style={styles.brandContainer}>
          <SocietyOSLogo size="md" color="#10201D" />
        </View>

        {/* 3. ROLE SELECTOR */}
        <View style={styles.roleSelector}>
          <Pressable
            onPress={() => setRole('resident')}
            style={[
              styles.roleTab,
              role === 'resident' && styles.roleTabActive,
            ]}
          >
            <Text
              style={[
                styles.roleText,
                role === 'resident' && styles.roleTextActive,
              ]}
            >
              Resident
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setRole('staff')}
            style={[
              styles.roleTab,
              role === 'staff' && styles.roleTabActive,
            ]}
          >
            <Text
              style={[
                styles.roleText,
                role === 'staff' && styles.roleTextActive,
              ]}
            >
              Society Staff
            </Text>
          </Pressable>
        </View>

        {/* 4. FORM FIELDS */}
        <View style={styles.formContainer}>
          {/* Mobile Number Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Mobile number</Text>
            <View style={styles.inputBox}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.inputLeadingIcon}>
                <Path
                  d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM12 18h.01"
                  stroke="#69716D"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>

              <View style={styles.countryPicker}>
                <Text style={styles.countryCodeText}>+91</Text>
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="m6 9 6 6 6-6"
                    stroke="#69716D"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>

              <View style={styles.inputDivider} />

              <TextInput
                style={styles.textInput}
                placeholder="Enter your mobile number"
                placeholderTextColor="#A0A5A2"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputBox}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.inputLeadingIcon}>
                <Path
                  d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4"
                  stroke="#69716D"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>

              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Enter your password"
                placeholderTextColor="#A0A5A2"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />

              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={8}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      stroke="#69716D"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Circle cx="12" cy="12" r="3" stroke="#69716D" strokeWidth={1.8} />
                  </Svg>
                ) : (
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"
                      stroke="#69716D"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </Pressable>
            </View>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsRow}>
            <Pressable
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.rememberMeGroup}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && (
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="m5 12 5 5L20 7"
                      stroke="#FFFFFF"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </Pressable>

            <Pressable hitSlop={8}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Sign In CTA Button */}
          <Pressable
            onPress={handleSignIn}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.signInButton,
              pressed && styles.buttonPressed,
              isLoading && { opacity: 0.8 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
          >
            <Text style={styles.signInText}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Text>
            {!isLoading && (
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="#FFFFFF"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            )}
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <Text style={styles.dividerText}>or continue with</Text>
          </View>

          {/* Social Buttons */}
          <View style={styles.socialButtonsRow}>
            {/* Google */}
            <Pressable
              onPress={handleSignIn}
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.socialButtonPressed,
              ]}
            >
              <Svg width={16} height={16} viewBox="0 0 24 24">
                <Path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <Path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <Path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <Path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </Svg>
              <Text style={styles.socialText}>Continue with Google</Text>
            </Pressable>

            {/* Apple */}
            <Pressable
              onPress={handleSignIn}
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.socialButtonPressed,
              ]}
            >
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="#000000">
                <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.58.67-.99 1.74-.88 2.76 1 .08 1.98-.51 2.6-1.26z" />
              </Svg>
              <Text style={styles.socialText}>Continue with Apple</Text>
            </Pressable>
          </View>

          {/* New to SocietyOS CTA */}
          {onRegister && (
            <Pressable
              onPress={onRegister}
              style={({ pressed }) => [
                styles.registerRow,
                pressed && { opacity: 0.75 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="New to Society? Register or Onboard your unit"
            >
              <Text style={styles.registerPrompt}>New to Society? </Text>
              <Text style={styles.registerLink}>Register & Onboard Your Home</Text>
            </Pressable>
          )}
        </View>

        {/* Accessible quote for testing / accessibility */}
        <View style={styles.accessibleHidden}>
          <Text>More than homes.</Text>
          <Text>A better way to live together.</Text>
        </View>

        {/* 5. BOTTOM SKYLINE & EDITORIAL QUOTE */}
        <View style={styles.bottomIllustrationContainer}>
          <Image
            source={require('../../../../../assets/images/login-skyline.png')}
            style={styles.skylineImage}
            resizeMode="cover"
          />
          {/* Ivory Mound Arch matching Reference */}
          <Svg
            width="100%"
            height={96}
            viewBox="0 0 390 96"
            preserveAspectRatio="none"
            style={styles.moundSvg}
          >
            <Path
              d="M 0 42 Q 195 -12 390 42 L 390 96 L 0 96 Z"
              fill="#FAF8F1"
            />
          </Svg>
          <View style={styles.editorialQuoteBox}>
            <Text style={styles.quoteLineNormal}>More than homes.</Text>
            <Text style={styles.quoteLineSerif}>A better way to live together.</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F1',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  backButton: {
    padding: 6,
    marginLeft: -6,
  },
  helpText: {
    fontSize: 13.5,
    color: '#69716D',
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 10,
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: '#EBE8DE',
    borderRadius: 22,
    padding: 3,
    marginBottom: 14,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
  },
  roleTabActive: {
    backgroundColor: '#064F45',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  roleText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#69716D',
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
  },
  roleTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: FONT_FAMILY_INTER_BOLD,
  },
  formContainer: {
    gap: 13,
  },
  fieldGroup: {
    gap: 5,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#10201D',
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DC',
    borderRadius: 13,
    paddingHorizontal: 13,
  },
  inputLeadingIcon: {
    marginRight: 8,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countryCodeText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#10201D',
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
  },
  inputDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#E5E3DC',
    marginHorizontal: 9,
  },
  textInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#10201D',
    fontFamily: FONT_FAMILY_INTER,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 1,
  },
  rememberMeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#064F45',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#064F45',
  },
  rememberText: {
    fontSize: 12.5,
    color: '#10201D',
    fontFamily: FONT_FAMILY_INTER,
  },
  forgotText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#064F45',
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
  },
  errorText: {
    fontSize: 12,
    color: '#D9534F',
    marginTop: 2,
  },
  signInButton: {
    backgroundColor: '#064F45',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 24,
    gap: 8,
    marginTop: 4,
    shadowColor: '#043F38',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonPressed: {
    backgroundColor: '#043F38',
    transform: [{ scale: 0.99 }],
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '600',
    fontFamily: FONT_FAMILY_INTER_BOLD,
  },
  dividerRow: {
    alignItems: 'center',
    marginVertical: 2,
  },
  dividerText: {
    fontSize: 11.5,
    color: '#7C837F',
    fontFamily: FONT_FAMILY_INTER,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DC',
    borderRadius: 11,
    gap: 8,
  },
  socialButtonPressed: {
    backgroundColor: '#F7F5EE',
  },
  socialText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10201D',
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
  },
  accessibleHidden: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  bottomIllustrationContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginHorizontal: -22,
    height: 190,
    position: 'relative',
    overflow: 'hidden',
  },
  skylineImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.95,
  } as ImageStyle,
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 6,
  },
  registerPrompt: {
    fontSize: 14,
    color: '#69716D',
    fontFamily: FONT_FAMILY_INTER,
  },
  registerLink: {
    fontSize: 14,
    color: '#041B17',
    fontWeight: '700',
    fontFamily: FONT_FAMILY_INTER_BOLD,
    textDecorationLine: 'underline',
  },
  moundSvg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  editorialQuoteBox: {
    alignItems: 'center',
    paddingBottom: 16,
    zIndex: 2,
  },
  quoteLineNormal: {
    fontSize: 14.5,
    color: '#2C3532',
    fontFamily: FONT_FAMILY_SERIF,
    fontWeight: '400',
  },
  quoteLineSerif: {
    fontSize: 16.5,
    color: '#2C3532',
    fontFamily: FONT_FAMILY_SERIF_ITALIC,
    fontStyle: 'italic',
    marginTop: 2,
  },
});

export default ResidentLoginScreen;
