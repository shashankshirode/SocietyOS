import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { Spacing } from '../../../../shared/theme/spacing';
import { SafeText } from '../../../../shared/components/SafeText';
import { SocietyButton } from '../../../../shared/components/SocietyButton';
import { StatusIndicator } from '../../../../shared/components/StatusIndicator';
import type { ParkingIncident } from '../../../../shared/types/parking.types';
import { formatResidentDateTime } from '../../../../core/localization/dateTimeFormatters';
import { resolveIncidentNarrative, resolveIncidentStatusInfo } from './ParkingIncidentObject';

export interface ParkingIncidentFocusProps {
  incident: ParkingIncident;
  onResolve?: () => Promise<void> | void;
  onEscalate?: () => Promise<void> | void;
  onReportFalseResolution?: () => Promise<void> | void;
  isResolving?: boolean;
  isEscalating?: boolean;
  isReportingFalse?: boolean;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ParkingIncidentFocus({
  incident,
  onResolve,
  onEscalate,
  onReportFalseResolution,
  isResolving = false,
  isEscalating = false,
  isReportingFalse = false,
  onClose,
  style,
}: ParkingIncidentFocusProps) {
  const theme = useAppTheme();
  const narrative = resolveIncidentNarrative(incident.issueType, incident.location);
  const statusInfo = resolveIncidentStatusInfo(incident.status);
  const isResolvedOrClosed = ['RESOLVED', 'CLOSED'].includes(incident.status);
  const isEscalated = incident.status === 'ESCALATED';

  return (
    <View
      style={[
        {
          backgroundColor: theme.semantic.surface.raised,
          borderColor: theme.semantic.border.default,
          borderWidth: 1,
          borderRadius: 16,
          padding: Spacing.lg,
          gap: Spacing.md,
        },
        style,
      ]}
    >
      {/* Header bar: Status + Reference ID + Close if modal */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
          <StatusIndicator label={statusInfo.label} tone={statusInfo.tone} />
          {incident.priority === 'URGENT' ? (
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

        <SafeText variant="tiny" color="muted" style={{ fontFamily: 'monospace' }}>
          {incident.incidentNumber}
        </SafeText>
      </View>

      {/* Narrative Headline */}
      <View style={{ gap: Spacing.xs }}>
        <SafeText variant="h2" style={{ color: theme.semantic.text.primary }}>
          {narrative}
        </SafeText>
        <SafeText variant="body" color="secondary">
          {statusInfo.note}
        </SafeText>
      </View>

      {/* Key Details Card */}
      <View
        style={{
          backgroundColor: theme.semantic.surface.soft,
          borderColor: theme.semantic.border.default,
          borderWidth: 1,
          borderRadius: 12,
          padding: Spacing.md,
          gap: Spacing.sm,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <SafeText variant="caption" color="secondary">Location</SafeText>
          <SafeText variant="bodyStrong">{incident.location}</SafeText>
        </View>

        {incident.vehicleNumber ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <SafeText variant="caption" color="secondary">Vehicle Involved</SafeText>
            <View
              style={{
                backgroundColor: theme.semantic.surface.raised,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: theme.semantic.border.default,
              }}
            >
              <SafeText variant="bodyStrong" style={{ letterSpacing: 0.5 }}>
                {incident.vehicleNumber}
              </SafeText>
            </View>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <SafeText variant="caption" color="secondary">Reported By</SafeText>
          <SafeText variant="bodyStrong">
            {incident.reportedBy} ({incident.reportedFlat})
          </SafeText>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <SafeText variant="caption" color="secondary">Assigned Security</SafeText>
          <SafeText variant="bodyStrong">
            {incident.assignedTo ?? incident.assignedTeam ?? 'Patrolling Team'}
          </SafeText>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <SafeText variant="caption" color="secondary">Created</SafeText>
          <SafeText variant="bodyStrong">
            {formatResidentDateTime(incident.createdAt)}
          </SafeText>
        </View>

        {incident.description ? (
          <View style={{ gap: 2, paddingTop: Spacing.xs, borderTopWidth: 1, borderColor: theme.semantic.border.default }}>
            <SafeText variant="caption" color="secondary">Note from resident</SafeText>
            <SafeText variant="body">{incident.description}</SafeText>
          </View>
        ) : null}
      </View>

      {/* Incident Progress Timeline */}
      {incident.timeline && incident.timeline.length > 0 ? (
        <View style={{ gap: Spacing.sm }}>
          <SafeText variant="tiny" color="muted" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Activity & Security Trace
          </SafeText>
          <View style={{ gap: Spacing.xs }}>
            {incident.timeline.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  gap: Spacing.sm,
                  backgroundColor: theme.semantic.surface.soft,
                  padding: Spacing.sm,
                  borderRadius: 8,
                }}
              >
                <Ionicons name="time-outline" size={16} color={theme.semantic.accent.moss} style={{ marginTop: 2 }} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <SafeText variant="caption" style={{ fontWeight: '600', color: theme.semantic.text.primary }}>
                    {item.title}
                  </SafeText>
                  <SafeText variant="caption" color="secondary">
                    {item.note}
                  </SafeText>
                  <SafeText variant="tiny" color="muted" style={{ marginTop: 2 }}>
                    {formatResidentDateTime(item.createdAt)}
                  </SafeText>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Action Buttons */}
      <View style={{ gap: Spacing.sm, paddingTop: Spacing.xs }}>
        {!isResolvedOrClosed && onResolve ? (
          <SocietyButton
            title="Mark Cleared / Resolved"
            onPress={onResolve}
            loading={isResolving}
            variant="primary"
            size="md"
            fullWidth
          />
        ) : null}

        {!isResolvedOrClosed && !isEscalated && onEscalate ? (
          <SocietyButton
            title="Escalate to Facility Manager"
            onPress={onEscalate}
            loading={isEscalating}
            variant="danger"
            size="md"
            fullWidth
          />
        ) : null}

        {isResolvedOrClosed && onReportFalseResolution ? (
          <SocietyButton
            title="Report Still Blocked"
            onPress={onReportFalseResolution}
            loading={isReportingFalse}
            variant="outline"
            size="md"
            fullWidth
          />
        ) : null}

        {onClose ? (
          <SocietyButton
            title="Close Details"
            onPress={onClose}
            variant="secondary"
            size="sm"
            fullWidth
          />
        ) : null}
      </View>
    </View>
  );
}
