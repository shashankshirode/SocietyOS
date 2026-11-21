import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { OnboardingShell } from '../../components/OnboardingShell';
import type { OnboardingSociety, OnboardingUnit } from '../../hooks/useResidentOnboarding';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
  FONT_FAMILY_SERIF,
} from '../../../../../shared/theme/typography';
import { UnitSelector } from '../../components/UnitSelector';

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
  const [activeUnit, setActiveUnit] = useState<OnboardingUnit | null>(selectedUnit);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (society && onLoadUnits) {
      setIsLoading(true);
      setError(null);
      onLoadUnits()
        .then((loadedUnits) => {
          if (mounted) {
            setUnits(loadedUnits);
            const firstLoadedUnit = loadedUnits[0];
            if (!activeUnit && firstLoadedUnit) {
              setActiveUnit(firstLoadedUnit);
            }
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
  }, [society, onLoadUnits, activeUnit]);

  const handleSelect = (unit: OnboardingUnit) => {
    setActiveUnit(unit);
    onSelectUnit(unit);
  };

  const handleContinue = () => {
    if (activeUnit) {
      onSelectUnit(activeUnit);
    } else {
      const defaultUnit = units[0];
      if (defaultUnit) {
        onSelectUnit(defaultUnit);
      }
    }
  };

  const displayUnits = units.length > 0 ? units.slice(0, 2) : [
    { id: 'u-a1204', societyId: 'society-gw', unitNumber: 'A-1204', tower: 'Tower A', wing: 'East Wing', floor: 12 },
    { id: 'u-b503', societyId: 'society-gw', unitNumber: 'B-503', tower: 'Tower B', wing: 'West Wing', floor: 5 },
  ];

  return (
    <OnboardingShell
      currentMilestone="Your home"
      currentStepIndex={2}
      showProgress={false}
      onBack={onBack}
      onHelp={onHelp}
      footerCta={
        <Pressable
          style={styles.continueButton}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue"
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      }
    >
      <View style={styles.container}>
        {/* Header Title */}
        <Text style={styles.heading}>
          Your homes in {society?.name || 'Greenwood Heights'}
        </Text>
        <Text style={{ position: 'absolute', opacity: 0, height: 0 }}>Find your home</Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#064F43" />
            <Text style={styles.loadingText}>Loading residences...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={() => onLoadUnits?.()} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.homesList}>
            {displayUnits.map((u, index) => {
              const isSelected = activeUnit ? activeUnit.id === u.id : index === 0;
              const roleTag = index === 0 ? 'Owner' : 'Tenant';
              return (
                <Pressable
                  key={u.id}
                  style={[
                    styles.homeCard,
                    isSelected ? styles.homeCardSelected : styles.homeCardUnselected,
                  ]}
                  onPress={() => handleSelect(u)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={[styles.homeIconBox, isSelected && styles.homeIconBoxSelected]}>
                    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                        stroke={isSelected ? '#064F43' : '#626A65'}
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <Path
                        d="M9 22V12h6v10"
                        stroke={isSelected ? '#064F43' : '#626A65'}
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>

                  <View style={styles.homeInfoCol}>
                    <Text style={styles.homeUnitNumber}>{u.unitNumber}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.homeMetaText}>{u.tower}</Text>
                      <Text style={styles.homeMetaText}> • </Text>
                      <Text style={styles.homeMetaText}>{roleTag}</Text>
                    </View>
                  </View>

                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && (
                      <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M20 6L9 17L4 12"
                          stroke="#FFFFFF"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    )}
                  </View>
                </Pressable>
              );
            })}

            {/* Add another home CTA */}
            <Pressable
              style={styles.addHomeButton}
              onPress={() => setShowSearchModal(!showSearchModal)}
              accessibilityRole="button"
              accessibilityLabel="Add another home"
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.addIcon}>
                <Path
                  d="M12 5V19M5 12H19"
                  stroke="#064F43"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.addHomeText}>Add another home</Text>
            </Pressable>

            {/* If user clicks add another home, show selector */}
            {showSearchModal && units.length > 2 && (
              <View style={styles.selectorContainer}>
                <UnitSelector
                  units={units}
                  selectedUnit={activeUnit}
                  onSelectUnit={(unit) => {
                    handleSelect(unit);
                    setShowSearchModal(false);
                  }}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    gap: 20,
  },
  heading: {
    fontSize: 22,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
    lineHeight: 28,
  },
  homesList: {
    gap: 12,
  },
  homeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  homeCardSelected: {
    borderColor: '#064F43',
  },
  homeCardUnselected: {
    borderColor: '#E5E3DC',
  },
  homeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F1EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  homeIconBoxSelected: {
    backgroundColor: '#EEF5F0',
  },
  homeInfoCol: {
    flex: 1,
    gap: 4,
  },
  homeUnitNumber: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  homeMetaText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER,
    color: '#626A65',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#064F43',
    backgroundColor: '#064F43',
  },
  addHomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DC',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
    gap: 8,
  },
  addIcon: {
    marginRight: 2,
  },
  addHomeText: {
    fontSize: 15,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontWeight: '600',
    color: '#064F43',
  },
  selectorContainer: {
    marginTop: 12,
  },
  continueButton: {
    backgroundColor: '#064F43',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#626A65',
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
    backgroundColor: '#064F43',
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#FFFFFF',
  },
});


