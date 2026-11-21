import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { OwnerInfo, TenantInfo, FamilyMember, Vehicle, MoveInRequest, ResidentHistoryRecord, UnitDocumentSummary } from '../../../../shared/types/ownerTenant.types';
import type { OccupancyOverview, OccupancyTimelineEvent, UnitDetails } from '../../../../shared/types/occupancy.types';
import type { UnitAccessStatusInfo } from '../../../../shared/types/unitAccess.types';
import { mockCurrentOwner, mockCoOwner, mockCurrentTenant, mockFamilyMembers, mockVehicles, mockPreviousOwners, mockPreviousTenants, } from '../../../../shared/mock/ownerTenant.mock';
import { mockOccupancyTimeline } from '../../../../shared/mock/occupancyTimeline.mock';
import { mockUnitAccessStatus } from '../../../../shared/mock/unitAccess.mock';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
export interface PropertyCorrectionRequest {
    id: string;
    unitId: string;
    field: string;
    currentValue: string;
    proposedValue: string;
    reason: string;
    status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
    submittedAt: string;
}
const correctionRequests: PropertyCorrectionRequest[] = [];
const mockUnit: UnitDetails = {
    id: 'unit-a-1204',
    societyId: 'society-001',
    tower: 'A Wing',
    floor: '12',
    flatNumber: 'A-1204',
    unitType: 'APARTMENT',
    occupancyStatus: 'OWNER_OCCUPIED',
    carpetAreaSqFt: 1450,
    parkingSlots: ['B2-P114', 'B2-P115']
};
export const ownerTenantMockSource = {
    async getUnitOccupancyOverview(unitId: string): Promise<RepositoryResult<OccupancyOverview>> {
        await withMockDelay();
        if (unitId === 'unit-gv-b-804' || unitId.includes('b-804')) {
            return repositorySuccess({
                unitDetails: {
                    id: 'unit-gv-b-804',
                    societyId: 'society-gv',
                    tower: 'Tower B',
                    floor: '8',
                    flatNumber: 'B-804',
                    unitType: 'APARTMENT',
                    occupancyStatus: 'OWNER_OCCUPIED',
                    carpetAreaSqFt: 750,
                    parkingSlots: ['B1-P204']
                },
                societyName: 'Green Valley Heights',
                familyMembersCount: 3,
                vehiclesCount: 1,
                documentsCompletionCount: 4,
                documentsPendingCount: 0,
                previousOwnersCount: 0,
                previousTenantsCount: 0,
                lastOwnershipChangeDate: '2023-11-15'
            });
        }
        if (unitId === 'unit-gp-c-503' || unitId.includes('c-503')) {
            return repositorySuccess({
                unitDetails: {
                    id: 'unit-gp-c-503',
                    societyId: 'society-gp',
                    tower: 'Building C',
                    floor: '5',
                    flatNumber: 'C-503',
                    unitType: 'APARTMENT',
                    occupancyStatus: 'TENANT_OCCUPIED',
                    carpetAreaSqFt: 850,
                    parkingSlots: ['C-Open-12']
                },
                societyName: 'Gokhale Park Residency',
                currentTenant: mockCurrentTenant,
                familyMembersCount: 1,
                vehiclesCount: 1,
                documentsCompletionCount: 3,
                documentsPendingCount: 1,
                previousOwnersCount: 1,
                previousTenantsCount: 2,
                lastTenancyChangeDate: '2025-06-01'
            });
        }
        if (unitId === 'unit-ra-b-2101' || unitId.includes('b-2101')) {
            return repositorySuccess({
                unitDetails: {
                    id: 'unit-ra-b-2101',
                    societyId: 'society-ra',
                    tower: 'Phase 3',
                    floor: '21',
                    flatNumber: 'B-2101',
                    unitType: 'APARTMENT',
                    occupancyStatus: 'OWNER_OCCUPIED',
                    carpetAreaSqFt: 1200,
                    parkingSlots: ['P3-441', 'P3-442']
                },
                societyName: 'Rohan Ananta',
                currentOwner: mockCurrentOwner,
                familyMembersCount: 2,
                vehiclesCount: 2,
                documentsCompletionCount: 5,
                documentsPendingCount: 0,
                previousOwnersCount: 0,
                previousTenantsCount: 0,
                lastOwnershipChangeDate: '2025-01-10'
            });
        }
        return repositorySuccess({
            unitDetails: mockUnit,
            societyName: 'Green Valley Heights',
            currentOwner: mockCurrentOwner,
            familyMembersCount: mockFamilyMembers.filter((f) => f.residentType === 'OWNER_FAMILY').length,
            vehiclesCount: mockVehicles.filter((v) => v.linkedResidentName.includes('Shirode')).length,
            documentsCompletionCount: 6,
            documentsPendingCount: 1,
            previousOwnersCount: mockPreviousOwners.length,
            previousTenantsCount: mockPreviousTenants.length,
            lastOwnershipChangeDate: '2024-04-12',
            lastTenancyChangeDate: '2024-02-28 (Lease Expiry)'
        });
    },
    async getCurrentOwner(unitId: string): Promise<RepositoryResult<{
        primary: OwnerInfo;
        coOwner?: OwnerInfo;
    }>> {
        await withMockDelay();
        return repositorySuccess({
            primary: mockCurrentOwner,
            coOwner: mockCoOwner
        });
    },
    async getCurrentTenant(unitId: string): Promise<RepositoryResult<TenantInfo | Absent>> {
        await withMockDelay();
        return repositorySuccess(mockCurrentTenant);
    },
    async getFamilyMembers(unitId: string): Promise<RepositoryResult<FamilyMember[]>> {
        await withMockDelay();
        return repositorySuccess(mockFamilyMembers);
    },
    async getVehicles(unitId: string): Promise<RepositoryResult<Vehicle[]>> {
        await withMockDelay();
        return repositorySuccess(mockVehicles);
    },
    async getOwnerHistory(unitId: string): Promise<RepositoryResult<ResidentHistoryRecord[]>> {
        await withMockDelay();
        return repositorySuccess(mockPreviousOwners);
    },
    async getTenantHistory(unitId: string): Promise<RepositoryResult<ResidentHistoryRecord[]>> {
        await withMockDelay();
        return repositorySuccess(mockPreviousTenants);
    },
    async getOccupancyTimeline(unitId: string): Promise<RepositoryResult<OccupancyTimelineEvent[]>> {
        await withMockDelay();
        return repositorySuccess(mockOccupancyTimeline);
    },
    async getPreviousResidentDetail(unitId: string, residentHistoryId: string): Promise<RepositoryResult<ResidentHistoryRecord | Absent>> {
        await withMockDelay();
        const record = mockPreviousOwners.find((p) => p.id === residentHistoryId) ||
            mockPreviousTenants.find((t) => t.id === residentHistoryId);
        return repositorySuccess(record);
    },
    async getPreviousResidentDocuments(unitId: string, residentHistoryId: string): Promise<RepositoryResult<{
        id: string;
        title: string;
        category: string;
        sensitivity: string;
    }[]>> {
        await withMockDelay();
        return repositorySuccess([
            { id: 'doc-prev-001', title: 'Sale Deed Aggregation Copy', category: 'SALE_DEED', sensitivity: 'RESTRICTED' },
            { id: 'doc-prev-002', title: 'Police Verification Clearance', category: 'POLICE_VERIFICATION', sensitivity: 'RESTRICTED' },
            { id: 'doc-prev-003', title: 'Resident Aadhaar Identification Copy', category: 'OWNER_KYC', sensitivity: 'RESTRICTED' },
        ]);
    },
    async createMoveInRequest(input: Partial<MoveInRequest>): Promise<RepositoryResult<MoveInRequest>> {
        await withMockDelay();
        const newRequest: MoveInRequest = {
            id: `mi-req-${Math.floor(1000 + Math.random() * 9000)}`,
            residentType: input.residentType || 'TENANT',
            unitId: input.unitId || 'unit-a-1204',
            moveInDate: input.moveInDate || getRequiredItem(new Date().toISOString().split('T'), 0, "ownerTenant.mockSource.ts"),
            residentName: input.residentName || '',
            mobile: input.mobile || '',
            ...includeWhenPresent("email", input.email),
            vehicleCount: input.vehicleCount || 0,
            familyMemberCount: input.familyMemberCount || 0,
            liftSlotRequired: !!input.liftSlotRequired,
            truckEntryRequired: !!input.truckEntryRequired,
            ...includeWhenPresent("notes", input.notes),
            status: 'PENDING_APPROVAL',
            approvalSteps: [
                { stepName: 'Primary Owner Consent', status: 'PENDING' },
                { stepName: 'Document Verification', status: 'PENDING' },
                { stepName: 'Society Admin Approval', status: 'PENDING' },
                { stepName: 'Access Activation', status: 'PENDING' },
            ]
        };
        return repositorySuccess(newRequest);
    },
    async getUnitAccessStatus(unitId: string): Promise<RepositoryResult<UnitAccessStatusInfo>> {
        await withMockDelay();
        return repositorySuccess(mockUnitAccessStatus);
    },
    async getUnitDocuments(unitId: string): Promise<RepositoryResult<UnitDocumentSummary[]>> {
        await withMockDelay();
        return repositorySuccess([
            { id: 'doc-001', title: 'Primary Owner Masked Aadhaar Copy', category: 'OWNER_KYC', status: 'VERIFIED', expiry: 'Permanent' },
            { id: 'doc-002', title: 'Primary Owner Masked PAN Copy', category: 'OWNER_KYC', status: 'VERIFIED', expiry: 'Permanent' },
            { id: 'doc-003', title: 'Sale Deed Index II Copy', category: 'SALE_DEED', status: 'VERIFIED', expiry: 'Permanent' },
            { id: 'doc-004', title: 'Allotment Share Certificate', category: 'SHARE_CERTIFICATE', status: 'VERIFIED', expiry: 'Permanent' },
            { id: 'doc-005', title: 'Police Verification Clearance', category: 'POLICE_VERIFICATION', status: 'VERIFIED', expiry: '2026-04-30' },
            { id: 'doc-006', title: 'Registered Rental Lease Agreement', category: 'RENT_AGREEMENT', status: 'VERIFIED', expiry: '2026-04-30' },
            { id: 'doc-007', title: 'Sedan Vehicle RC Smartcard', category: 'VEHICLE_DOCUMENT', status: 'VERIFIED', expiry: 'Permanent' },
        ]);
    },
    async createCorrectionRequest(input: {
        unitId: string;
        field: string;
        currentValue: string;
        proposedValue: string;
        reason: string;
    }): Promise<RepositoryResult<PropertyCorrectionRequest>> {
        await withMockDelay();
        const request: PropertyCorrectionRequest = {
            id: `cor-${Date.now()}`,
            unitId: input.unitId,
            field: input.field,
            currentValue: input.currentValue,
            proposedValue: input.proposedValue,
            reason: input.reason,
            status: 'PENDING_REVIEW',
            submittedAt: new Date().toISOString(),
        };
        correctionRequests.unshift(request);
        return repositorySuccess(request);
    },
    async getCorrectionRequests(unitId: string): Promise<RepositoryResult<PropertyCorrectionRequest[]>> {
        await withMockDelay();
        return repositorySuccess(correctionRequests.filter((r) => r.unitId === unitId));
    }
};

