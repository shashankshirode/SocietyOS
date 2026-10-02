import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../../shared/components/AppHeader';
import { AppCard } from '../../../shared/cards/AppCard';
import { AppButton } from '../../../shared/components/AppButton';
import { AppIcon } from '../../../shared/icons/AppIcon';
import { EmptyState } from '../../../shared/feedback/EmptyState';
import { AppTextInput } from '../../../shared/forms/AppTextInput';
import { FormField } from '../../../shared/forms/FormField';
import { residentRegistrationService } from '../services/residentRegistrationService';
import { verificationService } from '../services/verificationService';
import type { ResidentInvitation, ResidentRegistration, ResidentRegistrationStatus } from '../data/residentRegistration.types';
import { REGISTRATION_STATUS_LABELS, RELATIONSHIP_TYPE_LABELS } from '../data/residentRegistration.types';
import { styles, createTextColorStyle, createViewBackgroundColorStyle } from '../styles/screens/InvitationAcceptanceScreen.styles';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { AppText } from '../../../shared/components/AppText';
import { useSociety } from '../../../core/auth/SocietyProvider';
import { format } from 'date-fns';

type Step = 'verify' | 'profile' | 'documents' | 'complete';

interface InvitationAcceptanceScreenProps {
  route: { params: { token: string } };
  navigation: { goBack: () => void; navigate: (route: string, params?: any) => void };
}

export function InvitationAcceptanceScreen({ route, navigation }: InvitationAcceptanceScreenProps) {
  const { token } = route.params;
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const { colors } = useAppTheme();
  const [invitation, setInvitation] = useState<ResidentInvitation | null>(null);
  const [registration, setRegistration] = useState<ResidentRegistration | null>(null);
  const [step, setStep] = useState<Step>('verify');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeId, setVerificationCodeId] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [profileFirstName, setProfileFirstName] = useState('');
  const [profileLastName, setProfileLastName] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    loadInvitation();
  }, [token]);

  const loadInvitation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const inv = await residentRegistrationService.getInvitationByToken(token);
      if (!inv) {
        setError('Invalid or expired invitation link');
        setIsLoading(false);
        return;
      }
      if (inv.status !== 'PENDING') {
        setError(`This invitation has already been ${inv.status.toLowerCase()}`);
        setIsLoading(false);
        return;
      }
      if (new Date(inv.expiresAt) < new Date()) {
        setError('This invitation has expired');
        setIsLoading(false);
        return;
      }
      setInvitation(inv);

      const reg = await residentRegistrationService.getRegistrationById(inv.registrationId);
      if (reg) setRegistration(reg);

      if (reg?.status === 'REGISTERED' || reg?.status === 'IDENTITY_VERIFIED') {
        setStep('profile');
      } else if (reg?.status === 'DOCUMENTS_SUBMITTED' || reg?.status === 'ADMIN_REVIEW') {
        setStep('documents');
      } else if (reg?.status === 'APPROVED' || reg?.status === 'ACTIVE') {
        setStep('complete');
      }
    } catch (e) {
      setError('Failed to load invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async () => {
    if (!invitation) return;
    setIsResending(true);
    setVerificationError(null);
    try {
      const result = await verificationService.sendCode({
        contact: invitation.recipientMobile,
        channel: 'MOBILE',
        purpose: 'RESIDENT_REGISTRATION',
      });
      if (result.success && result.codeId) {
        setVerificationCodeId(result.codeId);
        Alert.alert('Code Sent', 'Verification code sent to your mobile number');
      } else {
        setVerificationError(result.error || 'Failed to send code');
      }
    } catch (e) {
      setVerificationError('Failed to send verification code');
    } finally {
      setIsResending(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCodeId || verificationCode.length !== 6) {
      setVerificationError('Enter the 6-digit code');
      return;
    }
    setIsVerifying(true);
    setVerificationError(null);
    try {
      const result = await verificationService.verifyCode({
        codeId: verificationCodeId,
        code: verificationCode,
      });
      if (result.success && result.verified) {
        if (registration) {
          await residentRegistrationService.transitionStatus(registration.id, 'IDENTITY_VERIFIED');
          const updated = await residentRegistrationService.getRegistrationById(registration.id);
          if (updated) setRegistration(updated);
        }
        setStep('profile');
      } else {
        setVerificationError(result.error || 'Invalid code');
      }
    } catch (e) {
      setVerificationError('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const saveProfile = async () => {
    if (!registration || profileFirstName.trim().length < 2 || profileLastName.trim().length < 2) {
      Alert.alert('Error', 'Please enter valid first and last name');
      return;
    }
    setIsSavingProfile(true);
    try {
      await residentRegistrationService.updateRegistration({
        id: registration.id,
        firstName: profileFirstName.trim(),
        lastName: profileLastName.trim(),
      });
      const updated = await residentRegistrationService.getRegistrationById(registration.id);
      if (updated) setRegistration(updated);
      await residentRegistrationService.transitionStatus(registration.id, 'REGISTERED');
      setStep('documents');
    } catch (e) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleComplete = () => {
    navigation.navigate('ResidentApp');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !invitation) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_32428ea2bec2} showBack onBack={navigation.goBack} />
        <EmptyState
          title={localizedUiText.m_a491ddff9c85}
          description={error || 'Invitation not found'}
          iconName="alert-circle-outline"
        />
      </SafeAreaView>
    );
  }

  const progressSteps: { id: Step; label: string }[] = [
    { id: 'verify', label: 'Verify' },
    { id: 'profile', label: 'Profile' },
    { id: 'documents', label: 'Documents' },
    { id: 'complete', label: 'Complete' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_32428ea2bec2} showBack onBack={navigation.goBack} />

      <View style={styles.progressContainer}>
        {progressSteps.map((s, i) => (
          <View key={s.id} style={styles.progressStep}>
            <View
              style={[
                styles.progressCircle,
                progressSteps.indexOf({ id: step, label: '' }) > i && styles.progressCircleCompleted,
                progressSteps.indexOf({ id: step, label: '' }) === i && styles.progressCircleActive,
              ]}
            >
              {progressSteps.indexOf({ id: step, label: '' }) > i && <AppIcon name="checkmark" size={12} color={colors.white} />}
              {progressSteps.indexOf({ id: step, label: '' }) === i && <AppText variant="caption" style={styles.progressNumber}>{i + 1}</AppText>}
              {progressSteps.indexOf({ id: step, label: '' }) < i && <AppText variant="caption" style={styles.progressNumber}>{i + 1}</AppText>}
            </View>
            <AppText variant="caption" style={[
              styles.progressLabel,
              progressSteps.indexOf({ id: step, label: '' }) === i && styles.progressLabelActive,
            ]}>
              {s.label}
            </AppText>
            {i < progressSteps.length - 1 && (
              <View style={[
                styles.progressLine,
                progressSteps.indexOf({ id: step, label: '' }) > i && styles.progressLineCompleted,
              ]} />
            )}
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AppCard style={styles.invitationCard}>
          <AppText variant="h3" style={styles.cardTitle}>Invitation Details</AppText>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>Society</AppText>
              <AppText variant="body" style={styles.infoValue}>{invitation.societyName}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>Unit</AppText>
              <AppText variant="body" style={styles.infoValue}>{invitation.unitNumber}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>Relationship</AppText>
              <AppText variant="body" style={styles.infoValue}>{RELATIONSHIP_TYPE_LABELS[invitation.relationshipType]}</AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption" style={styles.infoLabel}>Status</AppText>
              <AppText variant="body" style={styles.infoValue}>{registration ? REGISTRATION_STATUS_LABELS[registration.status] : 'Invited'}</AppText>
            </View>
          </View>
        </AppCard>

        {step === 'verify' && (
          <AppCard style={styles.stepCard}>
            <AppText variant="h3" style={styles.stepTitle}>Verify Your Mobile</AppText>
            <AppText variant="body" style={styles.stepSubtitle}>
              We've sent a 6-digit code to <strong>{invitation.recipientMobile}</strong>
            </AppText>
            <View style={styles.codeInputContainer}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={styles.codeBox}>
                  <AppText variant="h3" style={styles.codeChar}>
                    {verificationCode[i] || ''}
                  </AppText>
                </View>
              ))}
            </View>
            {verificationError && (
              <AppText variant="caption" style={styles.errorText}>{verificationError}</AppText>
            )}
            <View style={styles.codeInputs}>
              {[...Array(6)].map((_, i) => (
                <AppTextInput
                  key={i}
                  maxLength={1}
                  value={verificationCode[i] || ''}
                  onChangeText={(text: string) => {
                    const newCode = verificationCode.split('');
                    newCode[i] = text;
                    setVerificationCode(newCode.join(''));
                    if (text && i < 5) {
                      (document.getElementById(`code-input-${i + 1}`) as any)?.focus?.();
                    }
                  }}
                  keyboardType="numeric"
                  autoFocus={i === 0}
                  id={`code-input-${i}`}
                />
              ))}
            </View>
            <AppButton
              title={isVerifying ? 'Verifying...' : 'Verify'}
              variant="primary"
              onPress={verifyCode}
              disabled={isVerifying || verificationCode.length !== 6}
              fullWidth
            />
            <View style={styles.resendRow}>
              <AppText variant="caption" style={styles.resendText}>Didn't receive the code? </AppText>
              <AppButton
                title="Resend"
                variant="ghost"
                onPress={sendVerificationCode}
                disabled={isResending}
                size="sm"
              />
            </View>
          </AppCard>
        )}

        {step === 'profile' && (
          <AppCard style={styles.stepCard}>
            <AppText variant="h3" style={styles.stepTitle}>Complete Your Profile</AppText>
            <AppText variant="body" style={styles.stepSubtitle}>
              Please confirm your name to complete registration
            </AppText>
            <View style={styles.formFields}>
              <FormField
                label="First Name"
                value={profileFirstName || registration?.firstName || ''}
                onChangeText={setProfileFirstName}
                placeholder="Enter first name"
                required
              />
              <FormField
                label="Last Name"
                value={profileLastName || registration?.lastName || ''}
                onChangeText={setProfileLastName}
                placeholder="Enter last name"
                required
              />
            </View>
            <AppButton
              title={isSavingProfile ? 'Saving...' : 'Continue'}
              variant="primary"
              onPress={saveProfile}
              disabled={isSavingProfile || profileFirstName.trim().length < 2 || profileLastName.trim().length < 2}
              fullWidth
            />
          </AppCard>
        )}

        {step === 'documents' && (
          <AppCard style={styles.stepCard}>
            <AppText variant="h3" style={styles.stepTitle}>Upload Documents</AppText>
            <AppText variant="body" style={styles.stepSubtitle}>
              Please upload the required documents for verification
            </AppText>
            <View style={styles.docsPlaceholder}>
              <AppIcon name="document-outline" size={48} color={colors.textMuted} />
              <AppText variant="body" style={styles.docsText}>Document upload will be available after backend integration</AppText>
              <AppText variant="caption" style={styles.docsSubtext}>For now, you can proceed to complete registration</AppText>
            </View>
            <AppButton
              title="Skip & Complete Registration"
              variant="primary"
              onPress={() => setStep('complete')}
              fullWidth
            />
          </AppCard>
        )}

        {step === 'complete' && (
          <AppCard style={styles.stepCard}>
            <View style={styles.completionContent}>
              <AppIcon name="checkmark-circle" size={64} color={colors.success} />
              <AppText variant="h2" style={styles.completionTitle}>All Set!</AppText>
              <AppText variant="body" style={styles.completionText}>
                Your registration has been submitted for admin review. You will be notified once approved.
              </AppText>
            </View>
            <AppButton
              title="Go to Resident App"
              variant="primary"
              onPress={handleComplete}
              fullWidth
            />
          </AppCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}