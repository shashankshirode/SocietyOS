import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppButton } from '../../../../shared/components/AppButton';
import { EmptyStatePanel } from '../../../../shared/components/EmptyStatePanel';
import { SafeText } from '../../../../shared/components/SafeText';
import { SearchInputBar } from '../../../../shared/components/SearchInputBar';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { Skeleton } from '../../../../shared/feedback/Skeleton';
import { residentImageCatalog } from '../../../../configuration/residentImageCatalog';
import { useMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilities, FacilityDiscoveryFilter } from '../hooks/useFacilities';
import { useFacilityDashboard } from '../hooks/useFacilityDashboard';
import {
  backgroundBorderStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';
import { FacilityDiscoveryCard } from './FacilityDiscoveryCard';
import { FacilityHero } from './FacilityHero';
import { FacilityScreenLayout } from './FacilityScreenLayout';

interface FacilityDiscoveryViewProps {
  readonly onBack: () => void;
  readonly onOpenFacility: (facilityId: string) => void;
  readonly onOpenBookings: () => void;
}

const filters = Object.values(FacilityDiscoveryFilter);

export function FacilityDiscoveryView({ onBack, onOpenFacility, onOpenBookings }: FacilityDiscoveryViewProps) {
  const { colors } = useAppTheme();
  const messages = useMessages();
  const labels = messages.resident.facilityBooking;
  const { activeContext } = useActiveResidentHome();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(FacilityDiscoveryFilter.All);
  const facilities = useFacilities({ query, filter });
  const dashboard = useFacilityDashboard();
  const locale = activeContext.locale ?? 'en-IN';
  const timezone = activeContext.timezone ?? 'Asia/Kolkata';
  const clearFilters = () => {
    setQuery('');
    setFilter(FacilityDiscoveryFilter.All);
  };
  return (
    <FacilityScreenLayout
      title={labels.discovery.title}
      subtitle={`${activeContext.societyName} · ${activeContext.displayUnitName}`}
      onBack={onBack}
      showBackButton={false}
      testID="facility-discovery-screen"
    >
      <FacilityHero
        image={residentImageCatalog.facilities.clubhouse}
        title={labels.discovery.heroTitle}
        subtitle={labels.discovery.heroSubtitle}
        badgeLabel={labels.discovery.upcomingCount(dashboard.data?.upcomingCount ?? 0)}
        actionLabel={labels.discovery.heroAction}
        onAction={onOpenBookings}
      />
      <View style={styles.section}>
        <SearchInputBar
          value={query}
          onChangeText={setQuery}
          placeholder={labels.discovery.searchPlaceholder}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {filters.map((item) => {
            const selected = item === filter;
            return (
              <Pressable
                key={item}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={labels.accessibilityLabels.filter(labels.discovery.filters[item])}
                onPress={() => setFilter(item)}
                style={[
                  styles.chip,
                  backgroundBorderStyle(selected ? colors.primarySoft : colors.surface, selected ? colors.primary : colors.border),
                ]}
              >
                <SafeText variant="tiny" color={selected ? 'info' : 'secondary'}>{labels.discovery.filters[item]}</SafeText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      {facilities.isLoading ? (
        <View style={styles.grid} accessibilityLabel={labels.states.loadingFacilities}>
          {[0, 1, 2, 3].map((item) => (
            <View key={item} style={[styles.gridItem, styles.skeletonCard]}>
              <Skeleton height={170} />
              <Skeleton height={18} width="58%" />
              <Skeleton height={12} width="88%" />
            </View>
          ))}
        </View>
      ) : facilities.error ? (
        <ErrorState
          title={labels.states.loadFacilitiesTitle}
          message={labels.states.loadFacilitiesDescription}
          onRetry={() => void facilities.refresh()}
          retryLabel={labels.states.retry}
        />
      ) : facilities.facilities.length === 0 ? (
        <EmptyStatePanel
          title={query || filter !== FacilityDiscoveryFilter.All ? labels.states.noSearchTitle : labels.states.noFacilitiesTitle}
          description={query || filter !== FacilityDiscoveryFilter.All ? labels.states.noSearchDescription : labels.states.noFacilitiesDescription}
          icon="empty"
          actionArea={query || filter !== FacilityDiscoveryFilter.All
            ? <AppButton title={labels.states.clearFilters} onPress={clearFilters} variant="outline" />
            : undefined}
        />
      ) : (
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <SafeText variant="title">{labels.discovery.resultsCount(facilities.facilities.length)}</SafeText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={labels.accessibilityLabels.refresh}
              onPress={() => void facilities.refresh()}
            >
              <Ionicons name="refresh-outline" size={22} color={colors.primary} />
            </Pressable>
          </View>
          <View style={styles.grid}>
            {facilities.facilities.map((facility) => (
              <View key={facility.id} style={styles.gridItem}>
                <FacilityDiscoveryCard
                  facility={facility}
                  locale={locale}
                  timezone={timezone}
                  onPress={() => onOpenFacility(facility.id)}
                />
              </View>
            ))}
          </View>
          {facilities.hasMore ? (
            <AppButton
              title={messages.common.viewAll}
              onPress={() => void facilities.loadMore()}
              loading={facilities.isLoadingMore}
              variant="outline"
            />
          ) : null}
          {facilities.nextPageError ? (
            <View style={styles.footerLoader}>
              <SafeText variant="tiny" color="danger">{labels.bookings.nextPageError}</SafeText>
              <AppButton title={labels.bookings.retryMore} onPress={() => void facilities.loadMore()} variant="ghost" size="sm" />
            </View>
          ) : null}
          {facilities.isRefreshing ? <ActivityIndicator color={colors.primary} /> : null}
        </View>
      )}
    </FacilityScreenLayout>
  );
}
