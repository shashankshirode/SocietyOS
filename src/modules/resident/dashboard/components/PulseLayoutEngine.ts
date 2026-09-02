import type { PulseScope, PulseSignal, PulseTemporalRegion } from '../data/pulseSignal.model';

export type PulseDensityMode = 'calm' | 'full' | 'selective' | 'summary' | 'highActivity';
export type PulseGroupKey = 'attention' | 'arrivals' | 'money' | 'later' | 'community' | 'overflow';
export type PulseLabelAnchor = 'left' | 'right' | 'above' | 'below' | 'outerLeft' | 'outerRight';

export type PulseDisplaySignal = PulseSignal & {
  sourceSignals: readonly PulseSignal[];
  groupKey?: PulseGroupKey;
};

export type PulseSignalLayout = PulseDisplaySignal & {
  ring: PulseTemporalRegion;
  nodeX: number;
  nodeY: number;
  labelX?: number;
  labelY?: number;
  labelWidth: number;
  labelHeight: number;
  labelAnchor?: PulseLabelAnchor;
  connectorLength: number;
  showLabel: boolean;
};

export type PulseLayoutResult = {
  density: PulseDensityMode;
  size: number;
  signals: PulseSignalLayout[];
  hiddenCount: number;
  labelCount: number;
};

export type PulseReservedBox = { x: number; y: number; width: number; height: number };
type Box = PulseReservedBox;

const regionRadius: Record<PulseTemporalRegion, number> = {
  now: 0.2,
  soon: 0.285,
  today: 0.37,
  later: 0.455,
};

export function rankPulseSignals(signals: readonly PulseSignal[]): PulseSignal[] {
  return [...signals].sort((left, right) => right.priority - left.priority || left.id.localeCompare(right.id));
}

export function resolvePulseDensity(signalCount: number, _availableWidth: number, expanded = false): PulseDensityMode {
  if (signalCount === 0) return 'calm';
  if (signalCount <= 3) return 'full';
  if (signalCount <= 6) return 'selective';
  if (expanded ? signalCount <= 12 : signalCount < 10) return 'summary';
  return 'highActivity';
}

function groupKey(signal: PulseSignal): Exclude<PulseGroupKey, 'overflow'> {
  if (signal.attentionLevel === 'critical' || signal.category === 'complaint') return 'attention';
  if (signal.category === 'visitor' || signal.category === 'domesticHelp' || signal.category === 'parcel') return 'arrivals';
  if (signal.category === 'billing') return 'money';
  if (signal.category === 'notice' || signal.category === 'residentConnect') return 'community';
  return 'later';
}

function groupedSignal(key: PulseGroupKey, sourceSignals: readonly PulseSignal[]): PulseDisplaySignal {
  const source = sourceSignals[0];
  const count = sourceSignals.length;
  const titleByGroup: Record<PulseGroupKey, string> = {
    attention: `${count} need you`,
    arrivals: 'VISITORS',
    money: `MONEY · ${count}`,
    community: 'COMMUNITY',
    later: `+${count} later`,
    overflow: `+${count} later`,
  };
  const timeByGroup: Record<PulseGroupKey, string> = {
    attention: 'Attention',
    arrivals: `${count} today`,
    money: `${count} ${count === 1 ? 'item' : 'items'}`,
    community: `${count} updates`,
    later: 'Later',
    overflow: 'Later',
  };
  const fallback: PulseSignal = {
    id: `pulse-${key}`,
    category: 'notice',
    title: titleByGroup[key],
    shortTitle: titleByGroup[key],
    timeLabel: timeByGroup[key],
    contextLabel: '',
    attentionLevel: 'normal',
    requiresAction: false,
    priority: 0,
    icon: 'ellipse-outline',
    target: 'notice',
    temporalRegion: 'later',
    sourceItems: [],
  };
  return {
    ...(source ?? fallback),
    id: `pulse-group-${key}`,
    title: titleByGroup[key],
    shortTitle: titleByGroup[key],
    timeLabel: timeByGroup[key],
    contextLabel: '',
    priority: Math.max(...sourceSignals.map((signal) => signal.priority), 0),
    temporalRegion: key === 'attention' ? 'now' : source?.temporalRegion ?? 'later',
    sourceItems: sourceSignals.flatMap((signal) => signal.sourceItems),
    sourceSignals,
    groupKey: key,
  };
}

function representativeSignals(signals: readonly PulseSignal[], density: PulseDensityMode, compact: boolean): { signals: PulseDisplaySignal[]; hiddenCount: number } {
  const ranked = rankPulseSignals(signals);
  const individual = (signal: PulseSignal): PulseDisplaySignal => ({ ...signal, sourceSignals: [signal] });
  if (density === 'calm' || density === 'full' || density === 'selective') return { signals: ranked.map(individual), hiddenCount: 0 };
  if (density === 'summary') {
    const visibleLimit = compact ? 3 : 4;
    const visible = ranked.slice(0, visibleLimit).map(individual);
    const hidden = ranked.slice(visibleLimit);
    return hidden.length === 0
      ? { signals: visible, hiddenCount: 0 }
      : { signals: [...visible, groupedSignal('overflow', hidden)], hiddenCount: hidden.length };
  }

  const representativeLimit = compact ? 2 : 3;
  const visible = ranked.slice(0, representativeLimit).map(individual);
  const remainder = ranked.slice(representativeLimit);
  const grouped = new Map<Exclude<PulseGroupKey, 'overflow'>, PulseSignal[]>();
  remainder.forEach((signal) => {
    const key = groupKey(signal);
    grouped.set(key, [...(grouped.get(key) ?? []), signal]);
  });
  const room = compact ? 1 : 2;
  const groups = [...grouped.entries()]
    .map(([key, sourceSignals]) => groupedSignal(key, sourceSignals))
    .sort((left, right) => right.priority - left.priority)
    .slice(0, room);
  const representedIds = new Set(groups.flatMap((group) => group.sourceSignals.map((signal) => signal.id)));
  const unrepresented = remainder.filter((signal) => !representedIds.has(signal.id));
  return {
    signals: [...visible, ...groups, ...(unrepresented.length > 0 ? [groupedSignal('overflow', unrepresented)] : [])],
    hiddenCount: unrepresented.length,
  };
}

function intersects(left: Box, right: Box, gap = 7): boolean {
  return left.x < right.x + right.width + gap
    && left.x + left.width + gap > right.x
    && left.y < right.y + right.height + gap
    && left.y + left.height + gap > right.y;
}

function labelCandidates(nodeX: number, nodeY: number, width: number, height: number, canvasSize: number): { box: Box; anchor: PulseLabelAnchor; connectorLength: number }[] {
  const offset = 14;
  const outerOffset = 26;
  const preferRight = nodeX >= canvasSize / 2;
  const right = { box: { x: nodeX + offset, y: nodeY - height / 2, width, height }, anchor: 'right' as const, connectorLength: offset };
  const left = { box: { x: nodeX - width - offset, y: nodeY - height / 2, width, height }, anchor: 'left' as const, connectorLength: offset };
  const outerRight = { box: { x: nodeX + outerOffset, y: nodeY - height / 2, width, height }, anchor: 'outerRight' as const, connectorLength: outerOffset };
  const outerLeft = { box: { x: nodeX - width - outerOffset, y: nodeY - height / 2, width, height }, anchor: 'outerLeft' as const, connectorLength: outerOffset };
  return [
    ...(preferRight ? [right, left] : [left, right]),
    { box: { x: nodeX - width / 2, y: nodeY - height - offset, width, height }, anchor: 'above', connectorLength: offset },
    { box: { x: nodeX - width / 2, y: nodeY + offset, width, height }, anchor: 'below', connectorLength: offset },
    ...(preferRight ? [outerRight, outerLeft] : [outerLeft, outerRight]),
  ];
}

function inside(box: Box, size: number, safe = 8): boolean {
  return box.x >= safe && box.y >= safe && box.x + box.width <= size - safe && box.y + box.height <= size - safe;
}

function labelLimitFor(density: PulseDensityMode, count: number, compact: boolean): number {
  if (density === 'full') return count;
  if (density === 'selective') return compact ? 3 : 4;
  if (density === 'summary') return compact ? 3 : 4;
  if (density === 'highActivity') return compact ? 4 : 5;
  return 0;
}

export function resolvePulseLayout(
  inputSignals: readonly PulseSignal[],
  availableWidth: number,
  expanded = false,
  scope: PulseScope = 'today',
  reservedBoxes: readonly PulseReservedBox[] = [],
  selectedId?: string,
): PulseLayoutResult {
  const compact = availableWidth < 300;
  const density = resolvePulseDensity(inputSignals.length, availableWidth, expanded);
  const maxSize = expanded ? (availableWidth >= 720 ? 560 : availableWidth >= 480 ? 460 : 360) : (compact ? 252 : 320);
  const size = Math.max(200, Math.min(availableWidth, maxSize));
  const { signals: displaySignals, hiddenCount } = representativeSignals(inputSignals, density, compact);
  const labelLimit = labelLimitFor(density, displaySignals.length, compact);
  const center = size / 2;
  const centerSize = expanded ? 76 : 64;
  const centerExclusion: Box = { x: center - centerSize / 2 - 8, y: center - centerSize / 2 - 8, width: centerSize + 16, height: centerSize + 16 };
  const occupied: Box[] = [centerExclusion, ...reservedBoxes];
  const angleOffsetByScope: Record<PulseScope, number> = { now: -90, today: -142, week: -118 };
  const angleOffset = !expanded && (density === 'summary' || density === 'highActivity') ? 30 : angleOffsetByScope[scope];
  const angleStep = 360 / Math.max(displaySignals.length, 1);

  const signals = displaySignals.map((signal, index): PulseSignalLayout => {
    const angle = (angleOffset + index * angleStep) * (Math.PI / 180);
    const radius = size * regionRadius[signal.temporalRegion];
    const nodeX = center + Math.cos(angle) * radius;
    const nodeY = center + Math.sin(angle) * radius;
    const denseCompact = !expanded && (density === 'summary' || density === 'highActivity');
    const labelWidth = Math.min(expanded ? 150 : denseCompact ? 104 : 116, Math.max(denseCompact ? 84 : 94, signal.shortTitle.length * 6.2 + 18));
    const labelHeight = expanded ? 54 : denseCompact ? 44 : 48;
    const selected = signal.sourceSignals.some((source) => source.id === selectedId);
    const placement = index < labelLimit || selected
      ? labelCandidates(nodeX, nodeY, labelWidth, labelHeight, size).find(({ box }) => inside(box, size) && occupied.every((other) => !intersects(box, other)))
      : undefined;
    if (placement) occupied.push(placement.box);
    return {
      ...signal,
      ring: signal.temporalRegion,
      nodeX,
      nodeY,
      labelWidth,
      labelHeight,
      connectorLength: placement?.connectorLength ?? 0,
      showLabel: Boolean(placement),
      ...(placement ? { labelX: placement.box.x, labelY: placement.box.y, labelAnchor: placement.anchor } : {}),
    };
  });

  return { density, size, signals, hiddenCount, labelCount: signals.filter((signal) => signal.showLabel).length };
}
