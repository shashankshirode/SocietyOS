import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '../../../shared/layouts/ScreenContainer';
import { ResponsivePageHeader } from '../../../shared/layouts/ResponsivePageHeader';
import { AppButton } from '../../../shared/components/AppButton';
import { AppCard } from '../../../shared/cards/AppCard';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { useSocietyValidation, useSocietyActivation } from '../hooks/useSocietyValidation';
import { SocietyService } from '../services/societyService';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { formatUiLiteral } from '../../../shared/localization/formatUiLiteral';
import { getActiveUiLiteral } from '../../../shared/localization/activeUiLiteral';
import { includeWhenPresent } from '../../../shared/utils/presentProperty';
import type { ValidationResult, ValidationCheck } from '../data/societyProperty.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';

type Props = {
  navigation: NativeStackNavigationProp<SuperAdminStackParamList, 'SOCIETY_VALIDATION'>;
  route: RouteProp<SuperAdminStackParamList, 'SOCIETY_VALIDATION'>;
};

const CHECK_STATUS_COLORS = {
  PASS: '#10B981',
  FAIL: '#EF4444',
  WARNING: '#F59E0B',
  SKIPPED: '#6B7280',
};

const CHECK_STATUS_ICONS = {
  PASS: 'checkmark-circle',
  FAIL: 'close-circle',
  WARNING: 'alert-circle',
  SKIPPED: 'remove-circle',
};

export function SocietyValidationScreen({ navigation, route }: Props) {
  const { societyId } = route.params;
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const { colors } = useAppTheme();
  const { validationResult, isValidating, validate, clearValidation } = useSocietyValidation();
  const { activate, isActivating, activationError } = useSocietyActivation();
  const [society, setSociety] = useState<any>(null);

  useEffect(() => {
    if (societyId) {
      loadSociety();
      validate(societyId);
    }
  }, [societyId, validate]);

  const loadSociety = async () => {
    try {
      const data = await SocietyService.getSociety(societyId!);
      setSociety(data);
    } catch (error) {
      Alert.alert(getActiveUiLiteral("m_233f644f36b8"), error instanceof Error ? error.message : 'Failed to load society');
    }
  };

  const handleRevalidate = () => {
    if (societyId) validate(societyId);
  };

  const handleConfigure = () => {
    navigation.navigate('SocietyOnboarding', { societyId, mode: 'edit' });
  };

  const handleActivate = async () => {
    try {
      await activate(societyId!, 'current-admin');
      Alert.alert(
        getActiveUiLiteral("m_e64896eb6afe"),
        getActiveUiLiteral("m_16df3cae6505"),
        [{ text: getActiveUiLiteral("m_daee7606b339"), onPress: () => navigation.navigate('PlatformSocietyDetail', { societyId }) }]
      );
    } catch (error) {
      Alert.alert(getActiveUiLiteral("m_233f644f36b8"), error instanceof Error ? error.message : 'Activation failed');
    }
  };

  const handleViewDetails = () => {
    navigation.navigate('PlatformSocietyDetail', { societyId });
  };

  if (!society) {
    return (
      <ScreenContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <ResponsivePageHeader title={getActiveUiLiteral("m_7fe1cfa40e83")} />
          <LoadingState message={getActiveUiLiteral("m_23b87850823d")} />
        </SafeAreaView>
      </ScreenContainer>
    );
  }

  const canActivate = validationResult?.overallStatus === 'READY';

  return (
    <ScreenContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <ResponsivePageHeader
          title={getActiveUiLiteral("m_7fe1cfa40e83")}
          subtitle={formatUiLiteral(getActiveUiLiteral("m_dfc7d751c37d"), [society.name])}
        />
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <AppCard style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <SectionHeader title={getActiveUiLiteral("m_a0d57349fb67")} />
              <StatusBadge
                status={validationResult?.overallStatus ?? 'VALIDATING'}
                label={validationResult?.overallStatus ?? getActiveUiLiteral("m_23b87850823d")}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
              <View style={{ flex: 1, minWidth: 120, padding: 12, backgroundColor: colors.card, borderRadius: 8 }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: CHECK_STATUS_COLORS.PASS }}>
                  {validationResult?.summary.passed ?? 0}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Passed</Text>
              </View>
              <View style={{ flex: 1, minWidth: 120, padding: 12, backgroundColor: colors.card, borderRadius: 8 }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: CHECK_STATUS_COLORS.FAIL }}>
                  {validationResult?.summary.failed ?? 0}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Failed</Text>
              </View>
              <View style={{ flex: 1, minWidth: 120, padding: 12, backgroundColor: colors.card, borderRadius: 8 }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: CHECK_STATUS_COLORS.WARNING }}>
                  {validationResult?.summary.warnings ?? 0}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Warnings</Text>
              </View>
            </View>
          </AppCard>

          <AppCard style={{ marginBottom: 16 }}>
            <SectionHeader title={getActiveUiLiteral("m_c3b74c9d50e3")} />
            {validationResult?.checks.map((check: ValidationCheck) => (
              <View key={check.id} style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Text style={{ fontSize: 16, color: CHECK_STATUS_COLORS[check.status] }}>
                    {CHECK_STATUS_ICONS[check.status]}
                  </Text>
                  <Text style={{ fontWeight: '600', color: colors.textPrimary }}>{check.name}</Text>
                  <StatusBadge
                    status={check.status}
                    label={check.status}
                  />
                </View>
                <Text style={{ fontSize: 13, color: colors.textSecondary, marginLeft: 24 }}>{check.description}</Text>
                {check.message && (
                  <Text style={{ fontSize: 12, color: check.severity === 'ERROR' ? colors.danger : check.severity === 'WARNING' ? colors.warning : colors.textMuted, marginLeft: 24, marginTop: 4 }}>
                    {check.message}
                  </Text>
                )}
              </View>
            ))}
          </AppCard>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <AppButton
              title={getActiveUiLiteral("m_6aadac2f2b7a")}
              onPress={() => navigation.goBack()}
              variant="outline"
              style={{ flex: 1 }}
            />
            {validationResult?.overallStatus === 'FAILED' && (
              <AppButton
                title={getActiveUiLiteral("m_bb791fe68da8")}
                onPress={handleConfigure}
                style={{ flex: 1 }}
              />
            )}
            {validationResult?.overallStatus === 'FAILED' && (
              <AppButton
                title={getActiveUiLiteral("m_daee7606b339")}
                onPress={handleRevalidate}
                variant="secondary"
                style={{ flex: 1 }}
              />
            )}
            {canActivate && (
              <AppButton
                title={getActiveUiLiteral("m_e64896eb6afe")}
                onPress={handleActivate}
                loading={isActivating}
                disabled={isActivating}
                style={{ flex: 1 }}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}