import type { ModuleAdoptionRow } from '../types/platformAnalytics.types';

export const mockModuleAdoption: ModuleAdoptionRow[] = [
  { moduleName: 'Visitors', moduleKey: 'visitorManagement', enabledSocieties: 14, activeSocieties: 14, usageCount: 4520, adoptionPercentage: 100, trendPlaceholder: 'STABLE' },
  { moduleName: 'Billing', moduleKey: 'maintenanceBilling', enabledSocieties: 14, activeSocieties: 13, usageCount: 6840, adoptionPercentage: 93, trendPlaceholder: 'UP' },
  { moduleName: 'Complaints', moduleKey: 'complaints', enabledSocieties: 14, activeSocieties: 12, usageCount: 890, adoptionPercentage: 86, trendPlaceholder: 'STABLE' },
  { moduleName: 'Documents', moduleKey: 'documentVault', enabledSocieties: 14, activeSocieties: 11, usageCount: 2870, adoptionPercentage: 79, trendPlaceholder: 'UP' },
  { moduleName: 'NOC', moduleKey: 'nocRequests', enabledSocieties: 12, activeSocieties: 8, usageCount: 120, adoptionPercentage: 67, trendPlaceholder: 'STABLE' },
  { moduleName: 'Guard', moduleKey: 'guardApp', enabledSocieties: 14, activeSocieties: 13, usageCount: 15600, adoptionPercentage: 93, trendPlaceholder: 'UP' },
  { moduleName: 'Facility Booking', moduleKey: 'facilityBooking', enabledSocieties: 12, activeSocieties: 10, usageCount: 1340, adoptionPercentage: 83, trendPlaceholder: 'UP' },
  { moduleName: 'Parking', moduleKey: 'parking', enabledSocieties: 13, activeSocieties: 11, usageCount: 3200, adoptionPercentage: 85, trendPlaceholder: 'STABLE' },
  { moduleName: 'Governance', moduleKey: 'governance', enabledSocieties: 10, activeSocieties: 7, usageCount: 450, adoptionPercentage: 70, trendPlaceholder: 'DOWN', lowAdoptionReasonPlaceholder: 'Meeting frequency low', recommendedActionPlaceholder: 'Encourage AGM scheduling' },
  { moduleName: 'Staff Attendance', moduleKey: 'staffAttendance', enabledSocieties: 8, activeSocieties: 6, usageCount: 2100, adoptionPercentage: 75, trendPlaceholder: 'UP' },
  { moduleName: 'Emergency', moduleKey: 'emergencySafety', enabledSocieties: 6, activeSocieties: 4, usageCount: 12, adoptionPercentage: 67, trendPlaceholder: 'STABLE', lowAdoptionReasonPlaceholder: 'Low awareness', recommendedActionPlaceholder: 'Run safety drills campaign' },
  { moduleName: 'Compliance', moduleKey: 'complianceOperations', enabledSocieties: 8, activeSocieties: 5, usageCount: 320, adoptionPercentage: 63, trendPlaceholder: 'UP' },
  { moduleName: 'Community', moduleKey: 'communityMarketplace', enabledSocieties: 10, activeSocieties: 6, usageCount: 340, adoptionPercentage: 60, trendPlaceholder: 'UP' },
  { moduleName: 'Family Care', moduleKey: 'familyCare', enabledSocieties: 4, activeSocieties: 2, usageCount: 45, adoptionPercentage: 50, trendPlaceholder: 'STABLE', lowAdoptionReasonPlaceholder: 'New module', recommendedActionPlaceholder: 'Awareness campaign needed' },
  { moduleName: 'Knowledge Base', moduleKey: 'knowledgeBase', enabledSocieties: 5, activeSocieties: 3, usageCount: 1580, adoptionPercentage: 60, trendPlaceholder: 'UP' },
];
