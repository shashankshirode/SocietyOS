import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '../../../shared/layouts/ScreenContainer';
import { ResponsivePageHeader } from '../../../shared/layouts/ResponsivePageHeader';
import { AppButton } from '../../../shared/components/AppButton';
import { AppCard } from '../../../shared/cards/AppCard';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { DataRow } from '../../../shared/dataDisplay/DataRow';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { EmptyState } from '../../../shared/components/EmptyState';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { formatUiLiteral } from '../../../shared/localization/formatUiLiteral';
import { getActiveUiLiteral } from '../../../shared/localization/activeUiLiteral';
import { SocietyService } from '../services/societyService';
import type { Society, SocietyLifecycleStatus } from '../data/societyProperty.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';

type Props = {
  navigation: NativeStackNavigationProp<SuperAdminStackParamList, 'SOCIETY_LIST'>;
  route: RouteProp<SuperAdminStackParamList, 'SOCIETY_LIST'>;
};

const STATUS_COLORS: Record<SocietyLifecycleStatus, string> = {
  DRAFT: '#6B7280',
  CONFIGURING: '#3B82F6',
  VALIDATING: '#F59E0B',
  READY: '#10B981',
  ACTIVE: '#059669',
  SUSPENDED: '#EF4444',
  ARCHIVED: '#9CA3AF',
};

const STATUS_ACTIONS: Record<SocietyLifecycleStatus, { label: string; action: 'configure' | 'review' | 'activate' | 'open' }> = {
  DRAFT: { label: 'Continue Setup', action: 'configure' },
  CONFIGURING: { label: 'Continue Configuration', action: 'configure' },
  VALIDATING: { label: 'Review Validation', action: 'review' },
  READY: { label: 'Review & Activate', action: 'activate' },
  ACTIVE: { label: 'Open Society', action: 'open' },
  SUSPENDED: { label: 'Review', action: 'review' },
  ARCHIVED: { label: 'View', action: 'review' },
};

export function SocietyListScreen({ navigation }: Props) {
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const { colors } = useAppTheme();
  const [societies, setSocieties] = useState<Society[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSocieties();
  }, []);

  const loadSocieties = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SocietyService.getSocieties();
      setSocieties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load societies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (society: Society) => {
    const action = STATUS_ACTIONS[society.status]?.action;
    switch (action) {
      case 'configure':
        navigation.navigate('SocietyOnboarding', { societyId: society.id, mode: 'edit' });
        break;
      case 'review':
        navigation.navigate('SOCIETY_VALIDATION', { societyId: society.id });
        break;
      case 'activate':
        navigation.navigate('SOCIETY_ACTIVATION', { societyId: society.id });
        break;
      case 'open':
        navigation.navigate('PlatformSocietyDetail', { societyId: society.id });
        break;
    }
  };

  const handleDelete = (society: Society) => {
    Alert.alert(
      getActiveUiLiteral("m_233f644f36b8"),
      formatUiLiteral(getActiveUiLiteral("m_ddf785b79c42"), [society.name]),
      [
        { text: getActiveUiLiteral("m_6aadac2f2b7a"), style: 'cancel' },
        {
          text: getActiveUiLiteral("m_1282d9db3fce"),
          style: 'destructive',
          onPress: async () => {
            try {
              await SocietyService.updateSociety({ id: society.id, status: 'ARCHIVED' });
              loadSocieties();
            } catch (err) {
              Alert.alert(getActiveUiLiteral("m_233f644f36b8"), err instanceof Error ? err.message : 'Failed to archive');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <ResponsivePageHeader title={getActiveUiLiteral("m_3362c251f881")} />
          <LoadingState message={getActiveUiLiteral("m_23b87850823d")} />
        </SafeAreaView>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <ResponsivePageHeader title={getActiveUiLiteral("m_3362c251f881")} />
          <ErrorState message={error} onRetry={loadSocieties} />
        </SafeAreaView>
      </ScreenContainer>
    );
  }

  if (societies.length === 0) {
    return (
      <ScreenContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <ResponsivePageHeader title={getActiveUiLiteral("m_3362c251f881")} />
          <EmptyState
            title={getActiveUiLiteral("m_1c027aeecfa8")}
            description={getActiveUiLiteral("m_495e13ae2b3d")}
            actionTitle={getActiveUiLiteral("m_1282d9db3fce")}
            onAction={() => navigation.navigate('SocietyOnboarding', { mode: 'create' })}
          />
        </SafeAreaView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <ResponsivePageHeader title={getActiveUiLiteral("m_3362c251f881")} />
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          {societies.map((society) => {
            const statusColor = STATUS_COLORS[society.status];
            const action = STATUS_ACTIONS[society.status];
            return (
              <AppCard key={society.id} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 }}>
                      {society.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 2 }}>
                      {society.address.city}, {society.address.state}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textMuted }}>
                      {getActiveUiLiteral("m_9fb6669a77ea")}: {society.totalUnits} {getActiveUiLiteral("m_c5aede3e6faa")}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 8 }}>
                    <StatusBadge
                      status={society.status}
                      label={society.status}
                    />
                    <AppButton
                      title={action.label}
                      onPress={() => handleAction(society)}
                      size="sm"
                      variant={society.status === 'READY' ? 'primary' : 'secondary'}
                    />
                  </View>
                </View>
                <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <DataRow label={getActiveUiLiteral("m_29894a6ccc25")} value={society.type} />
                  <DataRow label={getActiveUiLiteral("m_7a6c4da06ed9")} value={society.planCode} />
                  <DataRow label={getActiveUiLiteral("m_150f3e5e3c03")} value={new Date(society.createdAt).toLocaleDateString()} />
                </View>
              </AppCard>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}