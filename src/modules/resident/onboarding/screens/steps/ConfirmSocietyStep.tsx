import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { OnboardingShell } from '../../components/OnboardingShell';
import { PrimaryCTA } from '../../components/PrimaryCTA';
import { SecondaryCTA } from '../../components/SecondaryCTA';
import { OnboardingSociety } from '../../data/residentOnboarding.types';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
  FONT_FAMILY_SERIF,
} from '../../../../../shared/theme/typography';

interface ConfirmSocietyStepProps {
  society: OnboardingSociety;
  onConfirm: () => void;
  onChooseAnother: () => void;
  onBack: () => void;
  onHelp: () => void;
}

export function ConfirmSocietyStep({
  society,
  onConfirm,
  onChooseAnother,
  onBack,
  onHelp,
}: ConfirmSocietyStepProps) {
  return (
    <OnboardingShell
      currentMilestone="Your home"
      currentStepIndex={2}
      onBack={onBack}
      onHelp={onHelp}
      footerCta={
        <>
          <PrimaryCTA
            label="Yes, continue"
            onPress={onConfirm}
          />
          <SecondaryCTA
            label="Choose another society"
            onPress={onChooseAnother}
          />
        </>
      }
    >
      <View style={styles.container}>
        {/* Editorial Title */}
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>Is this your community?</Text>
          <Text style={styles.supportingText}>
            Confirm your society before associating your home.
          </Text>
        </View>

        {/* Hero Society Identity Card */}
        <View style={styles.societyHeroCard}>
          <Image
            source={require('../../../../../../assets/images/community-feature.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <View style={styles.heroMeta}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{society.category}</Text>
            </View>

            <Text style={styles.societyNameText}>{society.name.toUpperCase()}</Text>

            <View style={styles.locationRow}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                  stroke="#69716D"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                  stroke="#69716D"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.locationText}>
                {society.city}, {society.state}
              </Text>
            </View>

            <View style={styles.statsDivider} />

            <View style={styles.statsRow}>
              <View style={styles.statCol}>
                <Text style={styles.statNumber}>{society.totalUnits}</Text>
                <Text style={styles.statLabel}>Total Homes</Text>
              </View>
              <View style={styles.statSeparator} />
              <View style={styles.statCol}>
                <Text style={styles.statNumber}>Verified</Text>
                <Text style={styles.statLabel}>Society Status</Text>
              </View>
              <View style={styles.statSeparator} />
              <View style={styles.statCol}>
                <Text style={styles.statNumber}>Active</Text>
                <Text style={styles.statLabel}>Governance</Text>
              </View>
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
  societyHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EBE8DE',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  heroImage: {
    width: '100%',
    height: 160,
  },
  heroMeta: {
    padding: 18,
    gap: 6,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F0EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 2,
  },
  categoryBadgeText: {
    fontSize: 11.5,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#064F45',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  societyNameText: {
    fontSize: 20,
    fontFamily: FONT_FAMILY_SERIF,
    fontWeight: '700',
    color: '#10201D',
    letterSpacing: 0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 13.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
  },
  statsDivider: {
    height: 1,
    backgroundColor: '#F0EDE4',
    marginVertical: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statCol: {
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    fontSize: 14.5,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#064F45',
  },
  statLabel: {
    fontSize: 11.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#7C8581',
  },
  statSeparator: {
    width: 1,
    height: 24,
    backgroundColor: '#EBE8DE',
  },
});

