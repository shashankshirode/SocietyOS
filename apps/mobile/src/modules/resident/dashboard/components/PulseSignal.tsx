import { Pressable, View } from 'react-native';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { residentColors } from '../../../../shared/theme/residentColors';
import type { PulseSignalLayout } from './PulseLayoutEngine';
import { createConnectorStyle, createHaloStyle, createLabelLayoutStyle, createLabelBackgroundStyle, createLabelSelectedStyle, createNodeLayoutStyle, createNodeStyle, createTextColorStyle, styles } from '../styles/components/PulseSignal.styles';

type PulseSignalProps = {
  signal: PulseSignalLayout;
  selected?: boolean;
  onPress?: () => void;
};

function signalColor(signal: PulseSignalLayout, semantic: ReturnType<typeof useAppTheme>['semantic']): string {
  if (signal.attentionLevel === 'critical' || signal.attentionLevel === 'attention') return semantic.accent.coral;
  if (signal.category === 'billing' || signal.category === 'notice') return semantic.accent.amber;
  if (signal.category === 'facility') return semantic.accent.lavender;
  return semantic.accent.sage;
}

export function PulseSignal({ signal, selected = false, onPress }: PulseSignalProps) {
  const { semantic } = useAppTheme();
  const color = signalColor(signal, semantic);
  const accessibilityLabel = `${signal.shortTitle}, ${signal.timeLabel}${signal.contextLabel ? `, ${signal.contextLabel}` : ''}`;
  return (
    <View style={styles.layer} pointerEvents="box-none">
      {signal.showLabel && signal.labelX !== undefined && signal.labelY !== undefined ? (
        <View
          style={[
            styles.label,
            selected && styles.labelSelected,
            selected && createLabelSelectedStyle(semantic.accent.moss),
            createLabelLayoutStyle(signal.labelX, signal.labelY, signal.labelWidth, signal.labelHeight),
          ]}
          pointerEvents="none"
        >
          <SafeText variant="tiny" style={[styles.title, createTextColorStyle(residentColors.brandInk)]} numberOfLines={1}>
            {signal.shortTitle}
          </SafeText>
          <SafeText variant="tiny" style={[styles.time, createTextColorStyle(color)]} numberOfLines={1}>
            {signal.timeLabel}
          </SafeText>
        </View>
      ) : null}
      {signal.showLabel && signal.labelAnchor ? <View style={[styles.connector, selected && styles.connectorSelected, createConnectorStyle(signal.nodeX, signal.nodeY, signal.labelAnchor, signal.connectorLength, color)]} pointerEvents="none" /> : null}
      <Pressable onPress={onPress} disabled={!onPress} accessibilityRole={onPress ? 'button' : undefined} accessibilityState={{ selected }} accessibilityLabel={accessibilityLabel} style={[styles.nodeTarget, createNodeLayoutStyle(signal.nodeX, signal.nodeY)]}>
        {selected ? <View style={[styles.nodeHalo, createHaloStyle(color)]} /> : null}
        <View style={[styles.node, createNodeStyle(color, selected)]} />
      </Pressable>
    </View>
  );
}
