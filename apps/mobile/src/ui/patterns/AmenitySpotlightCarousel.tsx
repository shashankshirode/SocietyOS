import React from 'react';
import { StyleSheet, View, Image, ScrollView, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../shared/components/SafeText';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { imageAssets } from '../../shared/theme/imageAssets';
import { HapticFeedback } from '../../shared/utils/haptics';

export interface AmenitySpotlightItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  hours: string;
  rating: string;
  status: 'available' | 'busy' | 'closed';
}

export const defaultSpotlightAmenities: AmenitySpotlightItem[] = [
  {
    id: 'swimming-pool',
    name: 'Infinity Pool & Deck',
    category: 'Aquatics',
    imageUrl: imageAssets.amenities.swimmingPool,
    hours: '6:00 AM – 10:00 PM',
    rating: '4.9',
    status: 'available',
  },
  {
    id: 'badminton-court',
    name: 'Indoor Badminton Arena',
    category: 'Sports',
    imageUrl: imageAssets.amenities.badmintonCourt,
    hours: 'Open 24/7',
    rating: '4.8',
    status: 'available',
  },
  {
    id: 'clubhouse',
    name: 'Grand Clubhouse & Lounge',
    category: 'Leisure',
    imageUrl: imageAssets.amenities.clubhouse,
    hours: '7:00 AM – 11:00 PM',
    rating: '4.9',
    status: 'available',
  },
  {
    id: 'tennis-court',
    name: 'Synthetic Tennis Court',
    category: 'Racquet Sports',
    imageUrl: imageAssets.amenities.tennisCourt,
    hours: '6:00 AM – 9:00 PM',
    rating: '4.7',
    status: 'available',
  },
  {
    id: 'gymnasium',
    name: 'State-of-Art Fitness Center',
    category: 'Fitness',
    imageUrl: imageAssets.amenities.gymnasium,
    hours: '5:30 AM – 11:00 PM',
    rating: '4.9',
    status: 'available',
  },
];

export interface AmenitySpotlightCarouselProps {
  title?: string;
  items?: AmenitySpotlightItem[];
  onSelectAmenity: (item: AmenitySpotlightItem) => void;
  onViewAll?: () => void;
}

export function AmenitySpotlightCarousel({
  title = 'Amenities & Clubhouse',
  items = defaultSpotlightAmenities,
  onSelectAmenity,
  onViewAll,
}: AmenitySpotlightCarouselProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container} testID="amenity-spotlight-carousel">
      <View style={styles.headerRow}>
        <View>
          <SafeText variant="h3" color="primary">{title}</SafeText>
          <SafeText variant="caption" color="muted">Discover and reserve luxury facilities</SafeText>
        </View>
        {onViewAll ? (
          <Pressable
            onPress={() => {
              HapticFeedback.light();
              onViewAll();
            }}
            style={styles.viewAllBtn}
          >
            <SafeText variant="caption" style={{ color: colors.primary, fontWeight: '700' }}>Explore All</SafeText>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {
              HapticFeedback.light();
              onSelectAmenity(item);
            }}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.9 : 1 }
            ]}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <SafeText variant="tiny" style={styles.ratingText}>{item.rating}</SafeText>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
                <SafeText variant="tiny" style={styles.statusText}>Open</SafeText>
              </View>
            </View>

            <View style={styles.cardBody}>
              <SafeText variant="tiny" color="muted" style={styles.category}>{item.category.toUpperCase()}</SafeText>
              <SafeText variant="bodyStrong" color="primary" numberOfLines={1}>{item.name}</SafeText>
              <View style={styles.hoursRow}>
                <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
                <SafeText variant="tiny" color="muted" style={styles.hoursText}>{item.hours}</SafeText>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 14,
  },
  card: {
    width: 220,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingText: {
    color: '#FFF',
    fontWeight: '700',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    color: '#FFF',
    fontWeight: '700',
  },
  cardBody: {
    padding: 10,
  },
  category: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  hoursText: {
    fontSize: 11,
  },
});
