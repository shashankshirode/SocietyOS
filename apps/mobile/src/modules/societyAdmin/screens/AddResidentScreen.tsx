import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, ActivityIndicator, Alert, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../../shared/components/AppHeader';
import { AppCard } from '../../../shared/cards/AppCard';
import { AppButton } from '../../../shared/components/AppButton';
import { FormField } from '../../../shared/forms/FormField';
import { useAdminCreateResidentRegistration, useAdminCheckDuplicate, useAdminResidentInvitation } from '../data/useAdminResidentRegistrations';
import { useSociety } from '../../../core/auth/SocietyProvider';
import { useAdminUnits } from '../data/useAdminUnits';
import type { AdminUnit } from '../../../shared/types/admin.types';
import type { ResidentRelationshipType, FamilyRelationshipSubType } from '../data/residentRegistration.types';
import { RELATIONSHIP_TYPE_LABELS, FAMILY_RELATIONSHIP_SUBTYPE_LABELS } from '../data/residentRegistration.types';
import { styles, createTextColorStyle, createViewBackgroundColorStyle } from '../styles/screens/AddResidentScreen.styles';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { AppText } from '../../../shared/components/AppText';
import { AppIcon } from '../../../shared/icons/AppIcon';

type Step = 'unit' | 'relationship' | 'details' | 'review';

const RELATIONSHIP_OPTIONS = [
  { value: 'OWNER', label: RELATIONSHIP_TYPE_LABELS.OWNER },
  { value: 'CO_OWNER', label: RELATIONSHIP_TYPE_LABELS.CO_OWNER },
  { value: 'TENANT', label: RELATIONSHIP_TYPE_LABELS.TENANT },
  { value: 'FAMILY_MEMBER', label: RELATIONSHIP_TYPE_LABELS.FAMILY_MEMBER },
] as const;

const FAMILY_SUBTYPE_OPTIONS = [
  { value: 'SPOUSE', label: FAMILY_RELATIONSHIP_SUBTYPE_LABELS.SPOUSE },
  { value: 'CHILD', label: FAMILY_RELATIONSHIP_SUBTYPE_LABELS.CHILD },
  { value: 'PARENT', label: FAMILY_RELATIONSHIP_SUBTYPE_LABELS.PARENT },
  { value: 'DEPENDENT', label: FAMILY_RELATIONSHIP_SUBTYPE_LABELS.DEPENDENT },
  { value: 'OTHER', label: FAMILY_RELATIONSHIP_SUBTYPE_LABELS.OTHER },
] as const;

export function AddResidentScreen({ navigation }: { navigation: { goBack: () => void; navigate: (route: string, params?: any) => void } }) {
  const { currentSociety } = useSociety();
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const { colors } = useAppTheme();
  const { data: units = [], isLoading: unitsLoading } = useAdminUnits({ societyId: currentSociety?.id || '' });
  const { execute: createRegistration, isSubmitting: creating, error: createError } = useAdminCreateResidentRegistration();
  const { execute: checkDuplicate, isChecking } = useAdminCheckDuplicate();
  const { createInvitation, isSubmitting: inviting } = useAdminResidentInvitation();

  const [step, setStep] = useState<Step>('unit');
  const [selectedUnit, setSelectedUnit] = useState<AdminUnit | null>(null);
  const [relationshipType, setRelationshipType] = useState<ResidentRelationshipType>('OWNER');
  const [familySubType, setFamilySubType] = useState<FamilyRelationshipSubType | undefined>(undefined);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [duplicateCheck, setDuplicateCheck] = useState<{ hasDuplicate: boolean; message: string } | null>(null);
  const [showInviteConfirm, setShowInviteConfirm] = useState(false);
  const [createdRegistrationId, setCreatedRegistrationId] = useState<string | null>(null);

  const steps: Step[] = ['unit', 'relationship', 'details', 'review'];
  const currentStepIndex = steps.indexOf(step);

  const canGoNext = useCallback(() => {
    switch (step) {
      case 'unit':
        return !!selectedUnit;
      case 'relationship':
        return !!relationshipType && (relationshipType !== 'FAMILY_MEMBER' || !!familySubType);
      case 'details':
        return firstName.trim().length >= 2 && lastName.trim().length >= 2 && mobile.length >= 10 && email.includes('@');
      case 'review':
        return true;
      default:
        return false;
    }
  }, [step, selectedUnit, relationshipType, familySubType, firstName, lastName, mobile, email]);

const handleNext = async () => {
    if (step === 'details') {
      setDuplicateCheck(null);
      if (currentSociety?.id) {
        const result = await checkDuplicate(currentSociety.id, mobile, email);
        setDuplicateCheck(result);
        if (result.hasDuplicate) {
          Alert.alert('Duplicate Detected', result.message);
          return;
        }
      }
    }
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      if (nextStep) setStep(nextStep as Step);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      if (prevStep) setStep(prevStep as Step);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    if (!currentSociety?.id) return;
    try {
      const registration = await createRegistration({
        societyId: currentSociety.id,
        unitId: selectedUnit!.id,
        relationshipType,
        ...(familySubType && { familyRelationshipSubType: familySubType }),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        createdBy: 'admin',
      });
      setCreatedRegistrationId(registration.id);
      setShowInviteConfirm(true);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to create registration');
    }
  };

  const handleSendInvitation = async () => {
    if (!createdRegistrationId || !currentSociety || !selectedUnit) return;
    try {
      await createInvitation({
        registrationId: createdRegistrationId,
        societyId: currentSociety.id,
        societyName: currentSociety.name,
        unitId: selectedUnit.id,
        unitNumber: selectedUnit.unitNumber,
        relationshipType,
        ...(familySubType && { familyRelationshipSubType: familySubType }),
        recipientMobile: mobile,
        recipientEmail: email,
      });
      Alert.alert('Success', 'Invitation sent successfully');
      setShowInviteConfirm(false);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to send invitation');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'unit':
        return (
          <View style={styles.stepContent}>
            <AppText variant="h3" style={styles.stepTitle}>Select Unit</AppText>
            <AppText variant="body" style={styles.stepSubtitle}>Choose the unit for this resident</AppText>
            {unitsLoading ? (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : units.length === 0 ? (
              <View style={styles.emptyState}>
                <AppIcon name="home-outline" size={48} color={colors.textMuted} />
                <AppText variant="body" style={styles.emptyText}>No units available</AppText>
              </View>
            ) : (
              <FlatList<AdminUnit>
                data={units}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.unitCard,
                      selectedUnit?.id === item.id && styles.unitCardSelected,
                    ]}
                    onPress={() => setSelectedUnit(item)}
                  >
                    <AppText variant="body" style={styles.unitNumber}>{item.unitNumber}</AppText>
                    <AppText variant="caption" style={styles.unitMeta}>
                      {item.wing}, Floor {item.floor} • {item.unitType}
                    </AppText>
                    <AppText variant="caption" style={styles.unitStatus}>
                      {item.occupancyStatus}
                    </AppText>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.unitList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        );
      case 'relationship':
        return (
          <View style={styles.stepContent}>
            <AppText variant="h3" style={styles.stepTitle}>Select Relationship</AppText>
            <AppText variant="body" style={styles.stepSubtitle}>How is this resident associated with the unit?</AppText>
            <View style={styles.relationshipOptions}>
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.relationshipOption,
                    relationshipType === opt.value && styles.relationshipOptionSelected,
                  ]}
                  onPress={() => {
                    setRelationshipType(opt.value as ResidentRelationshipType);
                    if (opt.value !== 'FAMILY_MEMBER') {
                      setFamilySubType(undefined);
                    }
                  }}
                >
                  <AppText variant="body" style={[
                    styles.relationshipOptionText,
                    relationshipType === opt.value && styles.relationshipOptionTextSelected,
                  ]}>
                    {opt.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
            {relationshipType === 'FAMILY_MEMBER' && (
              <View style={styles.subTypeSection}>
                <AppText variant="h3" style={styles.subTypeTitle}>Family Relationship</AppText>
                <View style={styles.relationshipOptions}>
                  {FAMILY_SUBTYPE_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.relationshipOption,
                        familySubType === opt.value && styles.relationshipOptionSelected,
                      ]}
                      onPress={() => setFamilySubType(opt.value as FamilyRelationshipSubType)}
                    >
                      <AppText variant="body" style={[
                        styles.relationshipOptionText,
                        familySubType === opt.value && styles.relationshipOptionTextSelected,
                      ]}>
                        {opt.label}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        );
      case 'details':
        return (
          <View style={styles.stepContent}>
            <AppText variant="h3" style={styles.stepTitle}>Resident Details</AppText>
            <AppText variant="body" style={styles.stepSubtitle}>Enter the resident's personal information</AppText>
            <View style={styles.formFields}>
              <FormField
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                required
                error={!firstName.trim() ? 'Required' : ''}
              />
              <FormField
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                required
                error={!lastName.trim() ? 'Required' : ''}
              />
              <FormField
                label="Mobile Number"
                value={mobile}
                onChangeText={setMobile}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                required
                error={mobile.length < 10 ? 'Enter valid mobile number' : ''}
              />
              <FormField
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                keyboardType="email-address"
                required
                error={!email.includes('@') ? 'Enter valid email' : ''}
              />
            </View>
            {duplicateCheck && (
              <View style={styles.duplicateWarning}>
                <AppIcon name="warning" size={20} color={colors.warning} />
                <AppText variant="bodySmall" style={styles.duplicateText}>{duplicateCheck.message}</AppText>
              </View>
            )}
          </View>
        );
      case 'review':
        return (
          <View style={styles.stepContent}>
            <AppText variant="h3" style={styles.stepTitle}>Review & Confirm</AppText>
            <AppText variant="body" style={styles.stepSubtitle}>Please review the details before creating the registration</AppText>
            <AppCard style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <AppText variant="caption" style={styles.reviewLabel}>Unit</AppText>
                <AppText variant="body" style={styles.reviewValue}>{selectedUnit?.unitNumber}</AppText>
              </View>
              <View style={styles.reviewRow}>
                <AppText variant="caption" style={styles.reviewLabel}>Relationship</AppText>
                <AppText variant="body" style={styles.reviewValue}>
                  {RELATIONSHIP_TYPE_LABELS[relationshipType]}
                  {familySubType && ` - ${FAMILY_RELATIONSHIP_SUBTYPE_LABELS[familySubType]}`}
                </AppText>
              </View>
              <View style={styles.reviewRow}>
                <AppText variant="caption" style={styles.reviewLabel}>Name</AppText>
                <AppText variant="body" style={styles.reviewValue}>{firstName} {lastName}</AppText>
              </View>
              <View style={styles.reviewRow}>
                <AppText variant="caption" style={styles.reviewLabel}>Mobile</AppText>
                <AppText variant="body" style={styles.reviewValue}>{mobile}</AppText>
              </View>
              <View style={styles.reviewRow}>
                <AppText variant="caption" style={styles.reviewLabel}>Email</AppText>
                <AppText variant="body" style={styles.reviewValue}>{email}</AppText>
              </View>
            </AppCard>
            {duplicateCheck && duplicateCheck.hasDuplicate && (
              <View style={styles.duplicateWarning}>
                <AppIcon name="warning" size={20} color={colors.warning} />
                <AppText variant="bodySmall" style={styles.duplicateText}>{duplicateCheck.message}</AppText>
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader
        title={localizedUiText.m_32428ea2bec2}
        showBack
        onBack={handleBack}
      />

      <View style={styles.progressContainer}>
        {steps.map((s, i) => (
          <View key={s} style={styles.progressStep}>
            <View
              style={[
                styles.progressCircle,
                i < currentStepIndex && styles.progressCircleCompleted,
                i === currentStepIndex && styles.progressCircleActive,
              ]}
            >
              {i < currentStepIndex && <AppIcon name="checkmark" size={12} color={colors.white} />}
              {i === currentStepIndex && <AppText variant="caption" style={styles.progressNumber}>{i + 1}</AppText>}
              {i > currentStepIndex && <AppText variant="caption" style={styles.progressNumber}>{i + 1}</AppText>}
            </View>
            <AppText variant="caption" style={[
              styles.progressLabel,
              i === currentStepIndex && styles.progressLabelActive,
            ]}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </AppText>
            {i < steps.length - 1 && (
              <View style={[
                styles.progressLine,
                i < currentStepIndex && styles.progressLineCompleted,
              ]} />
            )}
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        {step !== 'review' && (
          <AppButton
            title={currentStepIndex === steps.length - 2 ? localizedUiText.m_e6779afda449 : localizedUiText.m_684b45158391}
            variant="primary"
            onPress={handleNext}
            disabled={!canGoNext() || creating || inviting}
            fullWidth
          />
        )}
        {step === 'review' && (
          <AppButton
            title={localizedUiText.m_32428ea2bec2}
            variant="primary"
            onPress={handleSubmit}
            disabled={creating || inviting}
            fullWidth
            loading={creating}
          />
        )}
        {step !== 'unit' && (
          <AppButton
            title={localizedUiText.m_648435d140c3}
            variant="outline"
            onPress={handleBack}
            fullWidth
            style={styles.backButton}
          />
        )}
      </View>

      {showInviteConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppIcon name="checkmark-circle" size={48} color={colors.success} />
            <AppText variant="h3" style={styles.modalTitle}>Registration Created</AppText>
            <AppText variant="body" style={styles.modalText}>
              Resident registration has been created successfully. Would you like to send an invitation now?
            </AppText>
            <View style={styles.modalButtons}>
              <AppButton
                title="Later"
                variant="outline"
                onPress={() => {
                  setShowInviteConfirm(false);
                  navigation.goBack();
                }}
                fullWidth
              />
              <AppButton
                title="Send Invitation"
                variant="primary"
                onPress={handleSendInvitation}
                disabled={inviting}
                loading={inviting}
                fullWidth
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}