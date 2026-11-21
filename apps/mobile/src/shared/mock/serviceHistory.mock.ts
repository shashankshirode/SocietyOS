import type { ServiceHistoryItem } from '../types/workOrder.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockServiceHistory: ServiceHistoryItem[] = Array.from({ length: 20 }, (_, index) => ({
    id: `service-history-${index + 1}`,
    serviceDate: `2026-06-${String((index % 20) + 1).padStart(2, '0')}`,
    assetId: `asset-${(index % 12) + 1}`,
    assetName: getRequiredItem(['Lift A1', 'Water Pump B2', 'Generator Main', 'CCTV Gate'], index % 4, "serviceHistory.mock.ts"),
    vendorId: `vendor-${(index % 8) + 1}`,
    vendorName: getRequiredItem(['Lift Services Nashik', 'Electrical Services Nashik', 'Fire Safety Services Nashik'], index % 3, "serviceHistory.mock.ts"),
    workOrderNumber: `WO-GVH-2026-${String(index + 1).padStart(4, '0')}`,
    serviceType: index % 2 === 0 ? 'PREVENTIVE_MAINTENANCE' : 'REPAIR',
    status: index % 3 === 0 ? 'VERIFIED' : 'COMPLETED',
    costPlaceholder: 'Accounting integration later',
    technician: 'Assigned technician',
    findings: 'Routine inspection completed with minor observations.',
    nextAction: 'Next preventive service as scheduled.',
    reportPlaceholder: 'Service report preview placeholder.',
}));

