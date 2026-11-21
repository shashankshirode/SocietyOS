import type { ResidentDashboardData, HomeActivityItem, ActivityModule } from './dashboard.types';
import type { Absent } from '../../../../shared/types/absence.types';

export type PulseScope = 'now' | 'today' | 'week';
export type PulseAttentionLevel = 'normal' | 'information' | 'attention' | 'critical';
export type PulseTemporalRegion = 'now' | 'soon' | 'today' | 'later';
export type PulseCategory = ActivityModule | 'parcel' | 'domesticHelp' | 'parking';

export type PulseSignal = {
  id: string;
  category: PulseCategory;
  title: string;
  shortTitle: string;
  timeLabel: string;
  contextLabel: string;
  timestamp?: string;
  attentionLevel: PulseAttentionLevel;
  requiresAction: boolean;
  priority: number;
  icon: string;
  target: ActivityModule;
  temporalRegion: PulseTemporalRegion;
  sourceItems: readonly HomeActivityItem[];
};

const categoryPriority: Record<ActivityModule, number> = {
  emergency: 100,
  complaint: 90,
  billing: 80,
  visitor: 70,
  notice: 60,
  facility: 50,
  document: 40,
  residentConnect: 30,
};

const categoryIcon: Record<ActivityModule, string> = {
  emergency: 'warning-outline',
  complaint: 'construct-outline',
  billing: 'wallet-outline',
  visitor: 'person-outline',
  notice: 'megaphone-outline',
  facility: 'calendar-outline',
  document: 'document-text-outline',
  residentConnect: 'people-outline',
};

function compactTimeLabel(label: string): string {
  return label
    .replace(/minutes? ago/i, 'min')
    .replace(/hours? ago/i, 'hr')
    .replace(/days? ago/i, 'days')
    .replace(/^about\s+/i, '');
}

function visitorShortTitle(title: string): string {
  const namedPass = title.match(/(?:pass (?:created|ready) for|visit approved for)\s+(.+)/i);
  if (namedPass?.[1]) return `${namedPass[1].trim().split(/\s+/)[0]} pass`;
  const serviceVisit = title.match(/^(.+?) visit approved/i);
  if (serviceVisit?.[1]) return `${serviceVisit[1].trim()} visit`;
  return title.replace(/^Visitor\s+/i, '').replace(/\s+(?:is )?(?:expected|arriving)$/i, '').slice(0, 28);
}

function shortTitleFor(item: HomeActivityItem): string {
  if (item.module === 'visitor') return visitorShortTitle(item.title);
  if (item.module === 'billing') {
    const amount = item.description.match(/₹[\d,]+/i)?.[0];
    if (amount) return `${amount} due`;
  }
  if (item.module === 'notice') return item.title.replace(/\s+(?:acknowledged|published)$/i, '').slice(0, 28);
  if (item.module === 'facility') return item.title.replace(/\s+(?:court )?booked$/i, '').slice(0, 28);
  if (item.module === 'complaint') return item.title.replace(/^Complaint\s+/i, '').slice(0, 28);
  return item.title.slice(0, 28);
}

function temporalRegionFor(item: HomeActivityItem): PulseTemporalRegion {
  const value = `${item.timestampLabel} ${item.dateGroupLabel ?? ''}`.toLowerCase();
  const minuteMatch = value.match(/(\d+)\s*(?:min|minute)/);
  const hourMatch = value.match(/(\d+)\s*(?:hr|hour)/);
  if (value.includes('now') || value.includes('at gate') || (minuteMatch && Number(minuteMatch[1]) <= 60) || (hourMatch && Number(hourMatch[1]) <= 2)) return 'now';
  if (value.includes('today') || /^\d{1,2}:\d{2}/.test(value) || /\b(?:am|pm)\b/.test(value)) return 'today';
  if (value.includes('tomorrow') || value.includes('yesterday')) return 'soon';
  return 'later';
}

function attentionFor(item: HomeActivityItem): PulseAttentionLevel {
  if (item.module === 'emergency') return 'critical';
  if (item.module === 'complaint' || /overdue|required|waiting|expir|due\b/i.test(`${item.title} ${item.description}`)) return 'attention';
  if (item.module === 'billing' || item.module === 'notice') return 'information';
  return 'normal';
}

function requiresActionFor(item: HomeActivityItem): boolean {
  return item.module === 'emergency' || /required|waiting|overdue|due\b|expir|confirm|acknowledg/i.test(`${item.title} ${item.description}`);
}

export function normalizePulseSignal(item: HomeActivityItem, index = 0): PulseSignal {
  const requiresAction = requiresActionFor(item);
  const attentionLevel = attentionFor(item);
  return {
    id: item.id,
    category: item.module,
    title: item.title,
    shortTitle: shortTitleFor(item),
    timeLabel: compactTimeLabel(item.timestampLabel),
    contextLabel: item.description.split(' · ')[0]?.trim() ?? item.description,
    attentionLevel,
    requiresAction,
    priority: categoryPriority[item.module] + (requiresAction ? 18 : 0) + (attentionLevel === 'critical' ? 30 : 0) - Math.min(index, 20),
    icon: categoryIcon[item.module],
    target: item.module,
    temporalRegion: temporalRegionFor(item),
    sourceItems: [item],
  };
}

function currentBillActivity(dashboard: ResidentDashboardData): HomeActivityItem | Absent {
  const payment = dashboard.maintenancePayment;
  if (payment.status === 'paid') return undefined;
  const amount = payment.totalOutstanding ?? payment.billAmount;
  const dueLabel = payment.dueDateLabel ?? (payment.dueInDays <= 0 ? 'Overdue' : payment.dueInDays === 1 ? 'Tomorrow' : `In ${payment.dueInDays} days`);
  return {
    id: `pulse-bill-${payment.billId ?? payment.billingMonth}`,
    title: `₹${Math.round(amount).toLocaleString('en-IN')} due`,
    description: `Maintenance · ${payment.status}`,
    module: 'billing',
    timestampLabel: dueLabel,
    dateGroupLabel: payment.dueInDays <= 7 ? 'This week' : 'Later',
  };
}

function noticeActivities(dashboard: ResidentDashboardData): HomeActivityItem[] {
  return dashboard.notices
    .filter((notice) => notice.acknowledgementStatus === 'pending' || notice.category === 'emergency')
    .map((notice) => ({
      id: `pulse-notice-${notice.id}`,
      title: notice.title,
      description: notice.acknowledgementStatus === 'pending' ? 'Needs acknowledgement' : notice.summary ?? 'Safety notice',
      module: 'notice' as const,
      timestampLabel: notice.publishedAtLabel || 'Today',
      dateGroupLabel: 'Today',
    }));
}

function activeVisitorActivities(dashboard: ResidentDashboardData): HomeActivityItem[] {
  return dashboard.visitorTimeline
    .filter((visitor) => ['upcoming', 'waitingAtGate', 'inside', 'exitConfirmationRequired'].includes(visitor.status))
    .map((visitor) => ({
      id: `pulse-visitor-${visitor.id}`,
      title: visitor.status === 'waitingAtGate' ? `${visitor.visitorName} is at the gate` : `${visitor.visitorName} pass`,
      description: `${visitor.purpose} · ${visitor.gateName}`,
      module: 'visitor' as const,
      timestampLabel: visitor.status === 'waitingAtGate' ? 'Now' : visitor.enteredAtLabel ?? visitor.validFrom,
      dateGroupLabel: 'Today',
    }));
}

export function createResidencePulseSignals(dashboard: ResidentDashboardData): PulseSignal[] {
  const bill = currentBillActivity(dashboard);
  const generated: HomeActivityItem[] = [
    ...noticeActivities(dashboard),
    ...activeVisitorActivities(dashboard),
    ...(bill ? [bill] : []),
  ];
  const generatedModules = new Set(generated.map((item) => item.module));
  const source = [
    ...generated,
    ...dashboard.activities.filter((item) => !generatedModules.has(item.module)),
  ];
  const unique = source.filter((item, index) => source.findIndex((candidate) => candidate.id === item.id) === index);
  return unique.map(normalizePulseSignal).sort((left, right) => right.priority - left.priority);
}

export function scopePulseSignals(signals: readonly PulseSignal[], scope: PulseScope): PulseSignal[] {
  if (scope === 'week') return [...signals];
  if (scope === 'today') return signals.filter((signal) => signal.temporalRegion !== 'later');
  return signals.filter((signal) => signal.temporalRegion === 'now');
}
