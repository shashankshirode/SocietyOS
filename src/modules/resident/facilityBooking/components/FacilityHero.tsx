import React from 'react';
import { View, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { ResponsiveImage } from '../../../../ui/components/ResponsiveImage';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import type { CatalogImage } from '../../../../configuration/residentImageCatalog';
import {
  backgroundBorderStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';

interface FacilityHeroProps {
  readonly image: CatalogImage;
  readonly title: string;
  readonly subtitle: string;
  readonly actionLabel: string;
  readonly badgeLabel: string;
  readonly onAction: () => void;
  readonly nextBookingSummary?: string | undefined;
}

export function FacilityHero({
  image,
  title,
  subtitle,
  actionLabel,
  badgeLabel,
  onAction,
  nextBookingSummary,
}: FacilityHeroProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.hero}>
      <ResponsiveImage
        image={image}
        aspectRatio={16 / 7}
        style={styles.heroImage}
      />
      {/* High-contrast localized tonal scrim */}
      <View style={styles.heroScrim}>
        <View style={[styles.heroBadge, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
          <SafeText variant="tiny" color="inverse" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
            {badgeLabel}
          </SafeText>
        </View>

        <SafeText variant="h1" color="inverse" style={{ fontSize: 22, fontWeight: '700', lineHeight: 28 }}>
          {title}
        </SafeText>

        <SafeText variant="caption" color="inverse" style={{ opacity: 0.9 }}>
          {subtitle}
        </SafeText>

        {/* Compact Contextual Next Space / Booking Pill */}
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={nextBookingSummary ? `Your next booking: ${nextBookingSummary}` : actionLabel}
          style={({ pressed }) => [
            {
              marginTop: 4,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: pressed ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.16)',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
            <Ionicons name="calendar-outline" size={15} color="#FFFFFF" />
            <SafeText variant="tiny" color="inverse" style={{ fontWeight: '600' }} numberOfLines={1}>
              {nextBookingSummary ? `NEXT: ${nextBookingSummary}` : actionLabel}
            </SafeText>
          </View>
          <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
