import { LiftVisitType, MaintenanceVisitStatus } from '../types/liftSafety.types';
import { getRequiredItem } from "../utils/requiredItem";
export interface LiftMaintenanceVisit {
    id: string;
    liftId: string;
    liftNumber: string;
    vendor: string;
    technicianName: string;
    visitType: LiftVisitType;
    visitDate: string;
    findings: string;
    status: MaintenanceVisitStatus;
}
export const mockLiftMaintenanceVisits: LiftMaintenanceVisit[] = Array.from({ length: 15 }, (_, idx) => {
    const liftIds = ['lift-1', 'lift-2', 'lift-3', 'lift-4', 'lift-5', 'lift-6', 'lift-7', 'lift-8'];
    const liftNumbers = ['LIFT-A1', 'LIFT-A2', 'LIFT-B1', 'LIFT-B2', 'LIFT-C1', 'LIFT-C2', 'LIFT-CH1', 'LIFT-P1'];
    const types: LiftVisitType[] = ['PREVENTIVE_MAINTENANCE', 'BREAKDOWN_REPAIR', 'SAFETY_INSPECTION'];
    const liftIdx = idx % liftIds.length;
    const status = idx === 0 ? 'SCHEDULED' : idx === 1 ? 'IN_PROGRESS' : 'COMPLETED';
    return {
        id: `visit-${idx + 1}`,
        liftId: getRequiredItem(liftIds, liftIdx, "liftMaintenanceVisits.mock.ts"),
        liftNumber: getRequiredItem(liftNumbers, liftIdx, "liftMaintenanceVisits.mock.ts"),
        vendor: liftIdx < 2 ? 'OTIS Elevators' : liftIdx < 4 ? 'KONE Elevators' : liftIdx < 6 ? 'Schindler Lifts' : 'Johnson Lifts',
        technicianName: idx % 2 === 0 ? 'Aniket Sawant' : 'Vijay Salve',
        visitType: getRequiredItem(types, idx % types.length, "liftMaintenanceVisits.mock.ts"),
        visitDate: `2026-06-${String((idx % 28) + 1).padStart(2, '0')}`,
        findings: status === 'COMPLETED' ? 'Routine inspection completed. Replaced door rollers.' : 'Technician scheduled to visit.',
        status
    };
});

