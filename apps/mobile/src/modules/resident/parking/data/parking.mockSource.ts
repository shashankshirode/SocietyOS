import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { resolveRequestContext } from '../../homeContext/utils/resolveRequestContext';
import { mockParkingRules, mockParkingSlots, mockParkingUnit, mockStickerRfidRecords, mockVisitorParkingPasses, } from '../../../../shared/mock/parking.mock';
import { mockParkingHardwareReadiness } from '../../../../shared/mock/parkingHardware.mock';
import { mockParkingIncidents } from '../../../../shared/mock/parkingIncidents.mock';
import { mockParkingViolations } from '../../../../shared/mock/parkingViolations.mock';
import { mockGuardVehicleLookupResults, mockVehicles } from '../../../../shared/mock/vehicles.mock';
import type { AddVehicleInput, GuardVehicleLookupResult, Vehicle } from '../../../../shared/types/vehicle.types';
import type { CreateParkingIncidentInput, CreateVisitorParkingPassInput, ExtendVisitorParkingPassInput, ParkingHardwareActionInput, ParkingHardwareReadiness, ParkingHome, ParkingIncident, ParkingRules, ParkingSlot, ParkingSlotChangeRequestInput, ParkingViolation, StickerRfidRecord, VisitorParkingPass, SocietyParkingAllocationPolicy } from '../../../../shared/types/parking.types';
import type { ParkingIncidentListParams } from './parking.dto';
import { residentScopedVehicles } from '../../mock/residentMockDomainBuilders';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
import { mockStore } from '../../../../core/mockStore/mockStore';
const vehicles: Vehicle[] = [...residentScopedVehicles, ...mockVehicles];
const visitorPasses: VisitorParkingPass[] = [...mockVisitorParkingPasses];
const incidents: ParkingIncident[] = [...mockParkingIncidents];
const stickerRfidRecords: StickerRfidRecord[] = mockStickerRfidRecords.map((record) => ({ ...record }));
let configuredAllocationPolicy: SocietyParkingAllocationPolicy = 'FIXED_ALLOTMENT';
function normalizeSearch(value: string): string {
    return value.trim().toLowerCase();
}
function maskMobile(mobileNumber: string): string {
    return mobileNumber.replace(/\d(?=\d{4})/g, '*');
}
function filterByQuery(query: string, values: (string | Absent)[]): boolean {
    const normalized = normalizeSearch(query);
    if (!normalized) {
        return true;
    }
    return values.some((value) => value?.toLowerCase().includes(normalized));
}
export const parkingMockSource = {
    getSocietyAllocationPolicy(): SocietyParkingAllocationPolicy {
        return configuredAllocationPolicy;
    },
    setSocietyAllocationPolicy(policy: SocietyParkingAllocationPolicy): void {
        configuredAllocationPolicy = policy;
    },
    async getParkingHome(unitId: string): Promise<RepositoryResult<ParkingHome>> {
        await withMockDelay();
        const ctx = resolveRequestContext();
        const active = ctx.activeHome;
        const unitVehicles = vehicles.filter((vehicle) => vehicle.unitId === unitId || vehicle.linkedFlat === active.flatNumber);
        const unitSlots = configuredAllocationPolicy === 'NO_PARKING_SOCIETY' || configuredAllocationPolicy === 'OPEN_COMMON_POOL'
            ? []
            : mockParkingSlots.filter((slot) => slot.linkedUnitId === unitId || slot.linkedFlat === active.flatNumber);
        const unitIncidents = incidents.filter((incident) => incident.unitId === unitId || incident.reportedFlat === active.flatNumber);
        return repositorySuccess({
            allocationPolicy: configuredAllocationPolicy,
            resident: {
                id: active.residentId,
                name: active.residentRole === 'tenant' ? 'Amit' : 'Shashank',
                role: active.residentRole === 'familyMember' ? 'FAMILY_MEMBER' : active.residentRole.toUpperCase() as 'OWNER' | 'TENANT',
                societyId: active.societyId,
                societyName: active.societyName,
                unitId: active.unitId,
                tower: active.wingName || active.towerName || 'Tower',
                flatNumber: active.flatNumber,
                city: active.city
            },
            unit: {
                id: active.unitId,
                societyId: active.societyId,
                tower: active.wingName || active.towerName || 'Tower',
                flatNumber: active.flatNumber,
                parkingSlots: unitSlots.map(s => s.slotNumber)
            },
            registeredVehiclesCount: unitVehicles.length,
            allocatedParkingSlotsCount: unitSlots.length,
            visitorParkingRequestsCount: visitorPasses.filter((pass) => (pass.unitId === unitId || pass.visitingFlat === active.flatNumber) && pass.status !== 'EXPIRED').length,
            openParkingIncidentsCount: unitIncidents.filter((incident) => !['RESOLVED', 'REJECTED', 'CLOSED'].includes(incident.status)).length,
            pendingStickerRfidCount: unitVehicles.filter((vehicle) => vehicle.stickerStatus !== 'ISSUED' || !['ACTIVE', 'NOT_CONFIGURED'].includes(vehicle.rfidStatus)).length,
            recentActivity: [
                'MH15AB1234 entered through Main Gate today at 8:42 AM.',
                'Visitor parking pass VP-GVH-2401 approved for today evening.',
                'Incident PKG-2026-0002 notified to security team.',
            ],
            vehicles: unitVehicles,
            parkingSlots: unitSlots,
            incidents: unitIncidents
        });
    },
    async getMyVehicles(unitId: string): Promise<RepositoryResult<Vehicle[]>> {
        await withMockDelay();
        return repositorySuccess(vehicles.filter((vehicle) => vehicle.unitId === unitId));
    },
    async getVehicleDetail(vehicleId: string): Promise<RepositoryResult<Vehicle | Absent>> {
        await withMockDelay();
        return repositorySuccess(vehicles.find((vehicle) => vehicle.id === vehicleId));
    },
    async addVehicle(input: AddVehicleInput): Promise<RepositoryResult<Vehicle>> {
        await withMockDelay();
        const normalizedNumber = input.vehicleNumber.toUpperCase().replace(/[\s-]/g, '');
        const duplicateInLocal = vehicles.find((v) => v.societyId === input.societyId && v.vehicleNumber.replace(/[\s-]/g, '') === normalizedNumber);
        const duplicateInStore = mockStore.getState().vehicles.find((v) => v.societyId === input.societyId && v.vehicleNumber.replace(/[\s-]/g, '') === normalizedNumber);
        if (duplicateInLocal || duplicateInStore) {
            return {
                ok: false,
                error: {
                    code: 'VEHICLE_ALREADY_REGISTERED',
                    message: `Vehicle ${normalizedNumber} is already registered in this society.`
                }
            };
        }
        const vehicle: Vehicle = {
            id: `vehicle-${Date.now()}`,
            societyId: input.societyId,
            unitId: input.unitId,
            vehicleNumber: normalizedNumber,
            vehicleType: input.vehicleType,
            makeModel: input.makeModel,
            color: input.color,
            fuelType: input.fuelType,
            isEv: input.vehicleType === 'EV' || input.fuelType === 'ELECTRIC',
            ownerName: input.ownerName,
            linkedResidentName: input.linkedResidentName,
            linkedFlat: mockParkingUnit.flatNumber,
            ...includeWhenPresent("parkingSlotId", input.parkingSlotId),
            ...includeWhenPresent("parkingSlotNumber", input.parkingSlotId
                ? mockParkingSlots.find((slot) => slot.id === input.parkingSlotId)?.slotNumber
                : undefined),
            stickerStatus: 'NOT_ISSUED',
            rfidStatus: 'NOT_CONFIGURED',
            verificationStatus: 'PENDING',
            registrationDocumentStatus: input.registrationDocumentName ? 'UPLOADED' : 'NOT_UPLOADED',
            ...includeWhenPresent("insuranceExpiry", input.insuranceExpiry),
            ...includeWhenPresent("pollutionCertificateExpiry", input.fuelType === 'ELECTRIC' ? 'Not applicable for EV' : undefined),
            lastGateEntry: 'No gate entry recorded yet',
            lastUpdatedAt: new Date().toISOString(),
            ...includeWhenPresent("notes", input.notes)
        };
        vehicles.unshift(vehicle);
        mockStore.addVehicle(vehicle);
        return repositorySuccess(vehicle);
    },
    async getParkingSlots(unitId: string): Promise<RepositoryResult<ParkingSlot[]>> {
        await withMockDelay();
        return repositorySuccess(mockParkingSlots.filter((slot) => slot.linkedUnitId === unitId));
    },
    async getParkingSlotDetail(slotId: string): Promise<RepositoryResult<ParkingSlot | Absent>> {
        await withMockDelay();
        return repositorySuccess(mockParkingSlots.find((slot) => slot.id === slotId));
    },
    async requestParkingSlotChange(input: ParkingSlotChangeRequestInput): Promise<RepositoryResult<boolean>> {
        await withMockDelay();
        const slotExists = mockParkingSlots.some((slot) => slot.id === input.slotId && slot.societyId === input.societyId);
        return repositorySuccess(slotExists);
    },
    async getVisitorParkingPasses(unitId: string): Promise<RepositoryResult<VisitorParkingPass[]>> {
        await withMockDelay();
        return repositorySuccess(visitorPasses.filter((pass) => pass.unitId === unitId));
    },
    async createVisitorParkingPass(input: CreateVisitorParkingPassInput): Promise<RepositoryResult<VisitorParkingPass>> {
        await withMockDelay();
        const pass: VisitorParkingPass = {
            id: `visitor-parking-pass-${Date.now()}`,
            unitId: input.unitId,
            passNumber: `VP-GVH-${Math.floor(1000 + Math.random() * 8999)}`,
            visitorName: input.visitorName,
            mobileMasked: maskMobile(input.mobileNumber),
            vehicleNumber: input.vehicleNumber.toUpperCase().replace(/\s/g, ''),
            vehicleType: input.vehicleType,
            visitPurpose: input.visitPurpose,
            visitingFlat: input.visitingFlat,
            approvedParkingZone: 'Visitor Zone V2',
            validFrom: `${input.expectedDate} ${input.expectedTime}`,
            validUntil: `${input.expectedDate} ${input.duration}`,
            status: 'REQUESTED',
            instructions: ['Mock request created.', 'Security approval and QR generation will be connected later.']
        };
        visitorPasses.unshift(pass);
        return repositorySuccess(pass);
    },
    async getVisitorParkingPassDetail(passId: string): Promise<RepositoryResult<VisitorParkingPass | Absent>> {
        await withMockDelay();
        return repositorySuccess(visitorPasses.find((pass) => pass.id === passId));
    },
    async cancelVisitorParkingPass(passId: string): Promise<RepositoryResult<VisitorParkingPass | Absent>> {
        await withMockDelay();
        const pass = visitorPasses.find((candidate) => candidate.id === passId);
        if (pass && !['USED', 'EXPIRED', 'CANCELLED', 'REJECTED'].includes(pass.status)) {
            pass.status = 'CANCELLED';
        }
        return repositorySuccess(pass);
    },
    async extendVisitorParkingPass(input: ExtendVisitorParkingPassInput): Promise<RepositoryResult<VisitorParkingPass | Absent>> {
        await withMockDelay();
        const pass = visitorPasses.find((candidate) => candidate.id === input.passId);
        if (pass && !['USED', 'EXPIRED', 'CANCELLED', 'REJECTED'].includes(pass.status)) {
            const parsedEnd = Date.parse(pass.validUntil);
            pass.validUntil = Number.isNaN(parsedEnd)
                ? `${pass.validUntil} · extended by ${input.hours} hours`
                : new Date(parsedEnd + input.hours * 60 * 60 * 1000).toISOString();
        }
        return repositorySuccess(pass);
    },
    async getParkingIncidents(params: ParkingIncidentListParams = {}): Promise<RepositoryResult<ParkingIncident[]>> {
        await withMockDelay();
        const filtered = incidents.filter((incident) => {
            const matchesUnit = params.unitId ? incident.unitId === params.unitId || incident.reportedFlat === mockParkingUnit.flatNumber : true;
            const matchesStatus = params.status && params.status !== 'ALL' ? incident.status === params.status : true;
            const matchesQuery = params.query
                ? filterByQuery(params.query, [incident.incidentNumber, incident.vehicleNumber, incident.location])
                : true;
            return matchesUnit && matchesStatus && matchesQuery;
        });
        return repositorySuccess(filtered);
    },
    async getParkingIncidentDetail(incidentId: string): Promise<RepositoryResult<ParkingIncident | Absent>> {
        await withMockDelay();
        return repositorySuccess(incidents.find((incident) => incident.id === incidentId));
    },
    async createParkingIncident(input: CreateParkingIncidentInput): Promise<RepositoryResult<ParkingIncident>> {
        await withMockDelay();
        const now = new Date().toISOString();
        const incident: ParkingIncident = {
            id: `parking-incident-${Date.now()}`,
            societyId: input.societyId,
            unitId: input.unitId,
            incidentNumber: `PKG-2026-${String(incidents.length + 1).padStart(4, '0')}`,
            issueType: input.issueType,
            reportedBy: input.reportedBy,
            reportedFlat: input.reportedFlat,
            ...includeWhenPresent("vehicleNumber", input.vehicleNumber?.toUpperCase().replace(/\s/g, '')),
            location: input.location,
            description: input.description,
            priority: input.priority,
            status: input.immediateSecurityHelp || input.isVehicleBlocked ? 'SECURITY_NOTIFIED' : 'REPORTED',
            createdAt: now,
            updatedAt: now,
            assignedTeam: 'Main Gate Security',
            ...includeWhenPresent("assignedTo", input.immediateSecurityHelp ? 'Security team notified in mock mode' : undefined),
            ...includeWhenPresent("evidenceLabel", input.evidenceLabel),
            timeline: [
                {
                    id: `timeline-${Date.now()}-1`,
                    title: 'Incident reported',
                    note: 'Report captured in mock mode.',
                    createdAt: now
                },
                ...(input.immediateSecurityHelp || input.isVehicleBlocked
                    ? [{
                            id: `timeline-${Date.now()}-2`,
                            title: 'Security notified',
                            note: 'Security team has been notified in mock mode.',
                            createdAt: now
                        }]
                    : []),
            ]
        };
        incidents.unshift(incident);
        return repositorySuccess(incident);
    },
    async resolveParkingIncident(incidentId: string): Promise<RepositoryResult<ParkingIncident | Absent>> {
        await withMockDelay();
        const incident = incidents.find((item) => item.id === incidentId);
        if (incident) {
            incident.status = 'RESOLVED';
            incident.updatedAt = new Date().toISOString();
            incident.resolutionNotes = 'Resolved locally in mock mode. Backend audit logs will be required later.';
            incident.timeline.push({
                id: `timeline-${Date.now()}-resolved`,
                title: 'Resolved by guard',
                note: 'Mock resolve action recorded.',
                createdAt: incident.updatedAt
            });
        }
        return repositorySuccess(incident);
    },
    async escalateParkingIncident(incidentId: string): Promise<RepositoryResult<ParkingIncident | Absent>> {
        await withMockDelay();
        const incident = incidents.find((item) => item.id === incidentId);
        if (incident) {
            incident.status = 'ESCALATED';
            incident.priority = 'URGENT';
            incident.updatedAt = new Date().toISOString();
            incident.timeline.push({
                id: `timeline-${Date.now()}-escalated`,
                title: 'Escalated',
                note: 'Mock escalation recorded for society admin review.',
                createdAt: incident.updatedAt
            });
        }
        return repositorySuccess(incident);
    },
    async reportFalseParkingResolution(incidentId: string): Promise<RepositoryResult<ParkingIncident | Absent>> {
        await withMockDelay();
        const incident = incidents.find((item) => item.id === incidentId);
        if (incident && ['RESOLVED', 'CLOSED'].includes(incident.status)) {
            incident.status = 'ESCALATED';
            incident.priority = 'URGENT';
            incident.updatedAt = new Date().toISOString();
            incident.timeline.push({
                id: `timeline-${Date.now()}-false-resolution`,
                title: 'Resolution disputed',
                note: 'The resident reported that the parking issue remains unresolved.',
                createdAt: incident.updatedAt
            });
        }
        return repositorySuccess(incident);
    },
    async getParkingViolationHistory(unitId: string): Promise<RepositoryResult<ParkingViolation[]>> {
        await withMockDelay();
        const unitVehicleNumbers = vehicles.filter((vehicle) => vehicle.unitId === unitId).map((vehicle) => vehicle.vehicleNumber);
        return repositorySuccess(mockParkingViolations.filter((violation) => unitVehicleNumbers.includes(violation.vehicleNumber) || violation.isRepeatOffence));
    },
    async getStickerRfidStatus(unitId: string): Promise<RepositoryResult<StickerRfidRecord[]>> {
        await withMockDelay();
        const unitVehicleIds = vehicles.filter((vehicle) => vehicle.unitId === unitId).map((vehicle) => vehicle.id);
        return repositorySuccess(stickerRfidRecords.filter((record) => unitVehicleIds.includes(record.vehicleId)));
    },
    async updateParkingHardware(input: ParkingHardwareActionInput): Promise<RepositoryResult<StickerRfidRecord | Absent>> {
        await withMockDelay();
        const record = stickerRfidRecords.find((candidate) => candidate.id === input.recordId && candidate.vehicleId === input.vehicleId);
        if (!record)
            return repositorySuccess(undefined);
        if (input.action === 'REQUEST_STICKER') {
            record.stickerStatus = 'NOT_ISSUED';
            delete record.stickerNumber;
            delete record.stickerIssuedDate;
            delete record.stickerValidUntil;
        }
        else if (input.action === 'REQUEST_RFID') {
            record.rfidStatus = 'REQUESTED';
        }
        else {
            record.stickerStatus = 'LOST';
        }
        return repositorySuccess(record);
    },
    async lookupVehicleForGuard(query: string): Promise<RepositoryResult<GuardVehicleLookupResult[]>> {
        await withMockDelay();
        const normalized = normalizeSearch(query);
        if (!normalized) {
            return repositorySuccess([]);
        }
        const staticResults = mockGuardVehicleLookupResults.filter((result) => filterByQuery(normalized, [
            result.vehicleNumber,
            result.linkedFlat,
            result.parkingSlotNumber,
            result.residentName,
        ]));
        const allKnownVehicles = [...vehicles, ...mockStore.getState().vehicles];
        const dynamicResults: GuardVehicleLookupResult[] = allKnownVehicles
            .filter((v) => filterByQuery(normalized, [
                v.vehicleNumber,
                v.linkedFlat,
                v.parkingSlotNumber,
                v.linkedResidentName,
                v.ownerName,
                v.makeModel,
            ]))
            .map((v) => ({
                id: v.id,
                vehicleId: v.id,
                vehicleNumber: v.vehicleNumber,
                vehicleType: v.vehicleType,
                residentName: v.linkedResidentName || v.ownerName,
                linkedFlat: v.linkedFlat,
                parkingSlotNumber: v.parkingSlotNumber || 'Unassigned',
                stickerStatus: v.stickerStatus,
                rfidStatus: v.rfidStatus,
                verificationStatus: v.verificationStatus,
                recentEntryStatus: v.lastGateEntry ? `Last entered ${v.lastGateEntry}` : 'No recent entry',
            }));
        const combined = [...dynamicResults, ...staticResults];
        const unique = combined.filter((item, index, self) =>
            index === self.findIndex((c) => c.vehicleNumber.replace(/[\s-]/g, '') === item.vehicleNumber.replace(/[\s-]/g, ''))
        );
        return repositorySuccess(unique);
    },
    async getHardwareReadiness(societyId: string): Promise<RepositoryResult<ParkingHardwareReadiness>> {
        await withMockDelay();
        return repositorySuccess({ ...mockParkingHardwareReadiness, societyId });
    },
    async getParkingRules(): Promise<RepositoryResult<ParkingRules>> {
        await withMockDelay();
        return repositorySuccess(mockParkingRules);
    },
    async registerVehicle(input: AddVehicleInput): Promise<RepositoryResult<Vehicle>> {
        return this.addVehicle(input);
    },
    async allocateParkingSlot(params?: {
        slotId: string;
        unitId: string;
        vehicleId?: string;
        flatNumber?: string;
    } | JsonValue): Promise<RepositoryResult<ParkingSlot>> {
        await withMockDelay();
        if (!params || typeof params !== 'object') {
            return {
                ok: false,
                error: {
                    code: 'INVALID_ALLOCATION_PARAMS',
                    message: 'Invalid parking allocation parameters'
                }
            };
        }
        const input = params as { slotId: string; unitId: string; vehicleId?: string; flatNumber?: string };
        const slot = mockParkingSlots.find((s) => s.id === input.slotId || s.slotNumber === input.slotId);
        if (!slot) {
            return {
                ok: false,
                error: {
                    code: 'SLOT_NOT_FOUND',
                    message: 'Requested parking slot was not found.'
                }
            };
        }
        if (slot.allocationStatus === 'ALLOCATED' && slot.linkedUnitId && slot.linkedUnitId !== input.unitId) {
            return {
                ok: false,
                error: {
                    code: 'SLOT_ALREADY_ALLOCATED',
                    message: `Parking slot ${slot.slotNumber} is already allocated to flat ${slot.linkedFlat || slot.linkedUnitId}.`
                }
            };
        }
        slot.allocationStatus = 'ALLOCATED';
        slot.linkedUnitId = input.unitId;
        if (input.flatNumber) {
            slot.linkedFlat = input.flatNumber;
        }
        if (input.vehicleId) {
            slot.linkedVehicleId = input.vehicleId;
            const targetVehicle = vehicles.find((v) => v.id === input.vehicleId) ||
                mockStore.getState().vehicles.find((v) => v.id === input.vehicleId);
            if (targetVehicle) {
                targetVehicle.parkingSlotId = slot.id;
                targetVehicle.parkingSlotNumber = slot.slotNumber;
                slot.linkedVehicleNumber = targetVehicle.vehicleNumber;
                mockStore.updateVehicle(targetVehicle.id, {
                    parkingSlotId: slot.id,
                    parkingSlotNumber: slot.slotNumber,
                });
            }
        }
        return repositorySuccess(slot);
    },
    async createTemporaryVehiclePass(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async listParkingViolations(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async getRfidReadinessStatus(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    simulateVehicleGateEvent(vehicleId: string, eventType: 'ENTRY' | 'EXIT', gateLabel: string = 'Gate 2'): void {
        const v = vehicles.find((item) => item.id === vehicleId || item.vehicleNumber === vehicleId || item.makeModel?.toLowerCase().includes('honda'));
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (v) {
            v.lastGateEntry = eventType === 'ENTRY'
                ? `Entered through ${gateLabel} today at ${nowStr}`
                : `Exited through ${gateLabel} today at ${nowStr}`;
            v.lastUpdatedAt = new Date().toISOString();
        }
    }
};

