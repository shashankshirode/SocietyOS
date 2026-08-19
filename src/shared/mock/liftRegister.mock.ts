import { LiftStatus } from '../types/liftSafety.types';

export interface LiftRecord {
  id: string;
  liftNumber: string;
  tower: string;
  type: string;
  capacity: string;
  vendor: string;
  status: LiftStatus;
  lastServiceDate: string;
  nextServiceDate: string;
  certificateStatus: string;
  breakdownCount: number;
}

export const mockLiftRegister: LiftRecord[] = [
  {
    id: 'lift-1',
    liftNumber: 'LIFT-A1',
    tower: 'A Wing',
    type: 'Passenger',
    capacity: '8 Person (544 kg)',
    vendor: 'OTIS Elevators',
    status: 'OPERATIONAL',
    lastServiceDate: '2026-06-15',
    nextServiceDate: '2026-07-15',
    certificateStatus: 'VALID',
    breakdownCount: 1
  },
  {
    id: 'lift-2',
    liftNumber: 'LIFT-A2',
    tower: 'A Wing',
    type: 'Service / Goods',
    capacity: '15 Person (1020 kg)',
    vendor: 'OTIS Elevators',
    status: 'OPERATIONAL',
    lastServiceDate: '2026-06-18',
    nextServiceDate: '2026-07-18',
    certificateStatus: 'VALID',
    breakdownCount: 0
  },
  {
    id: 'lift-3',
    liftNumber: 'LIFT-B1',
    tower: 'B Wing',
    type: 'Passenger',
    capacity: '8 Person (544 kg)',
    vendor: 'KONE Elevators',
    status: 'BREAKDOWN',
    lastServiceDate: '2026-05-10',
    nextServiceDate: '2026-06-10',
    certificateStatus: 'EXPIRING_SOON',
    breakdownCount: 4
  },
  {
    id: 'lift-4',
    liftNumber: 'LIFT-B2',
    tower: 'B Wing',
    type: 'Passenger',
    capacity: '8 Person (544 kg)',
    vendor: 'KONE Elevators',
    status: 'OPERATIONAL',
    lastServiceDate: '2026-06-12',
    nextServiceDate: '2026-07-12',
    certificateStatus: 'VALID',
    breakdownCount: 2
  },
  {
    id: 'lift-5',
    liftNumber: 'LIFT-C1',
    tower: 'C Wing',
    type: 'Passenger',
    capacity: '8 Person (544 kg)',
    vendor: 'Schindler Lifts',
    status: 'UNDER_MAINTENANCE',
    lastServiceDate: '2026-06-28',
    nextServiceDate: '2026-07-28',
    certificateStatus: 'EXPIRED',
    breakdownCount: 3
  },
  {
    id: 'lift-6',
    liftNumber: 'LIFT-C2',
    tower: 'C Wing',
    type: 'Passenger',
    capacity: '8 Person (544 kg)',
    vendor: 'Schindler Lifts',
    status: 'OPERATIONAL',
    lastServiceDate: '2026-06-20',
    nextServiceDate: '2026-07-20',
    certificateStatus: 'VALID',
    breakdownCount: 1
  },
  {
    id: 'lift-7',
    liftNumber: 'LIFT-CH1',
    tower: 'Clubhouse',
    type: 'Passenger',
    capacity: '6 Person (408 kg)',
    vendor: 'Johnson Lifts',
    status: 'OPERATIONAL',
    lastServiceDate: '2026-05-05',
    nextServiceDate: '2026-08-05',
    certificateStatus: 'VALID',
    breakdownCount: 0
  },
  {
    id: 'lift-8',
    liftNumber: 'LIFT-P1',
    tower: 'Parking Level B2',
    type: 'Service',
    capacity: '13 Person (884 kg)',
    vendor: 'Johnson Lifts',
    status: 'OUT_OF_SERVICE',
    lastServiceDate: '2026-04-10',
    nextServiceDate: '2026-07-10',
    certificateStatus: 'NOT_AVAILABLE',
    breakdownCount: 5
  }
];
