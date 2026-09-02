import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeText } from '../../../../shared/components/SafeText';
import { useMessages } from '../../../../shared/constants/useMessages';
import { useReducedMotion } from '../../../../shared/motion';
import { Motion } from '../../../../shared/theme/motion';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { includeWhenPresent } from '../../../../shared/utils/presentProperty';
import type { Absent } from '../../../../shared/types/absence.types';
import { AppModal } from '../../../../ui/modal';
import { DismissControl } from '../../../../ui/controls';
import { useResponsiveLayout } from '../../../../ui/layout/useResponsiveLayout';
import type { HomeActivityItem } from '../data/dashboard.types';
import { scopePulseSignals, type PulseScope, type PulseSignal } from '../data/pulseSignal.model';
import { ResidencePulseOrbit } from './ResidencePulseField';
import { createContentInsetStyle, createRootInsetStyle, styles } from '../styles/components/ResidencePulseExpanded.styles';

type ResidencePulseExpandedProps = {
  visible: boolean;
  unitLabel: string;
  signals: readonly PulseSignal[];
  billAmountLabel: string;
  billDue: boolean;
  onClose: () => void;
  onPay: () => void;
  onActivityPress?: (item: HomeActivityItem) => void;
  presentation?: 'modal' | 'screen';
};

function activityTone(item: PulseSignal): 'sage' | 'amber' | 'facility' {
  if (item.category === 'billing' || item.category === 'notice') return 'amber';
  if (item.category === 'facility') return 'facility';
  return 'sage';
}

export function ResidencePulseExpanded({ visible, unitLabel, signals, billAmountLabel, billDue, onClose, onPay, onActivityPress, presentation = 'modal' }: ResidencePulseExpandedProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const responsive = useResponsiveLayout();
  const messages = useMessages();
  const reducedMotion = useReducedMotion();
  const copy = messages.resident.dashboard.homeExperience;
  const [scope, setScope] = useState<PulseScope>('today');
  const visibleActivities = useMemo(() => scopePulseSignals(signals, scope), [scope, signals]);
  const firstActivityId = visibleActivities[0]?.id;
  const [selectedId, setSelectedId] = useState<string | Absent>(firstActivityId);
  const selectedActivity = visibleActivities.find((item) => item.id === selectedId) ?? visibleActivities[0];
  const twoPane = responsive.isFold || responsive.isTablet;
  const scopeOptions: { id: PulseScope; label: string }[] = [
    { id: 'now', label: copy.scopeNow },
    { id: 'today', label: copy.scopeToday },
    { id: 'week', label: copy.scopeWeek },
  ];

  useEffect(() => {
    if (visible) setSelectedId(firstActivityId);
  }, [firstActivityId, visible]);

  const focusAndTimeline = <View style={styles.contextPane}>
    {selectedActivity ? <Pressable onPress={() => selectedActivity.sourceItems[0] && onActivityPress?.(selectedActivity.sourceItems[0])} disabled={!onActivityPress || !selectedActivity.sourceItems[0]} style={styles.selectedSignal} accessibilityRole={onActivityPress ? 'button' : undefined}>
      <View style={styles.selectedSignalCopy}>
        <SafeText variant="tiny" style={styles.focusEyebrow}>{copy.focusSignal} · {selectedActivity.timeLabel}</SafeText>
        <SafeText variant="bodyStrong" style={styles.title}>{selectedActivity.title}</SafeText>
        <SafeText variant="caption" style={styles.muted}>{selectedActivity.contextLabel}</SafeText>
      </View>
      {onActivityPress ? <Ionicons name="arrow-forward" size={20} color={colors.textInverse} /> : null}
    </Pressable> : null}
    <View style={styles.narrative}>
      <SafeText variant="h2" style={styles.title}>{visibleActivities.length > 0 ? copy.activeTitle : copy.quietTitle}</SafeText>
      <SafeText variant="body" style={styles.muted}>{visibleActivities.length > 0 ? copy.activeDescription(visibleActivities.length) : copy.quietDescription}</SafeText>
    </View>
    <SafeText variant="tiny" style={styles.eyebrow}>{scope === 'week' ? copy.scopeWeek : copy.today}</SafeText>
    <View style={styles.timeline}>
      {visibleActivities.map((item, index) => <Animated.View key={item.id} {...includeWhenPresent('entering', reducedMotion ? undefined : FadeInDown.delay(Math.min(index, 8) * Motion.stagger.tight).duration(Motion.duration.normal))}>
        <Pressable onPress={() => setSelectedId(item.id)} style={[styles.timelineRow, selectedId === item.id && styles.timelineRowSelected]} accessibilityRole="button" accessibilityState={{ selected: selectedId === item.id }}>
          <View style={styles.timelineRail}><View style={[styles.timelineNode, styles[`timelineNode_${activityTone(item)}`]]} />{index < visibleActivities.length - 1 ? <View style={styles.timelineLine} /> : null}</View>
          <SafeText variant="caption" style={styles.time}>{item.timeLabel}</SafeText>
          <View style={styles.timelineCopy}><SafeText variant="bodyStrong" style={styles.title}>{item.title}</SafeText><SafeText variant="caption" style={styles.muted}>{item.contextLabel}</SafeText></View>
        </Pressable>
      </Animated.View>)}
    </View>
    {billDue ? <Pressable onPress={onPay} style={styles.financialCommand} accessibilityRole="button"><View><SafeText variant="tiny" style={styles.amber}>{copy.maintenance}</SafeText><SafeText variant="title" style={styles.title}>{copy.due(billAmountLabel)}</SafeText></View><SafeText variant="bodyStrong" style={styles.amber}>{copy.payNow} →</SafeText></Pressable> : null}
    <View style={styles.explanation}><SafeText variant="bodyStrong" style={styles.sage}>{copy.pulseExplanationTitle}</SafeText><SafeText variant="caption" style={styles.muted}>{copy.pulseExplanation}</SafeText></View>
  </View>;

  const content = <View style={[styles.root, createRootInsetStyle(presentation === 'modal' ? insets.top : 0)]}>
    <View style={styles.header}><View><SafeText variant="h1" style={styles.title}>{copy.pulseTitle}</SafeText><SafeText variant="caption" style={styles.muted}>{unitLabel}</SafeText></View>{presentation === 'modal' ? <DismissControl onPress={onClose} accessibilityLabel={copy.closePulse} variant="inverse" /> : null}</View>
    <ScrollView contentContainerStyle={[styles.content, twoPane && styles.contentWide, createContentInsetStyle(insets.bottom, presentation === 'screen')]} showsVerticalScrollIndicator={false}>
      <View style={[styles.environment, twoPane && styles.environmentWide]}>
        <View style={styles.pulsePane}>
          <View style={styles.scopeRail}>{scopeOptions.map((option) => <Pressable key={option.id} onPress={() => setScope(option.id)} style={[styles.scopeOption, scope === option.id && styles.scopeOptionSelected]} accessibilityRole="button" accessibilityState={{ selected: scope === option.id }}><SafeText variant="tiny" style={scope === option.id ? styles.scopeTextSelected : styles.muted}>{option.label}</SafeText></Pressable>)}</View>
          <View style={[styles.orbitWrap, twoPane && styles.orbitWrapWide]}><ResidencePulseOrbit state={visibleActivities.length > 0 ? 'active' : 'calm'} signals={visibleActivities} expanded scope={scope} {...includeWhenPresent('selectedId', selectedId)} onSignalPress={(signal) => setSelectedId(signal.sourceSignals[0]?.id)} /></View>
        </View>
        {focusAndTimeline}
      </View>
    </ScrollView>
  </View>;
  if (presentation === 'screen') return visible ? content : null;
  return <AppModal visible={visible} onClose={onClose} fullScreen showDragHandle={false} contentStyle={styles.modalContent}>{content}</AppModal>;
}
