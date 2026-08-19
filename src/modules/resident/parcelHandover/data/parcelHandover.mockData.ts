import type { Parcel } from './parcelHandover.types';

export const mockParcels: Parcel[] = [
  {
    id: 'prcl-1',
    courierCompany: 'Amazon',
    recipientFlat: 'C-402',
    recipientName: 'Kunal Sen',
    receivedTime: '2026-07-05 14:30',
    status: 'PENDING_PICKUP',
    pickupOtp: '4820',
  },
  {
    id: 'prcl-2',
    courierCompany: 'BlueDart',
    recipientFlat: 'D-101',
    recipientName: 'Nisha Nair',
    receivedTime: '2026-07-05 11:15',
    status: 'COLLECTED',
    pickupOtp: '9153',
  },
];
