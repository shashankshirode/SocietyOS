import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { OnboardingShell } from '../../components/OnboardingShell';
import { UnitSelector } from '../../components/UnitSelector';
import type { OnboardingSociety, OnboardingUnit } from '../../hooks/useResidentOnboarding';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_BOLD,
  FONT_FAMILY_SERIF,
} from '../../../../../shared/theme/typography';

interface FindUnitStepProps {
  society: OnboardingSociety | null;
  selectedUnit: OnboardingUnit | null;
  onSelectUnit: (unit: OnboardingUnit) => void;
  onLoadUnits?: () => Promise<OnboardingUnit[]>;
  onBack: () => void;
  onHelp: () => void;
}

export function FindUnitStep({
  society,
  selectedUnit,
  onSelectUnit,
  onLoadUnits,
  onBack,
  onHelp,
}: FindUnitStepProps) {
  const [units, setUnits] = useState<OnboardingUnit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (society && onLoadUnits) {
      setIsLoading(true);
      setError(null);
      onLoadUnits()
        .then((loadedUnits) => {
          if (mounted) {
            setUnits(loadedUnits);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (mounted) {
            setError('Failed to load units. Please try again.');
            setIsLoading(false);
          }
        });
    } else {
      setUnits([]);
    }
    return () => {
      mounted = false;
    };
  }, [society, onLoadUnits]);

  return (
    <OnboardingShell
      currentMilestone="Your home"
      currentStepIndex={2}
      onBack={onBack}
      onHelp={onHelp}
    >
      <View style={styles.container}>
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>Find your home</Text>
          <Text style={styles.supportingText}>
            Select the home you're associated with in{' '}
            <Text style={styles.societyName}>{society?.name || 'your community'}</Text>.
          </Text>
        </View>

        {/* Unit Selector */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#064F45" />
            <Text style={styles.loadingText}>Loading units...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={() => onLoadUnits?.()} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : units.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No units found for this society</Text>
          </View>
        ) : (
          <UnitSelector
            units={units}
            selectedUnit={selectedUnit}
            onSelectUnit={onSelectUnit}
          />
        )}
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
  societyName: {
    fontWeight: '600',
    color: '#064F45',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#D9534F',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#064F45',
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
  },
});

