import type { ShiftDefinition, ShiftAssignment } from '../types/staff.types';

export const mockShifts: ShiftDefinition[] = [
  { id: 'shift-001', shiftName: 'Morning Security', startTime: '07:00', endTime: '15:00', gracePeriodMinutes: 15, location: 'All Gates', assignedStaffCount: 8, weeklyOffDays: ['SUNDAY'], status: 'ACTIVE', createdAt: '2022-01-01T00:00:00Z' },
  { id: 'shift-002', shiftName: 'Night Security', startTime: '23:00', endTime: '07:00', gracePeriodMinutes: 15, location: 'All Gates & Patrol', assignedStaffCount: 6, weeklyOffDays: ['SUNDAY'], status: 'ACTIVE', createdAt: '2022-01-01T00:00:00Z' },
  { id: 'shift-003', shiftName: 'Housekeeping Morning', startTime: '08:00', endTime: '16:00', gracePeriodMinutes: 30, location: 'All Wings & Lobby', assignedStaffCount: 10, weeklyOffDays: ['SUNDAY'], status: 'ACTIVE', createdAt: '2023-01-01T00:00:00Z' },
  { id: 'shift-004', shiftName: 'Clubhouse Evening', startTime: '14:00', endTime: '22:00', gracePeriodMinutes: 15, location: 'Clubhouse', assignedStaffCount: 4, weeklyOffDays: ['MONDAY'], status: 'ACTIVE', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'shift-005', shiftName: 'Facility General Shift', startTime: '09:00', endTime: '17:00', gracePeriodMinutes: 15, location: 'Facility Office', assignedStaffCount: 6, weeklyOffDays: ['SUNDAY'], status: 'ACTIVE', createdAt: '2020-01-01T00:00:00Z' },
  { id: 'shift-006', shiftName: 'Weekend Support', startTime: '09:00', endTime: '18:00', gracePeriodMinutes: 15, location: 'Main Gate', assignedStaffCount: 2, weeklyOffDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], status: 'ACTIVE', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'shift-007', shiftName: 'Afternoon Security', startTime: '15:00', endTime: '23:00', gracePeriodMinutes: 15, location: 'All Gates', assignedStaffCount: 0, weeklyOffDays: ['SUNDAY'], status: 'DRAFT', createdAt: '2026-06-01T00:00:00Z' },
  { id: 'shift-008', shiftName: 'Seasonal Night Patrol', startTime: '22:00', endTime: '06:00', gracePeriodMinutes: 15, location: 'Basement B2', assignedStaffCount: 0, weeklyOffDays: ['SATURDAY'], status: 'INACTIVE', createdAt: '2025-10-01T00:00:00Z' },
];

export const mockShiftAssignments: ShiftAssignment[] = [
  { id: 'asg-001', staffId: 'stf-001', staffName: 'Ramesh Pawar', staffCode: 'STF-SEC-001', shiftId: 'shift-001', shiftName: 'Morning Security', location: 'Main Gate', effectiveFrom: '2022-01-15', weeklyOffDays: ['SUNDAY'], createdAt: '2022-01-15T00:00:00Z', isActive: true },
  { id: 'asg-002', staffId: 'stf-002', staffName: 'Vikas Thorat', staffCode: 'STF-SEC-002', shiftId: 'shift-002', shiftName: 'Night Security', location: 'Main Gate', effectiveFrom: '2022-03-01', weeklyOffDays: ['SUNDAY'], createdAt: '2022-03-01T00:00:00Z', isActive: true },
  { id: 'asg-003', staffId: 'stf-003', staffName: 'Suresh Kamble', staffCode: 'STF-SEC-003', shiftId: 'shift-001', shiftName: 'Morning Security', location: 'B Wing Gate', effectiveFrom: '2023-06-01', weeklyOffDays: ['SUNDAY'], createdAt: '2023-06-01T00:00:00Z', isActive: true },
  { id: 'asg-004', staffId: 'stf-004', staffName: 'Dinesh Yadav', staffCode: 'STF-SEC-004', shiftId: 'shift-001', shiftName: 'Morning Security', location: 'All Gates', effectiveFrom: '2021-07-20', weeklyOffDays: ['SUNDAY'], createdAt: '2021-07-20T00:00:00Z', isActive: true },
  { id: 'asg-005', staffId: 'stf-005', staffName: 'Manoj Shinde', staffCode: 'STF-SEC-005', shiftId: 'shift-004', shiftName: 'Clubhouse Evening', location: 'Clubhouse', effectiveFrom: '2025-01-10', weeklyOffDays: ['MONDAY'], createdAt: '2025-01-10T00:00:00Z', isActive: true },
  { id: 'asg-006', staffId: 'stf-006', staffName: 'Pradeep Raut', staffCode: 'STF-SEC-006', shiftId: 'shift-002', shiftName: 'Night Security', location: 'Main Gate', effectiveFrom: '2022-11-01', weeklyOffDays: ['SUNDAY'], createdAt: '2022-11-01T00:00:00Z', isActive: true },
  { id: 'asg-007', staffId: 'stf-007', staffName: 'Meena Jadhav', staffCode: 'STF-HK-001', shiftId: 'shift-003', shiftName: 'Housekeeping Morning', location: 'A Wing', effectiveFrom: '2023-01-01', weeklyOffDays: ['SUNDAY'], createdAt: '2023-01-01T00:00:00Z', isActive: true },
  { id: 'asg-008', staffId: 'stf-008', staffName: 'Sunita Bansode', staffCode: 'STF-HK-002', shiftId: 'shift-003', shiftName: 'Housekeeping Morning', location: 'B Wing', effectiveFrom: '2023-03-15', weeklyOffDays: ['SUNDAY'], createdAt: '2023-03-15T00:00:00Z', isActive: true },
  { id: 'asg-009', staffId: 'stf-009', staffName: 'Rekha Shinde', staffCode: 'STF-HK-003', shiftId: 'shift-003', shiftName: 'Housekeeping Morning', location: 'C Wing', effectiveFrom: '2022-08-01', weeklyOffDays: ['SUNDAY'], createdAt: '2022-08-01T00:00:00Z', isActive: true },
  { id: 'asg-010', staffId: 'stf-010', staffName: 'Kavita Patil', staffCode: 'STF-HK-004', shiftId: 'shift-003', shiftName: 'Housekeeping Morning', location: 'Common Areas', effectiveFrom: '2026-05-01', weeklyOffDays: ['SUNDAY'], createdAt: '2026-05-01T00:00:00Z', isActive: true },
  
  ...Array.from({ length: 20 }).map((_, idx) => {
    const idNum = idx + 11;
    return {
      id: `asg-0${idNum}`,
      staffId: `stf-0${idNum}`,
      staffName: `Staff Member ${idNum}`,
      staffCode: `STF-FAC-0${idNum}`,
      shiftId: 'shift-005',
      shiftName: 'Facility General Shift',
      location: 'All Areas',
      effectiveFrom: '2026-01-01',
      weeklyOffDays: ['SUNDAY'],
      createdAt: '2026-01-01T00:00:00Z',
      isActive: true,
    };
  }),
];
