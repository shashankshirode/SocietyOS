export type ResidentInsightPriority = 'low' | 'medium' | 'high' | 'critical';

export type ResidentInsightCategory =
  | 'weather'
  | 'traffic'
  | 'civic'
  | 'society'
  | 'safety'
  | 'utility';

export interface ResidentInsightSource {
  id: string;
  label: string;
  labelMessageKey?: string;
  type: 'system' | 'facilityTeam' | 'societyOffice' | 'weatherService' | 'localAuthority';
  verified: boolean;
}

export interface ResidentInsightAction {
  id: string;
  labelMessageKey: string;
  type: 'primary' | 'secondary' | 'link';
  action: 'viewDetails' | 'dismiss' | 'markAsRead' | 'learnMore';
}

export interface ResidentInsightDetail {
  id: string;
  title: string;
  summary: string;
  detailedDescription: string;
  category: ResidentInsightCategory;
  priority: ResidentInsightPriority;
  source: ResidentInsightSource;
  areaLabel?: string;
  freshnessLabel?: string;
  recommendation?: string;
  impactSummary?: string;
  actions: ResidentInsightAction[];
}
