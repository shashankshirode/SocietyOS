import type { SmartMeterReading, SmartMeterDashboardData } from '../types/smartMeter.types';
import { getRequiredItem } from "../utils/requiredItem";
import { includeWhenPresent } from "../utils/presentProperty";
export const mockSmartMeterDashboard: SmartMeterDashboardData = {
    totalMeters: 45,
    electricityMetersCount: 15,
    waterMetersCount: 15,
    gasMetersCount: 15,
    onlineMetersCount: 42,
    offlineMetersCount: 3,
    lastImportDate: new Date().toISOString(),
    readingErrorsCount: 2
};
export const mockSmartMeterReadings: SmartMeterReading[] = Array.from({ length: 30 }, (_, i) => ({
    id: `smr-${String(i + 1).padStart(3, '0')}`,
    meterId: `dev-${String(i % 15 + 28).padStart(3, '0')}`,
    unitNumber: `A-Wing 10${i % 15}`,
    type: getRequiredItem((['ELECTRICITY', 'WATER', 'GAS'] as const), i % 3, "smartMeterReadings.mock.ts"),
    previousReadingValue: 1200 + (i * 100),
    currentReadingValue: 1350 + (i * 100),
    consumptionValue: 150,
    readingDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    source: getRequiredItem((['AUTOMATIC', 'MANUAL', 'ESTIMATED'] as const), i % 3, "smartMeterReadings.mock.ts"),
    status: getRequiredItem((['IMPORTED', 'VALIDATED', 'ESTIMATED', 'ERROR', 'DUPLICATE', 'MISSING', 'BILLING_READY'] as const), i % 7, "smartMeterReadings.mock.ts"),
    billingReadiness: getRequiredItem((['READY', 'PENDING_VALIDATION', 'ERROR'] as const), i % 3, "smartMeterReadings.mock.ts"),
    ...includeWhenPresent("errorNote", i % 7 === 3 ? 'Abnormally high consumption detected' : undefined)
}));

