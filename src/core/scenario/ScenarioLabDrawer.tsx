import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../shared/components/SafeText';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { ScenarioOrchestrator } from './ScenarioOrchestrator';
import { scenarioPresets } from './scenarioPresets';
import type { ScenarioPresetId, ScenarioNetworkState } from './scenario.types';
import { AppClock } from '../clock/AppClock';
import { AppLifecycleCoordinator } from '../lifecycle/AppLifecycleCoordinator';
import { HapticFeedback } from '../../shared/utils/haptics';
import { AppModal } from '../../ui/modal/AppModal';
import { parkingMockSource } from '../../modules/resident/parking/data/parking.mockSource';

export interface ScenarioLabDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function ScenarioLabDrawer({ visible, onClose }: ScenarioLabDrawerProps) {
  const { colors } = useAppTheme();
  const [currentScenario, setCurrentScenario] = useState(() => ScenarioOrchestrator.getCurrentScenario());
  const [clockIso, setClockIso] = useState(() => AppClock.iso());
  const [network, setNetwork] = useState<ScenarioNetworkState>(() => ScenarioOrchestrator.getNetworkState());

  useEffect(() => {
    const unsubScenario = ScenarioOrchestrator.subscribe((sc) => {
      setCurrentScenario(sc);
      setNetwork(sc.networkState);
    });
    const unsubClock = AppClock.subscribe(() => {
      setClockIso(AppClock.iso());
    });

    return () => {
      unsubScenario();
      unsubClock();
    };
  }, []);

  const handleSelectPreset = (presetId: ScenarioPresetId) => {
    HapticFeedback.medium();
    ScenarioOrchestrator.applyPreset(presetId);
  };

  const handleSetNetwork = (net: ScenarioNetworkState) => {
    HapticFeedback.light();
    ScenarioOrchestrator.setNetworkState(net);
  };

  const presetList = Object.values(scenarioPresets);

  return (
    <AppModal visible={visible} onClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.drawer, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="flask-outline" size={22} color={colors.primary} />
              <View>
                <SafeText variant="bodyStrong" color="primary">SocietyOS Scenario Lab</SafeText>
                <SafeText variant="tiny" color="muted">Deterministic Cross-App Orchestration</SafeText>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Active Status Badge */}
            <View style={[styles.activeCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <SafeText variant="caption" color="muted">CURRENT SCENARIO</SafeText>
              <SafeText variant="bodyStrong" color="primary">{currentScenario.name}</SafeText>
              <SafeText variant="tiny" color="muted" style={{ marginTop: 2 }}>{currentScenario.description}</SafeText>
              <View style={styles.metaRow}>
                <View style={styles.metaBadge}>
                  <SafeText variant="tiny" style={{ color: colors.primary, fontWeight: '700' }}>
                    ROLE: {currentScenario.role.toUpperCase()}
                  </SafeText>
                </View>
                <View style={styles.metaBadge}>
                  <SafeText variant="tiny" style={{ color: '#D97706', fontWeight: '700' }}>
                    STATUS: {currentScenario.membershipStatus}
                  </SafeText>
                </View>
              </View>
            </View>

            {/* Time Travel Controls */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="time-outline" size={16} color={colors.textPrimary} />
                <SafeText variant="caption" color="primary" style={{ fontWeight: '700' }}>
                  Time Travel (Central App Clock)
                </SafeText>
              </View>
              <SafeText variant="tiny" color="muted" style={{ marginBottom: 6 }}>
                Simulated Clock: {clockIso}
              </SafeText>
              <View style={styles.timeButtonsRow}>
                <Pressable
                  onPress={() => ScenarioOrchestrator.advanceClockMinutes(15)}
                  style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <SafeText variant="tiny" color="primary">+15m</SafeText>
                </Pressable>
                <Pressable
                  onPress={() => ScenarioOrchestrator.advanceClockMinutes(60)}
                  style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <SafeText variant="tiny" color="primary">+1h</SafeText>
                </Pressable>
                <Pressable
                  onPress={() => ScenarioOrchestrator.advanceClockDays(1)}
                  style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <SafeText variant="tiny" color="primary">+1d (Midnight)</SafeText>
                </Pressable>
                <Pressable
                  onPress={() => ScenarioOrchestrator.advanceClockDays(7)}
                  style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <SafeText variant="tiny" color="primary">+7d</SafeText>
                </Pressable>
                <Pressable
                  onPress={() => ScenarioOrchestrator.resetClock()}
                  style={[styles.timeBtn, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: colors.danger }]}
                >
                  <SafeText variant="tiny" style={{ color: colors.danger }}>Reset</SafeText>
                </Pressable>
              </View>
            </View>

            {/* Network State Controls */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="wifi-outline" size={16} color={colors.textPrimary} />
                <SafeText variant="caption" color="primary" style={{ fontWeight: '700' }}>
                  Network Simulation
                </SafeText>
              </View>
              <View style={styles.networkButtonsRow}>
                {(['online', 'slow', 'offline', 'error_inject'] as ScenarioNetworkState[]).map((net) => (
                  <Pressable
                    key={net}
                    onPress={() => handleSetNetwork(net)}
                    style={[
                      styles.networkBtn,
                      {
                        backgroundColor: network === net ? colors.primary : colors.background,
                        borderColor: network === net ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <SafeText
                      variant="tiny"
                      style={{ color: network === net ? '#FFF' : colors.textPrimary, fontWeight: '700' }}
                    >
                      {net.toUpperCase()}
                    </SafeText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Lifecycle Interruptions */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="swap-vertical-outline" size={16} color={colors.textPrimary} />
                <SafeText variant="caption" color="primary" style={{ fontWeight: '700' }}>
                  App Lifecycle Simulation
                </SafeText>
              </View>
              <View style={styles.timeButtonsRow}>
                <Pressable
                  onPress={() => {
                    HapticFeedback.light();
                    AppLifecycleCoordinator.simulateBackground();
                  }}
                  style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <SafeText variant="tiny" color="primary">Background App</SafeText>
                </Pressable>
                <Pressable
                  onPress={() => {
                    HapticFeedback.success();
                    AppLifecycleCoordinator.simulateResume();
                  }}
                  style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <SafeText variant="tiny" color="primary">Resume & Reconcile</SafeText>
                </Pressable>
              </View>
            </View>

            {/* Mobility Gate Simulation */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="car-outline" size={16} color={colors.textPrimary} />
                <SafeText variant="caption" color="primary" style={{ fontWeight: '700' }}>
                  Mobility Gate Events (Simulated)
                </SafeText>
              </View>
              <View style={styles.timeButtonsRow}>
                <Pressable
                  onPress={() => {
                    HapticFeedback.success();
                    parkingMockSource.simulateVehicleGateEvent('honda', 'ENTRY', 'Gate 2');
                  }}
                  style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <SafeText variant="tiny" color="primary">Honda City Enter (Gate 2)</SafeText>
                </Pressable>
                <Pressable
                  onPress={() => {
                    HapticFeedback.warning();
                    parkingMockSource.simulateVehicleGateEvent('honda', 'EXIT', 'Gate 2');
                  }}
                  style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <SafeText variant="tiny" color="primary">Honda City Exit (Gate 2)</SafeText>
                </Pressable>
              </View>

              {/* Society Policy Configuration Switcher */}
              <View style={[styles.timeButtonsRow, { marginTop: 6 }]}>
                <Pressable
                  onPress={() => {
                    HapticFeedback.light();
                    parkingMockSource.setSocietyAllocationPolicy('FIXED_ALLOTMENT');
                  }}
                  style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <SafeText variant="tiny" color="primary">Policy: Fixed Bay</SafeText>
                </Pressable>
                <Pressable
                  onPress={() => {
                    HapticFeedback.light();
                    parkingMockSource.setSocietyAllocationPolicy('OPEN_COMMON_POOL');
                  }}
                  style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <SafeText variant="tiny" color="primary">Policy: Common Pool</SafeText>
                </Pressable>
                <Pressable
                  onPress={() => {
                    HapticFeedback.light();
                    parkingMockSource.setSocietyAllocationPolicy('MECHANICAL_STACK');
                  }}
                  style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <SafeText variant="tiny" color="primary">Policy: Stack</SafeText>
                </Pressable>
                <Pressable
                  onPress={() => {
                    HapticFeedback.light();
                    parkingMockSource.setSocietyAllocationPolicy('NO_PARKING_SOCIETY');
                  }}
                  style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <SafeText variant="tiny" color="primary">Policy: No Allotment</SafeText>
                </Pressable>
              </View>
            </View>

            {/* Scenario Presets */}
            <View style={styles.section}>
              <SafeText variant="caption" color="primary" style={{ fontWeight: '700', marginBottom: 8 }}>
                Curated Scenario Presets (22 Scenarios)
              </SafeText>
              <View style={styles.presetsList}>
                {presetList.map((preset) => {
                  const isSelected = currentScenario.id === preset.id;
                  return (
                    <Pressable
                      key={preset.id}
                      onPress={() => handleSelectPreset(preset.id as ScenarioPresetId)}
                      style={[
                        styles.presetCard,
                        {
                          backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.12)' : colors.background,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <View style={styles.presetTopRow}>
                        <SafeText variant="caption" color="primary" style={{ fontWeight: '700' }}>
                          {preset.name}
                        </SafeText>
                        <SafeText variant="tiny" color="muted">
                          {preset.category.toUpperCase()}
                        </SafeText>
                      </View>
                      <SafeText variant="tiny" color="muted" numberOfLines={2}>
                        {preset.description}
                      </SafeText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  drawer: {
    height: '82%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    flex: 1,
    paddingTop: 12,
  },
  activeCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  metaBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  timeButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  timeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  networkButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  networkBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  presetsList: {
    gap: 8,
    paddingBottom: 40,
  },
  presetCard: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  presetTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
});
