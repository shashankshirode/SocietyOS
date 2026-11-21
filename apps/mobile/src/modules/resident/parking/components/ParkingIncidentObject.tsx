import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { Spacing } from '../../../../shared/theme/spacing';
import { SafeText } from '../../../../shared/components/SafeText';
import { StatusIndicator, type SemanticStatusTone } from '../../../../shared/components/StatusIndicator';
import { PressableScale } from '../../../../shared/motion/PressableScale';
import type { ParkingIncident, ParkingIncidentStatus, ParkingIncidentType } from '../../../../shared/types/parking.types';
import { formatResidentRelativeTime } from '../../../../core/localization/dateTimeFormatters';

export function resolveIncidentNarrative(issueType: ParkingIncidentType, location?: string): string {
  switch (issueType) {
    case 'PARKED_IN_MY_SLOT':
      return 'Vehicle parked in your allocated slot';
    case 'BLOCKING_EXIT':
      return 'Vehicle is blocking the exit ramp';
    case 'BLOCKING_DRIVEWAY':
      return 'Vehicle is blocking the driveway';
    case 'VISITOR_IN_RESIDENT_SLOT':
      return 'Visitor parked in a resident slot';
    case 'DOUBLE_PARKED':
      return 'Vehicle double parked';
    case 'UNKNOWN_VEHICLE':
      return 'Unrecognized vehicle parked';
    case 'OTHER':
    default:
      return location ? `Parking obstruction at ${location}` : 'Parking incident reported';
  }
}

export function resolveIncidentStatusInfo(status: ParkingIncidentStatus): {
  label: string;
  tone: SemanticStatusTone;
  note: string;
} {
  switch (status) {
    case 'SECURITY_NOTIFIED':
      return {
        label: 'Security Notified',
        tone: 'warning',
        note: 'Security has been alerted and is dispatching.',
      };
    case 'OWNER_NOTIFIED':
      return {
        label: 'Owner Notified',
        tone: 'warning',
        note: 'Vehicle owner was contacted to move vehicle.',
      };
    case 'IN_PROGRESS':
      return {
        label: 'Security Checking',
        tone: 'active',
        note: 'Security is on-site inspecting the vehicle.',
      };
    case 'ESCALATED':
      return {
        label: 'Escalated',
        tone: 'danger',
        note: 'Escalated to facility manager for towing.',
      };
    case 'RESOLVED':
      return {
        label: 'Resolved',
        tone: 'resolved',
        note: 'Issue cleared and parking restored.',
      };
    case 'CLOSED':
      return {
        label: 'Closed',
        tone: 'neutral',
        note: 'Incident closed.',
      };
    case 'REJECTED':
      return {
        label: 'Dismissed',
        tone: 'neutral',
        note: 'Report dismissed by security.',
      };
    case 'REPORTED':
    default:
      return {
        label: 'Reported',
        tone: 'neutral',
        note: 'Report submitted. Pending security pickup.',
      };
  }
}

export interface ParkingIncidentObjectProps {
  incident: ParkingIncident;
  onPress: () => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ParkingIncidentObject({
  incident,
  onPress,
  selected = false,
  style,
  testID,
}: ParkingIncidentObjectProps) {
  const theme = useAppTheme();
  const narrative = resolveIncidentNarrative(incident.issueType, incident.location);
  const statusInfo = resolveIncidentStatusInfo(incident.status);
  const isUrgent = incident.priority === 'URGENT' || incident.priority === 'HIGH';

  return (
    <PressableScale
      testID={testID ?? `incident-object-${incident.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${narrative}, ${statusInfo.label}`}
      onPress={onPress}
      style={[
        {
          backgroundColor: selected
            ? theme.semantic.surface.raised
            : theme.semantic.surface.soft,
          borderColor: selected
            ? theme.semantic.accent.moss
            : theme.semantic.border.default,
          borderWidth: 1,
          borderRadius: 14,
          padding: Spacing.md,
          gap: Spacing.sm,
        },
        style,
      ]}
    >
      {/* Top row: Status Badge + Priority Tag + Time */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, flexWrap: 'wrap' }}>
          <StatusIndicator label={statusInfo.label} tone={statusInfo.tone} size="sm" />
          {isUrgent ? (
            <View
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <SafeText variant="tiny" style={{ color: theme.semantic.status.danger, fontWeight: '700' }}>
                URGENT
              </SafeText>
            </View>
          ) : null}
        </View>

        <SafeText variant="tiny" color="secondary">
          {formatResidentRelativeTime(incident.createdAt)}
        </SafeText>
      </View>

      {/* Narrative & Vehicle Info */}
      <View style={{ gap: 2 }}>
        <SafeText variant="bodyStrong" style={{ color: theme.semantic.text.primary, fontSize: 15 }} numberOfLines={2}>
          {narrative}
        </SafeText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, flexWrap: 'wrap' }}>
          <SafeText variant="caption" color="secondary" style={{ fontWeight: '500' }}>
            {incident.location}
          </SafeText>
          {incident.vehicleNumber ? (
            <>
              <SafeText variant="caption" color="muted">·</SafeText>
              <View
                style={{
                  backgroundColor: theme.semantic.surface.raised,
                  paddingHorizontal: 6,
                  paddingVertical: 1,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: theme.semantic.border.default,
                }}
              >
                <SafeText variant="caption" style={{ color: theme.semantic.text.primary, fontWeight: '700', letterSpacing: 0.5 }}>
                  {incident.vehicleNumber}
                </SafeText>
              </View>
            </>
          ) : null}
        </View>
      </View>

      {/* Footer: Live Status Note + Assignee + Chevron */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: Spacing.xs,
          borderTopWidth: 1,
          borderColor: theme.semantic.border.default,
          gap: Spacing.sm,
        }}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          <SafeText variant="caption" color="secondary" numberOfLines={1}>
            {statusInfo.note}
          </SafeText>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
          {incident.assignedTeam ? (
            <SafeText variant="tiny" color="muted" numberOfLines={1}>
              {incident.assignedTeam}
            </SafeText>
          ) : null}
          <Ionicons name="chevron-forward" size={16} color={theme.semantic.text.tertiary} />
        </View>
      </View>
    </PressableScale>
  );
}
