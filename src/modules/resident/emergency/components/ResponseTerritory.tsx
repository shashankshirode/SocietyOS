import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { emergencyTheme } from '../theme/emergencyTheme';
import type { SosType } from '../data/sosResponsePlan.types';
import type { EmergencyLensFrame } from '../layout/emergencyLensLayout';

export interface ResponseTerritoryDefinition {
  type: SosType;
  label: string;
  shortDesc: string;
  requestLabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
}

interface ResponseTerritoryProps {
  definition: ResponseTerritoryDefinition;
  isSelected: boolean;
  isReceded: boolean;
  onSelect: (type: SosType) => void;
  compact?: boolean;
  frame?: EmergencyLensFrame;
  showDescription?: boolean;
}

export function ResponseTerritory({
  definition,
  isSelected,
  isReceded,
  onSelect,
  compact = false,
  frame,
  showDescription = !compact,
}: ResponseTerritoryProps) {
  const { type, label, shortDesc, icon, accentColor } = definition;

  return (
    <Pressable
      onPress={() => onSelect(type)}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${label}. ${shortDesc}`}
      style={({ pressed }) => [
        styles.territory,
        frame ? { position: 'absolute', left: frame.left, top: frame.top, width: frame.width, height: frame.height } : null,
        compact ? styles.territoryCompact : null,
        isSelected
          ? [styles.territorySelected, { borderColor: accentColor, backgroundColor: emergencyTheme.surfaceRaised }]
          : isReceded
          ? styles.territoryReceded
          : [styles.territoryIdle, { backgroundColor: pressed ? emergencyTheme.surfaceRaised : emergencyTheme.surface }],
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: isSelected
              ? `${accentColor}33`
              : `${emergencyTheme.border}55`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={compact ? 20 : 24}
          color={isSelected ? accentColor : emergencyTheme.text}
        />
      </View>

      <View style={styles.textColumn}>
        <SafeText
          variant="caption"
          style={[
            styles.label,
            { color: isSelected ? accentColor : emergencyTheme.text, fontWeight: '700' },
          ]}
          numberOfLines={1}
        >
          {label}
        </SafeText>
        {showDescription && (
          <SafeText
            variant="tiny"
            style={[styles.desc, { color: isSelected ? emergencyTheme.text : emergencyTheme.textSecondary }]}
            numberOfLines={1}
          >
            {shortDesc}
          </SafeText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  territory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    gap: 6,
    minHeight: 48,
    minWidth: 0,
  },
  territoryCompact: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    gap: 4,
    minHeight: 42,
    minWidth: 0,
  },
  territoryIdle: {
    opacity: 0.95,
    backgroundColor: 'transparent',
  },
  territorySelected: {
    opacity: 1,
    transform: [{ scale: 1.02 }],
  },
  territoryReceded: {
    opacity: 0.35,
    transform: [{ scale: 0.95 }],
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
  },
  label: {
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  desc: {
    fontSize: 11,
  },
});
