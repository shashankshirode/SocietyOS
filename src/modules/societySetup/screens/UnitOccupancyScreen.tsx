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
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { EmptyState } from '../../../shared/components/EmptyState';
import { AppIcon } from '../../../shared/icons/AppIcon';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { formatUiLiteral } from '../../../shared/localization/formatUiLiteral';
import { getActiveUiLiteral } from '../../../shared/localization/activeUiLiteral';
import { useCurrentOccupancy, useOccupancyHistory, useUnitTimeline, useRelationshipActions } from '../hooks/useRelationships';
import type { ResidentUnitRelationship, RelationshipType, RelationshipStatus } from '../data/occupancyRelationship.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';

type Props = NativeStackScreenProps<SuperAdminStackParamList, 'UNIT_OCCUPANCY'>;

const RELATIONSHIP_ICONS: Record<string, string> = {
  OWNER: 'home',
  CO_OWNER: 'people',
  TENANT: 'key',
  FAMILY_MEMBER: 'people-circle',
  AUTHORIZED_OCCUPANT: 'shield-checkmark',
};

export function UnitOccupancyScreen({ navigation, route }: Props) {
  const { societyId, unitId, unitNumber } = route.params;
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const { colors } = useAppTheme();
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'timeline'>('current');
  const [editingRelationship, setEditingRelationship] = useState<any>(null);
  const [showEndDialog, setShowEndDialog] = useState<string | null>(null);
  const [endDate, setEndDate] = useState('');

  const { occupancy, isLoading: occupancyLoading, error: occupancyError, load: loadOccupancy } = useCurrentOccupancy(societyId, unitId);
  const { history, isLoading: historyLoading, error: historyError, load: loadHistory } = useOccupancyHistory(societyId, unitId);
  const { timeline, isLoading: timelineLoading, error: timelineError, load: loadTimeline } = useUnitTimeline(societyId, unitId);
  const { endRelationship, isLoading: actionLoading, error: actionError } = useRelationshipActions(societyId);

  useEffect(() => {
    loadOccupancy();
    loadHistory();
    loadTimeline();
  }, [loadOccupancy, loadHistory, loadTimeline]);

  const handleEndRelationship = async (relationshipId: string) => {
    if (!endDate) {
      Alert.alert('Error', 'Please select an end date');
      return;
    }
    try {
      await endRelationship({ id: relationshipId, endDate, endedBy: 'current-user' });
      Alert.alert('Success', 'Relationship ended successfully');
      setShowEndDialog(null);
      setEndDate('');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to end relationship');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return colors.success;
      case 'ENDED': return colors.textMuted;
      case 'PENDING': return colors.warning;
      case 'CANCELLED': return colors.danger;
      default: return colors.textSecondary;
    }
  };

  const renderRelationshipCard = (rel: any, isActive: boolean) => {
    const icon = RELATIONSHIP_ICONS[rel.relationshipType] ?? 'help-circle';
    
    return (
      <AppCard key={rel.id} style={{ marginBottom: 12, opacity: isActive ? 1 : 0.6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <AppIcon name={icon as any} size={24} color={colors.primary} />
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>
                {rel.relationshipType === 'FAMILY_MEMBER' && rel.familyRelation 
                  ? `${rel.relationshipType} (${rel.familyRelation})` 
                  : rel.relationshipType}
              </Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                {rel.residentId} • {new Date(rel.startDate).toLocaleDateString()} 
                {rel.endDate ? ` → ${new Date(rel.endDate).toLocaleDateString()}` : ' → Present'}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 8 }}>
            <StatusBadge status={rel.status} moduleType="occupancy" />
            {isActive && rel.status === 'ACTIVE' && (
              <TouchableOpacity
                onPress={() => setShowEndDialog(rel.id)}
                style={{ padding: 8 }}
              >
                <AppIcon name="close-circle" size={20} color={colors.danger} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {rel.relationshipType === 'TENANT' && rel.tenancyDetails && (
          <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border }}>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Tenancy Details</Text>
            <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                Agreement: {new Date(rel.tenancyDetails.agreementStartDate).toLocaleDateString()} → {new Date(rel.tenancyDetails.agreementEndDate).toLocaleDateString()}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                Occupancy: {new Date(rel.tenancyDetails.occupancyStartDate).toLocaleDateString()}
              </Text>
              {rel.approvalStatus && rel.approvalStatus !== 'NOT_REQUIRED' && (
                <StatusBadge 
                  status={rel.approvalStatus}
                  moduleType="approval"
                />
              )}
            </View>
          </View>
        )}
      </AppCard>
    );
  };

  if (!societyId || !unitId) {
    return (
      <ScreenContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <ResponsivePageHeader title="Unit Occupancy" onBack={() => navigation.goBack()} />
          <ErrorState message="Invalid unit" onRetry={() => navigation.goBack()} />
        </SafeAreaView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <ResponsivePageHeader 
          title={getActiveUiLiteral("m_97d04342608b")} 
          subtitle={`${unitNumber} - Occupancy`}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.tabs} role="tablist">
          {(['current', 'history', 'timeline'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
            >
              <Text style={{ color: activeTab === tab ? colors.primary : colors.textSecondary, fontWeight: activeTab === tab ? '600' : '400' }}>
                {tab === 'current' ? getActiveUiLiteral("m_f116bca63a65") : tab === 'history' ? getActiveUiLiteral("m_9202a63dd74e") : getActiveUiLiteral("m_56de8fa8e7f6")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          {activeTab === 'current' && (
            <>
              {occupancyLoading ? (
                <LoadingState message={getActiveUiLiteral("m_23b87850823d")} />
              ) : occupancyError ? (
                <ErrorState message={occupancyError} onRetry={loadOccupancy} />
              ) : occupancy?.relationships.length === 0 ? (
                <EmptyState
                  title={getActiveUiLiteral("m_1c027aeecfa8")}
                  description={getActiveUiLiteral("m_495e13ae2b3d")}
                />
              ) : (
                occupancy?.relationships.map((rel) => renderRelationshipCard(rel, true))
              )}
            </>
          )}
          {activeTab === 'history' && (
            <>
              {historyLoading ? (
                <LoadingState message={getActiveUiLiteral("m_23b87850823d")} />
              ) : historyError ? (
                <ErrorState message={historyError} onRetry={loadHistory} />
              ) : history?.relationships.length === 0 ? (
                <EmptyState
                  title={getActiveUiLiteral("m_1c027aeecfa8")}
                  description={getActiveUiLiteral("m_495e13ae2b3d")}
                />
              ) : (
                history?.relationships.map((rel) => renderRelationshipCard(rel, rel.status === 'ACTIVE'))
              )}
            </>
          )}
          {activeTab === 'timeline' && (
            <>
              {timelineLoading ? (
                <LoadingState message={getActiveUiLiteral("m_23b87850823d")} />
              ) : timelineError ? (
                <ErrorState message={timelineError} onRetry={loadTimeline} />
              ) : timeline.length === 0 ? (
                <EmptyState
                  title={getActiveUiLiteral("m_1c027aeecfa8")}
                  description={getActiveUiLiteral("m_495e13ae2b3d")}
                />
              ) : (
                timeline.map((event) => (
                  <AppCard key={event.id} style={styles.timelineItem}>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={{ width: 40, alignItems: 'center' }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />
                        <View style={{ width: 2, height: '100%', backgroundColor: colors.border, position: 'absolute', left: 3, top: 8 }} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '600', color: colors.textPrimary }}>{event.title}</Text>
                        <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{event.description}</Text>
                        <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>
                          {new Date(event.occurredAt).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </AppCard>
                ))
              )}
            </>
          )}
        </ScrollView>
        
        {showEndDialog && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{getActiveUiLiteral("m_bb791fe68da8")}</Text>
              <Text style={styles.modalText}>
                {getActiveUiLiteral("m_4d5d52995fef")}
              </Text>
              <View style={{ marginVertical: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary, marginBottom: 8 }}>
                  {getActiveUiLiteral("m_7a6c4da06ed9")}
                </Text>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={styles.dateInput}
                  min={new Date().toISOString().split('T')[0]}
                />
              </View>
              <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'flex-end' }}>
                <AppButton
                  title={getActiveUiLiteral("m_6aadac2f2b7a")}
                  onPress={() => { setShowEndDialog(null); setEndDate(''); }}
                  variant="outline"
                />
                <AppButton
                  title={getActiveUiLiteral("m_1282d9db3fce")}
                  onPress={() => handleEndRelationship(showEndDialog!)}
                  loading={actionLoading}
                  disabled={actionLoading || !endDate}
                />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </ScreenContainer>
  );
}


const styles = {
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
  } as any,
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  } as any,
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#059669',
  } as any,
  timelineItem: {
    marginBottom: 12,
  } as any,
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  } as any,
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    maxWidth: 400,
    alignSelf: 'center',
  } as any,
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  } as any,
  modalText: {
    color: '#666',
    marginBottom: 16,
  } as any,
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  } as any,
};