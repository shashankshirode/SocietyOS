import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { OnboardingShell } from '../../components/OnboardingShell';
import { PrimaryCTA } from '../../components/PrimaryCTA';
import { SecondaryCTA } from '../../components/SecondaryCTA';
import { OnboardingSociety, OnboardingUnit } from '../../data/residentOnboarding.types';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
  FONT_FAMILY_SERIF,
} from '../../../../../shared/theme/typography';

interface ConfirmUnitStepProps {
  society: OnboardingSociety | null;
  unit: OnboardingUnit;
  onConfirm: () => void;
  onChooseAnother: () => void;
  onBack: () => void;
  onHelp: () => void;
}

export function ConfirmUnitStep({
  society,
  unit,
  onConfirm,
  onChooseAnother,
  onBack,
  onHelp,
}: ConfirmUnitStepProps) {
  return (
    <OnboardingShell
      currentMilestone="Your home"
      currentStepIndex={2}
      onBack={onBack}
      onHelp={onHelp}
      footerCta={
        <>
          <PrimaryCTA
            label="Yes, this is my home"
            onPress={onConfirm}
          />
          <SecondaryCTA
            label="Choose another home"
            onPress={onChooseAnother}
          />
        </>
      }
    >
      <View style={styles.container}>
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>Is this your home?</Text>
          <Text style={styles.supportingText}>
            Confirm your unit details to begin association.
          </Text>
        </View>

        {/* Reassuring Unit Card */}
        <View style={styles.unitHeroCard}>
          <View style={styles.iconBox}>
            <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                stroke="#064F45"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M9 22V12h6v10"
                stroke="#064F45"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          <Text style={styles.unitBigTitle}>{unit.unitNumber}</Text>
          <Text style={styles.unitSubLocation}>
            {unit.tower} • {unit.wing} • Floor {unit.floor}
          </Text>

          <View style={styles.divider} />

          <View style={styles.societyDetailsRow}>
            <View style={styles.societyLogoPlaceholder}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#064F45"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.societyTextCol}>
              <Text style={styles.societyNameText}>{society?.name || 'Green Valley Heights'}</Text>
              <Text style={styles.societyLocationText}>
                {society?.city || 'Nashik'}, {society?.state || 'Maharashtra'}
              </Text>
            </View>
          </View>
        </View>
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
  },
  unitHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EBE8DE',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  unitBigTitle: {
    fontSize: 32,
    fontFamily: FONT_FAMILY_SERIF,
    fontWeight: '700',
    color: '#10201D',
  },
  unitSubLocation: {
    fontSize: 14.5,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#69716D',
    marginTop: 4,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F0EDE4',
    marginVertical: 18,
  },
  societyDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'flex-start',
  },
  societyLogoPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#E6F0EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  societyTextCol: {
    gap: 2,
  },
  societyNameText: {
    fontSize: 14.5,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#10201D',
  },
  societyLocationText: {
    fontSize: 12.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#7C8581',
  },
});

