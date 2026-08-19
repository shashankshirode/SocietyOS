import type { SafetyDrillRecord } from '../types/safety.types';

export const mockSafetyDrills: SafetyDrillRecord[] = [
  {
    id: 'drill-001',
    drillType: 'FIRE_DRILL',
    drillName: 'H1 2026 Annual Fire & Evacuation Drill',
    scheduledDate: '2026-06-15',
    targetArea: 'A & B Wings, Main Lawn',
    participantsCount: 120,
    status: 'COMPLETED',
    observations: 'Evacuation completed in 4 minutes 20 seconds. Two fire hose reels in B Wing had low pressure.',
    improvementActions: 'Replace nozzle valves on B Wing 5th and 12th floor hose reels. Conduct guard training on water pumps.',
    completedAt: '2026-06-15T11:00:00Z',
  },
  {
    id: 'drill-002',
    drillType: 'LIFT_RESCUE_DRILL',
    drillName: 'Otis Lift Rescue Training for Security Guards',
    scheduledDate: '2026-05-10',
    targetArea: 'C Wing Lifts',
    participantsCount: 15,
    status: 'COMPLETED',
    observations: 'Guards successfully practiced manual brake release and cabin leveling.',
    improvementActions: 'Ensure lift keys are always kept in the labeled keyboard cabinet in the security cabin.',
    completedAt: '2026-05-10T15:00:00Z',
  },
  {
    id: 'drill-003',
    drillType: 'MEDICAL_RESPONSE_DRILL',
    drillName: 'First-Aid & CPR Volunteer Simulation',
    scheduledDate: '2026-07-15',
    targetArea: 'Clubhouse Multipurpose Hall',
    participantsCount: 40,
    status: 'PLANNED',
  }
];
export type { SafetyDrillRecord };
