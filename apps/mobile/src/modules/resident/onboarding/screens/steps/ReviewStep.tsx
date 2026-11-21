import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { OnboardingShell } from '../../components/OnboardingShell';
import { ReviewSection } from '../../components/ReviewSection';
import { PrimaryCTA } from '../../components/PrimaryCTA';
import type { OnboardingProfile, OnboardingDocument, OnboardingUnit, OnboardingSociety, ClaimedRelationshipType, TenantDetails, FamilyDetails, RegistrationDocumentRequirement, RegistrationRequirementResolution, OnboardingStep } from '../../hooks/useResidentOnboarding';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
  FONT_FAMILY_SERIF,
} from '../../../../../shared/theme/typography';

interface ReviewStepProps {
  profile: OnboardingProfile;
  claimedRelationship: ClaimedRelationshipType | null;
  selectedSociety: OnboardingSociety | null;
  selectedUnit: OnboardingUnit | null;
  documents: OnboardingDocument[];
  requirements: readonly RegistrationDocumentRequirement[] | RegistrationDocumentRequirement[];
  requirementResolution: RegistrationRequirementResolution | null;
  tenantDetails?: TenantDetails;
  familyDetails?: FamilyDetails;
  onEditSection: (step: OnboardingStep) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error?: string;
  onBack: () => void;
  onHelp: () => void;
}

export function ReviewStep({
  profile,
  claimedRelationship,
  selectedSociety,
  selectedUnit,
  documents,
  requirements,
  requirementResolution,
  tenantDetails,
  familyDetails,
  onEditSection,
  onSubmit,
  isSubmitting,
  error,
  onBack,
  onHelp,
}: ReviewStepProps) {
  const [agreedToDeclaration, setAgreedToDeclaration] = useState(true);

  const uploadedDocCount = documents.filter(
    (d) => d.status === 'UPLOADED' || d.status === 'SUBMITTED' || d.status === 'VERIFIED',
  ).length;

  const roleLabel =
    claimedRelationship === 'OWNER'
      ? 'Owner'
      : claimedRelationship === 'CO_OWNER'
      ? 'Co-Owner'
      : claimedRelationship === 'TENANT'
      ? 'Tenant'
      : claimedRelationship === 'FAMILY_MEMBER'
      ? `Family Member (${familyDetails?.relationship || 'Spouse'})`
      : 'Authorized Resident';

  return (
    <OnboardingShell
      currentMilestone="Review"
      currentStepIndex={4}
      onBack={onBack}
      onHelp={onHelp}
      footerCta={
        <PrimaryCTA
          label="Submit for verification"
          onPress={onSubmit}
          disabled={!agreedToDeclaration}
          isLoading={isSubmitting}
        />
      }
    >
      <View style={styles.container}>
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>Review your details</Text>
          <Text style={styles.supportingText}>
            Make sure everything looks right before we send your request for verification.
          </Text>
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* 1. YOUR HOME */}
        <ReviewSection
          title="YOUR HOME"
          onEdit={() => onEditSection('FIND_UNIT')}
        >
          <Text style={styles.valuePrimary}>
            {selectedUnit?.unitNumber || 'Not selected'}
          </Text>
          <Text style={styles.valueSecondary}>
            {selectedUnit?.tower || ''} • {selectedUnit?.wing || ''} • Floor {selectedUnit?.floor || ''}
          </Text>
          <Text style={styles.valueMuted}>
            {selectedSociety?.name || ''}, {selectedSociety?.city || ''}
          </Text>
        </ReviewSection>

        {/* 2. YOUR ROLE */}
        <ReviewSection
          title="YOUR ROLE"
          onEdit={() => onEditSection('RESIDENT_TYPE')}
        >
          <Text style={styles.valuePrimary}>{roleLabel}</Text>
          {claimedRelationship === 'TENANT' && tenantDetails && (
            <Text style={styles.valueSecondary}>
              Agreement: {tenantDetails.agreementStart} – {tenantDetails.agreementEnd}
              {tenantDetails.ownerName ? ` (Owner: ${tenantDetails.ownerName})` : ''}
            </Text>
          )}
          {claimedRelationship === 'FAMILY_MEMBER' && familyDetails && (
            <Text style={styles.valueSecondary}>
              Household head: {familyDetails.primaryResidentName || 'Not specified'}
            </Text>
          )}
        </ReviewSection>

        {/* 3. YOUR DETAILS */}
        <ReviewSection
          title="YOUR DETAILS"
          onEdit={() => onEditSection('ABOUT_YOU')}
        >
          <Text style={styles.valuePrimary}>
            {profile.fullName || 'Not provided'}
          </Text>
          <Text style={styles.valueSecondary}>{profile.email || 'Not provided'}</Text>
        </ReviewSection>

        {/* 4. DOCUMENTS */}
        <ReviewSection
          title="DOCUMENTS"
          onEdit={() => onEditSection('DOCUMENTS')}
        >
          <Text style={styles.valuePrimary}>
            {uploadedDocCount} document{uploadedDocCount !== 1 ? 's' : ''} uploaded
            {requirementResolution && !requirementResolution.complete && (
              <Text style={styles.inlineNotice}> — {requirementResolution.incompleteRequirements.length} required pending</Text>
            )}
          </Text>
          <View style={styles.docsMiniList}>
            {documents
              .filter((d) => d.status === 'UPLOADED' || d.status === 'SUBMITTED' || d.status === 'VERIFIED')
              .map((d) => (
                <View key={d.id} style={styles.docRow}>
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="m5 12 5 5L20 7"
                      stroke="#1B7A4E"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                  <Text style={styles.docRowText}>
                    {d.title}: {d.fileName || 'Uploaded'}
                  </Text>
                </View>
              ))}
          </View>
        </ReviewSection>

        {/* Concise Consent & Declaration (Screen 17) */}
        <Pressable
          onPress={() => setAgreedToDeclaration(!agreedToDeclaration)}
          style={styles.consentRow}
        >
          <View style={[styles.checkbox, agreedToDeclaration && styles.checkboxActive]}>
            {agreedToDeclaration && (
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Path
                  d="m5 12 5 5L20 7"
                  stroke="#FFFFFF"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            )}
          </View>
          <Text style={styles.consentText}>
            By continuing, you confirm that the information provided is accurate and agree to your society's residency bylaws.
          </Text>
        </Pressable>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingTop: 8,
  },
  headerBlock: {
    gap: 6,
  },
  heading: {
    fontSize: 26,
    fontFamily: FONT_FAMILY_SERIF,
    fontWeight: '600',
    color: '#10201D',
  },
  supportingText: {
    fontSize: 14.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
    lineHeight: 20,
  },
  valuePrimary: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#10201D',
  },
  valueSecondary: {
    fontSize: 13.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#55605C',
    marginTop: 2,
  },
  valueMuted: {
    fontSize: 12.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#7C8581',
    marginTop: 1,
  },
  inlineNotice: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#D9534F',
  },
  docsMiniList: {
    gap: 4,
    marginTop: 4,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  docRowText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER,
    color: '#10201D',
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F5F2EA',
    borderRadius: 14,
    padding: 14,
    marginVertical: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#C5C2B8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    borderColor: '#064F45',
    backgroundColor: '#064F45',
  },
  consentText: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#55605C',
    lineHeight: 18,
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#D9534F',
  },
});

