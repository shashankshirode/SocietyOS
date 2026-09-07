import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useResponsiveLayout } from '../../../../ui/layout/useResponsiveLayout';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { Spacing } from '../../../../shared/theme/spacing';
import { SafeText } from '../../../../shared/components/SafeText';
import { SearchInputBar } from '../../../../shared/components/SearchInputBar';
import { FilterChipBar } from '../../../../shared/components/FilterChipBar';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { ErrorState } from '../../../../shared/components/ErrorState';
import { ResidentAppHeader } from '../../navigation/ResidentAppHeader';
import { SocietyPageShell } from '../../experience/SocietyPageShell';
import type { ParkingIncidentListScreenProps } from '../../../../app/navigation/navigation.types';
import type { ParkingIncident } from '../../../../shared/types/parking.types';
import { useParkingIncidents } from '../data/useParkingIncidents';
import { useEscalateParkingIncident, useReportFalseParkingResolution, useResolveParkingIncident, } from '../data/useParkingIncidentDetail';
import { ParkingIncidentTrace } from '../components/ParkingIncidentTrace';
import { ParkingIncidentFocus } from '../components/ParkingIncidentFocus';
type ResidentIncidentFilter = 'OPEN' | 'SECURITY' | 'OWNER' | 'RESOLVED' | 'ALL';
const FILTER_OPTIONS: {
    value: ResidentIncidentFilter;
    label: string;
}[] = [
    { value: 'OPEN', label: 'Open' },
    { value: 'SECURITY', label: 'Security' },
    { value: 'OWNER', label: 'Owner Notified' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'ALL', label: 'All Reports' },
];
export function ParkingIncidentListScreen({ navigation, route }: ParkingIncidentListScreenProps) {
    const theme = useAppTheme();
    const layout = useResponsiveLayout();
    const [filter, setFilter] = useState<ResidentIncidentFilter>('OPEN');
    const [query, setQuery] = useState('');
    const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
    const { data = [], isLoading, error, refetch } = useParkingIncidents({
        unitId: route.params?.unitId,
    });
    const resolveMutation = useResolveParkingIncident();
    const escalateMutation = useEscalateParkingIncident();
    const falseResolutionMutation = useReportFalseParkingResolution();
    const filteredIncidents = useMemo(() => {
        let list = data;
        if (filter === 'OPEN') {
            list = list.filter((i) => !['RESOLVED', 'REJECTED', 'CLOSED'].includes(i.status));
        }
        else if (filter === 'SECURITY') {
            list = list.filter((i) => ['SECURITY_NOTIFIED', 'IN_PROGRESS', 'ESCALATED'].includes(i.status));
        }
        else if (filter === 'OWNER') {
            list = list.filter((i) => i.status === 'OWNER_NOTIFIED');
        }
        else if (filter === 'RESOLVED') {
            list = list.filter((i) => ['RESOLVED', 'CLOSED'].includes(i.status));
        }
        if (query.trim()) {
            const q = query.trim().toLowerCase();
            list = list.filter((i) => i.incidentNumber.toLowerCase().includes(q) ||
                i.location.toLowerCase().includes(q) ||
                (i.vehicleNumber && i.vehicleNumber.toLowerCase().includes(q)) ||
                (i.reportedBy && i.reportedBy.toLowerCase().includes(q)) ||
                (i.description && i.description.toLowerCase().includes(q)));
        }
        return list;
    }, [data, filter, query]);
    const selectedIncident = useMemo(() => {
        if (!selectedIncidentId)
            return filteredIncidents[0] ?? null;
        return data.find((i) => i.id === selectedIncidentId) ?? filteredIncidents[0] ?? null;
    }, [data, filteredIncidents, selectedIncidentId]);
    const isSplitLayout = (layout.isTablet || layout.isFold) && filteredIncidents.length > 0;
    const handleSelectIncident = (incident: ParkingIncident) => {
        if (layout.isTablet || layout.isFold) {
            setSelectedIncidentId(incident.id);
        }
        else {
            navigation.navigate('ParkingIncidentDetail', { incidentId: incident.id });
        }
    };
    const handleResolve = async () => {
        if (!selectedIncident)
            return;
        const res = await resolveMutation.submit(selectedIncident.id);
        if (res.ok)
            await refetch();
    };
    const handleEscalate = async () => {
        if (!selectedIncident)
            return;
        const res = await escalateMutation.submit(selectedIncident.id);
        if (res.ok)
            await refetch();
    };
    const handleReportFalse = async () => {
        if (!selectedIncident)
            return;
        const res = await falseResolutionMutation.submit(selectedIncident.id);
        if (res.ok)
            await refetch();
    };
    return (<SocietyPageShell showHeader={false} showDockClearance={true} testID="parking-incident-list-screen">
      
      <ResidentAppHeader showBackButton={true} onBackPress={() => navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate('ParkingHome', { unitId: route.params?.unitId ?? '' })} fallbackTab="HomeTab" fallbackRoute="ParkingHome" showNarrative={false}/>

      <View style={{ gap: Spacing.md, paddingTop: Spacing.sm }}>
        
        <View style={{ gap: Spacing.xs }}>
          <SafeText variant="display" style={{ color: theme.semantic.text.primary }}>
            Parking Incidents
          </SafeText>
          <SafeText variant="body" color="secondary">
            Track reports and follow-ups around your vehicle and parking spaces.
          </SafeText>
        </View>

        
        <SearchInputBar value={query} onChangeText={setQuery} placeholder="Search incident, vehicle, or location..."/>

        
        <FilterChipBar options={FILTER_OPTIONS} value={filter} onChange={(val) => setFilter(val as ResidentIncidentFilter)}/>

        
        {isLoading ? (<View style={{ paddingVertical: Spacing.xl, alignItems: 'center' }}>
            <SafeText variant="caption" color="secondary">Loading parking reports...</SafeText>
          </View>) : error ? (<ErrorState title="Unable to load incidents" message={error.message} onRetry={refetch}/>) : filteredIncidents.length === 0 ? (<EmptyState title={query
                ? 'No matching incidents'
                : filter === 'OPEN'
                    ? 'All clear'
                    : 'No incidents in this category'} description={query
                ? `No reports match "${query}". Try searching a different keyword.`
                : filter === 'OPEN'
                    ? 'There are no active parking issues reported around your flat.'
                    : 'No incidents found under the selected filter.'} iconName="car-sport-outline" {...(filter !== 'OPEN' || query
            ? {
                actionTitle: 'Reset Filters',
                onAction: () => {
                    setFilter('OPEN');
                    setQuery('');
                },
            }
            : {})}/>) : isSplitLayout ? (<View style={{ flexDirection: 'row', gap: Spacing.lg, alignItems: 'flex-start', paddingTop: Spacing.xs }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <ParkingIncidentTrace incidents={filteredIncidents} selectedIncidentId={selectedIncident?.id ?? null} onSelectIncident={handleSelectIncident}/>
            </View>

            {selectedIncident ? (<View style={{ width: 380, minWidth: 0 }}>
                <ParkingIncidentFocus incident={selectedIncident} onResolve={handleResolve} onEscalate={handleEscalate} onReportFalseResolution={handleReportFalse} isResolving={resolveMutation.isSubmitting} isEscalating={escalateMutation.isSubmitting} isReportingFalse={falseResolutionMutation.isSubmitting}/>
              </View>) : null}
          </View>) : (<View style={{ paddingTop: Spacing.xs }}>
            <ParkingIncidentTrace incidents={filteredIncidents} onSelectIncident={handleSelectIncident}/>
          </View>)}
      </View>
    </SocietyPageShell>);
}
export default ParkingIncidentListScreen;

