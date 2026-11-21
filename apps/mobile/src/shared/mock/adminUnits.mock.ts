import type { AdminUnit, AdminUnitDetail } from '../types/admin.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockAdminUnits: AdminUnit[] = [
    { id: 'unit-001', unitNumber: 'A-1204', wing: 'A Wing', floor: 12, unitType: '3BHK', areaSqFt: 1450, occupancyStatus: 'OWNER_OCCUPIED', ownerName: 'Shashank Shirode', duesStatus: 'NO_DUES', outstandingAmount: 0, parkingCount: 2, documentStatus: 'COMPLETE', kycStatus: 'VERIFIED' },
    { id: 'unit-002', unitNumber: 'A-0801', wing: 'A Wing', floor: 8, unitType: '2BHK', areaSqFt: 985, occupancyStatus: 'TENANT_OCCUPIED', ownerName: 'Rahul Patil', tenantName: 'Deepak Sharma', duesStatus: 'DUES_PENDING', outstandingAmount: 9200, parkingCount: 1, documentStatus: 'INCOMPLETE', kycStatus: 'PENDING' },
    { id: 'unit-003', unitNumber: 'A-0302', wing: 'A Wing', floor: 3, unitType: '2BHK', areaSqFt: 1050, occupancyStatus: 'VACANT', ownerName: 'Sunita Mehta', duesStatus: 'PARTIAL_DUES', outstandingAmount: 2700, parkingCount: 1, documentStatus: 'COMPLETE', kycStatus: 'VERIFIED' },
    { id: 'unit-004', unitNumber: 'B-0404', wing: 'B Wing', floor: 4, unitType: '2BHK', areaSqFt: 1100, occupancyStatus: 'OWNER_OCCUPIED', ownerName: 'Anil Deshmukh', duesStatus: 'NO_DUES', outstandingAmount: 0, parkingCount: 1, documentStatus: 'COMPLETE', kycStatus: 'VERIFIED' },
    { id: 'unit-005', unitNumber: 'B-0802', wing: 'B Wing', floor: 8, unitType: '3BHK', areaSqFt: 1380, occupancyStatus: 'OWNER_OCCUPIED', ownerName: 'Priya Joshi', duesStatus: 'NO_DUES', outstandingAmount: 0, parkingCount: 2, documentStatus: 'COMPLETE', kycStatus: 'VERIFIED' },
    { id: 'unit-006', unitNumber: 'B-1101', wing: 'B Wing', floor: 11, unitType: '2BHK+Study', areaSqFt: 1200, occupancyStatus: 'TENANT_OCCUPIED', ownerName: 'Vijay Kulkarni', tenantName: 'Snehal Rao', duesStatus: 'DUES_PENDING', outstandingAmount: 14500, parkingCount: 1, documentStatus: 'PENDING_VERIFICATION', kycStatus: 'PENDING' },
    { id: 'unit-007', unitNumber: 'C-1501', wing: 'C Wing', floor: 15, unitType: 'Penthouse', areaSqFt: 2200, occupancyStatus: 'OWNER_OCCUPIED', ownerName: 'Ramesh Agarwal', duesStatus: 'NO_DUES', outstandingAmount: 0, parkingCount: 3, documentStatus: 'COMPLETE', kycStatus: 'VERIFIED' },
    { id: 'unit-008', unitNumber: 'C-0601', wing: 'C Wing', floor: 6, unitType: '1BHK', areaSqFt: 650, occupancyStatus: 'VACANT', ownerName: 'Nalini Sharma', duesStatus: 'LONG_PENDING', outstandingAmount: 28000, parkingCount: 1, documentStatus: 'INCOMPLETE', kycStatus: 'NOT_STARTED' },
    { id: 'unit-009', unitNumber: 'A-0101', wing: 'A Wing', floor: 1, unitType: '2BHK', areaSqFt: 980, occupancyStatus: 'OWNER_OCCUPIED', ownerName: 'Suresh Nair', duesStatus: 'NO_DUES', outstandingAmount: 0, parkingCount: 1, documentStatus: 'COMPLETE', kycStatus: 'VERIFIED' },
    { id: 'unit-010', unitNumber: 'B-0205', wing: 'B Wing', floor: 2, unitType: '2BHK', areaSqFt: 1020, occupancyStatus: 'MOVE_OUT_PENDING', ownerName: 'Kavita Sharma', tenantName: 'Rajan Iyer', duesStatus: 'PARTIAL_DUES', outstandingAmount: 3500, parkingCount: 1, documentStatus: 'PENDING_VERIFICATION', kycStatus: 'VERIFIED' },
];
export const mockAdminUnitDetail: AdminUnitDetail = {
    ...getRequiredItem(mockAdminUnits, 0, "adminUnits.mock.ts"),
    ownerMobileMasked: '98765*****',
    familyMemberCount: 4,
    vehicleCount: 2,
    pendingBillsCount: 0,
    openComplaintsCount: 1,
    lastPaymentDate: '2026-06-05',
    lastPaymentAmount: 6500,
};

