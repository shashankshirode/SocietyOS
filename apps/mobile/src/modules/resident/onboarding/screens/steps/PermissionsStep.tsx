import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { OnboardingShell } from '../../components/OnboardingShell';
import { PrimaryCTA } from '../../components/PrimaryCTA';
import { SecondaryCTA } from '../../components/SecondaryCTA';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
  FONT_FAMILY_SERIF,
} from '../../../../../shared/theme/typography';

interface PermissionsStepProps {
  onAllow: () => void;
  onSkip: () => void;
  onHelp: () => void;
}

export function PermissionsStep({
  onAllow,
  onSkip,
  onHelp,
}: PermissionsStepProps) {
  return (
    <OnboardingShell
      currentMilestone="Ready"
      currentStepIndex={5}
      showBack={false}
      onHelp={onHelp}
      footerCta={
        <>
          <PrimaryCTA
            label="Allow notifications"
            onPress={onAllow}
            showArrow={false}
          />
          <SecondaryCTA
            label="Not now"
            onPress={onSkip}
          />
        </>
      }
    >
      <View style={styles.container}>
        {/* Notification Bell Icon */}
        <View style={styles.iconCircle}>
          <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
              stroke="#064F45"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        {/* Heading & Supporting Copy */}
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>Stay connected to your home</Text>
          <Text style={styles.supportingText}>
            Never miss visitor arrival requests, urgent community notices, or payment due reminders.
          </Text>
        </View>

        {/* Value Points */}
        <View style={styles.pointsList}>
          <View style={styles.pointRow}>
            <View style={styles.pointIconBox}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                  stroke="#064F45"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.pointTextCol}>
              <Text style={styles.pointTitle}>Gate & Visitor approvals</Text>
              <Text style={styles.pointDesc}>Instant notifications when guests or deliveries arrive at your gate.</Text>
            </View>
          </View>

          <View style={styles.pointRow}>
            <View style={styles.pointIconBox}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01"
                  stroke="#064F45"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.pointTextCol}>
              <Text style={styles.pointTitle}>Emergency & Safety broadcasts</Text>
              <Text style={styles.pointDesc}>Urgent water maintenance, lift service, or security alerts.</Text>
            </View>
          </View>
        </View>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingTop: 16,
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E6F0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  headerBlock: {
    gap: 8,
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontFamily: FONT_FAMILY_SERIF,
    fontWeight: '600',
    color: '#10201D',
    textAlign: 'center',
  },
  supportingText: {
    fontSize: 14.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 10,
  },
  pointsList: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EBE8DE',
    padding: 18,
    gap: 16,
    marginTop: 8,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  pointIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E6F0EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointTextCol: {
    flex: 1,
    gap: 3,
  },
  pointTitle: {
    fontSize: 14.5,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#10201D',
  },
  pointDesc: {
    fontSize: 12.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
    lineHeight: 18,
  },
});

