import React, { useState, useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
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
import { FacilityAvailabilityStatus } from '../models/facilityBooking.enums';
import { backgroundBorderStyle, facilityBookingStyles as styles, } from '../styles/facilityBooking.styles';
import { FacilityHero } from './FacilityHero';
import { SpaceHorizon } from './SpaceHorizon';
import { SpaceObject } from './SpaceObject';
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
    const msg = labels.spaces;
    const { activeContext } = useActiveResidentHome();
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState(FacilityDiscoveryFilter.All);
    const facilities = useFacilities({ query, filter });
    const dashboard = useFacilityDashboard();
    const clearFilters = () => {
        setQuery('');
        setFilter(FacilityDiscoveryFilter.All);
    };
    const { heroTitle, heroSubtitle } = useMemo(() => {
        const rawList = facilities.facilities;
        if (rawList.length === 0) {
            return {
                heroTitle: labels.discovery.heroTitle,
                heroSubtitle: labels.discovery.heroSubtitle,
            };
        }
        const openCount = rawList.filter((f) => f.availabilityStatus === FacilityAvailabilityStatus.Available).length;
        const maintenanceCount = rawList.filter((f) => f.availabilityStatus === FacilityAvailabilityStatus.UnderMaintenance).length;
        if (maintenanceCount > 0 && openCount > 0) {
            return {
                heroTitle: `${openCount} ${labels.discovery.filters.AVAILABLE_TODAY.toLowerCase()}`,
                heroSubtitle: `${maintenanceCount} ${labels.availability.UNDER_MAINTENANCE.toLowerCase()}`,
            };
        }
        if (openCount > 0) {
            return {
                heroTitle: labels.discovery.heroTitle,
                heroSubtitle: labels.discovery.heroSubtitle,
            };
        }
        return {
            heroTitle: msg.title,
            heroSubtitle: msg.subtitle,
        };
    }, [facilities.facilities, labels.discovery.heroSubtitle, labels.discovery.heroTitle, labels.discovery.filters.AVAILABLE_TODAY, labels.availability.UNDER_MAINTENANCE, msg.title, msg.subtitle]);
    const featuredSpace = facilities.facilities[0] || null;
    const otherSpaces = facilities.facilities.slice(1);
    return (<FacilityScreenLayout title={msg.title} subtitle={msg.subtitle} onBack={onBack} showBackButton={true} testID="facility-discovery-screen">
      
      <FacilityHero image={residentImageCatalog.facilities.clubhouse} title={heroTitle} subtitle={heroSubtitle} badgeLabel={msg.badge} actionLabel={dashboard.data?.upcomingCount ? `${labels.myBookingsTitle} (${dashboard.data.upcomingCount})` : `${labels.myBookingsTitle} →`} onAction={onOpenBookings} nextBookingSummary={dashboard.data?.upcomingCount ? 'Badminton Court · Today 7 PM' : undefined}/>

      
      {facilities.facilities.length > 0 ? (<SpaceHorizon facilities={facilities.facilities} onSelectFacility={onOpenFacility}/>) : null}

      
      <View style={styles.section}>
        <SearchInputBar value={query} onChangeText={setQuery} placeholder={msg.searchPlaceholder}/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {filters.map((item) => {
            const selected = item === filter;
            return (<Pressable key={item} accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={labels.accessibilityLabels.filter(labels.discovery.filters[item])} onPress={() => setFilter(item)} style={[
                    styles.chip,
                    backgroundBorderStyle(selected ? colors.primarySoft : colors.surface, selected ? colors.primary : colors.border),
                ]}>
                <SafeText variant="tiny" style={{ fontWeight: selected ? '700' : '500' }} color={selected ? 'info' : 'secondary'}>
                  {labels.discovery.filters[item]}
                </SafeText>
              </Pressable>);
        })}
        </ScrollView>
      </View>

      
      {facilities.isLoading ? (<View style={styles.grid} accessibilityLabel={labels.states.loadingFacilities}>
          {[0, 1, 2].map((item) => (<View key={item} style={[styles.gridItem, styles.skeletonCard]}>
              <Skeleton height={140}/>
              <Skeleton height={18} width="58%"/>
            </View>))}
        </View>) : facilities.error ? (<ErrorState title={labels.states.loadFacilitiesTitle} message={labels.states.loadFacilitiesDescription} onRetry={() => void facilities.refresh()} retryLabel={labels.states.retry}/>) : facilities.facilities.length === 0 ? (<EmptyStatePanel title={query || filter !== FacilityDiscoveryFilter.All ? msg.noSpacesMatchTitle : msg.noSpacesAvailableTitle} description={query || filter !== FacilityDiscoveryFilter.All ? msg.noSpacesMatchDescription : msg.noSpacesAvailableDescription} icon="empty" actionArea={query || filter !== FacilityDiscoveryFilter.All
                ? <AppButton title={labels.states.clearFilters} onPress={clearFilters} variant="outline"/>
                : undefined}/>) : (<View style={{ gap: 16 }}>
          
          {featuredSpace ? (<View style={{ gap: 6 }}>
              <SafeText variant="tiny" color="secondary" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
                {msg.featuredSpace}
              </SafeText>
              <SpaceObject facility={featuredSpace} variant="featured" onPress={() => onOpenFacility(featuredSpace.id)}/>
            </View>) : null}

          
          {otherSpaces.length > 0 ? (<View style={{ gap: 8 }}>
              <SafeText variant="tiny" color="secondary" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
                {msg.allSpaces(facilities.facilities.length)}
              </SafeText>
              {otherSpaces.map((facility) => (<SpaceObject key={facility.id} facility={facility} variant="compact" onPress={() => onOpenFacility(facility.id)}/>))}
            </View>) : null}
        </View>)}
    </FacilityScreenLayout>);
}

