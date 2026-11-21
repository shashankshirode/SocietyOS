export type WasteType =
  | 'WET_WASTE'
  | 'DRY_WASTE'
  | 'E_WASTE'
  | 'BULK_WASTE'
  | 'GARDEN_WASTE'
  | 'OTHER';

export type WastePickupStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'MISSED'
  | 'DELAYED'
  | 'CANCELLED';

export type WasteSegregationResult =
  | 'COMPLIANT'
  | 'MINOR_ISSUE'
  | 'NON_COMPLIANT'
  | 'REPEAT_NON_COMPLIANT'
  | 'NOT_INSPECTED';
