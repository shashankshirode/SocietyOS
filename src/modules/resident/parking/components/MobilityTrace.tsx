import React from 'react';
import { View, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import {
  styles,
  createBgStyle,
  createColorStyle,
} from '../styles/MobilityField.styles';

export type MobilityTraceEvent = {
  id: string;
  type: 'ENTRY' | 'EXIT' | 'VISITOR' | 'INCIDENT';
  time: string;
  title: string;
  subtitle: string;
  gateLabel?: string;
  statusTone?: 'success' | 'info' | 'warning';
};

type MobilityTraceProps = {
  events: MobilityTraceEvent[];
  onEventPress?: (event: MobilityTraceEvent) => void;
};

export function MobilityTrace({ events, onEventPress }: MobilityTraceProps) {
  const theme = useAppTheme();

  const getIcon = (type: MobilityTraceEvent['type']) => {
    switch (type) {
      case 'ENTRY':
        return 'arrow-down-circle';
      case 'EXIT':
        return 'arrow-up-circle';
      case 'VISITOR':
        return 'people-circle';
      case 'INCIDENT':
        return 'alert-circle';
      default:
        return 'car';
    }
  };

  const getColor = (type: MobilityTraceEvent['type']) => {
    switch (type) {
      case 'ENTRY':
        return theme.semantic.accent.moss;
      case 'EXIT':
        return theme.semantic.text.secondary;
      case 'VISITOR':
        return theme.semantic.accent.sage;
      case 'INCIDENT':
        return theme.semantic.status.warning;
      default:
        return theme.semantic.text.primary;
    }
  };

  return (
    <View style={styles.traceContainer}>
      <View style={styles.traceHeader}>
        <SafeText variant="bodyStrong" color="primary" style={{ fontSize: 18, fontWeight: '700' }}>
          Mobility Trace
        </SafeText>
        <SafeText variant="caption" color="secondary">
          Simulated Gate Stream
        </SafeText>
      </View>

      <View style={styles.traceList}>
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          const nodeColor = getColor(event.type);

          return (
            <View key={event.id} style={styles.traceRow}>
              {/* Movement Lane & Node */}
              <View style={styles.traceNodeColumn}>
                <View
                  style={[
                    styles.traceNodeDot,
                    createBgStyle(nodeColor),
                  ]}
                />
                {!isLast ? (
                  <View
                    style={[
                      styles.traceLine,
                      createBgStyle(theme.semantic.border.subtle),
                    ]}
                  />
                ) : null}
              </View>

              {/* Event Content Card */}
              <Pressable
                onPress={() => onEventPress?.(event)}
                accessibilityRole="button"
                accessibilityLabel={`${event.title}. ${event.subtitle}. At ${event.time}.`}
                style={[
                  styles.traceContent,
                  createBgStyle(theme.semantic.surface.raised, theme.semantic.border.subtle),
                ]}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <SafeText variant="bodyStrong" color="primary" style={{ fontSize: 15 }}>
                    {event.title}
                  </SafeText>
                  <SafeText variant="tiny" color="secondary">
                    {event.time}
                  </SafeText>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name={getIcon(event.type)} size={14} color={nodeColor} />
                  <SafeText variant="caption" color="secondary" style={{ fontSize: 13 }}>
                    {event.subtitle}
                  </SafeText>
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
