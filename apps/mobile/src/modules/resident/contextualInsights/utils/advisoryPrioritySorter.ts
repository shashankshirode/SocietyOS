import type { LocalAreaAdvisory, ContextualInsightPriority } from '../data/residentContextualInsights.types';

const PRIORITY_ORDER: Record<ContextualInsightPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function sortAdvisories(advisories: LocalAreaAdvisory[]): LocalAreaAdvisory[] {
  return [...advisories].sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
}
