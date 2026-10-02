import React, { useState, useCallback } from 'react';
import { View, TextInput, Keyboard, StyleSheet } from 'react-native';
import { useAuth } from '../AuthProvider';
import { AppButton } from '../../../shared/components/AppButton';
import { AppCard } from '../../../shared/cards/AppCard';
import { ScreenScaffold } from '../../../shared/layout/ScreenScaffold';
import { Stack } from '../../../shared/layout/Stack';
import { Box } from '../../../shared/layout/Box';
import { AppText } from '../../../shared/components/AppText';
import { AppIconBubble } from '../../../shared/icons/AppIconBubble';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import type { AppRole } from '../../../core/permissions/permission.types';
import type { AppIconName } from '../../../shared/icons/icon.types';

type LoginRole = 'SUPER_ADMIN' | 'SOCIETY_ADMIN' | 'RESIDENT';

interface RoleOption {
  id: LoginRole;
  label: string;
  description: string;
  icon: AppIconName;
  color: string;
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export function UnifiedLoginScreen() {
  const { login, status } = useAuth();
  const { colors } = useAppTheme();
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const [selectedRole, setSelectedRole] = useState<LoginRole>('RESIDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleOptions: RoleOption[] = [
    {
      id: 'SUPER_ADMIN',
      label: 'Platform Admin',
      description: 'Manage multiple societies, platform settings, and global operations',
      icon: 'grid',
      color: '#7C3AED',
    },
    {
      id: 'SOCIETY_ADMIN',
      label: 'Society Admin',
      description: 'Manage society operations, residents, units, and staff',
      icon: 'building',
      color: '#2563EB',
    },
    {
      id: 'RESIDENT',
      label: 'Resident',
      description: 'Access your home, visitors, complaints, bills, and community',
      icon: 'home',
      color: '#059669',
    },
  ];

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setError(null);

    try {
      let role: AppRole;
      if (selectedRole === 'RESIDENT') {
        role = 'RESIDENT_OWNER';
      } else if (selectedRole === 'SOCIETY_ADMIN') {
        role = 'SOCIETY_ADMIN';
      } else {
        role = 'SUPER_ADMIN';
      }

      await login(role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, selectedRole, login]);

  if (status === 'loading') {
    return <LoadingState message="Loading..." />;
  }

  return (
    <ScreenScaffold style={{ flex: 1 }}>
      <Stack gap="xl" style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40 }}>
        <Box alignItems="center">
          <AppIconBubble name="home" size={80} iconSize={36} color={colors.primary} backgroundColor={colors.primarySoft} />
          <AppText variant="displayMedium" style={{ marginTop: 16, color: colors.textPrimary }}>
            Society OS
          </AppText>
          <AppText variant="bodyMedium" style={{ marginTop: 8, color: colors.textSecondary, textAlign: 'center' }}>
            Sign in to continue
          </AppText>
        </Box>

        <Stack gap="md">
          {roleOptions.map((role) => (
            <AppCard
              key={role.id}
              pressable
              onPress={() => setSelectedRole(role.id)}
              style={{
                borderWidth: selectedRole === role.id ? 2 : 1,
                borderColor: selectedRole === role.id ? role.color : colors.border,
                backgroundColor: selectedRole === role.id ? `${role.color}10` : colors.card,
              }}
            >
              <View style={styles.row}>
                <AppIconBubble name={role.icon} size={48} iconSize={22} color={role.color} backgroundColor={`${role.color}15`} />
                <Box flex={1}>
                  <AppText variant="sectionTitle" style={{ color: colors.textPrimary }}>{role.label}</AppText>
                  <AppText variant="bodySmall" style={{ color: colors.textSecondary, marginTop: 2 }}>{role.description}</AppText>
                </Box>
                {selectedRole === role.id && <AppIconBubble name="check" size={24} iconSize={14} color={role.color} backgroundColor={`${role.color}15`} />}
              </View>
            </AppCard>
          ))}
        </Stack>

        <AppCard style={{ padding: 20 }}>
          <Stack gap="md">
            <AppText variant="sectionTitle" style={{ color: colors.textPrimary }}>Credentials</AppText>
            <View style={styles.inputContainer}>
              <AppText variant="caption" style={styles.inputLabel}>Email</AppText>
              <TextInput
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background, color: colors.textPrimary }]}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {error && <AppText variant="caption" style={styles.errorText}>{error}</AppText>}
            </View>
            <View style={styles.inputContainer}>
              <AppText variant="caption" style={styles.inputLabel}>Password</AppText>
              <TextInput
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background, color: colors.textPrimary }]}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>
            <AppButton
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={{ marginTop: 8 }}
            />
          </Stack>
        </AppCard>
      </Stack>
    </ScreenScaffold>
  );
}