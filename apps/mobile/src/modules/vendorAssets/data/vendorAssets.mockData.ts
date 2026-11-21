import type { Vendor, Asset } from './vendorAssets.types';

export const mockVendors: Vendor[] = [
  {
    id: 'vnd-1',
    name: 'Standard Elevators Ltd',
    serviceType: 'LIFT_MAINTENANCE',
    contactPerson: 'Vikas Dubey',
    phone: '+91 98765 43210',
    rating: 4.5,
  },
];

export const mockAssets: Asset[] = [
  {
    id: 'ast-1',
    name: 'Tower A Passenger Lift 1',
    location: 'Tower A Lobby',
    lastMaintenance: '2026-06-01',
    nextAmcDate: '2026-09-01',
  },
];
