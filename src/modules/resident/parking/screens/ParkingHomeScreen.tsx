import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, RefreshControl, useWindowDimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ParkingHomeScreenProps } from '../../../../app/navigation/navigation.types';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useParkingHome } from '../data/useParkingHome';
import { useCreateParkingIncident } from '../data/useCreateParkingIncident';
import { SocietyExperienceFrame } from '../../experience/SocietyExperienceFrame';
import { resolveResidentTabBarObstruction } from '../../navigation/useResidentTabBarLayout';
import { getAppPlatform } from '../../../../shared/platform';
import { MobilityField } from '../components/MobilityField';
import { MobilityTrace, type MobilityTraceEvent } from '../components/MobilityTrace';
import { VehicleFocusSheet } from '../components/VehicleFocusSheet';
import { MobilityIncidentModal } from '../components/MobilityIncidentModal';
import { PressableScale } from '../../../../shared/motion/PressableScale';
import type { Vehicle } from '../../../../shared/types/vehicle.types';
import type { ParkingSlot, VisitorParkingPass, ParkingIncident } from '../../../../shared/types/parking.types';
import {
  styles,
  createBgStyle,
  createColorStyle,
  createContentInset,
} from '../styles/MobilityField.styles';

export function ParkingHomeScreen({ navigation, route }: ParkingHomeScreenProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const bottomObstruction = resolveResidentTabBarObstruction(width, insets.bottom, getAppPlatform());
  const theme = useAppTheme();
  const { unitId } = route.params;
  const { data, refetch } = useParkingHome(unitId);
  const createIncident = useCreateParkingIncident();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();
  const [focusSheetVisible, setFocusSheetVisible] = useState(false);
  const [incidentModalVisible, setIncidentModalVisible] = useState(false);
  const [incidentMode, setIncidentMode] = useState<'WRONG_PARKING' | 'BLOCKED_VEHICLE'>('WRONG_PARKING');

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Primary vehicle & assigned bay
  const primaryVehicle = useMemo(() => {
    return data?.vehicles?.[0] || undefined;
  }, [data]);

  const assignedSlot = useMemo(() => {
    return data?.parkingSlots?.[0] || undefined;
  }, [data]);

  const activeIncident = useMemo(() => {
    return data?.incidents?.find((inc) => inc.status !== 'RESOLVED' && inc.status !== 'CLOSED');
  }, [data]);

  const policy = data?.allocationPolicy || 'FIXED_ALLOTMENT';

  const isBlocked = (activeIncident?.issueType === 'BLOCKING_EXIT' || activeIncident?.issueType === 'BLOCKING_DRIVEWAY') && activeIncident?.status !== 'RESOLVED';
  const isWrongVehicle = (activeIncident?.issueType === 'PARKED_IN_MY_SLOT' || activeIncident?.issueType === 'UNKNOWN_VEHICLE') && activeIncident?.status !== 'RESOLVED';
  const isAway = primaryVehicle?.lastGateEntry?.toLowerCase().includes('exit') || false;

  // Dynamic Narrative Copy based on Policy & Presence
  const heroNarrative = useMemo(() => {
    if (isBlocked) return 'Your exit path may be blocked.';
    if (isWrongVehicle && policy === 'FIXED_ALLOTMENT') return 'Another vehicle may be in your space.';
    if (policy === 'NO_PARKING_SOCIETY' || (!assignedSlot && !primaryVehicle && policy !== 'OPEN_COMMON_POOL')) {
      return 'No dedicated parking allotted to your flat.';
    }
    if (policy === 'OPEN_COMMON_POOL') {
      if (!primaryVehicle) return 'Common resident parking area.';
      if (isAway) return `${primaryVehicle.makeModel || 'Your vehicle'} is away from society.`;
      return `${primaryVehicle.makeModel || 'Your vehicle'} is inside common parking.`;
    }
    if (policy === 'MECHANICAL_STACK') {
      if (!primaryVehicle) return 'Mechanical stack bay is ready.';
      if (isAway) return `Stack bay is empty. ${primaryVehicle.makeModel} is away.`;
      return `Your ${primaryVehicle.makeModel} is in mechanical stack.`;
    }
    if (!primaryVehicle) return 'Your parking space is waiting.';
    if (isAway) return `Your parking space is waiting. ${primaryVehicle.makeModel || 'Your car'} is away.`;
    return `Your ${primaryVehicle.makeModel || 'car'} is where it belongs.`;
  }, [isBlocked, isWrongVehicle, policy, assignedSlot, primaryVehicle, isAway]);

  const slotLabel = policy === 'OPEN_COMMON_POOL'
    ? 'Common Pool'
    : policy === 'MECHANICAL_STACK'
    ? 'Stack Bay · Level 2'
    : assignedSlot?.slotNumber || 'B2 · P118';

  // Humanized Mobility Trace events
  const traceEvents = useMemo<MobilityTraceEvent[]>(() => {
    const rawEvents: MobilityTraceEvent[] = [
      {
        id: 'trace-1',
        type: isAway ? 'EXIT' : 'ENTRY',
        time: isAway ? '9:18 AM' : '18 min ago',
        title: isAway ? `${primaryVehicle?.makeModel || 'Vehicle'} exited` : `${primaryVehicle?.makeModel || 'Vehicle'} entered`,
        subtitle: 'Gate 2 · RFID Access · Confirmed',
        statusTone: 'success',
      },
      {
        id: 'trace-2',
        type: 'VISITOR',
        time: 'Yesterday',
        title: 'Visitor Pass P-V12 created',
        subtitle: 'Reserved for guest arrival · Completed',
        statusTone: 'info',
      },
    ];

    if (activeIncident) {
      rawEvents.unshift({
        id: 'trace-inc',
        type: 'INCIDENT',
        time: 'Just now',
        title: activeIncident.issueType === 'BLOCKING_EXIT' ? 'Exit obstruction reported' : 'Unauthorized vehicle reported',
        subtitle: `Assigned to Duty Guard · ${activeIncident.status}`,
        statusTone: 'warning',
      });
    }

    return rawEvents;
  }, [activeIncident, isAway, primaryVehicle]);

  const handleOpenFocus = (vehicle?: Vehicle) => {
    setSelectedVehicle(vehicle || primaryVehicle);
    setFocusSheetVisible(true);
  };

  const handleReportIncident = (mode: 'WRONG_PARKING' | 'BLOCKED_VEHICLE') => {
    setIncidentMode(mode);
    setIncidentModalVisible(true);
  };

  const handleIncidentSubmit = async (incidentData: { type: 'WRONG_PARKING' | 'BLOCKED_VEHICLE'; targetPlate: string; notes: string }) => {
    await createIncident.submit({
      societyId: 'soc-001',
      unitId,
      issueType: incidentData.type === 'WRONG_PARKING' ? 'PARKED_IN_MY_SLOT' : 'BLOCKING_EXIT',
      reportedBy: 'Resident',
      reportedFlat: '1204',
      vehicleNumber: incidentData.targetPlate,
      location: slotLabel,
      description: incidentData.notes,
      priority: 'HIGH',
      immediateSecurityHelp: true,
      isVehicleBlocked: incidentData.type === 'BLOCKED_VEHICLE',
    });
    refetch();
  };

  return (
    <SocietyExperienceFrame>
      <View style={[styles.root, createBgStyle(theme.semantic.surface.canvas)]}>
        <ScrollView
          contentContainerStyle={[styles.content, createContentInset(0, bottomObstruction)]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.semantic.accent.moss}
            />
          }
        >
          {/* 1. Ambient Narrative Header */}
          <View style={styles.narrativeBlock}>
            <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.accent.moss)]}>
              MOBILITY
            </SafeText>
            <SafeText variant="h1" color="primary" style={{ fontSize: 26, fontWeight: '700', lineHeight: 32 }}>
              {heroNarrative}
            </SafeText>
            <SafeText variant="body" color="secondary" style={{ fontSize: 15 }}>
              {slotLabel} · {policy === 'OPEN_COMMON_POOL' ? 'Open Society Pool' : 'Home Bay'}
            </SafeText>
          </View>

          {/* 2. Primary Spatial Mobility Field */}
          <MobilityField
            policy={policy}
            primaryVehicle={primaryVehicle}
            assignedSlot={assignedSlot}
            activeIncident={activeIncident}
            onVehiclePress={(v) => handleOpenFocus(v)}
            onSlotPress={() => handleOpenFocus(primaryVehicle)}
            onReportIssuePress={() => handleReportIncident('WRONG_PARKING')}
            onRequestAllotmentPress={() => navigation.navigate('VisitorParkingRequest', { unitId })}
          />

          {/* 3. Contextual "DO NEXT" Command */}
          <View style={{ gap: 8 }}>
            <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.accent.moss)]}>
              DO NEXT
            </SafeText>

            {isBlocked || isWrongVehicle ? (
              <PressableScale
                onPress={() => navigation.navigate('ParkingIncidentList', { unitId })}
                accessibilityRole="button"
                accessibilityLabel="Track parking issue"
              >
                <View
                  style={[
                    styles.actionCard,
                    createBgStyle(theme.semantic.surface.raised, theme.semantic.status.warning),
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Ionicons name="alert-circle" size={24} color={theme.semantic.status.warning} />
                    <View style={styles.actionCopy}>
                      <SafeText variant="bodyStrong" color="primary" style={{ fontSize: 16 }}>
                        Track Parking Incident
                      </SafeText>
                      <SafeText variant="caption" color="secondary">
                        Duty guard notified · Resolution in progress
                      </SafeText>
                    </View>
                  </View>
                  <Ionicons name="arrow-forward" size={18} color={theme.semantic.text.secondary} />
                </View>
              </PressableScale>
            ) : (
              <PressableScale
                onPress={() => navigation.navigate('VisitorParkingRequest', { unitId })}
                accessibilityRole="button"
                accessibilityLabel="Add visitor parking"
              >
                <View
                  style={[
                    styles.actionCard,
                    createBgStyle(theme.semantic.surface.raised, theme.semantic.border.subtle),
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: theme.semantic.surface.soft,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="people" size={20} color={theme.semantic.accent.moss} />
                    </View>
                    <View style={styles.actionCopy}>
                      <SafeText variant="bodyStrong" color="primary" style={{ fontSize: 16 }}>
                        Add Visitor Parking
                      </SafeText>
                      <SafeText variant="caption" color="secondary">
                        Reserve a temporary guest bay before arrival
                      </SafeText>
                    </View>
                  </View>
                  <Ionicons name="arrow-forward" size={18} color={theme.semantic.accent.moss} />
                </View>
              </PressableScale>
            )}
          </View>

          {/* 4. Mobility Trace (Gate Stream Movement Lane) */}
          <MobilityTrace
            events={traceEvents}
            onEventPress={(e) => {
              if (e.type === 'INCIDENT') {
                navigation.navigate('ParkingIncidentList', { unitId });
              } else {
                handleOpenFocus(primaryVehicle);
              }
            }}
          />
        </ScrollView>

        {/* 5. In-Place Vehicle Focus Sheet */}
        <VehicleFocusSheet
          visible={focusSheetVisible}
          vehicle={selectedVehicle || primaryVehicle}
          assignedSlot={assignedSlot}
          allVehicles={data?.vehicles}
          onClose={() => setFocusSheetVisible(false)}
          onSelectVehicle={(v) => setSelectedVehicle(v)}
          onReportBlocked={() => handleReportIncident('BLOCKED_VEHICLE')}
          onReportWrongParking={() => handleReportIncident('WRONG_PARKING')}
        />

        {/* 6. Contextual Incident Modal */}
        <MobilityIncidentModal
          visible={incidentModalVisible}
          mode={incidentMode}
          slotNumber={slotLabel}
          onClose={() => setIncidentModalVisible(false)}
          onSubmit={handleIncidentSubmit}
        />
      </View>
    </SocietyExperienceFrame>
  );
}

export default ParkingHomeScreen;
