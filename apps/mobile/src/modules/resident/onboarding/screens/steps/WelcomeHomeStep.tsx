import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { OnboardingShell } from '../../components/OnboardingShell';
import { PrimaryCTA } from '../../components/PrimaryCTA';
import { ResidentOnboardingDraft } from '../../data/residentOnboarding.types';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
  FONT_FAMILY_SERIF,
} from '../../../../../shared/theme/typography';

interface WelcomeHomeStepProps {
  draft?: ResidentOnboardingDraft;
  onEnterApp: () => void;
  onBack?: () => void;
  onHelp: () => void;
}

export function WelcomeHomeStep({
  draft,
  onEnterApp,
  onBack,
  onHelp,
}: WelcomeHomeStepProps) {
  const societyName = draft?.selectedSociety?.name || 'Green Valley Heights';
  const unitLabel = draft?.selectedUnit
    ? `${draft.selectedUnit.unitNumber} • ${draft.selectedUnit.tower}`
    : 'A-1204 • Tower A';

  return (
    <OnboardingShell
      currentMilestone="Ready"
      currentStepIndex={5}
      showBack={false}
      onHelp={onHelp}
      footerCta={
        <PrimaryCTA
          label="Enter Society OS"
          onPress={onEnterApp}
        />
      }
    >
      <View style={styles.container}>
        {/* Subtle community image banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('../../../../../../assets/images/society-hero.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.sparkleBadge}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                fill="#FFFFFF"
              />
            </Svg>
          </View>
        </View>

        {/* Heading & Subtitle */}
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>Welcome home.</Text>
          <Text style={styles.supportingText}>
            {societyName} is now connected to your residence at{' '}
            <Text style={styles.unitBold}>{unitLabel}</Text>.
          </Text>
        </View>

        {/* Preview of Resident capabilities */}
        <View style={styles.previewGrid}>
          <View style={styles.previewCard}>
            <View style={styles.previewIconCircle}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                  stroke="#064F45"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.previewTitle}>Visitors</Text>
            <Text style={styles.previewDesc}>Passes & instant gate clearance</Text>
          </View>

          <View style={styles.previewCard}>
            <View style={styles.previewIconCircle}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z M2 10h20"
                  stroke="#064F45"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.previewTitle}>Payments</Text>
            <Text style={styles.previewDesc}>1-tap maintenance & GST receipts</Text>
          </View>

          <View style={styles.previewCard}>
            <View style={styles.previewIconCircle}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                  stroke="#064F45"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.previewTitle}>Community</Text>
            <Text style={styles.previewDesc}>Clubhouse events & discussions</Text>
          </View>

          <View style={styles.previewCard}>
            <View style={styles.previewIconCircle}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                  stroke="#064F45"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.previewTitle}>Services</Text>
            <Text style={styles.previewDesc}>Verified domestic help & facility booking</Text>
          </View>
        </View>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    alignItems: 'center',
    paddingTop: 8,
  },
  bannerContainer: {
    width: '100%',
    height: 140,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#EBE8DE',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  sparkleBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#064F45',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerBlock: {
    gap: 6,
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontFamily: FONT_FAMILY_SERIF,
    fontWeight: '700',
    color: '#10201D',
    textAlign: 'center',
  },
  supportingText: {
    fontSize: 14.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 12,
  },
  unitBold: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#064F45',
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
    width: '100%',
  },
  previewCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBE8DE',
    padding: 16,
    gap: 4,
  },
  previewIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#E6F0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  previewTitle: {
    fontSize: 14.5,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#10201D',
  },
  previewDesc: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
    lineHeight: 16,
  },
});

