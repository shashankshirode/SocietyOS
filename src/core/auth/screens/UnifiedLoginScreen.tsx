import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, Keyboard, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '../AuthProvider';
import { AppButton } from '../../../shared/components/AppButton';
import { AppCard } from '../../../shared/cards/AppCard';
import { ScreenScaffold } from '../../../shared/layout/ScreenScaffold';
import { Stack } from '../../../shared/layout/Stack';
import { Box } from '../../../shared/layout/Box';
import { AppText } from '../../../shared/components/AppText';
import { AppIconBubble } from '../../../shared/icons/AppIconBubble';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { LoadingState } from '../../../shared/feedback/LoadingState';

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 22,
    letterSpacing: 8,
    textAlign: 'center',
    fontWeight: '700',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  helperBadge: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
  },
  devPersonaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

type AuthStage = 'ENTER_PHONE' | 'ENTER_OTP' | 'REGISTER_NEW_USER';

export function UnifiedLoginScreen() {
  const { loginWithPhone, requestOtp, registerNewUser, setMockSession, status } = useAuth();
  const { colors } = useAppTheme();

  const [stage, setStage] = useState<AuthStage>('ENTER_PHONE');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDevPersonas, setShowDevPersonas] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendTimer]);

  const handleSendOtp = useCallback(async () => {
    const cleanNumber = mobileNumber.replace(/\D/g, '').slice(-10);
    if (cleanNumber.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setError(null);

    try {
      const res = await requestOtp(cleanNumber);
      if (res.success) {
        setStage('ENTER_OTP');
        setResendTimer(res.retryAfterSeconds ?? 30);
      } else {
        setError(res.error || 'Failed to send verification code.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request OTP');
    } finally {
      setIsLoading(false);
    }
  }, [mobileNumber, requestOtp]);

  const handleVerifyOtp = useCallback(async () => {
    if (otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setError(null);

    try {
      const res = await loginWithPhone(mobileNumber, otp.trim());
      if (!res.success) {
        setError(res.error || 'Verification failed. Please check the code.');
      } else if (res.isNewUser) {
        setStage('REGISTER_NEW_USER');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  }, [mobileNumber, otp, loginWithPhone]);

  const handleRegister = useCallback(async () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setError(null);

    try {
      const res = await registerNewUser(mobileNumber, fullName.trim(), email.trim() || undefined);
      if (!res.success) {
        setError(res.error || 'Registration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }, [mobileNumber, fullName, email, registerNewUser]);

  if (status === 'loading') {
    return <LoadingState message="Authenticating..." />;
  }

  return (
    <ScreenScaffold scroll style={{ flex: 1 }}>
      <Stack gap="xl" style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 }}>
        <Box alignItems="center">
          <AppIconBubble name="home" size={80} iconSize={36} color={colors.primary} backgroundColor={colors.primarySoft} />
          <AppText variant="displayMedium" style={{ marginTop: 16, color: colors.textPrimary }}>
            Society OS
          </AppText>
          <AppText variant="bodyMedium" style={{ marginTop: 8, color: colors.textSecondary, textAlign: 'center' }}>
            Residential Community Management Platform
          </AppText>
        </Box>

        {stage === 'ENTER_PHONE' && (
          <AppCard style={{ padding: 20 }}>
            <Stack gap="md">
              <AppText variant="sectionTitle" style={{ color: colors.textPrimary }}>Sign In with Mobile</AppText>
              <AppText variant="bodySmall" style={{ color: colors.textSecondary }}>
                Enter your 10-digit mobile number to receive a secure login OTP.
              </AppText>

              <View style={styles.inputContainer}>
                <AppText variant="caption" style={styles.inputLabel}>Mobile Number</AppText>
                <View style={styles.phoneRow}>
                  <View style={[styles.countryBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <AppText variant="bodyMedium" style={[styles.countryText, { color: colors.textPrimary }]}>+91</AppText>
                  </View>
                  <TextInput
                    style={[styles.input, { flex: 1, borderColor: colors.border, backgroundColor: colors.background, color: colors.textPrimary }]}
                    placeholder="98765 43210"
                    placeholderTextColor={colors.textSecondary}
                    value={mobileNumber}
                    onChangeText={(val) => {
                      setMobileNumber(val);
                      if (error) setError(null);
                    }}
                    keyboardType="number-pad"
                    maxLength={10}
                    autoFocus
                  />
                </View>
                {error && <AppText variant="caption" style={styles.errorText}>{error}</AppText>}
              </View>

              <AppButton
                title="Get Verification Code"
                onPress={handleSendOtp}
                loading={isLoading}
                disabled={isLoading || mobileNumber.replace(/\D/g, '').length < 10}
                style={{ marginTop: 8 }}
              />
            </Stack>
          </AppCard>
        )}

        {stage === 'ENTER_OTP' && (
          <AppCard style={{ padding: 20 }}>
            <Stack gap="md">
              <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <AppText variant="sectionTitle" style={{ color: colors.textPrimary }}>Verify OTP</AppText>
                <Pressable onPress={() => { setStage('ENTER_PHONE'); setError(null); }}>
                  <AppText variant="caption" style={{ color: colors.primary, fontWeight: '600' }}>Edit Number</AppText>
                </Pressable>
              </Box>

              <AppText variant="bodySmall" style={{ color: colors.textSecondary }}>
                Verification code sent to +91 {mobileNumber}
              </AppText>

              <View style={[styles.helperBadge, { backgroundColor: `${colors.primary}12`, borderColor: `${colors.primary}30` }]}>
                <AppText variant="caption" style={{ color: colors.primary, fontWeight: '600' }}>
                  Demo Verification Code: 123456
                </AppText>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.otpInput, { borderColor: colors.border, backgroundColor: colors.background, color: colors.textPrimary }]}
                  placeholder="123456"
                  placeholderTextColor={colors.textSecondary}
                  value={otp}
                  onChangeText={(val) => {
                    setOtp(val.replace(/\D/g, '').slice(0, 6));
                    if (error) setError(null);
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
                {error && <AppText variant="caption" style={styles.errorText}>{error}</AppText>}
              </View>

              <AppButton
                title="Verify & Continue"
                onPress={handleVerifyOtp}
                loading={isLoading}
                disabled={isLoading || otp.length < 6}
                style={{ marginTop: 8 }}
              />

              <Box flexDirection="row" justifyContent="center" alignItems="center" style={{ marginTop: 8 }}>
                {resendTimer > 0 ? (
                  <AppText variant="caption" style={{ color: colors.textSecondary }}>
                    Resend code in {resendTimer}s
                  </AppText>
                ) : (
                  <Pressable onPress={handleSendOtp} disabled={isLoading}>
                    <AppText variant="caption" style={{ color: colors.primary, fontWeight: '600' }}>
                      Resend Code
                    </AppText>
                  </Pressable>
                )}
              </Box>
            </Stack>
          </AppCard>
        )}

        {stage === 'REGISTER_NEW_USER' && (
          <AppCard style={{ padding: 20 }}>
            <Stack gap="md">
              <AppText variant="sectionTitle" style={{ color: colors.textPrimary }}>Complete Your Profile</AppText>
              <AppText variant="bodySmall" style={{ color: colors.textSecondary }}>
                Welcome to Society OS! Please enter your details to set up your account.
              </AppText>

              <View style={styles.inputContainer}>
                <AppText variant="caption" style={styles.inputLabel}>Full Name *</AppText>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background, color: colors.textPrimary }]}
                  placeholder="e.g. Ramesh Patel"
                  placeholderTextColor={colors.textSecondary}
                  value={fullName}
                  onChangeText={setFullName}
                  autoFocus
                />
              </View>

              <View style={styles.inputContainer}>
                <AppText variant="caption" style={styles.inputLabel}>Email Address (Optional)</AppText>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background, color: colors.textPrimary }]}
                  placeholder="ramesh@example.com"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {error && <AppText variant="caption" style={styles.errorText}>{error}</AppText>}
              </View>

              <AppButton
                title="Create Account & Continue"
                onPress={handleRegister}
                loading={isLoading}
                disabled={isLoading || !fullName.trim()}
                style={{ marginTop: 8 }}
              />
            </Stack>
          </AppCard>
        )}

        {/* Developer Personas / Test Switcher */}
        <AppCard style={{ padding: 16, backgroundColor: `${colors.border}15` }}>
          <Pressable onPress={() => setShowDevPersonas(!showDevPersonas)}>
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <AppText variant="caption" style={{ color: colors.textSecondary, fontWeight: '700' }}>
                DEVELOPER PERSONAS (QUICK DEMO)
              </AppText>
              <AppText variant="caption" style={{ color: colors.primary, fontWeight: '600' }}>
                {showDevPersonas ? 'Hide ▲' : 'Show ▼'}
              </AppText>
            </Box>
          </Pressable>

          {showDevPersonas && (
            <Stack gap="sm" style={{ marginTop: 12 }}>
              <Pressable
                style={[styles.devPersonaRow, { borderColor: colors.border }]}
                onPress={() => {
                  setMobileNumber('9876543210');
                  setStage('ENTER_PHONE');
                }}
              >
                <Box>
                  <AppText variant="bodySmall" style={{ fontWeight: '600', color: colors.textPrimary }}>Rohan Sharma</AppText>
                  <AppText variant="caption" style={{ color: colors.textSecondary }}>Resident Owner • 9876543210</AppText>
                </Box>
                <AppText variant="caption" style={{ color: colors.primary }}>Use Phone →</AppText>
              </Pressable>

              <Pressable
                style={[styles.devPersonaRow, { borderColor: colors.border }]}
                onPress={() => {
                  setMobileNumber('9876543213');
                  setStage('ENTER_PHONE');
                }}
              >
                <Box>
                  <AppText variant="bodySmall" style={{ fontWeight: '600', color: colors.textPrimary }}>Priya Mehta</AppText>
                  <AppText variant="caption" style={{ color: colors.textSecondary }}>Resident Tenant • 9876543213</AppText>
                </Box>
                <AppText variant="caption" style={{ color: colors.primary }}>Use Phone →</AppText>
              </Pressable>

              <Pressable
                style={[styles.devPersonaRow, { borderColor: colors.border }]}
                onPress={() => {
                  setMobileNumber('9876543217');
                  setStage('ENTER_PHONE');
                }}
              >
                <Box>
                  <AppText variant="bodySmall" style={{ fontWeight: '600', color: colors.textPrimary }}>Suresh Patil</AppText>
                  <AppText variant="caption" style={{ color: colors.textSecondary }}>Society Admin • 9876543217</AppText>
                </Box>
                <AppText variant="caption" style={{ color: colors.primary }}>Use Phone →</AppText>
              </Pressable>

              <Pressable
                style={[styles.devPersonaRow, { borderColor: colors.border }]}
                onPress={() => {
                  setMobileNumber('9876543214');
                  setStage('ENTER_PHONE');
                }}
              >
                <Box>
                  <AppText variant="bodySmall" style={{ fontWeight: '600', color: colors.textPrimary }}>Vikram Singh</AppText>
                  <AppText variant="caption" style={{ color: colors.textSecondary }}>Security Guard • 9876543214</AppText>
                </Box>
                <AppText variant="caption" style={{ color: colors.primary }}>Use Phone →</AppText>
              </Pressable>

              <Pressable
                style={[styles.devPersonaRow, { borderColor: colors.border }]}
                onPress={() => {
                  setMobileNumber('9999999999');
                  setStage('ENTER_PHONE');
                }}
              >
                <Box>
                  <AppText variant="bodySmall" style={{ fontWeight: '600', color: '#EF4444' }}>Suspended User Test</AppText>
                  <AppText variant="caption" style={{ color: colors.textSecondary }}>Blocked Account • 9999999999</AppText>
                </Box>
                <AppText variant="caption" style={{ color: '#EF4444' }}>Test Block →</AppText>
              </Pressable>

              <Pressable
                style={[styles.devPersonaRow, { borderColor: colors.border, borderBottomWidth: 0 }]}
                onPress={() => {
                  setMobileNumber('9811122233');
                  setStage('ENTER_PHONE');
                }}
              >
                <Box>
                  <AppText variant="bodySmall" style={{ fontWeight: '600', color: colors.primary }}>New Resident Registration</AppText>
                  <AppText variant="caption" style={{ color: colors.textSecondary }}>Unregistered • 9811122233</AppText>
                </Box>
                <AppText variant="caption" style={{ color: colors.primary }}>Register →</AppText>
              </Pressable>
            </Stack>
          )}
        </AppCard>
      </Stack>
    </ScreenScaffold>
  );
}