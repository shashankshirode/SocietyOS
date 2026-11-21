import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { ResidentRole } from '../data/residentOnboarding.types';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
} from '../../../../shared/theme/typography';

interface RoleOption {
  id: ResidentRole;
  title: string;
  subtitle: string;
  iconPath: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'OWNER',
    title: 'Owner',
    subtitle: 'You own this flat or hold allotment documents',
    iconPath: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  },
  {
    id: 'TENANT',
    title: 'Tenant',
    subtitle: 'You reside here under a rental agreement',
    iconPath: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  },
  {
    id: 'FAMILY_MEMBER',
    title: 'Family member',
    subtitle: 'Living here with the homeowner or tenant',
    iconPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  },
  {
    id: 'OTHER',
    title: 'Other authorized resident',
    subtitle: 'Designated caretaker or authorized occupant',
    iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  },
];

interface ResidentTypeSelectorProps {
  selectedRole: ResidentRole | null;
  onSelectRole: (role: ResidentRole) => void;
}

export function ResidentTypeSelector({
  selectedRole,
  onSelectRole,
}: ResidentTypeSelectorProps) {
  return (
    <View style={styles.container}>
      {ROLE_OPTIONS.map((option) => {
        const isSelected = selectedRole === option.id;

        return (
          <Pressable
            key={option.id}
            onPress={() => onSelectRole(option.id)}
            style={({ pressed }) => [
              styles.tile,
              isSelected && styles.tileSelected,
              pressed && styles.tilePressed,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${option.title}: ${option.subtitle}`}
          >
            {/* Distinctive Icon Badge */}
            <View
              style={[
                styles.iconBadge,
                isSelected && styles.iconBadgeSelected,
              ]}
            >
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d={option.iconPath}
                  stroke={isSelected ? '#FFFFFF' : '#064F45'}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>

            <View style={styles.textCol}>
              <Text
                style={[
                  styles.titleText,
                  isSelected && styles.titleTextSelected,
                ]}
              >
                {option.title}
              </Text>
              <Text
                style={[
                  styles.subtitleText,
                  isSelected && styles.subtitleTextSelected,
                ]}
              >
                {option.subtitle}
              </Text>
            </View>

            {/* Selection Circle */}
            <View
              style={[
                styles.radioCircle,
                isSelected && styles.radioCircleSelected,
              ]}
            >
              {isSelected && <View style={styles.radioDot} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#EBE8DE',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  tileSelected: {
    borderColor: '#064F45',
    backgroundColor: '#F7FAF9',
  },
  tilePressed: {
    opacity: 0.9,
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#E6F0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconBadgeSelected: {
    backgroundColor: '#064F45',
  },
  textCol: {
    flex: 1,
    gap: 3,
  },
  titleText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#10201D',
  },
  titleTextSelected: {
    color: '#064F45',
  },
  subtitleText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
    lineHeight: 18,
  },
  subtitleTextSelected: {
    color: '#3D8577',
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
  radioCircleSelected: {
    borderColor: '#064F45',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#064F45',
  },
});
