import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
} from '../../../../shared/theme/typography';

interface StatusStep {
  id: string;
  label: string;
  isComplete: boolean;
  isCurrent?: boolean;
}

interface VerificationStatusProps {
  steps?: StatusStep[];
}

const DEFAULT_STEPS: StatusStep[] = [
  { id: 'mobile', label: 'Mobile verified', isComplete: true },
  { id: 'home', label: 'Home selected', isComplete: true },
  { id: 'details', label: 'Details submitted', isComplete: true },
  { id: 'society', label: 'Society verification', isComplete: false, isCurrent: true },
];

export function VerificationStatus({
  steps = DEFAULT_STEPS,
}: VerificationStatusProps) {
  return (
    <View style={styles.card}>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;

        return (
          <View key={step.id} style={styles.stepRow}>
            {/* Left Node & Vertical Connector Line */}
            <View style={styles.nodeColumn}>
              <View
                style={[
                  styles.nodeCircle,
                  step.isComplete && styles.nodeCircleComplete,
                  step.isCurrent && styles.nodeCircleCurrent,
                ]}
              >
                {step.isComplete ? (
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="m5 12 5 5L20 7"
                      stroke="#FFFFFF"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ) : step.isCurrent ? (
                  <View style={styles.currentPulseDot} />
                ) : (
                  <Circle cx="12" cy="12" r="4" fill="#A0A5A2" />
                )}
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.connectorLine,
                    step.isComplete && styles.connectorLineComplete,
                  ]}
                />
              )}
            </View>

            {/* Right Step Label */}
            <View style={styles.labelColumn}>
              <Text
                style={[
                  styles.stepLabel,
                  step.isComplete && styles.stepLabelComplete,
                  step.isCurrent && styles.stepLabelCurrent,
                ]}
              >
                {step.label}
              </Text>
              {step.isCurrent && (
                <Text style={styles.stepSubtitle}>In review with committee</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EBE8DE',
    padding: 22,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nodeColumn: {
    alignItems: 'center',
    width: 32,
  },
  nodeCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EBE8DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCircleComplete: {
    backgroundColor: '#064F45',
  },
  nodeCircleCurrent: {
    backgroundColor: '#E6F0EE',
    borderWidth: 2,
    borderColor: '#064F45',
  },
  currentPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#064F45',
  },
  connectorLine: {
    width: 2,
    height: 28,
    backgroundColor: '#EBE8DE',
    marginVertical: 2,
  },
  connectorLineComplete: {
    backgroundColor: '#064F45',
  },
  labelColumn: {
    flex: 1,
    marginLeft: 12,
    paddingTop: 3,
  },
  stepLabel: {
    fontSize: 14.5,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#7C8581',
  },
  stepLabelComplete: {
    color: '#10201D',
    fontWeight: '600',
  },
  stepLabelCurrent: {
    color: '#064F45',
    fontFamily: FONT_FAMILY_INTER_BOLD,
  },
  stepSubtitle: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
    marginTop: 2,
  },
});
