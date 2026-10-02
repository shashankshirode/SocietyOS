import React, { useState } from 'react';
import { ScrollView, View, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../../shared/components/AppHeader';
import { AppCard } from '../../../shared/cards/AppCard';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { AppButton } from '../../../shared/components/AppButton';
import { AppIcon } from '../../../shared/icons/AppIcon';
import { EmptyState } from '../../../shared/feedback/EmptyState';
import { AppTextArea } from '../../../shared/forms/AppTextArea';
import { useAdminResidentRegistrationDetail } from '../data/useAdminResidentRegistrations';
import { residentRegistrationService } from '../services/residentRegistrationService';
import { useSociety } from '../../../core/auth/SocietyProvider';
import type { ResidentRegistrationDetail, ResidentRegistrationStatus, DocumentRequirement, ResidentDocument } from '../data/residentRegistration.types';
import { REGISTRATION_STATUS_LABELS, RELATIONSHIP_TYPE_LABELS, FAMILY_RELATIONSHIP_SUBTYPE_LABELS } from '../data/residentRegistration.types';
import { styles, createTextColorStyle, createViewBackgroundColorStyle } from '../styles/screens/ResidentDetailScreen.styles';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { AppText } from '../../../shared/components/AppText';
import { format } from 'date-fns';

interface ResidentDetailScreenProps {
  route: { params: { residentId: string } };
  navigation: { goBack: () => void; navigate: (route: string, params?: any) => void };
}

export function ResidentDetailScreen({ route, navigation }: ResidentDetailScreenProps) {
  const { residentId } = route.params;
  const { currentSociety } = useSociety();
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const { colors } = useAppTheme();
  const { data: resident, isLoading, error, refetch } = useAdminResidentRegistrationDetail(residentId);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleApprove = async () => {
    setIsActionLoading(true);
    try {
      await residentRegistrationService.approveRegistration(residentId, 'admin');
      refetch();
      Alert.alert(localizedUiText.m_c88a0b907419, localizedUiText.m_f5a723a3d15f);
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
    if (!rejectReason.trim()) {
      Alert.alert('Required', 'Please enter a rejection reason');
      return;
    }
    setIsActionLoading(true);
    try {
      await residentRegistrationService.rejectRegistration(residentId, 'admin', rejectReason);
      refetch();
      setShowRejectModal(false);
      setRejectReason('');
      Alert.alert(localizedUiText.m_c88a0b907419, localizedUiText.m_f5a723a3d15f);
    } catch (e) {
      Alert.alert(localizedUiText.m_a7e04dec5f64, e instanceof Error ? e.message : 'Failed to reject');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResubmit = async () => {
    setIsActionLoading(true);
    try {
      await residentRegistrationService.requestResubmission(residentId, 'admin');
      refetch();
      Alert.alert(localizedUiText.m_c88a0b907419, 'Resubmission requested');
    } catch (e) {
      Alert.alert(localizedUiText.m_a7e04dec5f64, e instanceof Error ? e.message : 'Failed to request resubmission');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleActivate = async () => {
    setIsActionLoading(true);
    try {
      await residentRegistrationService.activateRegistration(residentId);
      refetch();
      Alert.alert(localizedUiText.m_c88a0b907419, 'Resident activated');
    } catch (e) {
      Alert.alert(localizedUiText.m_a7e04dec5f64, e instanceof Error ? e.message : 'Failed to activate');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_70761c1912c0} showBack onBack={navigation.goBack} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !resident) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_70761c1912c0} showBack onBack={navigation.goBack} />
        <EmptyState title={localizedUiText.m_a491ddff9c85} description={error?.message || 'Resident not found'} iconName="alert-circle-outline" />
      </SafeAreaView>
    );
  }

  const statusColor = (() => {
    switch (resident.status) {
      case 'INVITED':
      case 'REGISTERED':
        return colors.info;
      case 'IDENTITY_VERIFIED':
      case 'DOCUMENTS_SUBMITTED':
      case 'ADMIN_REVIEW':
        return colors.warning;
      case 'APPROVED':
      case 'ACTIVE':
        return colors.success;
      case 'RESUBMIT':
        return colors.warning;
      case 'REJECTED':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  })();

  const canApprove = resident.status === 'ADMIN_REVIEW';
  const canReject = resident.status === 'ADMIN_REVIEW';
  const canResubmit = resident.status === 'ADMIN_REVIEW';
  const canActivate = resident.status === 'APPROVED';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_70761c1912c0} showBack onBack={navigation.goBack} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AppCard style={styles.sectionCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <AppText variant="h2" style={styles.avatarTextLarge}>
                {resident.firstName.charAt(0)}{resident.lastName.charAt(0)}
              </AppText>
            </View>
            <View style={styles.profileInfo}>
              <AppText variant="h2" style={styles.name}>{resident.firstName} {resident.lastName}</AppText>
              <View style={styles.statusRow}>
                <StatusBadge
                  label={REGISTRATION_STATUS_LABELS[resident.status]}
                  type={resident.status === 'ACTIVE' ? 'success' : resident.status === 'REJECTED' ? 'danger' : resident.status === 'APPROVED' ? 'success' : 'warning'}
                  style={styles.statusBadge}
                />
              </View>
            </View>
          </View>
        </AppCard>

        <AppCard style={styles.sectionCard}>
          <AppText variant="h3" style={styles.sectionTitle}>{localizedUiText.m_199c39763358} / {localizedUiText.m_70761c1912c0}</AppText>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>{localizedUiText.m_4e545960f1bf}</AppText>
              <AppText variant="body" style={styles.infoValue}>{resident.unit?.unitNumber || resident.unitNumber}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>{localizedUiText.m_5704b7c3727f}</AppText>
              <AppText variant="body" style={styles.infoValue}>{RELATIONSHIP_TYPE_LABELS[resident.relationshipType]}</AppText>
            </View>
            {resident.familyRelationshipSubType && (
              <View style={styles.infoItem}>
                <AppText variant="caption" style={styles.infoLabel}>{localizedUiText.m_5704b7c3727f} Sub-type</AppText>
                <AppText variant="body" style={styles.infoValue}>{FAMILY_RELATIONSHIP_SUBTYPE_LABELS[resident.familyRelationshipSubType]}</AppText>
              </View>
            )}
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>{localizedUiText.m_6a8c4e0e0703}</AppText>
              <AppText variant="body" style={styles.infoValue}>{resident.mobile}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>{localizedUiText.m_17507dcf8457}</AppText>
              <AppText variant="body" style={styles.infoValue}>{resident.email}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>{localizedUiText.m_a20969304997}</AppText>
              <AppText variant="body" style={styles.infoValue}>{REGISTRATION_STATUS_LABELS[resident.status]}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>Identity Verification</AppText>
              <AppText variant="body" style={styles.infoValue}>{resident.verificationStatus === 'VERIFIED' ? 'Verified' : 'Pending'}</AppText>
            </View>
            {resident.registeredAt && (
              <View style={styles.infoItem}>
                <AppText variant="caption" style={styles.infoLabel}>Registered</AppText>
                <AppText variant="body" style={styles.infoValue}>{format(new Date(resident.registeredAt), 'MMM d, yyyy')}</AppText>
              </View>
            )}
            {resident.activatedAt && (
              <View style={styles.infoItem}>
                <AppText variant="caption" style={styles.infoLabel}>Activated</AppText>
                <AppText variant="body" style={styles.infoValue}>{format(new Date(resident.activatedAt), 'MMM d, yyyy')}</AppText>
              </View>
            )}
          </View>
        </AppCard>

        {resident.invitation && (
          <AppCard style={styles.sectionCard}>
            <AppText variant="h3" style={styles.sectionTitle}>Invitation</AppText>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <AppText variant="caption" style={styles.infoLabel}>Status</AppText>
                <StatusBadge label={resident.invitation.status} type={resident.invitation.status === 'ACCEPTED' ? 'success' : 'warning'} />
              </View>
              <View style={styles.infoItem}>
                <AppText variant="caption" style={styles.infoLabel}>Sent</AppText>
                <AppText variant="body" style={styles.infoValue}>{format(new Date(resident.invitation.createdAt), 'MMM d, yyyy')}</AppText>
              </View>
              {resident.invitation.acceptedAt && (
                <View style={styles.infoItem}>
                  <AppText variant="caption" style={styles.infoLabel}>Accepted</AppText>
                  <AppText variant="body" style={styles.infoValue}>{format(new Date(resident.invitation.acceptedAt), 'MMM d, yyyy')}</AppText>
                </View>
              )}
              <View style={styles.infoItem}>
                <AppText variant="caption" style={styles.infoLabel}>Expires</AppText>
                <AppText variant="body" style={styles.infoValue}>{format(new Date(resident.invitation.expiresAt), 'MMM d, yyyy')}</AppText>
              </View>
            </View>
          </AppCard>
        )}

        <AppCard style={styles.sectionCard}>
          <AppText variant="h3" style={styles.sectionTitle}>Documents ({resident.documents.length} / {resident.requiredDocuments.length})</AppText>
          {resident.documents.length === 0 ? (
            <View style={styles.emptyDocs}>
              <AppText variant="body" style={styles.emptyText}>No documents uploaded</AppText>
            </View>
          ) : (
            <View style={styles.docsList}>
              {resident.documents.map((doc) => (
                <View key={doc.id} style={styles.docItem}>
                  <View style={styles.docInfo}>
                    <AppText variant="body" style={styles.docName}>{doc.fileName}</AppText>
                    <AppText variant="caption" style={styles.docMeta}>
                      {doc.type} • {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                    </AppText>
                  </View>
                  <StatusBadge
                    label={doc.status}
                    type={doc.status === 'VERIFIED' ? 'success' : doc.status === 'REJECTED' ? 'danger' : 'warning'}
                    style={styles.docBadge}
                  />
                </View>
              ))}
              {resident.requiredDocuments.map((req) => {
                const existing = resident.documents.find((d) => d.type === req.type);
                if (existing) return null;
                return (
                  <View key={req.type} style={styles.docItemMissing}>
                    <View style={styles.docInfo}>
                      <AppText variant="body" style={styles.docName}>{req.label}</AppText>
                      <AppText variant="caption" style={styles.docMeta}>
                        {req.mandatory ? 'Required' : 'Optional'}
                      </AppText>
                    </View>
                    <StatusBadge label="Missing" type="danger" style={styles.docBadge} />
                  </View>
                );
              })}
            </View>
          )}
        </AppCard>

        {resident.rejectionReason && (
          <AppCard style={[styles.sectionCard, styles.rejectionCard]}>
            <AppText variant="h3" style={[styles.sectionTitle, { color: colors.danger }]}>Rejection Reason</AppText>
            <AppText variant="body" style={styles.rejectionText}>{resident.rejectionReason}</AppText>
          </AppCard>
        )}

        {(canApprove || canReject || canResubmit || canActivate) && (
          <View style={styles.actionsContainer}>
            {canApprove && (
              <AppButton
                title={localizedUiText.m_6007acbe30b2}
                variant="primary"
                onPress={handleApprove}
                disabled={isActionLoading}
                iconLeft={<AppIcon name="checkmark" size={18} color={colors.white} />}
                fullWidth
              />
            )}
            {canActivate && (
              <AppButton
                title="Activate Resident"
                variant="success"
                onPress={handleActivate}
                disabled={isActionLoading}
                iconLeft={<AppIcon name="person-add" size={18} color={colors.white} />}
                fullWidth
              />
            )}
            {canReject && (
              <AppButton
                title={localizedUiText.m_ab604a360777}
                variant="danger"
                onPress={handleReject}
                disabled={isActionLoading}
                iconLeft={<AppIcon name="close" size={18} color={colors.white} />}
                fullWidth
              />
            )}
            {canResubmit && (
              <AppButton
                title="Request Resubmission"
                variant="outline"
                onPress={handleResubmit}
                disabled={isActionLoading}
                iconLeft={<AppIcon name="refresh" size={18} color={colors.primary} />}
                fullWidth
              />
            )}
          </View>
        )}
      </ScrollView>

      {showRejectModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText variant="h3" style={styles.modalTitle}>Reject Registration</AppText>
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
    </SafeAreaView>
  );
}