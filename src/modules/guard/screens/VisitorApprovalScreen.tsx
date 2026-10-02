import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResidentTheme } from '../../../../ui/foundation/residentTheme';
import { ResidentPageHeader } from '../../../../ui/patterns/ResidentPageHeader';
import { AppButton } from '../../../../shared/components/AppButton';
import { StatusPill, type StatusTone } from '../../../../ui/components/StatusPill';
import { SafeText } from '../../../../shared/components/SafeText';
import { AppTextArea } from '../../../../shared/forms/AppTextArea';
import { useMessages as useGeneratedUiMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { styles, createTextColorStyle, createViewBackgroundColorStyle } from '../styles/screens/VisitorApprovalScreen.styles';
import { useVisitorApprovalRequests } from '../data/useVisitorApprovals';
import { visitorApprovalService } from '../services/visitorApprovalService';

interface VisitorApprovalScreenProps {
  route: { params: { requestId?: string } };
  navigation: { goBack: () => void; navigate: (route: string, params?: any) => void };
}

export function VisitorApprovalScreen({ route, navigation }: VisitorApprovalScreenProps) {
  const { requestId } = route.params;
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const theme = useResidentTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<any>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [showDenialReason, setShowDenialReason] = useState(false);
  const [denialReason, setDenialReason] = useState('');

  const { data: requests, refetch } = useVisitorApprovalRequests();

  useEffect(() => {
    if (requestId) {
      loadRequest();
    }
  }, [requestId]);

  const loadRequest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const req = await visitorApprovalService.getApprovalRequest(requestId);
      if (!req) {
        setError('Approval request not found');
        return;
      }
      setRequest(req);
    } catch (e) {
      setError('Failed to load approval request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!request) return;
    setIsResponding(true);
    try {
      const updated = await visitorApprovalService.respondToApproval(
        request.id,
        'APPROVE',
        'current-resident',
        'RESIDENT'
      );
      setRequest(updated);
      Alert.alert('Success', 'Visitor approved successfully');
      refetch();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to approve');
    } finally {
      setIsResponding(false);
    }
  };

  const handleDeny = () => {
    setShowDenialReason(true);
  };

  const confirmDeny = async () => {
    if (!request) return;
    if (!denialReason.trim()) {
      Alert.alert('Required', 'Please provide a reason for denial');
      return;
    }
    setIsResponding(true);
    try {
      const updated = await visitorApprovalService.respondToApproval(
        request.id,
        'DENY',
        'current-resident',
        'RESIDENT',
        denialReason
      );
      setRequest(updated);
      setShowDenialReason(false);
      setDenialReason('');
      Alert.alert('Success', 'Visitor denied');
      refetch();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to deny');
    } finally {
      setIsResponding(false);
    }
  };

  const handleEscalate = async (type: 'SECURITY' | 'SUPERVISOR' | 'COMMITTEE') => {
    if (!request) return;
    const reasonMap = {
      SECURITY: 'Escalated to security for review',
      SUPERVISOR: 'Escalated to supervisor for review',
      COMMITTEE: 'Escalated to committee for review',
    };
    
    try {
      const updated = await visitorApprovalService.escalateRequest(
        request.id,
        'current-resident',
        `Escalated to ${type}: ${type === 'SECURITY' ? 'security' : type === 'SUPERVISOR' ? 'supervisor' : 'committee'}`,
        type === 'SECURITY' ? 'ESCALATED_TO_SECURITY' : type === 'SUPERVISOR' ? 'ESCALATED_TO_SUPERVISOR' : 'ESCALATED_TO_COMMITTEE'
      );
      setRequest(updated);
      Alert.alert('Success', 'Request escalated');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to escalate');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ResidentPageHeader title={localizedUiText.m_visitor_approval} showBack onBack={navigation.goBack} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !request) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ResidentPageHeader title={localizedUiText.m_visitor_approval} showBack onBack={navigation.goBack} />
        <View style={styles.errorContainer}>
          <SafeText variant="body" style={createTextColorStyle(theme.colors.danger)}>
            {error || 'Request not found'}
          </SafeText>
          <AppButton title={localizedUiText.m_retry} onPress={loadRequest} variant="primary" fullWidth style={styles.retryButton} />
        </View>
      </SafeAreaView>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING: theme.colors.warning,
    APPROVED: theme.colors.success,
    DENIED: theme.colors.danger,
    ESCALATED: theme.colors.info,
    EXPIRED: theme.colors.muted,
  };

  const getStatusTone = (status: string): StatusTone => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'DENIED': return 'danger';
      case 'ESCALATED': return 'warning';
      case 'PENDING': return 'info';
      case 'EXPIRED': return 'muted';
      default: return 'neutral';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ResidentPageHeader title={localizedUiText.m_visitor_approval} showBack onBack={navigation.goBack} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, styles.requestCard]}>
          <View style={styles.header}>
            <View style={styles.visitorInfo}>
              <SafeText variant="bodyStrong" style={styles.visitorName}>{request.visitorName}</SafeText>
              <SafeText variant="caption" style={styles.visitorMeta}>
                {request.visitorType} • {request.flatNumber}
              </SafeText>
            </View>
            <StatusPill
              label={request.status}
              type={getStatusTone(request.status)}
              small
            />
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <SafeText variant="tiny" style={styles.detailLabel}>{localizedUiText.m_request_type}</SafeText>
              <SafeText variant="body" style={styles.detailValue}>{request.requestType.replace('_', ' ')}</SafeText>
            </View>
            <View style={styles.detailItem}>
              <SafeText variant="tiny" style={styles.detailLabel}>{localizedUiText.m_gate}</SafeText>
              <SafeText variant="body" style={styles.detailValue}>{request.gateName}</SafeText>
            </View>
            <View style={styles.detailItem}>
              <SafeText variant="tiny" style={styles.detailLabel}>{localizedUiText.m_guard}</SafeText>
              <SafeText variant="body" style={styles.detailValue}>{request.guardName}</SafeText>
            </View>
            <View style={styles.detailItem}>
              <SafeText variant="tiny" style={styles.detailLabel}>{localizedUiText.m_requested_at}</SafeText>
              <SafeText variant="body" style={styles.detailValue}>{formatDateTime(request.requestedAtIso)}</SafeText>
            </View>
            <View style={styles.detailItem}>
              <SafeText variant="tiny" style={styles.detailLabel}>{localizedUiText.m_expires_at}</SafeText>
              <SafeText variant="body" style={styles.detailValue}>{formatDateTime(request.expiresAtIso)}</SafeText>
            </View>
          </View>

          {request.escalationReason && (
            <View style={[styles.escalationBanner, styles.escalationTypeBanner]}>
              <SafeText variant="caption" style={styles.escalationLabel}>
                {localizedUiText.m_escalated_to}: {request.escalationStatus?.replace('ESCALATED_TO_', '')}
              </SafeText>
              <SafeText variant="caption" style={styles.escalationReason}>
                {request.escalationReason}
              </SafeText>
            </View>
          )}
        </View>

        {request.status === 'PENDING' && (
          <View style={styles.actionsSection}>
            <SafeText variant="bodyStrong" style={styles.sectionTitle}>
              {localizedUiText.m_take_action}
            </SafeText>
            <View style={styles.actionButtons}>
              <AppButton
                title={localizedUiText.m_approve}
                variant="success"
                onPress={handleApprove}
                disabled={isResponding}
                loading={isResponding}
                fullWidth
              />
              <AppButton
                title={localizedUiText.m_deny}
                variant="danger"
                onPress={handleDeny}
                disabled={isResponding}
                fullWidth
              />
              <AppButton
                title={localizedUiText.m_escalate}
                variant="outline"
                onPress={() => Alert.alert(
                  localizedUiText.m_escalate_to,
                  localizedUiText.m_choose_escalation,
                  [
                    { text: localizedUiText.m_security, onPress: () => handleEscalate('SECURITY') },
                    { text: localizedUiText.m_supervisor, onPress: () => handleEscalate('SUPERVISOR') },
                    { text: localizedUiText.m_committee, onPress: () => handleEscalate('COMMITTEE') },
                    { text: localizedUiText.m_cancel, style: 'cancel' },
                  ]
                )}
                fullWidth
              />
            </View>
          </View>
        )}

        {request.status === 'DENIED' && (
          <View style={[styles.card, styles.denialCard]}>
            <SafeText variant="bodyStrong" style={styles.denialTitle}>
              {localizedUiText.m_denial_reason}
            </SafeText>
            <SafeText variant="body" style={styles.denialReasonText}>
              {request.denialReason || localizedUiText.m_no_reason_provided}
            </SafeText>
          </View>
        )}

        {request.escalationStatus !== 'NOT_ESCALATED' && request.escalationStatus && (
          <View style={[styles.card, styles.escalationCard]}>
            <SafeText variant="bodyStrong" style={styles.escalationTitle}>
              {localizedUiText.m_escalation_details}
            </SafeText>
            <View style={styles.escalationDetails}>
              <SafeText variant="caption" style={styles.detailLabel}>{localizedUiText.m_escalated_to}</SafeText>
              <SafeText variant="body" style={styles.detailValue}>
                {request.escalationStatus.replace('ESCALATED_TO_', '')}
              </SafeText>
              <SafeText variant="caption" style={styles.detailLabel}>{localizedUiText.m_escalated_by}</SafeText>
              <SafeText variant="body" style={styles.detailValue}>{request.escalatedBy}</SafeText>
              <SafeText variant="caption" style={styles.detailLabel}>{localizedUiText.m_escalated_at}</SafeText>
              <SafeText variant="body" style={styles.detailValue}>{formatDateTime(request.escalatedAtIso)}</SafeText>
              <SafeText variant="caption" style={styles.detailLabel}>{localizedUiText.m_reason}</SafeText>
              <SafeText variant="body" style={styles.detailValue}>{request.escalationReason}</SafeText>
            </View>
          </View>
        )}

        {request.status === 'EXPIRED' && (
          <View style={[styles.card, styles.expiredCard]}>
            <SafeText variant="body" style={styles.expiredText} textAlign="center">
              {localizedUiText.m_request_expired}
            </SafeText>
          </View>
        )}
      </ScrollView>

      {showDenialReason && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SafeText variant="bodyStrong" style={styles.modalTitle}>
              {localizedUiText.m_deny_visitor}
            </SafeText>
            <SafeText variant="body" style={styles.modalText}>
              {localizedUiText.m_enter_denial_reason}
            </SafeText>
            <AppTextArea
              value={denialReason}
              onChangeText={setDenialReason}
              placeholder={localizedUiText.m_denial_reason_placeholder}
              style={styles.modalTextArea}
              minHeight={100}
            />
            <View style={styles.modalButtons}>
              <AppButton
                title={localizedUiText.m_cancel}
                variant="outline"
                onPress={() => { setShowDenialReason(false); setDenialReason(''); }}
                fullWidth
              />
              <AppButton
                title={localizedUiText.m_deny}
                variant="danger"
                onPress={confirmDeny}
                disabled={isResponding || !denialReason.trim()}
                fullWidth
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

const { format } = require('date-fns');
const { Alert } = require('react-native');