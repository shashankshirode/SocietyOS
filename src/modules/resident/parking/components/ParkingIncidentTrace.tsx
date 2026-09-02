import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { Spacing } from '../../../../shared/theme/spacing';
import type { ParkingIncident } from '../../../../shared/types/parking.types';
import { ParkingIncidentObject } from './ParkingIncidentObject';

export interface ParkingIncidentTraceProps {
  incidents: ParkingIncident[];
  onSelectIncident: (incident: ParkingIncident) => void;
  selectedIncidentId?: string | null | undefined;
  style?: StyleProp<ViewStyle> | undefined;
}

export function ParkingIncidentTrace({
  incidents,
  onSelectIncident,
  selectedIncidentId,
  style,
}: ParkingIncidentTraceProps) {
  const theme = useAppTheme();

  return (
    <View style={[{ gap: Spacing.md }, style]}>
      {incidents.map((incident, index) => {
        const isLast = index === incidents.length - 1;
        const isActive = !['RESOLVED', 'CLOSED', 'REJECTED'].includes(incident.status);

        return (
          <View key={incident.id} style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {/* Mobility Lane Node & Connector Line */}
            <View style={{ alignItems: 'center', width: 20 }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: isActive
                    ? theme.semantic.accent.moss
                    : theme.semantic.surface.soft,
                  borderWidth: 2,
                  borderColor: isActive
                    ? theme.semantic.accent.moss
                    : theme.semantic.border.default,
                  marginTop: 18,
                }}
              />
              {!isLast ? (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    backgroundColor: theme.semantic.border.default,
                    marginVertical: 4,
                  }}
                />
              ) : null}
            </View>

            {/* Incident Object Card */}
            <View style={{ flex: 1, minWidth: 0 }}>
              <ParkingIncidentObject
                incident={incident}
                selected={selectedIncidentId === incident.id}
                onPress={() => onSelectIncident(incident)}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
