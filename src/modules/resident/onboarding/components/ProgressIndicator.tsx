import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingMilestone } from '../data/residentOnboarding.types';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
} from '../../../../shared/theme/typography';

const MILESTONES: OnboardingMilestone[] = [
  'Verify',
  'Your home',
  'About you',
  'Review',
  'Ready',
];

interface ProgressIndicatorProps {
  currentMilestone: OnboardingMilestone;
  currentStepIndex: number;
}

export function ProgressIndicator({
  currentMilestone,
  currentStepIndex,
}: ProgressIndicatorProps) {
  return (
    <View style={styles.container}>
      {/* Subtle Segmented Progress Bar */}
      <View style={styles.barsRow}>
        {MILESTONES.map((milestone, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStepIndex;
          const isCurrent = stepNum === currentStepIndex;

          return (
            <View
              key={milestone}
              style={[
                styles.barSegment,
                isCompleted && styles.barCompleted,
                isCurrent && styles.barCurrent,
              ]}
            />
          );
        })}
      </View>

      {/* Label and Step Count */}
      <View style={styles.labelsRow}>
        <Text style={styles.currentMilestoneText}>{currentMilestone}</Text>
        <Text style={styles.stepCountText}>
          {currentStepIndex} of {MILESTONES.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  barsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginBottom: 6,
  },
  barSegment: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#EBE8DE',
  },
  barCompleted: {
    backgroundColor: '#064F45',
  },
  barCurrent: {
    backgroundColor: '#3D8577',
  },
  labelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentMilestoneText: {
    fontSize: 12.5,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#064F45',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  stepCountText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#7C8581',
  },
});
