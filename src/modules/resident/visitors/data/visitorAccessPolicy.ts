import { VisitorType } from './visitors.enums';

export const visitorAccessPolicy = {
  defaultDurationMinutes: {
    [VisitorType.GUEST]: 120,
    [VisitorType.DELIVERY]: 30,
    [VisitorType.CAB]: 30,
    [VisitorType.VENDOR]: 60,
  },
  durationOptions: [30, 60, 120, 240] as const,
  purposes: {
    [VisitorType.GUEST]: ['Social visit', 'Family', 'Event', 'Other'],
    [VisitorType.DELIVERY]: [],
    [VisitorType.CAB]: [],
    [VisitorType.VENDOR]: ['Maintenance', 'Electrical', 'Plumbing', 'Carpentry', 'Cleaning', 'Renovation', 'Other'],
  },
} as const;
