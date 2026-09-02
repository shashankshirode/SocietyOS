import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { emergencyTheme } from '../theme/emergencyTheme';
import { useMessages } from '../../../../messages/useMessages';
import type { SosEvent } from '../data/sosResponsePlan.types';

interface ResponseFieldProps {
  event: SosEvent;
  unitName: string;
  categoryLabel: string;
  accentColor: string;
}

export function ResponseField({
  event,
  unitName,
  categoryLabel,
  accentColor,
}: ResponseFieldProps) {
  const copy = useMessages().resident.emergency.crisis;
  const isAcknowledged = event.status === 'acknowledged' || event.status === 'responderDispatched' || event.status === 'responderReached' || event.status === 'underControl';

  // Extract deliveries
  const deliveries = event.recipientDeliveries;

  return (
    <View style={styles.container}>
      {/* 1. Central Spatial Constellation */}
      <View style={styles.constellationWrapper}>
        {/* Halo Rings */}
        <View style={[styles.haloRingOuter, { borderColor: emergencyTheme.haloRing }]}>
          <View style={[styles.haloRingInner, { borderColor: isAcknowledged ? emergencyTheme.haloRingActive : emergencyTheme.haloRing }]}>
            
            {/* Center Home Node */}
            <View style={[styles.centerHomeNode, { borderColor: accentColor }]}>
              <Ionicons name="home" size={20} color={accentColor} />
              <SafeText variant="tiny" style={[styles.centerHomeText, { color: emergencyTheme.text }]}>
                {unitName || 'Home'}
              </SafeText>
              <SafeText variant="tiny" style={{ color: accentColor, fontSize: 9, fontWeight: '700' }}>
                {categoryLabel}
              </SafeText>
            </View>

          </View>
        </View>

        {/* Radiating Responder Nodes */}
        <View style={styles.respondersRow}>
          {deliveries.slice(0, 3).map((delivery) => {
            const isDeliveryAck = delivery.deliveryStatus === 'acknowledged';
            return (
              <View key={delivery.recipientId} style={styles.responderNode}>
                <View
                  style={[
                    styles.responderIconWrap,
                    {
                      borderColor: isDeliveryAck ? emergencyTheme.acknowledged : emergencyTheme.connector,
                      backgroundColor: isDeliveryAck ? `${emergencyTheme.acknowledged}22` : emergencyTheme.surfaceRaised,
                    },
                  ]}
                >
                  <Ionicons
                    name={isDeliveryAck ? 'shield-checkmark' : 'shield-outline'}
                    size={16}
                    color={isDeliveryAck ? emergencyTheme.acknowledged : emergencyTheme.textSecondary}
                  />
                </View>
                <SafeText variant="tiny" style={[styles.responderName, { color: emergencyTheme.text }]} numberOfLines={1}>
                  {delivery.displayName}
                </SafeText>
                <SafeText
                  variant="tiny"
                  style={{
                    color: isDeliveryAck ? emergencyTheme.acknowledged : emergencyTheme.textMuted,
                    fontSize: 9,
                    fontWeight: isDeliveryAck ? '700' : '500',
                  }}
                >
                  {isDeliveryAck ? copy.acknowledged : copy.simulated}
                </SafeText>
              </View>
            );
          })}
        </View>
      </View>

      {/* 2. Live Response Trace Timeline */}
      <View style={styles.traceContainer}>
        <SafeText variant="tiny" style={[styles.traceHeader, { color: emergencyTheme.textSecondary }]}>
          {copy.traceTitle}
        </SafeText>

        <View style={styles.traceList}>
          {/* Milestone 1: Triggered */}
          <View style={styles.traceRow}>
            <View style={[styles.traceDot, { backgroundColor: emergencyTheme.acknowledged }]} />
            <SafeText variant="tiny" style={[styles.traceTime, { color: emergencyTheme.textSecondary }]}>
              {new Date(event.triggeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </SafeText>
            <SafeText variant="caption" style={[styles.traceText, { color: emergencyTheme.text }]}>
              {copy.sent} · {copy.simulated}
            </SafeText>
          </View>

          {/* Milestone 2: Delivery */}
          {event.status !== 'initiated' && (
            <View style={styles.traceRow}>
              <View style={[styles.traceDot, { backgroundColor: emergencyTheme.acknowledged }]} />
              <SafeText variant="tiny" style={[styles.traceTime, { color: emergencyTheme.textSecondary }]}>
                {new Date(event.triggeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </SafeText>
              <SafeText variant="caption" style={[styles.traceText, { color: emergencyTheme.text }]}>
                {copy.delivered} · {copy.simulated}
              </SafeText>
            </View>
          )}

          {/* Milestone 3: Acknowledged */}
          {isAcknowledged && (
            <View style={styles.traceRow}>
              <View style={[styles.traceDot, { backgroundColor: emergencyTheme.acknowledged }]} />
              <SafeText variant="tiny" style={[styles.traceTime, { color: emergencyTheme.textSecondary }]}>
                {event.acknowledgedAt
                  ? new Date(event.acknowledgedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : new Date(event.triggeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </SafeText>
              <SafeText variant="caption" style={[styles.traceText, { color: emergencyTheme.acknowledged, fontWeight: '700' }]}>
                {copy.acknowledged} · {copy.simulated}
              </SafeText>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    alignItems: 'center',
    width: '100%',
  },
  constellationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
  },
  haloRingOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloRingInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHomeNode: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1.5,
    backgroundColor: emergencyTheme.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  centerHomeText: {
    fontWeight: '700',
    fontSize: 11,
  },
  respondersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 12,
  },
  responderNode: {
    alignItems: 'center',
    gap: 4,
    width: 90,
  },
  responderIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  responderName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  traceContainer: {
    width: '100%',
    paddingHorizontal: 8,
    gap: 8,
  },
  traceHeader: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  traceList: {
    gap: 8,
    paddingLeft: 4,
  },
  traceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  traceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  traceTime: {
    fontSize: 10,
    minWidth: 40,
  },
  traceText: {
    fontSize: 12,
  },
});
