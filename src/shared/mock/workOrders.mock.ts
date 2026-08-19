import type { FacilityIncident, WorkOrder } from '../types/workOrder.types';
import { getRequiredItem } from "../utils/requiredItem";
import { includeWhenPresent } from "../utils/presentProperty";
const workOrderTypes = ['PREVENTIVE_MAINTENANCE', 'BREAKDOWN', 'INSPECTION', 'REPAIR', 'REPLACEMENT', 'COMPLAINT_LINKED', 'INSTALLATION', 'OTHER'] as const;
const workOrderStatuses = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'OVERDUE', 'COMPLETED', 'VERIFIED', 'CLOSED', 'ON_HOLD'] as const;
export const mockWorkOrders: WorkOrder[] = Array.from({ length: 16 }, (_, index) => ({
    id: `work-order-${index + 1}`,
    workOrderNumber: `WO-GVH-2026-${String(index + 1).padStart(4, '0')}`,
    title: `${getRequiredItem(workOrderTypes, index % workOrderTypes.length, "workOrders.mock.ts").replace(/_/g, ' ')} task`,
    type: getRequiredItem(workOrderTypes, index % workOrderTypes.length, "workOrders.mock.ts"),
    linkedAssetId: `asset-${(index % 10) + 1}`,
    linkedAssetName: getRequiredItem(['Lift A1', 'Water Pump B2', 'Generator Main', 'CCTV Gate'], index % 4, "workOrders.mock.ts"),
    vendorId: `vendor-${(index % 8) + 1}`,
    vendorName: getRequiredItem(['Lift Services Nashik', 'Electrical Services Nashik', 'Fire Safety Services Nashik'], index % 3, "workOrders.mock.ts"),
    priority: index % 5 === 0 ? 'URGENT' : index % 3 === 0 ? 'HIGH' : 'MEDIUM',
    status: getRequiredItem(workOrderStatuses, index % workOrderStatuses.length, "workOrders.mock.ts"),
    dueDate: `2026-07-${String((index % 15) + 1).padStart(2, '0')}`,
    assignedTo: 'Suresh Patil',
    slaStatus: index % 4 === 0 ? 'SLA at risk' : 'Within SLA',
    source: index % 3 === 0 ? 'SCHEDULE' : index % 3 === 1 ? 'MANUAL' : 'BREAKDOWN',
    description: 'Mock work order for facility operations tracking.',
    notes: 'Lifecycle actions are local mock only.',
    ...includeWhenPresent("evidenceLabel", index % 4 === 0 ? 'service-photo.jpg' : undefined),
    verificationStatus: index % 5 === 0 ? 'Pending facility manager verification' : 'Not due',
    ...includeWhenPresent("linkedComplaintId", index % 6 === 0 ? `complaint-${index}` : undefined),
    timeline: [
        { id: `wo-${index}-t1`, title: 'Work order created', note: 'Created in mock mode.', createdAt: '2026-06-29T09:00:00.000Z' },
        { id: `wo-${index}-t2`, title: 'Vendor assigned', note: 'Assignment recorded locally.', createdAt: '2026-06-29T09:30:00.000Z' },
    ]
}));
export const mockFacilityIncidents: FacilityIncident[] = Array.from({ length: 5 }, (_, index) => ({
    id: `facility-incident-${index + 1}`,
    assetId: `asset-${index + 1}`,
    assetName: getRequiredItem(['Lift A1', 'Fire Pump', 'Generator Main', 'CCTV DVR', 'Water Pump'], index, "workOrders.mock.ts"),
    location: getRequiredItem(['A Wing', 'Basement B2', 'Main Gate', 'Security Room', 'Pump Room'], index, "workOrders.mock.ts"),
    description: 'Mock asset breakdown incident.',
    severity: index === 1 ? 'CRITICAL' : index === 2 ? 'HIGH' : 'MEDIUM',
    operationalImpact: index === 1 ? 'SERVICE_DOWN' : index === 2 ? 'SAFETY_RISK' : 'PARTIAL_IMPACT',
    immediateActionTaken: 'Area isolated and facility manager notified.',
    evidenceLabel: 'asset-breakdown-photo.jpg',
    vendorNotificationRequired: true,
    linkedWorkOrderId: `work-order-${index + 1}`
}));

