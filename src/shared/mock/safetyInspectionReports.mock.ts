import { getRequiredItem } from "../utils/requiredItem";
export interface SafetyInspectionReport {
    id: string;
    reportNumber: string;
    category: string;
    inspector: string;
    status: string;
    date: string;
    score: number;
}
export const mockSafetyInspectionReports: SafetyInspectionReport[] = Array.from({ length: 10 }, (_, idx) => {
    const categories = ['Waste Segregation', 'Housekeeping Quality', 'Lift Safety Inspection', 'Fire Safety Audit'];
    const inspectors = ['Suresh Patil', 'Kavita Jadhav', 'Prakash More'];
    return {
        id: `sir-${idx + 1}`,
        reportNumber: `REP-SAFE-${2026}-${String(idx + 1).padStart(3, '0')}`,
        category: getRequiredItem(categories, idx % categories.length, "safetyInspectionReports.mock.ts"),
        inspector: getRequiredItem(inspectors, idx % inspectors.length, "safetyInspectionReports.mock.ts"),
        status: idx % 2 === 0 ? 'COMPLETED' : 'PENDING_REVIEW',
        date: `2026-06-${String((idx % 28) + 1).padStart(2, '0')}`,
        score: 85 + (idx % 15)
    };
});

