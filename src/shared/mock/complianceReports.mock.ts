export interface ComplianceReportCard {
  id: string;
  name: string;
  description: string;
  lastGenerated: string;
  reportType: string;
}

export const mockComplianceReports: ComplianceReportCard[] = [
  {
    id: 'rep-1',
    name: 'Waste Compliance Report',
    description: 'Tower-wise wet/dry waste segregation rate and violation history.',
    lastGenerated: '2026-06-29 05:00 PM',
    reportType: 'WASTE'
  },
  {
    id: 'rep-2',
    name: 'Housekeeping Completion Report',
    description: 'Cleaning schedules completion percentage, supervisor rework count.',
    lastGenerated: '2026-06-29 05:30 PM',
    reportType: 'HOUSEKEEPING'
  },
  {
    id: 'rep-3',
    name: 'Lift Downtime Report',
    description: 'Lift breakdown duration, MTTR, and frequent issue types.',
    lastGenerated: '2026-06-28 09:00 AM',
    reportType: 'LIFT_DOWNTIME'
  },
  {
    id: 'rep-4',
    name: 'Lift Certificate Report',
    description: 'Renewal statuses, PWD inspection dates, and licensing history.',
    lastGenerated: '2026-06-27 11:00 AM',
    reportType: 'LIFT_CERTIFICATE'
  },
  {
    id: 'rep-5',
    name: 'Fire Equipment Expiry Report',
    description: 'List of fire extinguishers expiring within 30, 60, and 90 days.',
    lastGenerated: '2026-06-29 06:00 PM',
    reportType: 'FIRE_EXPIRY'
  },
  {
    id: 'rep-6',
    name: 'Fire Drill Participation Report',
    description: 'Attendance records, evacuation times, and observations for fire drills.',
    lastGenerated: '2026-06-25 10:00 AM',
    reportType: 'FIRE_DRILL'
  },
  {
    id: 'rep-7',
    name: 'Compliance Task Aging Report',
    description: 'Open tasks tracking, overdue tasks count, and average completion time.',
    lastGenerated: '2026-06-29 04:00 PM',
    reportType: 'TASK_AGING'
  },
  {
    id: 'rep-8',
    name: 'Overdue Task Report',
    description: 'Detailed list of compliance tasks that have missed their target dates.',
    lastGenerated: '2026-06-29 04:15 PM',
    reportType: 'OVERDUE_TASKS'
  }
];
