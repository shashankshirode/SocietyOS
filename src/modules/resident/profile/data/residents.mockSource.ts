import type { ResidentProfileInfo } from './residents.types';

export const mockResidentsList: ResidentProfileInfo[] = [
  {
    id: 'res-1',
    name: 'Rohan Gupta',
    role: 'OWNER',
    email: 'rohan.gupta@mail.com',
    phone: '+91 98765 43210',
    kycStatus: 'APPROVED',
    policeVerified: true,
    vehiclesCount: 2,
    accessStatus: 'ACTIVE',
  },
  {
    id: 'res-2',
    name: 'Sunita Nair',
    role: 'TENANT',
    email: 'sunita.nair@mail.com',
    phone: '+91 91234 56789',
    kycStatus: 'PENDING',
    policeVerified: false,
    vehiclesCount: 1,
    accessStatus: 'ACTIVE',
  },
  {
    id: 'res-3',
    name: 'Amit Kumar',
    role: 'FAMILY',
    email: 'amit.k@mail.com',
    phone: '+91 99988 87766',
    kycStatus: 'APPROVED',
    policeVerified: true,
    vehiclesCount: 0,
    accessStatus: 'ACTIVE',
  },
];
