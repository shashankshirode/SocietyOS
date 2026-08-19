import type { LocalAdvisoryType, ContextualInsightPriority, LocalAreaAdvisory, AppIconName } from '../data/residentContextualInsights.types';

export interface UserReportedAdvisoryInput {
  societyId: string;
  areaId: string;
  type: LocalAdvisoryType;
  priority: ContextualInsightPriority;
  title: string;
  description: string;
  durationHours: number;
  reporterRole: 'resident' | 'admin' | 'guard';
  reporterName: string;
}

export interface UserReportedAdvisory extends LocalAreaAdvisory {
  customTitle: string;
  customDescription: string;
  reporterRole: 'resident' | 'admin' | 'guard';
  reporterName: string;
  confirmationsCount: number;
  confirmedByUserIds: Set<string>;
  isVerified: boolean;
  autoIconName: AppIconName;
}

// Automatic icon mapping function - Users NEVER need to pick icons!
export function getAutoIconForCategory(type: LocalAdvisoryType, titleText = ''): AppIconName {
  const lowerTitle = titleText.toLowerCase();
  
  if (lowerTitle.includes('fire') || lowerTitle.includes('smoke')) return 'flame-outline';
  if (lowerTitle.includes('water') || lowerTitle.includes('leak') || type === 'waterlogging') return 'water-outline';
  if (lowerTitle.includes('lift') || lowerTitle.includes('elevator') || type === 'liftOutage') return 'arrow-down-outline';
  if (lowerTitle.includes('power') || lowerTitle.includes('electricity') || type === 'powerCut') return 'flash-outline';
  if (lowerTitle.includes('gate') || lowerTitle.includes('queue') || type === 'gateCongestion') return 'people-outline';
  if (lowerTitle.includes('road') || lowerTitle.includes('traffic') || type === 'roadBlock') return 'warning-outline';
  if (lowerTitle.includes('security') || lowerTitle.includes('guard') || type === 'securityAlert') return 'shield-outline';
  if (lowerTitle.includes('park') || type === 'parkingCongestion') return 'car-outline';
  if (type === 'maintenanceWork') return 'construct-outline';
  if (type === 'societyEvent') return 'calendar-outline';
  
  return 'information-circle-outline';
}

const userReportedAdvisories: UserReportedAdvisory[] = [];
const userLastReportTimestamp: Record<string, number> = {};

// Rate-limiting check: max 1 report every 30 seconds per user
export function checkReportRateLimit(userId: string): { allowed: boolean; waitSecondsRemaining: number } {
  const lastTime = userLastReportTimestamp[userId] || 0;
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - lastTime) / 1000);
  const minInterval = 30; // 30 seconds cooldown
  
  if (elapsedSeconds < minInterval) {
    return { allowed: false, waitSecondsRemaining: minInterval - elapsedSeconds };
  }
  return { allowed: true, waitSecondsRemaining: 0 };
}

export function addUserReportedAdvisory(input: UserReportedAdvisoryInput, userId: string): UserReportedAdvisory {
  const now = Date.now();
  userLastReportTimestamp[userId] = now;

  const id = `user-adv-${now}-${Math.random().toString(36).substr(2, 5)}`;
  const validUntilIso = new Date(now + input.durationHours * 3600 * 1000).toISOString();
  
  const source = input.reporterRole === 'admin' 
    ? 'societyAdmin' 
    : input.reporterRole === 'guard' 
    ? 'guardReport' 
    : 'residentReports';

  const isVerified = input.reporterRole === 'admin' || input.reporterRole === 'guard';
  const autoIconName = getAutoIconForCategory(input.type, input.title);

  const newAdvisory: UserReportedAdvisory = {
    id,
    societyId: input.societyId,
    areaId: input.areaId,
    type: input.type,
    priority: input.priority,
    titleMessageKey: input.title,
    descriptionMessageKey: input.description,
    shortSuggestionMessageKey: input.title,
    customTitle: input.title,
    customDescription: input.description,
    reportedAtIso: new Date(now).toISOString(),
    validUntilIso,
    source,
    reporterRole: input.reporterRole,
    reporterName: input.reporterName,
    confirmationsCount: isVerified ? 5 : 1,
    confirmedByUserIds: new Set([userId]),
    isVerified,
    autoIconName,
  };

  userReportedAdvisories.unshift(newAdvisory);
  return newAdvisory;
}

export function getUserReportedAdvisories(societyId?: string): UserReportedAdvisory[] {
  const now = Date.now();
  return userReportedAdvisories.filter((adv) => {
    const validUntil = new Date(adv.validUntilIso).getTime();
    if (validUntil < now) return false;
    if (societyId && adv.societyId && adv.societyId !== societyId) return false;
    return true;
  });
}

export function confirmUserAdvisory(advisoryId: string, userId: string): boolean {
  const adv = userReportedAdvisories.find((a) => a.id === advisoryId);
  if (!adv) return false;
  
  if (adv.confirmedByUserIds.has(userId)) {
    return false; // Already confirmed
  }

  adv.confirmedByUserIds.add(userId);
  adv.confirmationsCount += 1;
  if (adv.confirmationsCount >= 3) {
    adv.isVerified = true;
  }
  return true;
}
