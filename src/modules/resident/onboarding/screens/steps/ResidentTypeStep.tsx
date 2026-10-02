import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingShell } from '../../components/OnboardingShell';
import { ResidentTypeSelector } from '../../components/ResidentTypeSelector';
import { PrimaryCTA } from '../../components/PrimaryCTA';
import { ResidentRole, OnboardingUnit } from '../../data/residentOnboarding.types';
import type { ClaimedRelationshipType } from '../../../auth/data/registration.types';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_SERIF,
} from '../../../../../shared/theme/typography';

interface ResidentTypeStepProps {
  unit: OnboardingUnit | null;
  selectedRole: ResidentRole | ClaimedRelationshipType | null;
  onSelectRole: (role: ClaimedRelationshipType) => void;
  onBack: () => void;
  onHelp: () => void;
}

export function ResidentTypeStep({
  unit,
  selectedRole,
  onSelectRole,
  onBack,
  onHelp,
}: ResidentTypeStepProps) {
  const [currentSelection, setCurrentSelection] = useState<ResidentRole | null>(
    selectedRole,
  );

  const handleContinue = () => {
    if (
      currentSelection === 'OWNER' ||
      currentSelection === 'CO_OWNER' ||
      currentSelection === 'TENANT' ||
      currentSelection === 'FAMILY_MEMBER'
    ) {
      onSelectRole(currentSelection);
    }
  };

  return (
    <OnboardingShell
      currentMilestone="About you"
      currentStepIndex={3}
      onBack={onBack}
      onHelp={onHelp}
      footerCta={
        <PrimaryCTA
          label="Continue"
          onPress={handleContinue}
          disabled={!currentSelection}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>How are you connected to this home?</Text>
          <Text style={styles.supportingText}>
            Select your role for unit{' '}
            <Text style={styles.unitHighlight}>{unit?.unitNumber || 'A-1204'}</Text>.
            This determines verification requirements.
          </Text>
        </View>

        <ResidentTypeSelector
          selectedRole={currentSelection}
          onSelectRole={(role) => setCurrentSelection(role)}
        />
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
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
  unitHighlight: {
    fontWeight: '600',
    color: '#064F45',
  },
});

