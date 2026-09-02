import type { ActivityModule, HomeActivityItem } from '../data/dashboard.types';
import { normalizePulseSignal } from '../data/pulseSignal.model';
import { rankPulseSignals, resolvePulseDensity, resolvePulseLayout } from '../components/PulseLayoutEngine';

function activities(count: number) {
  const modules: ActivityModule[] = ['visitor', 'billing', 'complaint', 'notice', 'facility', 'document', 'residentConnect', 'emergency'];
  const times = ['15 minutes ago', 'Tomorrow', 'Today · 5:30 PM', 'Sunday'];
  return Array.from({ length: count }, (_, index): HomeActivityItem => ({
    id: `activity-${index}`,
    title: index === 0 ? 'Visitor pass created for Rajesh Kulkarni' : `Activity ${index}`,
    description: index === 1 ? '₹4,850 due by Sunday' : `Residence activity ${index}`,
    module: modules[index % modules.length] ?? 'notice',
    timestampLabel: times[index % times.length] ?? 'Today',
  })).map(normalizePulseSignal);
}

describe('PulseLayoutEngine', () => {
  it.each([[0, 'calm'], [1, 'full'], [2, 'full'], [3, 'full'], [5, 'selective'], [8, 'summary'], [12, 'highActivity'], [20, 'highActivity']] as const)('uses intentional compact density for %i events', (count, density) => {
    expect(resolvePulseDensity(count, 390)).toBe(density);
  });

  it('lets the expanded field retain individual summary behavior through 12 signals', () => {
    expect(resolvePulseDensity(12, 390, true)).toBe('summary');
  });

  it.each([0, 1, 2, 3, 5, 8, 12, 20])('keeps labels unclipped and collision-free for %i signals', (count) => {
    const layout = resolvePulseLayout(activities(count), 390, true, 'today');
    const labels = layout.signals.filter((signal) => signal.showLabel);
    labels.forEach((label) => {
      expect(label.labelX).toBeGreaterThanOrEqual(8);
      expect((label.labelX ?? 0) + label.labelWidth).toBeLessThanOrEqual(layout.size - 8);
      expect(label.labelY).toBeGreaterThanOrEqual(8);
      expect((label.labelY ?? 0) + label.labelHeight).toBeLessThanOrEqual(layout.size - 8);
    });
    labels.forEach((left, index) => labels.slice(index + 1).forEach((right) => {
      const overlaps = (left.labelX ?? 0) < (right.labelX ?? 0) + right.labelWidth + 6
        && (left.labelX ?? 0) + left.labelWidth + 6 > (right.labelX ?? 0)
        && (left.labelY ?? 0) < (right.labelY ?? 0) + right.labelHeight + 6
        && (left.labelY ?? 0) + left.labelHeight + 6 > (right.labelY ?? 0);
      expect(overlaps).toBe(false);
    }));
  });

  it('places immediate events closer to HOME than later events', () => {
    const layout = resolvePulseLayout(activities(4), 390, true, 'week');
    const center = layout.size / 2;
    const distance = (id: string) => {
      const signal = layout.signals.find((item) => item.id === id);
      return signal ? Math.hypot(signal.nodeX - center, signal.nodeY - center) : Number.POSITIVE_INFINITY;
    };
    expect(distance('activity-0')).toBeLessThan(distance('activity-3'));
  });

  it('keeps every small-state signal as a real labelled event', () => {
    const layout = resolvePulseLayout(activities(3), 390, true);
    expect(layout.signals).toHaveLength(3);
    expect(layout.signals.every((signal) => !signal.groupKey && signal.showLabel)).toBe(true);
    expect(layout.signals.some((signal) => signal.shortTitle.includes('Rajesh'))).toBe(true);
  });

  it('compresses 20 events into selectable groups backed by actual signals', () => {
    const layout = resolvePulseLayout(activities(20), 390, true, 'week');
    expect(layout.density).toBe('highActivity');
    expect(layout.signals.length).toBeLessThanOrEqual(6);
    layout.signals.filter((signal) => signal.groupKey).forEach((group) => expect(group.sourceSignals.length).toBeGreaterThan(0));
    expect(layout.signals.some((signal) => signal.groupKey === 'overflow' && signal.shortTitle.includes('later'))).toBe(true);
  });

  it('keeps meaningful labels visible in a standard phone dashboard field', () => {
    const layout = resolvePulseLayout(activities(12), 346, false, 'today', [{ x: 0, y: 0, width: 320, height: 54 }]);
    expect(layout.labelCount).toBeGreaterThanOrEqual(2);
    expect(layout.signals.slice(0, 2).every((signal) => signal.showLabel)).toBe(true);
  });

  it('ranks known actionable signals ahead of routine signals', () => {
    const ranked = rankPulseSignals(activities(8));
    expect(ranked[0]?.category).toBe('emergency');
  });
});
