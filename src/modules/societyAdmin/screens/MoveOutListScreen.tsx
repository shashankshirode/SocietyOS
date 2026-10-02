import React, { useState } from 'react';
import { FlatList, View, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { AppHeader } from '../../../shared/components/AppHeader';
import { AppCard } from '../../../shared/cards/AppCard';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { SearchBar } from '../../../shared/lists/SearchBar';
import { FilterChips } from '../../../shared/lists/FilterChips';
import { EmptyState } from '../../../shared/feedback/EmptyState';
import { useAdminMoveOutRequests } from '../data/useAdminMoveOutRequests';
import { useSociety } from '../../../core/auth/SocietyProvider';
import type { MoveOutRequest, MoveOutStatus } from '../../../shared/types/moveOut.types';
import { MOVE_OUT_STATUS_LABELS } from '../../../shared/types/moveOut.types';
import { styles, createTextColorStyle, createViewBackgroundColorStyle } from '../styles/screens/MoveOutListScreen.styles';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { AppText } from '../../../shared/components/AppText';
import { format } from 'date-fns';

const statusOrder: MoveOutStatus[] = [
  'DRAFT',
  'REQUESTED',
  'CLEARANCE_CHECK',
  'EXCEPTION',
  'READY',
  'PENDING_APPROVAL',
  'APPROVED',
  'REJECTED',
  'RESUBMIT',
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'FAILED',
  'ARCHIVED',
];

const statusColors: Record<MoveOutStatus, string> = {
  DRAFT: 'neutral',
  REQUESTED: 'info',
  CLEARANCE_CHECK: 'warning',
  EXCEPTION: 'danger',
  READY: 'success',
  PENDING_APPROVAL: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  RESUBMIT: 'warning',
  SCHEDULED: 'info',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'neutral',
  FAILED: 'danger',
  ARCHIVED: 'neutral',
};

export function MoveOutListScreen({ navigation }: {
  navigation: {
    navigate: (route: string, params?: any) => void;
    goBack: () => void;
  };
}) {
  const { currentSociety } = useSociety();
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const { colors } = useAppTheme();
  const { data: requests = [], isLoading, error, refetch } = useAdminMoveOutRequests({ societyId: currentSociety?.id || '' });
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<MoveOutStatus | 'ALL'>('ALL');

  const statusOptions = ['ALL', ...statusOrder];

  const filtered = requests.filter((r) => {
    const matchesSearch = r.requestNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase()) ||
      r.unitId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeType = (status: MoveOutStatus) => statusColors[status] || 'neutral';

  const renderRequestItem = ({ item, index }: { item: MoveOutRequest; index: number }) => (
    <Animated.View entering={FadeInLeft.delay(index * 30).duration(300)}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('MoveOutDetail', { requestId: item.id })}
        activeOpacity={0.8}
      >
        <View style={styles.headerRow}>
          <View style={styles.leftSection}>
            <AppText variant="body" style={styles.requestNumber}>{item.requestNumber}</AppText>
            <StatusBadge label={MOVE_OUT_STATUS_LABELS[item.status]} type={getStatusBadgeType(item.status)} style={styles.smallBadge} />
          </View>
        </View>

        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <AppText variant="caption" style={styles.detailLbl}>{localizedUiText.m_4e545960f1bf}</AppText>
            <AppText variant="caption" style={styles.detailVal}>{item.unitId}</AppText>
          </View>
          <View style={styles.detailRow}>
            <AppText variant="caption" style={styles.detailLbl}>{localizedUiText.m_225e2abb60c4}</AppText>
            <AppText variant="caption" style={styles.detailVal}>{format(new Date(item.requestedExitDate), 'MMM d, yyyy')}</AppText>
          </View>
          <View style={styles.detailRow}>
            <AppText variant="caption" style={styles.detailLbl}>Person Type</AppText>
            <AppText variant="caption" style={styles.detailVal}>{item.personType}</AppText>
          </View>
          <View style={styles.detailRow}>
            <AppText variant="caption" style={styles.detailLbl}>{localizedUiText.m_5704b7c3727f}</AppText>
            <AppText variant="caption" style={styles.detailVal}>{item.reason}</AppText>
          </View>
          <View style={styles.detailRow}>
            <AppText variant="caption" style={styles.detailLbl}>{localizedUiText.m_a20969304997}</AppText>
            <StatusBadge label={MOVE_OUT_STATUS_LABELS[item.status]} type={getStatusBadgeType(item.status)} style={styles.smallBadge} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_276917fa0649} showBack onBack={navigation.goBack} />

      <View style={styles.controls}>
        <SearchBar value={search} onChangeText={setSearch} placeholder={localizedUiText.m_28093dd4406b} />
        <FilterChips
          options={statusOptions.map((s) => ({ label: s === 'ALL' ? 'All' : MOVE_OUT_STATUS_LABELS[s as MoveOutStatus], value: s }))}
          selected={selectedStatus}
          onChange={setSelectedStatus}
        />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <EmptyState title={localizedUiText.m_a491ddff9c85} description={error.message} iconName="alert-circle-outline" />
      ) : filtered.length === 0 ? (
        <EmptyState title="No move-out requests" description="No move-out requests found matching your criteria" iconName="clipboard-outline" />
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        />
      )}
    </SafeAreaView>
  );
}