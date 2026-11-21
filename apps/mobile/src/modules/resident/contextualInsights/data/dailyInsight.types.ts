export type DailyInsightCategory =
  | 'weather'
  | 'road'
  | 'utility'
  | 'security'
  | 'maintenance'
  | 'community'
  | 'health'
  | 'emergency';

export type DailyInsightSeverity =
  | 'information'
  | 'advisory'
  | 'important'
  | 'urgent'
  | 'critical';

export type DailyInsightAction = {
  id: string;
  type:
    | 'acknowledge'
    | 'openNotice'
    | 'openMap'
    | 'callSecurity'
    | 'openDetails'
    | 'dismiss';
  label: string;
  targetId?: string;
};

export type DailyInsight = {
  id: string;
  residenceId: string;
  societyId: string;
  category: DailyInsightCategory;
  severity: DailyInsightSeverity;
  title: string;
  description: string;
  recommendation?: string;
  source: {
    type: 'weatherService' | 'facilityTeam' | 'securityTeam' | 'residentReport' | 'societyOffice';
    displayName: string;
  };
  location?: {
    label: string;
    areaCode?: string;
  };
  validFrom: string;
  validUntil?: string;
  updatedAt: string;
  status: 'active' | 'resolved' | 'expired';
  actions: DailyInsightAction[];
  explanation?: string;
};

export type DailyInsightActionViewModel = {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'link';
  action: 'acknowledge' | 'openNotice' | 'openMap' | 'callSecurity' | 'openDetails' | 'dismiss' | 'learnMore';
  targetId?: string;
};

export type DailyInsightViewModel = {
  id: string;
  categoryLabel: string;
  categoryIcon: string;
  severityLabel: string;
  severityTone: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'muted';
  title: string;
  description: string;
  recommendation?: string;
  sourceLabel?: string;
  locationLabel?: string;
  updatedLabel: string;
  explanation?: string;
  actions: DailyInsightActionViewModel[];
};
