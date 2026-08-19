import type { EvChargingSession, EvChargingDashboardData } from '../types/evCharging.types';
import { getRequiredItem } from "../utils/requiredItem";
import { includeWhenPresent } from "../utils/presentProperty";
export const mockEvChargingDashboard: EvChargingDashboardData = {
    totalChargers: 6,
    availableChargersCount: 3,
    occupiedChargersCount: 2,
    offlineChargersCount: 1,
    totalSessionsToday: 12,
    energyConsumedTodayKwh: 240,
    revenueTodayAmount: 3600
};
export const mockEvChargingSessions: EvChargingSession[] = Array.from({ length: 20 }, (_, i) => ({
    id: `evs-${String(i + 1).padStart(3, '0')}`,
    chargerId: `dev-${String(i % 6 + 43).padStart(3, '0')}`,
    chargerName: `EV Charger ${i % 6 + 1}`,
    residentName: getRequiredItem(['Rajesh Patil', 'Priya Sharma', 'Amit Shah', 'Neha Kulkarni', 'Vikram Joshi'], i % 5, "evChargingSessions.mock.ts"),
    unitNumber: `A-Wing 10${i}`,
    vehicleNumberMasked: `MH-15-******${1000 + i}`,
    startTime: new Date(Date.now() - (i * 2 * 60 * 60 * 1000)).toISOString(),
    ...includeWhenPresent("endTime", i === 0 ? undefined : new Date(Date.now() - (i * 2 * 60 * 60 * 1000) + (60 * 60 * 1000)).toISOString()),
    energyConsumedKwh: 15 + (i * 2),
    costEstimateAmount: 200 + (i * 30),
    billingStatus: getRequiredItem((['PENDING', 'BILLED', 'FREE_LIMIT', 'FAILED'] as const), i % 4, "evChargingSessions.mock.ts"),
    status: getRequiredItem((['RESERVED', 'STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED', 'BILLING_PENDING'] as const), i % 7, "evChargingSessions.mock.ts")
}));

