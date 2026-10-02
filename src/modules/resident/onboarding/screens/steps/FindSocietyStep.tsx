import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { OnboardingShell } from '../../components/OnboardingShell';
import { SocietyCard } from '../../components/SocietyCard';
import { OnboardingSociety } from '../../data/residentOnboarding.types';
import { MOCK_SOCIETIES } from '../../data/residentOnboarding.mockData';
import { isDevelopmentMode } from '../../../../../shared/utils/isDevelopmentMode';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_BOLD,
} from '../../../../../shared/theme/typography';

interface FindSocietyStepProps {
  onSelectSociety: (society: OnboardingSociety) => void;
  onBack: () => void;
  onHelp: () => void;
}

export function FindSocietyStep({
  onSelectSociety,
  onBack,
  onHelp,
}: FindSocietyStepProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSocieties = useMemo(() => {
    if (!isDevelopmentMode()) {
      throw new Error('Society search requires backend API - not implemented for production');
    }
    if (!searchQuery.trim()) return MOCK_SOCIETIES;
    const q = searchQuery.toLowerCase().trim();
    return MOCK_SOCIETIES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <OnboardingShell
      currentMilestone="Your home"
      currentStepIndex={2}
      onBack={onBack}
      onHelp={onHelp}
    >
      <View style={styles.container}>
        {/* Editorial Heading */}
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>Find your community</Text>
          <Text style={styles.supportingText}>
            Search for your society to continue.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
            <Path
              d="m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0z"
              stroke="#69716D"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <TextInput
            style={styles.searchInput}
            placeholder="Search society name or location"
            placeholderTextColor="#A0A5A2"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="words"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="#69716D"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          )}
        </View>

        {/* Nearby Communities List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>NEARBY COMMUNITIES</Text>
          <Text style={styles.resultCountText}>
            {filteredSocieties.length} found
          </Text>
        </View>

        <View style={styles.societiesList}>
          {filteredSocieties.map((society) => (
            <SocietyCard
              key={society.id}
              society={society}
              onSelect={onSelectSociety}
              detailed
            />
          ))}

          {filteredSocieties.length === 0 && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No community found</Text>
              <Text style={styles.emptyDesc}>
                We couldn't find a matching society for "{searchQuery}". Please check the spelling or ask your society management committee.
              </Text>
            </View>
          )}
        </View>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  headerBlock: {
    gap: 6,
    paddingTop: 8,
  },
  heading: {
    fontSize: 26,
    fontFamily: FONT_FAMILY_INTER,
    fontWeight: '600',
    color: '#10201D',
  },
  supportingText: {
    fontSize: 14.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EBE8DE',
    paddingHorizontal: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#10201D',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#69716D',
    letterSpacing: 0.8,
  },
  resultCountText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER,
    color: '#7C8581',
  },
  societiesList: {
    gap: 2,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBE8DE',
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#10201D',
  },
  emptyDesc: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
    textAlign: 'center',
    lineHeight: 19,
  },
});

