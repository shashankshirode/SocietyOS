export interface SocietyHierarchyNode {
  id: string;
  name: string;
  type: 'SOCIETY' | 'BUILDING' | 'WING' | 'FLOOR' | 'UNIT';
  children?: SocietyHierarchyNode[];
}

export interface TowerSetupData {
  towerName: string;
  wingsCount: number;
  floorsCount: number;
  unitsPerFloor: number;
}

export interface UnitDetailInfo {
  id: string;
  unitNumber: string;
  wing: string;
  floor: number;
  occupancyStatus: 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'VACANT';
  ownerName?: string;
  tenantName?: string;
  areaSqFt: number;
  parkingSlot?: string;
  billingFrequency: 'MONTHLY' | 'QUARTERLY';
  kycVerified: boolean;
}
