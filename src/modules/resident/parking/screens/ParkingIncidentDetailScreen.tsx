import React from 'react';
import { View } from 'react-native';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { Spacing } from '../../../../shared/theme/spacing';
import { SafeText } from '../../../../shared/components/SafeText';
import { ErrorState } from '../../../../shared/components/ErrorState';
import { ResidentAppHeader } from '../../navigation/ResidentAppHeader';
import { SocietyPageShell } from '../../experience/SocietyPageShell';
import type { ParkingIncidentDetailScreenProps } from '../../../../app/navigation/navigation.types';
import {
  useEscalateParkingIncident,
  useParkingIncidentDetail,
  useReportFalseParkingResolution,
  useResolveParkingIncident,
} from '../data/useParkingIncidentDetail';
import { ParkingIncidentFocus } from '../components/ParkingIncidentFocus';

export function ParkingIncidentDetailScreen({ navigation, route }: ParkingIncidentDetailScreenProps) {
  const theme = useAppTheme();
  const { data: incident, isLoading, error, refetch } = useParkingIncidentDetail(route.params.incidentId);
  const resolveMutation = useResolveParkingIncident();
  const escalateMutation = useEscalateParkingIncident();
  const falseResolutionMutation = useReportFalseParkingResolution();

  const handleResolve = async () => {
    if (!incident) return;
    const result = await resolveMutation.submit(incident.id);
    if (result.ok) {
      await refetch();
    }
  };

  const handleEscalate = async () => {
    if (!incident) return;
    const result = await escalateMutation.submit(incident.id);
    if (result.ok) {
      await refetch();
    }
  };

  const handleReportFalse = async () => {
    if (!incident) return;
    const result = await falseResolutionMutation.submit(incident.id);
    if (result.ok) {
      await refetch();
    }
  };

  return (
    <SocietyPageShell
      showHeader={false}
      showDockClearance={false}
      testID="parking-incident-detail-screen"
    >
      {/* Global Society OS Navigation Header */}
      <ResidentAppHeader
        showBackButton={true}
        onBackPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate('ParkingIncidentList', { unitId: incident?.unitId ?? '' })
        }
        fallbackTab="HomeTab"
        fallbackRoute="ParkingIncidentList"
        showNarrative={false}
      />

      <View style={{ gap: Spacing.md, paddingTop: Spacing.sm }}>
        {isLoading ? (
          <View style={{ paddingVertical: Spacing.xl, alignItems: 'center' }}>
            <SafeText variant="caption" color="secondary">Loading incident details...</SafeText>
          </View>
        ) : error || !incident ? (
          <ErrorState
            title="Incident not found"
            message={error ? error.message : 'Unable to retrieve parking incident record.'}
            onRetry={refetch}
          />
        ) : (
          <ParkingIncidentFocus
            incident={incident}
            onResolve={handleResolve}
            onEscalate={handleEscalate}
            onReportFalseResolution={handleReportFalse}
            isResolving={resolveMutation.isSubmitting}
            isEscalating={escalateMutation.isSubmitting}
            isReportingFalse={falseResolutionMutation.isSubmitting}
            onClose={() => navigation.goBack()}
          />
        )}
      </View>
    </SocietyPageShell>
  );
}

export default ParkingIncidentDetailScreen;
