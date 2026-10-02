import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { OnboardingSociety } from '../data/residentOnboarding.types';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
} from '../../../../shared/theme/typography';

interface SocietyCardProps {
  society: OnboardingSociety;
  isSelected?: boolean;
  onSelect: (society: OnboardingSociety) => void;
  detailed?: boolean;
}

export function SocietyCard({
  society,
  isSelected = false,
  onSelect,
  detailed = false,
}: SocietyCardProps) {
  return (
    <Pressable
      onPress={() => onSelect(society)}
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${society.name}, ${society.city}`}
    >
      {/* Thumbnail or Badge */}
      <View style={styles.thumbBox}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 21h18M5 21V7l8-4v18M13 11l6 3v7M9 9v.01M9 12v.01M9 15v.01M9 18v.01"
            stroke="#064F45"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      <View style={styles.contentCol}>
        <View style={styles.nameRow}>
          <Text style={styles.nameText}>{society.name}</Text>
          {society.isVerified && (
            <View style={styles.verifiedBadge}>
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Path
                  d="m5 12 5 5L20 7"
                  stroke="#064F45"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          )}
        </View>

        <Text style={styles.locationText}>
          {society.city}, {society.state}
        </Text>

        {detailed && (
          <View style={styles.detailsRow}>
            <Text style={styles.tagText}>{society.category}</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.unitsText}>{society.totalUnits} Units</Text>
          </View>
        )}
      </View>

      {/* Checkmark or Selection indicator */}
      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBE8DE',
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardSelected: {
    borderColor: '#064F45',
    backgroundColor: '#F7FAF9',
  },
  cardPressed: {
    opacity: 0.85,
  },
  thumbBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E6F0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contentCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  nameText: {
    fontSize: 15.5,
    fontWeight: '600',
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#10201D',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#CEE1DC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  locationText: {
    fontSize: 13,
    color: '#69716D',
    fontFamily: FONT_FAMILY_INTER,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  tagText: {
    fontSize: 11.5,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#064F45',
    backgroundColor: '#E6F0EE',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: '#A0A5A2',
    fontSize: 12,
  },
  unitsText: {
    fontSize: 12,
    color: '#69716D',
    fontFamily: FONT_FAMILY_INTER,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#C5C2B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioCircleActive: {
    borderColor: '#064F45',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#064F45',
  },
});
