import { memo } from 'react';
import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { formatAppDateTime } from '../../../../shared/datetime/date-time-formatter';
import type { HomeActivityItem } from '../data/dashboard.types';
import {
  createSectionHeadingStyle,
  createSectionLinkStyle,
  createEmptyIconStyle,
  createEmptyTextStyle,
  createItemTitleStyle,
  createTimestampStyle,
  createItemSubtitleStyle,
  createChevronStyle,
  createCardStyle,
  createDividerStyle,
  styles,
} from '../styles/components/HomeActivityTimeline.styles';

export interface HomeActivityTimelineProps {
  activities: readonly HomeActivityItem[];
  onItemPress: (item: HomeActivityItem) => void;
  onViewAll: () => void;
}

interface ActivityIconConfig {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}

function resolveActivityIcon(
  item: HomeActivityItem,
  semantic: ReturnType<typeof useAppTheme>['semantic'],
): ActivityIconConfig {
  const category = (item as { activityCategory?: string }).activityCategory;
  const titleLower = item.title.toLowerCase();
  const descLower = item.description.toLowerCase();

  if (category === 'delivery' || titleLower.includes('delivery') || descLower.includes('delivery') || titleLower.includes('amazon') || titleLower.includes('swiggy') || titleLower.includes('zomato') || titleLower.includes('milk')) {
    return {
      icon: 'cube-outline',
      color: semantic.status.warning,
      bg: semantic.status.warningSurface,
    };
  }

  if (category === 'cab' || titleLower.includes('cab') || titleLower.includes('uber') || titleLower.includes('ola')) {
    return {
      icon: 'car-outline',
      color: semantic.status.info,
      bg: semantic.status.infoSurface,
    };
  }

  if (category === 'staff' || titleLower.includes('maid') || titleLower.includes('cook') || titleLower.includes('cleaner') || titleLower.includes('driver')) {
    return {
      icon: 'shirt-outline',
      color: semantic.accent.moss,
      bg: semantic.accent.moss + '18',
    };
  }

  if (category === 'service' || category === 'vendor' || titleLower.includes('service') || titleLower.includes('plumber') || titleLower.includes('electrician') || titleLower.includes('ironing')) {
    return {
      icon: 'construct-outline',
      color: semantic.accent.lavender,
      bg: semantic.accent.lavender + '20',
    };
  }

  switch (item.module) {
    case 'visitor':
      return {
        icon: 'person-outline',
        color: semantic.status.success,
        bg: semantic.status.successSurface,
      };
    case 'billing':
      return {
        icon: 'wallet-outline',
        color: semantic.status.info,
        bg: semantic.status.infoSurface,
      };
    case 'complaint':
      return {
        icon: 'construct-outline',
        color: semantic.status.warning,
        bg: semantic.status.warningSurface,
      };
    case 'facility':
      return {
        icon: 'calendar-outline',
        color: semantic.accent.lavender,
        bg: semantic.accent.lavender + '20',
      };
    case 'notice':
      return {
        icon: 'megaphone-outline',
        color: semantic.accent.moss,
        bg: semantic.surface.focus,
      };
    case 'emergency':
      return {
        icon: 'alert-circle-outline',
        color: semantic.status.danger,
        bg: semantic.status.dangerSurface,
      };
    default:
      return {
        icon: 'information-circle-outline',
        color: semantic.text.secondary,
        bg: semantic.surface.soft,
      };
  }
}

function resolveActivityMetaLine(item: HomeActivityItem): string {
  const location = (item as { location?: string }).location;
  const rawTimestamp = item.timestampLabel?.trim();

  let formattedTime = '';
  if (rawTimestamp) {
    formattedTime = formatAppDateTime(rawTimestamp, { includeYear: false });
  }

  if (location && formattedTime && formattedTime !== '—') {
    return `${location} · ${formattedTime}`;
  }

  if (formattedTime && formattedTime !== '—') {
    return formattedTime;
  }

  if (location) {
    return location;
  }

  return rawTimestamp || '';
}

export const HomeActivityTimeline = memo(function HomeActivityTimeline({
  activities,
  onItemPress,
  onViewAll,
}: HomeActivityTimelineProps) {
  const { semantic } = useAppTheme();
  const displayItems = activities.slice(0, 4);

  return (
    <View style={styles.root}>
      <View style={styles.sectionHeaderRow}>
        <SafeText style={createSectionHeadingStyle(semantic.text.primary)}>
          Around your home
        </SafeText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View all home activities"
          onPress={onViewAll}
        >
          <SafeText style={createSectionLinkStyle(semantic.text.secondary)}>
            View all activity ›
          </SafeText>
        </Pressable>
      </View>

      <View style={createCardStyle(semantic.surface.raised, semantic.border.default)}>
        {displayItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="sparkles-outline"
              size={24}
              color={createEmptyIconStyle(semantic.text.tertiary)}
            />
            <SafeText style={createEmptyTextStyle(semantic.text.secondary)}>
              No recent activity around your home.
            </SafeText>
          </View>
        ) : (
          displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;
            const iconConfig = resolveActivityIcon(item, semantic);
            const metaLine = resolveActivityMetaLine(item);
            const statusOrDesc = (item as { statusLabel?: string }).statusLabel || item.description;

            return (
              <View key={item.id}>
                <Pressable
                  style={styles.activityRow}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title}. ${statusOrDesc}. ${metaLine}`}
                  onPress={() => onItemPress(item)}
                >
                  {/* Column 1: Contextual Icon */}
                  <View
                    style={[
                      styles.leadingIconWrapper,
                      { backgroundColor: iconConfig.bg },
                    ]}
                  >
                    <Ionicons
                      name={iconConfig.icon}
                      size={18}
                      color={iconConfig.color}
                    />
                  </View>

                  {/* Column 2: Title, Status, Date/Time */}
                  <View style={styles.contentCol}>
                    <SafeText
                      style={[styles.itemTitle, createItemTitleStyle(semantic.text.primary)]}
                      numberOfLines={2}
                    >
                      {item.title}
                    </SafeText>

                    {statusOrDesc ? (
                      <SafeText
                        style={[styles.itemSubtitle, createItemSubtitleStyle(semantic.text.secondary)]}
                        numberOfLines={1}
                      >
                        {statusOrDesc}
                      </SafeText>
                    ) : null}

                    {metaLine ? (
                      <SafeText
                        style={[styles.timestamp, createTimestampStyle(semantic.text.tertiary)]}
                        numberOfLines={1}
                      >
                        {metaLine}
                      </SafeText>
                    ) : null}
                  </View>

                  {/* Column 3: Trailing Chevron */}
                  <View style={styles.trailingAffordance}>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={createChevronStyle(semantic.text.tertiary)}
                    />
                  </View>
                </Pressable>

                {!isLast ? (
                  <View style={createDividerStyle(semantic.border.subtle)} />
                ) : null}
              </View>
            );
          })
        )}
      </View>
    </View>
  );
});

export default HomeActivityTimeline;
