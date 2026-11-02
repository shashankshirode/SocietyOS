import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from './SafeText';
import { useAppTheme } from '../theme/useAppTheme';

export interface TimelineStepItem {
  id: string;
  title: string;
  timestamp?: string;
  description?: string;
  status: 'completed' | 'active' | 'upcoming';
}

export type TimelineStep = TimelineStepItem;

interface SocietyTimelineProps {
  steps: readonly TimelineStepItem[] | TimelineStepItem[];
  style?: ViewStyle;
}

export function SocietyTimeline({ steps, style }: SocietyTimelineProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <View key={step.id} style={styles.stepRow}>
            <View style={styles.indicatorCol}>
              {step.status === 'completed' ? (
                <View style={[styles.circle, { backgroundColor: '#16A34A' }]}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
              ) : step.status === 'active' ? (
                <View style={[styles.circleActive, { borderColor: '#D97706' }]}>
                  <View style={[styles.innerDot, { backgroundColor: '#D97706' }]} />
                </View>
              ) : (
                <View style={[styles.circleUpcoming, { borderColor: colors.border }]} />
              )}

              {!isLast ? (
                <View
                  style={[
                    styles.connectorLine,
                    {
                      backgroundColor:
                        step.status === 'completed' ? '#16A34A' : colors.border,
                    },
                  ]}
                />
              ) : null}
            </View>

            <View style={[styles.contentCol, !isLast && styles.contentColWithLine]}>
              <SafeText
                style={[
                  styles.stepTitle,
                  {
                    color:
                      step.status === 'upcoming'
                        ? colors.textMuted
                        : colors.textPrimary,
                    fontWeight: step.status === 'active' ? '700' : '600',
                  },
                ]}
              >
                {step.title}
              </SafeText>

              {step.timestamp ? (
                <SafeText style={[styles.stepTimestamp, { color: colors.textSecondary }]}>
                  {step.timestamp}
                </SafeText>
              ) : null}

              {step.description ? (
                <SafeText style={[styles.stepDescription, { color: colors.textMuted }]}>
                  {step.description}
                </SafeText>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  stepRow: {
    flexDirection: 'row',
  },
  indicatorCol: {
    alignItems: 'center',
    width: 28,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  circleUpcoming: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  connectorLine: {
    width: 2,
    flex: 1,
    minHeight: 32,
    marginVertical: 4,
  },
  contentCol: {
    flex: 1,
    paddingLeft: 12,
    paddingTop: 1,
  },
  contentColWithLine: {
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 15,
  },
  stepTimestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  stepDescription: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
});
