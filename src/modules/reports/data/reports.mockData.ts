import type { FinancialReport, ReportCard, SocietyHealthScore } from './reports.types';

export const mockFinancialReports: FinancialReport[] = [
  { id: 'fr-1', reportName: 'July Collection Summary', month: 'July 2026', outstandingAmount: 125000, collectedAmount: 875000 },
  { id: 'fr-2', reportName: 'June Expense Summary', month: 'June 2026', outstandingAmount: 42000, collectedAmount: 912000 },
];

export const financialReportsMockData: ReportCard[] = [
  { id: 'fin-1', title: 'Collection Report', summary: 'Maintenance and parking collections grouped by month.', metric: 'Collected: Rs. 8.75L', status: 'READY' },
  { id: 'fin-2', title: 'Expense Report', summary: 'Facility, vendor and utility expense rollup.', metric: 'Expense: Rs. 4.2L', status: 'ON_TRACK' },
  { id: 'fin-3', title: 'Budget Variance', summary: 'Budget versus actual snapshot for committee review.', metric: 'Variance: 6%', status: 'NEEDS_REVIEW' },
];
export const collectionReportMockData: ReportCard[] = [
  { id: 'col-1', title: 'Tower A Collections', summary: 'Paid, unpaid and overdue bills for Tower A.', metric: '91% collected', status: 'ON_TRACK' },
  { id: 'col-2', title: 'Tower C Overdues', summary: 'High overdue concentration for July cycle.', metric: 'Rs. 68,000 overdue', status: 'NEEDS_REVIEW' },
];
export const complaintSlaReportMockData: ReportCard[] = [
  { id: 'sla-1', title: 'Plumbing SLA', summary: 'Two breached complaints pending vendor closure.', metric: '2 breached', status: 'BREACHED' },
  { id: 'sla-2', title: 'Electrical SLA', summary: 'All active complaints remain inside target window.', metric: '100% on track', status: 'ON_TRACK' },
];
export const vendorPerformanceReportMockData: ReportCard[] = [
  { id: 'vpr-1', title: 'SecureGate Services', summary: 'Guard attendance and incident handling score.', metric: 'SLA score 94', status: 'READY' },
  { id: 'vpr-2', title: 'CleanWell Facility', summary: 'Housekeeping feedback dipped after missed rounds.', metric: 'Rating 3.8', status: 'NEEDS_REVIEW' },
];
export const securityReportsMockData: ReportCard[] = [
  { id: 'sec-1', title: 'Visitor Trends', summary: 'Peak visitor load occurs between 18:00 and 21:00.', metric: '1,284 entries', status: 'READY' },
  { id: 'sec-2', title: 'Gate Load', summary: 'Gate 2 needs queue review during delivery hours.', metric: '32% load share', status: 'NEEDS_REVIEW' },
];
export const staffAttendanceReportsMockData: ReportCard[] = [
  { id: 'sar-1', title: 'Daily Attendance', summary: 'Staff-wise daily presence and missing checkouts.', metric: '96% present', status: 'ON_TRACK' },
  { id: 'sar-2', title: 'Vendor Attendance', summary: 'Vendor-wise payable days ready for invoice checks.', metric: '2 disputes', status: 'NEEDS_REVIEW' },
];
export const ownerTenantLifecycleReportMockData: ReportCard[] = [
  { id: 'otl-1', title: 'Move-in Pipeline', summary: 'Move-in requests pending document verification.', metric: '8 pending', status: 'NEEDS_REVIEW' },
  { id: 'otl-2', title: 'Expired Agreements', summary: 'Tenant agreements nearing renewal date.', metric: '5 expiring', status: 'ON_TRACK' },
];
export const complianceReportsMockData: ReportCard[] = [
  { id: 'com-1', title: 'Fire NOC Expiry', summary: 'Fire document expiry is within warning window.', metric: '29 days left', status: 'NEEDS_REVIEW' },
  { id: 'com-2', title: 'Rule Acknowledgement', summary: 'Pending acknowledgements after latest rules update.', metric: '84% acknowledged', status: 'ON_TRACK' },
];
export const communityReportsMockData: ReportCard[] = [
  { id: 'cr-1', title: 'Notice Acknowledgement', summary: 'High-priority notice pending residents.', metric: '17 pending', status: 'NEEDS_REVIEW' },
  { id: 'cr-2', title: 'Poll Participation', summary: 'Tower-wise participation in active poll.', metric: '63% voted', status: 'ON_TRACK' },
];
export const societyHealthScoreMockData: SocietyHealthScore[] = [
  { id: 'shs-1', societyName: 'Green Valley Heights', score: 86, trend: 'UP', weakestDimension: 'Governance Activity', improvementSuggestion: 'Schedule AGM and publish action tracker.' },
  { id: 'shs-2', societyName: 'Skyline Towers', score: 68, trend: 'DOWN', weakestDimension: 'Support Load', improvementSuggestion: 'Close high-priority support tickets before onboarding more modules.' },
];
