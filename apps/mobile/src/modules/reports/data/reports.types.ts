export interface FinancialReport {
  id: string;
  reportName: string;
  month: string;
  outstandingAmount: number;
  collectedAmount: number;
}

export type ReportStatus = 'ON_TRACK' | 'NEEDS_REVIEW' | 'BREACHED' | 'READY';

export type ReportCard = {
  id: string;
  title: string;
  summary: string;
  metric: string;
  status: ReportStatus;
};

export type SocietyHealthScore = {
  id: string;
  societyName: string;
  score: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  weakestDimension: string;
  improvementSuggestion: string;
};
