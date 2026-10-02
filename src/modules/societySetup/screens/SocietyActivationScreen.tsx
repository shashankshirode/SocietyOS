import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '../../../shared/layouts/ScreenContainer';
import { ResponsivePageHeader } from '../../../shared/layouts/ResponsivePageHeader';
import { AppButton } from '../../../shared/components/AppButton';
import { AppCard } from '../../../shared/cards/AppCard';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { useSocietyActivation } from '../hooks/useSocietyValidation';
import { SocietyService } from '../services/societyService';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { formatUiLiteral } from '../../../shared/localization/formatUiLiteral';
import { getActiveUiLiteral } from '../../../shared/localization/activeUiLiteral';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';

type Props = {
  navigation: NativeStackNavigationProp<SuperAdminStackParamList, 'SOCIETY_ACTIVATION'>;
  route: RouteProp<SuperAdminStackParamList, 'SOCIETY_ACTIVATION'>;
};

export function SocietyActivationScreen({ navigation, route }: Props) {
  const { societyId } = route.params;
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const { colors } = useAppTheme();
  const { activate, isActivating, activationError } = useSocietyActivation();
  const [society, setSociety] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (societyId) loadData();
  }, [societyId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [soc, validation] = await Promise.all([
        SocietyService.getSociety(societyId!),
        SocietyService.validateSociety(societyId!),
      ]);
      setSociety(soc);
      setValidationResult(validation);
    } catch (error) {
      Alert.alert(getActiveUiLiteral("m_233f644f36b8"), error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return (
      <ScreenContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <ResponsivePageHeader title={getActiveUiLiteral("m_e64896eb6afe")} />
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
          title={getActiveUiLiteral("m_e64896eb6afe")}
          subtitle={society ? formatUiLiteral(getActiveUiLiteral("m_dfc7d751c37d"), [society.name]) : ''}
        />
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <AppCard style={{ marginBottom: 16 }}>
            <SectionHeader title={getActiveUiLiteral("m_a0d57349fb67")} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary }}>{society?.name}</Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>{society?.status}</Text>
            </View>
          </AppCard>

          <AppCard style={{ marginBottom: 16 }}>
            <SectionHeader title={getActiveUiLiteral("m_97d04342608b")} />
            <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
              <View style={{ flex: 1, minWidth: 100, padding: 12, backgroundColor: colors.card, borderRadius: 8 }}>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Total Units</Text>
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary }}>{society?.totalUnits ?? 0}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 100, padding: 12, backgroundColor: colors.card, borderRadius: 8 }}>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Active Users</Text>
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary }}>{society?.activeUsers ?? 0}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 100, padding: 12, backgroundColor: colors.card, borderRadius: 8 }}>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Modules</Text>
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary }}>{society?.enabledModulesCount ?? 0}</Text>
              </View>
            </View>
          </AppCard>

          <AppCard style={{ marginBottom: 16 }}>
            <SectionHeader title={getActiveUiLiteral("m_c3b74c9d50e3")} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 16, color: validationResult?.overallStatus === 'READY' ? '#10B981' : '#EF4444' }}>
                {validationResult?.overallStatus === 'READY' ? '✓' : '✗'}
              </Text>
              <Text style={{ fontWeight: '600', color: colors.textPrimary }}>
                {validationResult?.overallStatus === 'READY' ? getActiveUiLiteral("m_f116bca63a65") : getActiveUiLiteral("m_9202a63dd74e")}
              </Text>
            </View>
            {validationResult?.summary && (
              <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
                <View style={{ flex: 1, minWidth: 100, padding: 12, backgroundColor: colors.card, borderRadius: 8 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#10B981' }}>{validationResult.summary.passed}</Text>
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>Passed</Text>
                </View>
                <View style={{ flex: 1, minWidth: 100, padding: 12, backgroundColor: colors.card, borderRadius: 8 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#EF4444' }}>{validationResult.summary.failed}</Text>
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>Failed</Text>
                </View>
                <View style={{ flex: 1, minWidth: 100, padding: 12, backgroundColor: colors.card, borderRadius: 8 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#F59E0B' }}>{validationResult.summary.warnings}</Text>
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>Warnings</Text>
                </View>
              </View>
            )}
          </AppCard>

          <AppCard style={{ marginBottom: 16, backgroundColor: canActivate ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderColor: canActivate ? '#10B981' : '#EF4444', borderWidth: 1 }}>
            <SectionHeader title={getActiveUiLiteral("m_e64896eb6afe")} />
            <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
              {canActivate
                ? getActiveUiLiteral("m_f116bca63a65")
                : getActiveUiLiteral("m_9202a63dd74e")}
            </Text>
            <TouchableOpacity
              onPress={() => setConfirmed(!confirmed)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderWidth: 2,
                  borderRadius: 4,
                  borderColor: confirmed ? colors.primary : colors.border,
                  backgroundColor: confirmed ? colors.primary : 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {confirmed && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
              </View>
              <Text style={{ color: colors.textPrimary }}>{getActiveUiLiteral("m_992b909b9f63")}</Text>
            </TouchableOpacity>
            <AppButton
              title={getActiveUiLiteral("m_e64896eb6afe")}
              onPress={handleActivate}
              loading={isActivating}
              disabled={isActivating || !confirmed || !canActivate}
            />
          </AppCard>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}