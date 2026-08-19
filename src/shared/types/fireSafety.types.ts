export type CertificateStatus =
  | 'VALID'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'RENEWAL_IN_PROGRESS'
  | 'NOT_AVAILABLE';

export type FireEquipmentType =
  | 'FIRE_EXTINGUISHER'
  | 'HYDRANT'
  | 'FIRE_ALARM_PANEL'
  | 'SMOKE_DETECTOR'
  | 'SPRINKLER'
  | 'FIRE_PUMP'
  | 'HOSE_REEL'
  | 'EMERGENCY_LIGHT'
  | 'EXIT_SIGNAGE'
  | 'ASSEMBLY_POINT_SIGN'
  | 'OTHER';

export type FireEquipmentStatus =
  | 'ACTIVE'
  | 'NEEDS_INSPECTION'
  | 'EXPIRED'
  | 'FAULTY'
  | 'UNDER_MAINTENANCE'
  | 'REPLACED'
  | 'MISSING';

export type FireNocStatus =
  | 'VALID'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'RENEWAL_IN_PROGRESS'
  | 'NOT_AVAILABLE';

export type FireDrillType =
  | 'FIRE_DRILL'
  | 'EVACUATION_DRILL'
  | 'LIFT_RESCUE_DRILL'
  | 'MEDICAL_RESPONSE_DRILL'
  | 'SECURITY_DRILL';

export type FireDrillStatus =
  | 'PLANNED'
  | 'COMPLETED'
  | 'MISSED'
  | 'CANCELLED'
  | 'REVIEW_PENDING';
