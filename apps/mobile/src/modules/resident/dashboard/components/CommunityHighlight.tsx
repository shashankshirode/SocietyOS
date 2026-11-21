import { memo } from 'react';
import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import type { NoticeHighlight } from '../data/dashboard.types';
import type { Absent } from '../../../../shared/types/absence.types';
import {
  createSectionHeadingStyle,
  createSectionLinkStyle,
  createCardStyle,
  createCardTitleStyle,
  createCardSubtitleStyle,
  createChevronStyle,
  styles,
} from '../styles/components/CommunityHighlight.styles';

export interface CommunityHighlightProps {
  notice?: NoticeHighlight | Absent;
  onPress: () => void;
}

export const CommunityHighlight = memo(function CommunityHighlight({
  notice,
  onPress,
}: CommunityHighlightProps) {
  const { semantic } = useAppTheme();

  const title = notice?.title || 'Connect with your community';
  const subtitle =
    notice?.summary ||
    (notice?.category === 'event'
      ? 'Today · 6:00 PM - 8:00 PM · Clubhouse'
      : 'Events, society notices, facilities and neighbour groups');

  const getCategoryConfig = (category?: NoticeHighlight['category']) => {
    switch (category) {
      case 'event':
        return {
          icon: 'calendar-outline' as const,
          color: semantic.accent.moss,
          bg: semantic.accent.moss + '18',
        };
      case 'maintenance':
        return {
          icon: 'construct-outline' as const,
          color: semantic.accent.amber,
          bg: semantic.accent.amber + '18',
        };
      case 'important':
      case 'emergency':
        return {
          icon: 'alert-circle-outline' as const,
          color: semantic.status.danger,
          bg: semantic.status.dangerSurface,
        };
      default:
        return {
          icon: 'calendar-outline' as const,
          color: semantic.accent.moss,
          bg: semantic.accent.moss + '18',
        };
    }
  };

  const categoryConfig = getCategoryConfig(notice?.category);

  return (
    <View style={styles.root}>
      <View style={styles.sectionHeaderRow}>
        <SafeText style={createSectionHeadingStyle(semantic.text.primary)}>
          In your community
        </SafeText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Explore community tab"
          onPress={onPress}
        >
          <SafeText style={createSectionLinkStyle(semantic.text.secondary)}>
            Explore ›
          </SafeText>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          createCardStyle(semantic.surface.raised, semantic.border.default),
          pressed && { opacity: 0.88 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Community highlight: ${title}. ${subtitle}`}
        onPress={onPress}
      >
        {/* Area 1: Leading icon container */}
        <View style={[styles.iconBadge, { backgroundColor: categoryConfig.bg }]}>
          <Ionicons
            name={categoryConfig.icon}
            size={22}
            color={categoryConfig.color}
          />
        </View>

        {/* Area 2: Flexible text-content wrapper */}
        <View style={styles.textCol}>
          <SafeText
            style={[styles.cardTitle, createCardTitleStyle(semantic.text.primary)]}
            numberOfLines={2}
          >
            {title}
          </SafeText>
          <SafeText
            style={[styles.cardSubtitle, createCardSubtitleStyle(semantic.text.secondary)]}
            numberOfLines={3}
          >
            {subtitle}
          </SafeText>
        </View>

        {/* Area 3: Trailing chevron */}
        <View style={styles.trailingAffordance}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={createChevronStyle(semantic.text.tertiary)}
          />
        </View>
      </Pressable>
    </View>
  );
});

export default CommunityHighlight;
