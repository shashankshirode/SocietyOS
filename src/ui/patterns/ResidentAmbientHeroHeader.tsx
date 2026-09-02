import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../shared/components/SafeText';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { ambientGradients, getTimeOfDay } from '../../shared/theme/ambientGradients';

export interface ResidentAmbientHeroHeaderProps {
  greeting: string;
  residentName: string;
  societyName: string;
  unitName: string;
  statusMessage: string;
}

export function ResidentAmbientHeroHeader({
  greeting,
  residentName,
  societyName,
  unitName,
  statusMessage,
}: ResidentAmbientHeroHeaderProps) {
  const { colors } = useAppTheme();
  const timeOfDay = getTimeOfDay();
  const scheme = ambientGradients[timeOfDay];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]} testID="resident-ambient-hero-header">
      <View style={styles.topRow}>
        <View style={styles.societyBadge}>
          <Ionicons name="business" size={13} color={colors.primary} />
          <SafeText variant="tiny" style={{ color: colors.primary, fontWeight: '700' }} numberOfLines={1}>
            {societyName} • {unitName}
          </SafeText>
        </View>

        <View style={[styles.timeBadge, { backgroundColor: scheme.badgeBg }]}>
          <Ionicons name={scheme.icon as keyof typeof Ionicons.glyphMap} size={13} color={scheme.accent} />
          <SafeText variant="tiny" style={{ color: scheme.badgeText, fontWeight: '700', textTransform: 'capitalize' }}>
            {timeOfDay}
          </SafeText>
        </View>
      </View>

      <View style={styles.greetingRow}>
        <View style={styles.greetingTextCol}>
          <SafeText variant="h2" color="primary" numberOfLines={1} testID="resident-dashboard-name">
            {greeting}, {residentName}
          </SafeText>
          <SafeText variant="caption" color="muted" style={styles.statusText} numberOfLines={1}>
            {statusMessage}
          </SafeText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  societyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    maxWidth: '70%',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingTextCol: {
    flex: 1,
  },
  statusText: {
    marginTop: 2,
  },
});
