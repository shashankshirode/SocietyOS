import type { RfidTagMapping } from '../types/gateHardware.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockRfidTagMappings: RfidTagMapping[] = Array.from({ length: 10 }, (_, i) => ({
    id: `rtm-${String(i + 1).padStart(3, '0')}`,
    tagCode: `RF-TAG-${10000 + i}`,
    vehicleNumber: `MH-15-AB-${2000 + i}`,
    unitNumber: `A-Wing 10${i}`,
    residentName: getRequiredItem(['Rajesh Patil', 'Priya Sharma', 'Amit Shah', 'Neha Kulkarni', 'Vikram Joshi'], i % 5, "rfidTagMappings.mock.ts"),
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2027-01-01T00:00:00Z',
    accessZone: 'All Gates',
    status: getRequiredItem((['ACTIVE', 'ACTIVE', 'ACTIVE', 'INACTIVE', 'LOST', 'EXPIRED', 'BLOCKED', 'PENDING_MAPPING'] as const), i % 8, "rfidTagMappings.mock.ts"),
    notes: 'Registered under family vehicle',
}));

