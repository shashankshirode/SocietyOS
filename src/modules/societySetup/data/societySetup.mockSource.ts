import type { SocietyHierarchyNode, UnitDetailInfo } from './societySetup.types';

export const mockSocietyHierarchy: SocietyHierarchyNode = {
  id: 'soc-1',
  name: 'Orchid Towers Society',
  type: 'SOCIETY',
  children: [
    {
      id: 'tower-a',
      name: 'Tower A',
      type: 'BUILDING',
      children: [
        {
          id: 'wing-x',
          name: 'Wing X',
          type: 'WING',
          children: [
            {
              id: 'floor-1',
              name: 'Floor 1',
              type: 'FLOOR',
              children: [
                { id: 'unit-101', name: 'Flat 101', type: 'UNIT' },
                { id: 'unit-102', name: 'Flat 102', type: 'UNIT' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const mockUnitsDetailList: UnitDetailInfo[] = [
  {
    id: 'unit-101',
    unitNumber: 'Flat 101',
    wing: 'Wing X',
    floor: 1,
    occupancyStatus: 'OWNER_OCCUPIED',
    ownerName: 'Amit Sharma',
    areaSqFt: 1200,
    parkingSlot: 'P-12',
    billingFrequency: 'MONTHLY',
    kycVerified: true,
  },
  {
    id: 'unit-102',
    unitNumber: 'Flat 102',
    wing: 'Wing X',
    floor: 1,
    occupancyStatus: 'TENANT_OCCUPIED',
    ownerName: 'Rajesh Patel',
    tenantName: 'Suresh Kumar',
    areaSqFt: 1050,
    parkingSlot: 'P-15',
    billingFrequency: 'MONTHLY',
    kycVerified: true,
  },
];
