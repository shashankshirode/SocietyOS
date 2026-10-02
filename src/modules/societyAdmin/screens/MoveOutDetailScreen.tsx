import React, { useState } from 'react';
import { ScrollView, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../../shared/components/AppHeader';
import { AppCard } from '../../../shared/cards/AppCard';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { AppButton } from '../../../shared/components/AppButton';
import { AppIcon } from '../../../shared/icons/AppIcon';
import { EmptyState } from '../../../shared/feedback/EmptyState';
import { FormField } from '../../../shared/forms/FormField';
import { AppTextArea } from '../../../shared/forms/AppTextArea';
import { useAdminMoveOutRequest } from '../data/useAdminMoveOutRequests';
import { useAdminMoveOutClearance } from '../data/useAdminMoveOutRequests';
import { useAdminMoveOutApproval } from '../data/useAdminMoveOutRequests';
import { useAdminMoveOutNoc } from '../data/useAdminMoveOutRequests';
import { useAdminMoveOutAccess } from '../data/useAdminMoveOutRequests';
import { useAdminMoveOutOccupancy } from '../data/useAdminMoveOutRequests';
import { useAdminMoveOutCancel } from '../data/useAdminMoveOutRequests';
import { moveOutService } from '../services/moveOutService';
import { nocService } from '../services/nocService';
import { useSociety } from '../../../core/auth/SocietyProvider';
import type { MoveOutRequest, MoveOutStatus, ClearanceChecklistItem, ClearanceStatus } from '../../../shared/types/moveOut.types';
import { MOVE_OUT_STATUS_LABELS, CLEARANCE_STATUS_LABELS } from '../../../shared/types/moveOut.types';
import { styles, createTextColorStyle, createViewBackgroundColorStyle } from '../styles/screens/MoveOutDetailScreen.styles';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { AppText } from '../../../shared/components/AppText';
import { format } from 'date-fns';

interface MoveOutDetailScreenProps {
  route: { params: { requestId: string } };
  navigation: { goBack: () => void; navigate: (route: string, params?: any) => void };
}

export function MoveOutDetailScreen({ route, navigation }: MoveOutDetailScreenProps) {
  const { requestId } = route.params;
  const { currentSociety } = useSociety();
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const { colors } = useAppTheme();
  const { data: request, isLoading, error, refetch } = useAdminMoveOutRequest(requestId);
  const { updateItem, override, isLoading: clearanceLoading, error: clearanceError } = useAdminMoveOutClearance();
  const { approve, reject, resubmit, isSubmitting: approvalLoading, error: approvalError } = useAdminMoveOutApproval();
  const { generate, issue, isSubmitting: nocLoading, error: nocError } = useAdminMoveOutNoc();
  const { revoke, isSubmitting: accessLoading, error: accessError } = useAdminMoveOutAccess();
  const { close, isSubmitting: occupancyLoading, error: occupancyError } = useAdminMoveOutOccupancy();
  const { execute: cancel, isSubmitting: cancelLoading, error: cancelError } = useAdminMoveOutCancel();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideItem, setOverrideItem] = useState<ClearanceChecklistItem | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  const statusColor = (() => {
    switch (request?.status) {
      case 'DRAFT':
      case 'REQUESTED':
        return colors.info;
      case 'CLEARANCE_CHECK':
      case 'PENDING_APPROVAL':
      case 'SCHEDULED':
      case 'IN_PROGRESS':
        return colors.warning;
      case 'READY':
      case 'APPROVED':
      case 'COMPLETED':
        return colors.success;
      case 'EXCEPTION':
      case 'REJECTED':
      case 'FAILED':
        return colors.danger;
      case 'RESUBMIT':
        return colors.warning;
      case 'CANCELLED':
      case 'ARCHIVED':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  })();

  const canApprove = request?.status === 'READY';
  const canReject = request?.status === 'READY' || request?.status === 'PENDING_APPROVAL';
  const canResubmit = request?.status === 'REJECTED';
  const canGenerateNoc = request?.status === 'APPROVED' && request?.nocStatus !== 'GENERATED';
  const canIssueNoc = request?.nocStatus === 'GENERATED';
  const canRevokeAccess = request?.nocStatus === 'ISSUED' && request?.accessRevocationStatus !== 'REVOKED';
  const canCloseOccupancy = request?.accessRevocationStatus === 'REVOKED' && request?.occupancyClosureStatus !== 'CLOSED';
  const canCancel = request && ['SCHEDULED', 'READY', 'PENDING_APPROVAL'].includes(request.status);

  const handleApprove = async () => {
    if (!request) return;
    setIsActionLoading(true);
    try {
      await approve({ moveOutRequestId: requestId, approvedBy: 'admin' });
      refetch();
      Alert.alert(localizedUiText.m_c88a0b907419, 'Move-out request approved');
    } catch (e) {
      Alert.alert(localizedUiText.m_a7e04dec5f64, e instanceof Error ? e.message : 'Failed to approve');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim() || !request) return;
    setIsActionLoading(true);
    try {
      await reject({ moveOutRequestId: requestId, rejectedBy: 'admin', reason: rejectReason });
      refetch();
      setShowRejectModal(false);
      setRejectReason('');
      Alert.alert(localizedUiText.m_c88a0b907419, 'Move-out request rejected');
    } catch (e) {
      Alert.alert(localizedUiText.m_a7e04dec5f64, e instanceof Error ? e.message : 'Failed to reject');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResubmit = async () => {
    if (!request) return;
    setIsActionLoading(true);
    try {
      await resubmit({ moveOutRequestId: requestId, resubmittedBy: 'admin' });
      refetch();
      Alert.alert(localizedUiText.m_c88a0b907419, 'Move-out request resubmitted');
    } catch (e) {
      Alert.alert(localizedUiText.m_a7e04dec5f64, e instanceof Error ? e.message : 'Failed to resubmit');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleGenerateNoc = async () => {
    if (!request) return;
    setIsActionLoading(true);
    try {
      await generate({ moveOutRequestId: requestId, generatedBy: 'admin' });
      refetch();
      Alert.alert(localizedUiText.m_c88a0b907419, 'NOC generated');
    } catch (e) {
      Alert.alert(localizedUiText.m_a7e04dec5f64, e instanceof Error ? e.message : 'Failed to generate NOC');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleIssueNoc = async () => {
    if (!request) return;
    setIsActionLoading(true);
    try {
      await issue(requestId);
      refetch();
      Alert.alert(localizedUiText.m_c88a0b907419, 'NOC issued');
    } catch (e) {
      Alert.alert(localizedUiText.m_a7e04dec5f64, e instanceof Error ? e.message : 'Failed to issue NOC');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRevokeAccess = async () => {
    if (!request) return;
    setIsActionLoading(true);
    try {
      await revoke({ moveOutRequestId: requestId, revokedBy: 'admin' });
      refetch();
      Alert.alert(localizedUiText.m_c88a0b907419, 'Access revoked');
    } catch (e) {
      Alert.alert(localizedUiText.m_a7e04dec5f64, e instanceof Error ? e.message : 'Failed to revoke access');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCloseOccupancy = async () => {
    if (!request) return;
    setIsActionLoading(true);
    try {
      await close({ moveOutRequestId: requestId, closedBy: 'admin' });
      refetch();
      Alert.alert(localizedUiText.m_c88a0b907419, 'Occupancy closed');
    } catch (e) {
      Alert.alert(localizedUiText.m_a7e04dec5f64, e instanceof Error ? e.message : 'Failed to close occupancy');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!cancelReason.trim() || !request) return;
    setIsActionLoading(true);
    try {
      await cancel({ moveOutRequestId: requestId, cancelledBy: 'admin', reason: cancelReason });
      refetch();
      setShowCancelModal(false);
      setCancelReason('');
      Alert.alert(localizedUiText.m_c88a0b907419, 'Move-out request cancelled');
    } catch (e) {
      Alert.alert(localizedUiText.m_a7e04dec5f64, e instanceof Error ? e.message : 'Failed to cancel');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOverrideItem = (item: ClearanceChecklistItem) => {
    setOverrideItem(item);
    setOverrideReason('');
    setShowOverrideModal(true);
  };

  const confirmOverride = async () => {
    if (!overrideReason.trim() || !overrideItem || !request) return;
    setIsActionLoading(true);
    try {
      await override({
        moveOutRequestId: requestId,
        clearanceItemId: overrideItem.id,
        reason: overrideReason,
        overriddenBy: 'admin',
      });
      refetch();
      setShowOverrideModal(false);
      setOverrideItem(null);
      Alert.alert(localizedUiText.m_c88a0b907419, 'Clearance overridden');
    } catch (e) {
      Alert.alert(localizedUiText.m_a7e04dec5f64, e instanceof Error ? e.message : 'Failed to override');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_276917fa0649} showBack onBack={navigation.goBack} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !request) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_276917fa0649} showBack onBack={navigation.goBack} />
        <EmptyState title={localizedUiText.m_a491ddff9c85} description={error?.message || 'Move-out request not found'} iconName="alert-circle-outline" />
      </SafeAreaView>
    );
  }

  const getItemStatusColor = (status: ClearanceStatus) => {
    switch (status) {
      case 'CLEARED':
        return colors.success;
      case 'BLOCKED':
        return colors.danger;
      case 'OVERRIDDEN':
        return colors.warning;
      case 'IN_PROGRESS':
      case 'PENDING':
        return colors.info;
      case 'WAIVED':
      case 'NOT_APPLICABLE':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_276917fa0649} showBack onBack={navigation.goBack} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AppCard style={styles.sectionCard}>
          <View style={styles.headerRow}>
            <View style={styles.leftSection}>
              <AppText variant="h3" style={styles.requestNumber}>{request.requestNumber}</AppText>
              <StatusBadge
                label={MOVE_OUT_STATUS_LABELS[request.status]}
                type={
                  request.status === 'COMPLETED' || request.status === 'APPROVED' ? 'success' :
                  request.status === 'REJECTED' || request.status === 'FAILED' ? 'danger' :
                  request.status === 'EXCEPTION' ? 'danger' :
                  'warning'
                }
                style={styles.statusBadge}
              />
            </View>
          </View>
        </AppCard>

        <AppCard style={styles.sectionCard}>
          <AppText variant="h3" style={styles.sectionTitle}>{localizedUiText.m_199c39763358} / {localizedUiText.m_70761c1912c0}</AppText>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>{localizedUiText.m_4e545960f1bf}</AppText>
              <AppText variant="body" style={styles.infoValue}>{request.unitId}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>Person Type</AppText>
              <AppText variant="body" style={styles.infoValue}>{request.personType}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>{localizedUiText.m_225e2abb60c4}</AppText>
              <AppText variant="body" style={styles.infoValue}>{format(new Date(request.requestedExitDate), 'MMM d, yyyy')}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>{localizedUiText.m_5704b7c3727f}</AppText>
              <AppText variant="body" style={styles.infoValue}>{request.reason}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>{localizedUiText.m_5e185907b741}</AppText>
              <AppText variant="body" style={styles.infoValue}>{request.newAddress || 'Not provided'}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>Contact</AppText>
              <AppText variant="body" style={styles.infoValue}>{request.contactNumber}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>Mover</AppText>
              <AppText variant="body" style={styles.infoValue}>{request.moverName || 'Not provided'}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>Lift Slot</AppText>
              <AppText variant="body" style={styles.infoValue}>{request.liftSlotRequired ? 'Required' : 'Not required'}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>Gate Pass</AppText>
              <AppText variant="body" style={styles.infoValue}>{request.vehicleEntryRequired ? 'Required' : 'Not required'}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>{localizedUiText.m_a20969304997}</AppText>
              <StatusBadge label={MOVE_OUT_STATUS_LABELS[request.status]} type={request.status === 'COMPLETED' ? 'success' : request.status === 'REJECTED' ? 'danger' : request.status === 'EXCEPTION' ? 'danger' : 'warning'} style={styles.statusBadge} />
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>Requested</AppText>
              <AppText variant="body" style={styles.infoValue}>{format(new Date(request.requestedAt), 'MMM d, yyyy HH:mm')}</AppText>
            </View>
            {request.approvedAt && (
              <View style={styles.infoItem}>
                <AppText variant="caption" style={styles.infoLabel}>Approved</AppText>
                <AppText variant="body" style={styles.infoValue}>{format(new Date(request.approvedAt), 'MMM d, yyyy HH:mm')}</AppText>
              </View>
            )}
            {request.completedAt && (
              <View style={styles.infoItem}>
                <AppText variant="caption" style={styles.infoLabel}>Completed</AppText>
                <AppText variant="body" style={styles.infoValue}>{format(new Date(request.completedAt), 'MMM d, yyyy HH:mm')}</AppText>
              </View>
            )}
          </View>
        </AppCard>

        <AppCard style={styles.sectionCard}>
          <AppText variant="h3" style={styles.sectionTitle}>Clearance Checklist ({request.checklist.filter(c => c.status === 'CLEARED').length} / {request.checklist.filter(c => c.priority === 'MANDATORY').length} mandatory)</AppText>
          {request.checklist.length === 0 ? (
            <View style={styles.emptyDocs}>
              <AppText variant="body" style={styles.emptyText}>No clearance items</AppText>
            </View>
          ) : (
            <View style={styles.docsList}>
              {request.checklist.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.docItem}
                  onPress={() => item.status === 'BLOCKED' && handleOverrideItem(item)}
                  activeOpacity={0.8}
                >
                  <View style={styles.docInfo}>
                    <AppText variant="body" style={styles.docName}>{item.title}</AppText>
                    <AppText variant="caption" style={styles.docMeta}>
                      {CLEARANCE_STATUS_LABELS[item.status]} • {item.responsibleTeam}
                    </AppText>
                    {item.actionRequiredLabel && (
                      <AppText variant="caption" style={{ ...styles.docMeta, color: colors.warning }}>
                        {item.actionRequiredLabel}
                      </AppText>
                    )}
                    {item.overrideReason && (
                      <AppText variant="caption" style={{ ...styles.docMeta, color: colors.warning }}>
                        Overridden: {item.overrideReason}
                      </AppText>
                    )}
                  </View>
                  <StatusBadge
                    label={CLEARANCE_STATUS_LABELS[item.status]}
                    type={getItemStatusColor(item.status) === colors.success ? 'success' : getItemStatusColor(item.status) === colors.danger ? 'danger' : getItemStatusColor(item.status) === colors.warning ? 'warning' : 'neutral'}
                    style={styles.docBadge}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </AppCard>

        {request.rejectionReason && (
          <AppCard style={[styles.sectionCard, styles.rejectionCard]}>
            <AppText variant="h3" style={[styles.sectionTitle, { color: colors.danger }]}>Rejection Reason</AppText>
            <AppText variant="body" style={styles.rejectionText}>{request.rejectionReason}</AppText>
          </AppCard>
        )}

        {request.nocId && (
          <AppCard style={styles.sectionCard}>
            <AppText variant="h3" style={styles.sectionTitle}>NOC</AppText>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <AppText variant="caption" style={styles.infoLabel}>Status</AppText>
                <StatusBadge label={request.nocStatus || 'NOT_GENERATED'} type={request.nocStatus === 'ISSUED' ? 'success' : 'warning'} />
              </View>
              <View style={styles.infoItem}>
                <AppText variant="caption" style={styles.infoLabel}>NOC ID</AppText>
                <AppText variant="body" style={styles.infoValue}>{request.nocId}</AppText>
              </View>
            </View>
          </AppCard>
        )}

        {request.accessRevocationAt && (
          <AppCard style={styles.sectionCard}>
            <AppText variant="h3" style={styles.sectionTitle}>Access Revocation</AppText>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <AppText variant="caption" style={styles.infoLabel}>Status</AppText>
                <StatusBadge label={request.accessRevocationStatus || 'NOT_STARTED'} type={request.accessRevocationStatus === 'REVOKED' ? 'success' : 'warning'} />
              </View>
              <View style={styles.infoItem}>
                <AppText variant="caption" style={styles.infoLabel}>Revoked At</AppText>
                <AppText variant="body" style={styles.infoValue}>{format(new Date(request.accessRevocationAt), 'MMM d, yyyy HH:mm')}</AppText>
              </View>
            </View>
          </AppCard>
        )}

        {request.occupancyClosedAt && (
          <AppCard style={styles.sectionCard}>
            <AppText variant="h3" style={styles.sectionTitle}>Occupancy Closure</AppText>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <AppText variant="caption" style={styles.infoLabel}>Status</AppText>
                <StatusBadge label={request.occupancyClosureStatus || 'NOT_STARTED'} type={request.occupancyClosureStatus === 'CLOSED' ? 'success' : 'warning'} />
              </View>
              <View style={styles.infoItem}>
                <AppText variant="caption" style={styles.infoLabel}>Closed At</AppText>
                <AppText variant="body" style={styles.infoValue}>{format(new Date(request.occupancyClosedAt), 'MMM d, yyyy HH:mm')}</AppText>
              </View>
            </View>
          </AppCard>
        )}

        {(canApprove || canReject || canResubmit || canGenerateNoc || canIssueNoc || canRevokeAccess || canCloseOccupancy || canCancel) && (
          <View style={styles.actionsContainer}>
            {canApprove && (
              <AppButton
                title={localizedUiText.m_6007acbe30b2}
                variant="primary"
                onPress={handleApprove}
                disabled={isActionLoading || approvalLoading}
                iconLeft={<AppIcon name="checkmark" size={18} color={colors.white} />}
                fullWidth
              />
            )}
            {canGenerateNoc && (
              <AppButton
                title="Generate NOC"
                variant="primary"
                onPress={handleGenerateNoc}
                disabled={isActionLoading || nocLoading}
                iconLeft={<AppIcon name="ribbon" size={18} color={colors.white} />}
                fullWidth
              />
            )}
            {canIssueNoc && (
              <AppButton
                title="Issue NOC"
                variant="success"
                onPress={handleIssueNoc}
                disabled={isActionLoading || nocLoading}
                iconLeft={<AppIcon name="checkmark-circle" size={18} color={colors.white} />}
                fullWidth
              />
            )}
            {canRevokeAccess && (
              <AppButton
                title="Revoke Access"
                variant="primary"
                onPress={handleRevokeAccess}
                disabled={isActionLoading || accessLoading}
                iconLeft={<AppIcon name="lock-closed" size={18} color={colors.white} />}
                fullWidth
              />
            )}
            {canCloseOccupancy && (
              <AppButton
                title="Close Occupancy"
                variant="success"
                onPress={handleCloseOccupancy}
                disabled={isActionLoading || occupancyLoading}
                iconLeft={<AppIcon name="home-outline" size={18} color={colors.white} />}
                fullWidth
              />
            )}
            {canReject && (
              <AppButton
                title={localizedUiText.m_ab604a360777}
                variant="danger"
                onPress={handleReject}
                disabled={isActionLoading || approvalLoading}
                iconLeft={<AppIcon name="close" size={18} color={colors.white} />}
                fullWidth
              />
            )}
            {canResubmit && (
              <AppButton
                title="Resubmit"
                variant="outline"
                onPress={handleResubmit}
                disabled={isActionLoading || approvalLoading}
                iconLeft={<AppIcon name="refresh" size={18} color={colors.primary} />}
                fullWidth
              />
            )}
            {canCancel && (
              <AppButton
                title="Cancel Request"
                variant="outline"
                onPress={handleCancel}
                disabled={isActionLoading || cancelLoading}
                iconLeft={<AppIcon name="ban" size={18} color={colors.warning} />}
                fullWidth
              />
            )}
          </View>
        )}
      </ScrollView>

      {showRejectModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText variant="h3" style={styles.modalTitle}>Reject Move-Out Request</AppText>
            <AppText variant="body" style={styles.modalText}>Please provide a reason for rejection.</AppText>
            <AppTextArea
              value={rejectReason}
              onChangeText={setRejectReason}
              placeholder="Enter rejection reason..."
            />
            <View style={styles.modalButtons}>
              <AppButton
                title={localizedUiText.m_19766ed6ccb2}
                variant="outline"
                onPress={() => setShowRejectModal(false)}
                fullWidth
              />
              <AppButton
                title={localizedUiText.m_ab604a360777}
                variant="danger"
                onPress={confirmReject}
                disabled={isActionLoading}
                fullWidth
              />
            </View>
          </View>
        </View>
      )}

      {showCancelModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText variant="h3" style={styles.modalTitle}>Cancel Move-Out Request</AppText>
            <AppText variant="body" style={styles.modalText}>Please provide a reason for cancellation.</AppText>
            <AppTextArea
              value={cancelReason}
              onChangeText={setCancelReason}
              placeholder="Enter cancellation reason..."
            />
            <View style={styles.modalButtons}>
              <AppButton
                title={localizedUiText.m_19766ed6ccb2}
                variant="outline"
                onPress={() => setShowCancelModal(false)}
                fullWidth
              />
              <AppButton
                title={localizedUiText.m_ab604a360777}
                variant="danger"
                onPress={confirmCancel}
                disabled={isActionLoading}
                fullWidth
              />
            </View>
          </View>
        </View>
      )}

      {showOverrideModal && overrideItem && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText variant="h3" style={styles.modalTitle}>Override Clearance</AppText>
            <AppText variant="body" style={styles.modalText}>Override <strong>{overrideItem.title}</strong>. Please provide a reason.</AppText>
            <AppTextArea
              value={overrideReason}
              onChangeText={setOverrideReason}
              placeholder="Enter override reason..."
            />
            <View style={styles.modalButtons}>
              <AppButton
                title={localizedUiText.m_19766ed6ccb2}
                variant="outline"
                onPress={() => { setShowOverrideModal(false); setOverrideItem(null); }}
                fullWidth
              />
              <AppButton
                title="Override"
                variant="warning"
                onPress={confirmOverride}
                disabled={isActionLoading || !overrideReason.trim()}
                fullWidth
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}