import type { SeniorCareProfile, SeniorDailyCheckIn, SeniorInactivityAlert } from '../types/seniorCare.types';

export const mockSeniorCareProfile: SeniorCareProfile = {
  id: 'senior-001',
  residentId: 'resident-002',
  name: 'Madhav Deshpande',
  unitId: 'unit-b-0802',
  flatNumber: 'B-0802',
  tower: 'B Wing',
  seniorCareStatus: 'ENABLED',
  familyConnectEnabled: true,
  dailyCheckInEnabled: true,
  preferredHelpType: 'Mobility support & medication fetch',
  priorityComplaintEnabled: true,
  securityCheckCallPreference: 'Morning 10 AM',
  consentConfirmed: true,
  consentDate: '2026-06-01',
  createdAt: '2026-06-01T09:00:00Z',
};

export const mockSeniorCheckIns: SeniorDailyCheckIn[] = [
  {
    id: 'chkin-001',
    seniorId: 'senior-001',
    seniorName: 'Madhav Deshpande',
    flatNumber: 'B-0802',
    tower: 'B Wing',
    date: '2026-06-29',
    status: 'COMPLETED',
    checkInTime: '09:30 AM',
    notes: 'I am doing well today.',
    notifiedFamily: true,
  },
  {
    id: 'chkin-002',
    seniorId: 'senior-001',
    seniorName: 'Madhav Deshpande',
    flatNumber: 'B-0802',
    tower: 'B Wing',
    date: '2026-06-28',
    status: 'COMPLETED',
    checkInTime: '10:00 AM',
    notifiedFamily: true,
  },
  {
    id: 'chkin-003',
    seniorId: 'senior-001',
    seniorName: 'Madhav Deshpande',
    flatNumber: 'B-0802',
    tower: 'B Wing',
    date: '2026-06-27',
    status: 'MISSED',
    notifiedFamily: true,
  }
];

export const mockSeniorInactivityAlerts: SeniorInactivityAlert[] = [
  {
    id: 'inact-001',
    seniorId: 'senior-001',
    seniorName: 'Madhav Deshpande',
    unitId: 'unit-b-0802',
    flatNumber: 'B-0802',
    tower: 'B Wing',
    missedCheckInTime: '2026-06-29T11:00:00Z', 
    alertStatus: 'OPEN',
    familyNotified: true,
    securityCheckCallStatus: 'PENDING',
    notes: 'No check-in received by 10:00 AM. Automatically triggered inactivity alert.',
  }
];
