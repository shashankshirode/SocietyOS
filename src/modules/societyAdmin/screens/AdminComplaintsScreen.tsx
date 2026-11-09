import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { formatRelativeDate } from '../../../shared/utils/formatters';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { SafeText } from '../../../shared/components/SafeText';
import { AppButton } from '../../../shared/components/AppButton';
import { AppIcon } from '../../../shared/icons/AppIcon';
import { useAdminComplaints } from '../data/useAdminComplaints';
import { useAuthSession } from '../../../core/auth/useAuthSession';
import { ResidentPageHeader } from '../../../ui/patterns/ResidentPageHeader';
import type { AdminComplaint, AdminComplaintStatus } from '../../../shared/types/admin.types';
import {
  styles,
  createTextColorStyle,
  createDynamicBgColor,
} from './styles/AdminComplaintsScreen.styles';

const STATUS_CONFIG: Record<AdminComplaintStatus, { label: string; color: string; icon: string }> = {
  OPEN: { label: 'Open', color: '#3B82F6', icon: 'document-text-outline' },
  ASSIGNED: { label: 'Assigned', color: '#06B6D4', icon: 'person-outline' },
  IN_PROGRESS: { label: 'In Progress', color: '#3B82F6', icon: 'construct-outline' },
  SLA_BREACHED: { label: 'SLA Breached', color: '#EF4444', icon: 'alert-circle-outline' },
  ESCALATED: { label: 'Escalated', color: '#F59E0B', icon: 'alert-circle-outline' },
  VENDOR_LINKED: { label: 'Vendor Linked', color: '#8B5CF6', icon: 'link-outline' },
  RESOLVED: { label: 'Resolved', color: '#10B981', icon: 'checkmark-done-outline' },
  CLOSED: { label: 'Closed', color: '#6B7280', icon: 'lock-closed-outline' },
  REOPENED: { label: 'Reopened', color: '#F97316', icon: 'refresh-outline' },
};

const PRIORITY_CONFIG = {
  LOW: { label: 'Low', color: '#10B981' },
  MEDIUM: { label: 'Medium', color: '#3B82F6' },
  HIGH: { label: 'High', color: '#F59E0B' },
  CRITICAL: { label: 'Critical', color: '#EF4444' },
};

const SLA_STATUS_CONFIG = {
  ON_TIME: { label: 'On Time', color: '#10B981', icon: 'checkmark-circle-outline' },
  AT_RISK: { label: 'At Risk', color: '#F59E0B', icon: 'warning-outline' },
  BREACHED: { label: 'Breached', color: '#EF4444', icon: 'alert-circle-outline' },
};

export function AdminComplaintsScreen({
  navigation,
}: {
  navigation: { goBack: () => void; navigate: (route: string, params?: unknown) => void };
}) {
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const theme = useAppTheme();
  const { session } = useAuthSession();

  const { data: complaints, isLoading, error, refetch } = useAdminComplaints({
    societyId: session?.societyId,
  });

  const dashboard = useMemo(() => {
    const totalOpen = complaints.filter((c) => c.status === 'OPEN').length;
    const inProgress = complaints.filter(
      (c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED',
    ).length;
    const slaBreached = complaints.filter((c) => c.slaStatus === 'BREACHED').length;
    const totalReopened = complaints.filter((c) => c.status === 'REOPENED').length;
    const escalationCount = complaints.filter((c) => c.status === 'ESCALATED').length;
    return { totalOpen, inProgress, slaBreached, totalReopened, escalationCount };
  }, [complaints]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AdminComplaintStatus | 'ALL'>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<
    'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'ALL'
  >('ALL');
  const [selectedSlaStatus, setSelectedSlaStatus] = useState<
    'ON_TIME' | 'AT_RISK' | 'BREACHED' | 'ALL'
  >('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.unitNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchesPriority = selectedPriority === 'ALL' || c.priority === selectedPriority;
    const matchesSla = selectedSlaStatus === 'ALL' || c.slaStatus === selectedSlaStatus;
    return matchesSearch && matchesStatus && matchesPriority && matchesSla;
  });

  const renderItem = ({ item }: { item: AdminComplaint }) => {
    const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.OPEN;
    const priorityConfig = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.MEDIUM;
    const slaConfig = SLA_STATUS_CONFIG[item.slaStatus] || SLA_STATUS_CONFIG.ON_TIME;
    const timeAgo = formatRelativeDate(item.createdAt);

    return (
      <Pressable
        style={styles.complaintCard}
        onPress={() => navigation.navigate('AdminComplaintDetail', { complaint: item })}
        accessibilityRole="button"
        accessibilityLabel={`${item.ticketNumber}, ${item.category}`}
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.statusBadge,
                createDynamicBgColor(statusConfig.color, '20'),
              ]}
            >
              <Ionicons
                name={statusConfig.icon as keyof typeof Ionicons.glyphMap}
                size={16}
                color={statusConfig.color}
              />
            </View>
            <View style={styles.headerText}>
              <SafeText variant="bodyStrong" style={styles.ticketTitle}>
                {item.ticketNumber}
              </SafeText>
              <SafeText variant="caption" style={styles.ticketTitleSub}>
                {item.category}
              </SafeText>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View
              style={[
                styles.slaBadge,
                createDynamicBgColor(slaConfig.color, '20'),
              ]}
            >
              <Ionicons
                name={slaConfig.icon as keyof typeof Ionicons.glyphMap}
                size={12}
                color={slaConfig.color}
              />
              <SafeText
                variant="tiny"
                style={[styles.slaBadgeText, createTextColorStyle(slaConfig.color)]}
              >
                {slaConfig.label}
              </SafeText>
            </View>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <AppIcon name="home-outline" size={14} color={theme.colors.textMuted} />
            <SafeText variant="caption" style={styles.metaText}>
              {item.unitNumber}
            </SafeText>
          </View>
          <View style={styles.metaItem}>
            <AppIcon name="business-outline" size={14} color={theme.colors.textMuted} />
            <SafeText variant="caption" style={styles.metaText}>
              {item.wing}
            </SafeText>
          </View>
          {item.assigneeName ? (
            <View style={styles.metaItem}>
              <AppIcon name="person-outline" size={14} color={theme.colors.textMuted} />
              <SafeText variant="caption" style={styles.metaText}>
                {item.assigneeName}
              </SafeText>
            </View>
          ) : null}
        </View>

        <View style={styles.actionRow}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusPill,
                createDynamicBgColor(statusConfig.color, '15'),
              ]}
            >
              <Ionicons
                name={statusConfig.icon as keyof typeof Ionicons.glyphMap}
                size={12}
                color={statusConfig.color}
              />
              <SafeText
                variant="tiny"
                style={[styles.statusPillText, createTextColorStyle(statusConfig.color)]}
              >
                {statusConfig.label}
              </SafeText>
            </View>
            <View
              style={[
                styles.priorityPill,
                createDynamicBgColor(priorityConfig.color, '15'),
              ]}
            >
              <SafeText
                variant="tiny"
                style={[styles.priorityPillText, createTextColorStyle(priorityConfig.color)]}
              >
                {priorityConfig.label}
              </SafeText>
            </View>
          </View>
          <SafeText variant="tiny" style={styles.timeAgo}>
            {timeAgo}
          </SafeText>
        </View>

        {item.isVendorLinked ? (
          <View style={styles.vendorBadge}>
            <AppIcon name="link-outline" size={12} color={theme.colors.primary} />
            <SafeText variant="caption" style={styles.vendorText}>
              {item.vendorName}
            </SafeText>
          </View>
        ) : null}
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ResidentPageHeader title={localizedUiText.m_admin_complaints} showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ResidentPageHeader title={localizedUiText.m_admin_complaints} showBack />
        <View style={styles.errorContainer}>
          <SafeText variant="body" style={createTextColorStyle(theme.colors.danger)}>
            {error.message}
          </SafeText>
          <AppButton
            title={localizedUiText.m_retry}
            onPress={refetch}
            variant="primary"
            fullWidth
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ResidentPageHeader
        title={localizedUiText.m_admin_complaints}
        showBack
        subtitle={`${dashboard.totalOpen} open · ${dashboard.slaBreached} breached`}
      />

      <View style={styles.dashboardSummary}>
        <View style={styles.summaryCard}>
          <SafeText variant="caption" style={styles.summaryLabel}>
            {localizedUiText.m_open}
          </SafeText>
          <SafeText variant="h3" style={styles.summaryValue}>
            {dashboard.totalOpen}
          </SafeText>
        </View>
        <View style={styles.summaryCard}>
          <SafeText variant="caption" style={styles.summaryLabel}>
            {localizedUiText.m_sla_breached}
          </SafeText>
          <SafeText
            variant="h3"
            style={[styles.summaryValue, createTextColorStyle(theme.colors.danger)]}
          >
            {dashboard.slaBreached}
          </SafeText>
        </View>
        <View style={styles.summaryCard}>
          <SafeText variant="caption" style={styles.summaryLabel}>
            {localizedUiText.m_escalated}
          </SafeText>
          <SafeText
            variant="h3"
            style={[styles.summaryValue, createTextColorStyle(theme.colors.warning)]}
          >
            {dashboard.escalationCount}
          </SafeText>
        </View>
        <View style={styles.summaryCard}>
          <SafeText variant="caption" style={styles.summaryLabel}>
            {localizedUiText.m_reopened}
          </SafeText>
          <SafeText variant="h3" style={styles.summaryValue}>
            {dashboard.totalReopened}
          </SafeText>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={localizedUiText.m_search_complaints}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>
      </View>

      <View style={styles.filterRow}>
        <View style={styles.filterGroup}>
          <SafeText variant="caption" style={styles.filterLabel}>
            {localizedUiText.m_status}
          </SafeText>
          <Pressable
            style={styles.filterSelect}
            onPress={() =>
              setSelectedStatus(selectedStatus === 'ALL' ? 'OPEN' : 'ALL')
            }
          >
            <SafeText variant="caption" style={styles.filterValue}>
              {selectedStatus === 'ALL' ? localizedUiText.m_all : selectedStatus}
            </SafeText>
            <AppIcon
              name="chevron-down-outline"
              size={16}
              color={theme.colors.textMuted}
            />
          </Pressable>
        </View>
        <View style={styles.filterGroup}>
          <SafeText variant="caption" style={styles.filterLabel}>
            {localizedUiText.m_priority}
          </SafeText>
          <Pressable
            style={styles.filterSelect}
            onPress={() =>
              setSelectedPriority(selectedPriority === 'ALL' ? 'LOW' : 'ALL')
            }
          >
            <SafeText variant="caption" style={styles.filterValue}>
              {selectedPriority === 'ALL' ? localizedUiText.m_all : selectedPriority}
            </SafeText>
            <AppIcon
              name="chevron-down-outline"
              size={16}
              color={theme.colors.textMuted}
            />
          </Pressable>
        </View>
        <View style={styles.filterGroup}>
          <SafeText variant="caption" style={styles.filterLabel}>
            {localizedUiText.m_sla_status}
          </SafeText>
          <Pressable
            style={styles.filterSelect}
            onPress={() =>
              setSelectedSlaStatus(selectedSlaStatus === 'ALL' ? 'ON_TIME' : 'ALL')
            }
          >
            <SafeText variant="caption" style={styles.filterValue}>
              {selectedSlaStatus === 'ALL' ? localizedUiText.m_all : selectedSlaStatus}
            </SafeText>
            <AppIcon
              name="chevron-down-outline"
              size={16}
              color={theme.colors.textMuted}
            />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={filteredComplaints}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            style={styles.refreshControl}
          />
        }
        ListEmptyComponent={
          filteredComplaints.length === 0 ? (
            <View style={styles.emptyState}>
              <AppIcon
                name="document-text-outline"
                size={48}
                color={theme.colors.textMuted}
              />
              <SafeText variant="body" style={styles.emptyText}>
                {searchQuery ||
                selectedStatus !== 'ALL' ||
                selectedPriority !== 'ALL' ||
                selectedSlaStatus !== 'ALL'
                  ? 'No matching complaints found'
                  : 'No complaints reported yet'}
              </SafeText>
            </View>
          ) : <></>
        }
      />
    </SafeAreaView>
  );
}

export default AdminComplaintsScreen;
