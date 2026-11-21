export type CleaningType =
  | 'FLOOR_SWEEPING'
  | 'FLOOR_MOPPING'
  | 'LIFT_CLEANING'
  | 'LOBBY_CLEANING'
  | 'STAIRCASE_CLEANING'
  | 'PARKING_CLEANING'
  | 'CLUBHOUSE_CLEANING'
  | 'GARDEN_CLEANING'
  | 'TOILET_CLEANING'
  | 'OTHER';

export type CleaningFrequency =
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'ON_DEMAND';

export type HousekeepingRoundStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'VERIFICATION_PENDING'
  | 'VERIFIED'
  | 'REWORK_REQUIRED'
  | 'MISSED'
  | 'CANCELLED';

export type CleanlinessRating =
  | 'EXCELLENT'
  | 'GOOD'
  | 'NEEDS_ATTENTION'
  | 'POOR'
  | 'CRITICAL';

export type SupervisorVerificationResult =
  | 'VERIFIED'
  | 'PARTIALLY_VERIFIED'
  | 'REWORK_REQUIRED'
  | 'REJECTED';

export type HousekeepingIssueType =
  | 'CLEANING_MISSED'
  | 'BAD_ODOUR'
  | 'WET_FLOOR'
  | 'GARBAGE_OVERFLOW'
  | 'COMMON_AREA_DIRTY'
  | 'PEST_OBSERVED'
  | 'SAFETY_HAZARD'
  | 'OTHER';
