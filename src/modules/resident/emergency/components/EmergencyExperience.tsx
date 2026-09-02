import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, BackHandler, Pressable, View, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SafeText } from '../../../../shared/components/SafeText';
import { useMessages } from '../../../../messages/useMessages';
import { useAuthSession } from '../../../../core/auth/useAuthSession';
import { useActiveResidentHome } from '../../homeContext';
import { useSosResidenceContext } from '../hooks/useSosResidenceContext';
import { useSosRecipientResolution } from '../hooks/useSosRecipientResolution';
import { sosEventRepository } from '../data/sosEvent.repository';
import type { SosEvent, SosType } from '../data/sosResponsePlan.types';
import { emergencyTheme } from '../theme/emergencyTheme';
import { useEmergencyHaptics } from '../hooks/useEmergencyHaptics';
import { EmergencyLens } from './EmergencyLens';
import { EmergencyCommand } from './EmergencyCommand';
import { ResponsePath } from './ResponsePath';
import type { ResponseTerritoryDefinition } from './ResponseTerritory';

export type EmergencyState =
  | 'CHOOSING'
  | 'RESPONSE_SELECTED'
  | 'SENDING'
  | 'ACTIVE'
  | 'ACKNOWLEDGED'
  | 'FAILED'
  | 'CANCELLED';

interface EmergencyExperienceProps {
  visible: boolean;
  onClose: () => void;
}

export function EmergencyExperience({ visible, onClose }: EmergencyExperienceProps) {
  const copy = useMessages().resident.emergency.crisis;
  const session = useAuthSession().session;
  const { activeContext } = useActiveResidentHome();
  const context = useSosResidenceContext();
  const recipientResolution = useSosRecipientResolution(context);
  const haptics = useEmergencyHaptics();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [state, setState] = useState<EmergencyState>('CHOOSING');
  const [selectedType, setSelectedType] = useState<SosType>('generalEmergency');
  const [event, setEvent] = useState<SosEvent | null>(null);

  const definitions = useMemo<ResponseTerritoryDefinition[]>(() => [
    { type: 'medical', label: copy.medicalLabel, shortDesc: copy.medicalDescription, requestLabel: copy.requestMedical, icon: 'medical', accentColor: emergencyTheme.medical },
    { type: 'fire', label: copy.fireLabel, shortDesc: copy.fireDescription, requestLabel: copy.requestFire, icon: 'flame', accentColor: emergencyTheme.fire },
    { type: 'securityThreat', label: copy.securityLabel, shortDesc: copy.securityDescription, requestLabel: copy.requestSecurity, icon: 'shield', accentColor: emergencyTheme.security },
    { type: 'liftStuck', label: copy.liftLabel, shortDesc: copy.liftDescription, requestLabel: copy.requestLift, icon: 'swap-vertical', accentColor: emergencyTheme.lift },
    { type: 'seniorHelp', label: copy.careLabel, shortDesc: copy.careDescription, requestLabel: copy.requestCare, icon: 'heart', accentColor: emergencyTheme.care },
    { type: 'generalEmergency', label: copy.genericLabel, shortDesc: copy.genericDescription, requestLabel: copy.requestSos, icon: 'alert', accentColor: emergencyTheme.core },
  ], [copy]);

  const selectedDef = definitions.find((d) => d.type === selectedType) ?? definitions[5]!;

  const loadActiveEvent = useCallback(async () => {
    if (!context) return;
    const active = await sosEventRepository.getActiveSosEvent(context);
    if (active) {
      setEvent(active);
      setSelectedType(active.sosType);
      const isAck = active.status === 'acknowledged' || active.status === 'responderDispatched' || active.status === 'responderReached' || active.status === 'underControl';
      setState(isAck ? 'ACKNOWLEDGED' : 'ACTIVE');
    }
  }, [context]);

  useEffect(() => {
    if (!visible) return;
    void loadActiveEvent();
    AccessibilityInfo.announceForAccessibility(copy.title);
  }, [copy.title, loadActiveEvent, visible]);

  // Poll for simulated recipient delivery and acknowledgement
  useEffect(() => {
    const eventId = event?.id;
    if (!visible || !eventId || (state !== 'ACTIVE' && state !== 'ACKNOWLEDGED')) return;
    const interval = setInterval(async () => {
      const fresh = await sosEventRepository.getSosEvent(eventId);
      if (fresh) {
        setEvent(fresh);
        const isAck = fresh.status === 'acknowledged' || fresh.status === 'responderDispatched' || fresh.status === 'responderReached' || fresh.status === 'underControl';
        if (isAck && state !== 'ACKNOWLEDGED') {
          setState('ACKNOWLEDGED');
          haptics.triggerSuccess();
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [event?.id, haptics, state, visible]);

  // Back button handling
  useEffect(() => {
    if (!visible) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (state === 'RESPONSE_SELECTED' || state === 'FAILED') {
        setState('CHOOSING');
      } else if (state !== 'SENDING') {
        onClose();
      }
      return true;
    });
    return () => subscription.remove();
  }, [onClose, state, visible]);

  const handleSelectType = (type: SosType) => {
    haptics.triggerSelection();
    setSelectedType(type);
    setState('RESPONSE_SELECTED');
    // Pre-resolve configured recipients
    void recipientResolution.resolve(type);
  };

  const handleSelectGenericSos = () => {
    haptics.triggerSelection();
    setSelectedType('generalEmergency');
    setState('RESPONSE_SELECTED');
    void recipientResolution.resolve('generalEmergency');
  };

  const handleSendRequest = async () => {
    if (!context) {
      setState('FAILED');
      return;
    }
    setState('SENDING');
    try {
      const resolution = await recipientResolution.resolve(selectedType);
      const created = await sosEventRepository.triggerSos({
        context,
        sosType: selectedType,
        triggeredByUserId: session?.userId ?? 'resident-current',
        triggeredByUserName: session?.name ?? 'Resident',
        isTestMode: false,
        resolvedRecipients: resolution.resolvedRecipients,
      });
      setEvent(created);
      setState('ACTIVE');
      haptics.triggerSuccess();
      AccessibilityInfo.announceForAccessibility(copy.sent);
    } catch {
      haptics.triggerError();
      setState('FAILED');
    }
  };

  const handleCancelRequest = async () => {
    if (!event) {
      onClose();
      return;
    }
    try {
      const cancelled = await sosEventRepository.cancelSos(event.id, copy.falseAlarmReason);
      setEvent(cancelled);
      setState('CANCELLED');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch {
      setState('FAILED');
    }
  };

  if (!visible) return null;

  const residenceLine = activeContext
    ? `${activeContext.societyName} · ${activeContext.displayUnitName}`
    : copy.residenceUnavailable;
  const residenceDetail = activeContext
    ? [activeContext.displayUnitName, activeContext.towerName ?? activeContext.wingName].filter(Boolean).join(' · ')
    : '';

  const displayUnit = activeContext?.displayUnitName || 'B-804';

  return (
    <View style={styles.root} accessibilityViewIsModal>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
        {/* 1. Tactical Minimal Top Area */}
        <View style={styles.topBar}>
          <View style={styles.headerRow}>
            <View style={styles.eyebrowRow}>
              <View style={styles.livePulseDot} />
              <SafeText variant="tiny" style={styles.eyebrowText}>
                {copy.eyebrow}
              </SafeText>
            </View>
          </View>
          {state !== 'SENDING' && (
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={state === 'ACTIVE' || state === 'ACKNOWLEDGED' ? copy.returnToApp : copy.cancel}
              style={styles.closeButton}
            >
              <SafeText variant="caption" style={styles.closeButtonText}>{state === 'ACTIVE' || state === 'ACKNOWLEDGED' ? copy.returnToApp : copy.cancel}</SafeText>
            </Pressable>
          )}
          <View style={styles.residenceBlock}>
            <SafeText variant="caption" style={styles.residenceText} numberOfLines={1}>{residenceLine.split(' · ')[0]}</SafeText>
            <SafeText variant="tiny" style={styles.residenceDetail} numberOfLines={2}>{residenceDetail || residenceLine}</SafeText>
          </View>
          <View style={styles.statusRow}>
            <View style={styles.simBadge}>
              <SafeText variant="tiny" style={styles.simBadgeText}>{copy.simulationMarker}</SafeText>
            </View>
          </View>
        </View>

        {/* 2. Responsive Content Container */}
        {isTablet ? (
          /* Tablet Dual-Region Crisis Workspace */
          <View style={styles.tabletWorkspace}>
            <View style={styles.tabletLeftRegion}>
              <EmergencyLens
                state={state}
                selectedType={selectedType}
                definitions={definitions}
                unitName={displayUnit}
                activeEvent={event}
                onSelectType={handleSelectType}
                onSelectGenericSos={handleSelectGenericSos}
              />
            </View>

            <View style={styles.tabletRightRegion}>
              <SafeText variant="h1" style={styles.primaryQuestion}>
                {state === 'CHOOSING' ? copy.title : selectedDef.label}
              </SafeText>
              <SafeText variant="body" style={styles.subQuestion}>
                {selectedDef.shortDesc}
              </SafeText>

              {state === 'RESPONSE_SELECTED' && recipientResolution.resolution?.resolvedRecipients ? (
                <ResponsePath
                  unitName={displayUnit}
                  recipients={recipientResolution.resolution.resolvedRecipients}
                  accentColor={selectedDef.accentColor}
                />
              ) : null}

              <EmergencyCommand
                state={state}
                requestLabel={selectedDef.requestLabel}
                accentColor={selectedDef.accentColor}
                onRequest={() => void handleSendRequest()}
                onChangeResponse={() => setState('CHOOSING')}
                onCancelRequest={() => void handleCancelRequest()}
                onReturnToHome={onClose}
                onRetry={() => void handleSendRequest()}
                onCallGateSecurity={() => {}}
              />
            </View>
          </View>
        ) : (
          /* Standard Phone Unified Spatial Lens View */
          <ScrollView
            contentContainerStyle={styles.phoneScrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Primary Human Question */}
            <View style={styles.questionSection}>
              <SafeText variant="h1" style={styles.primaryQuestion}>
                {state === 'CHOOSING'
                  ? copy.title
                  : state === 'ACTIVE' || state === 'ACKNOWLEDGED'
                  ? copy.liveResponseTitle
                  : selectedDef.label}
              </SafeText>
              <SafeText variant="body" style={styles.subQuestion}>
                {state === 'CHOOSING' ? copy.subtitle : selectedDef.shortDesc}
              </SafeText>
            </View>

            {/* Central Spatial Emergency Lens */}
            <EmergencyLens
              state={state}
              selectedType={selectedType}
              definitions={definitions}
              unitName={displayUnit}
              activeEvent={event}
              onSelectType={handleSelectType}
              onSelectGenericSos={handleSelectGenericSos}
            />

            {/* Configured Response Path (Revealed in Selection) */}
            {state === 'RESPONSE_SELECTED' && recipientResolution.resolution?.resolvedRecipients && (
              <View style={styles.responsePathSection}>
                <ResponsePath
                  unitName={displayUnit}
                  recipients={recipientResolution.resolution.resolvedRecipients}
                  accentColor={selectedDef.accentColor}
                />
              </View>
            )}

            {/* Contextual Command Bar */}
            <View style={styles.commandSection}>
              <EmergencyCommand
                state={state}
                requestLabel={selectedDef.requestLabel}
                accentColor={selectedDef.accentColor}
                onRequest={() => void handleSendRequest()}
                onChangeResponse={() => setState('CHOOSING')}
                onCancelRequest={() => void handleCancelRequest()}
                onReturnToHome={onClose}
                onRetry={() => void handleSendRequest()}
                onCallGateSecurity={() => {}}
              />
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: emergencyTheme.canvas,
    zIndex: 9999,
  },
  safe: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: emergencyTheme.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 72,
  },
  residenceBlock: {
    gap: 2,
    paddingRight: 72,
  },
  residenceDetail: {
    color: emergencyTheme.textSecondary,
    fontSize: 11,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: emergencyTheme.core,
  },
  eyebrowText: {
    color: emergencyTheme.core,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontSize: 10,
  },
  residenceText: {
    color: emergencyTheme.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  simBadge: {
    backgroundColor: emergencyTheme.simulatedBadge,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  simBadgeText: {
    color: emergencyTheme.textMuted,
    fontSize: 9,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    minWidth: 64,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: emergencyTheme.textSecondary,
    fontWeight: '600',
  },
  phoneScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    flexGrow: 0,
  },
  questionSection: {
    gap: 2,
    alignItems: 'center',
    paddingVertical: 4,
  },
  primaryQuestion: {
    color: emergencyTheme.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  subQuestion: {
    color: emergencyTheme.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  responsePathSection: {
    paddingVertical: 4,
  },
  commandSection: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  tabletWorkspace: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 24,
  },
  tabletLeftRegion: {
    flex: 5.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabletRightRegion: {
    flex: 4.5,
    justifyContent: 'center',
    gap: 16,
  },
});
