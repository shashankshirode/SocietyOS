import type { SmartMeter } from '../types/smartMeter.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockSmartMeters: SmartMeter[] = Array.from({ length: 15 }, (_, i) => ({
    id: `dev-${String(i + 28).padStart(3, '0')}`,
    meterCode: `SM-MET-${1030 + i}`,
    unitNumber: `A-Wing 10${i}`,
    type: getRequiredItem((['ELECTRICITY', 'WATER', 'GAS'] as const), i % 3, "smartMeters.mock.ts"),
    status: getRequiredItem((['ONLINE', 'ONLINE', 'ONLINE', 'OFFLINE', 'ERROR'] as const), i % 5, "smartMeters.mock.ts"),
    lastReadingValue: 1200.5 + (i * 150),
    lastReadingDate: new Date().toISOString(),
    billingReadiness: getRequiredItem((['READY', 'PENDING', 'ERROR'] as const), i % 3, "smartMeters.mock.ts"),
}));

