import { mockStore } from '../../../core/mockStore/mockStore';
import { Society, SocietyLifecycleStatus, CreateSocietyRequest, UpdateSocietyRequest, SocietyOnboardingDraft, Phase, Tower, Wing, Floor, Unit, UnitType, UnitOccupancyStatus, UnitBillingCategory, CreateUnitRequest, UpdateUnitRequest, BulkUnitGenerationRequest, BulkUnitPreviewItem, BulkUnitPreviewResult, ValidationCheck, ValidationResult, SocietyActivationRequest, SocietyActivationResult, PropertyHierarchyNode, PropertyHierarchyLevel, SOCIETY_LIFECYCLE_TRANSITIONS, canTransition, LEVEL_HIERARCHY_ORDER, getAllowedChildren, getParentLevel, } from '../data/societyProperty.types';
import { absentValue, type Absent } from '../../../shared/types/absence.types';
import type { UnitDetailInfo, SocietyHierarchyNode } from '../data/societySetup.types';
const STORAGE_KEY = 'society-os.platform.societies';
const DRAFTS_STORAGE_KEY = 'society-os.platform.onboarding-drafts';
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function toUnit(detail: UnitDetailInfo): Unit {
    return {
        id: detail.id,
        unitNumber: detail.unitNumber,
        societyId: detail.societyId || '',
        towerId: detail.towerId || '',
        floorId: detail.floorId || '',
        type: detail.type || '1BHK',
        carpetAreaSqFt: detail.carpetAreaSqFt ?? detail.areaSqFt ?? 0,
        builtupAreaSqFt: detail.builtupAreaSqFt ?? detail.areaSqFt ?? 0,
        occupancyStatus: (detail.occupancyStatus === 'OWNER_OCCUPIED' || detail.occupancyStatus === 'TENANT_OCCUPIED' || detail.occupancyStatus === 'VACANT' || detail.occupancyStatus === 'RESERVED' || detail.occupancyStatus === 'UNDER_CONSTRUCTION') ? detail.occupancyStatus : 'VACANT',
        billingCategory: detail.billingCategory || 'RESIDENTIAL',
        status: detail.status || 'ACTIVE',
        createdAt: detail.createdAt || new Date().toISOString(),
        updatedAt: detail.updatedAt || new Date().toISOString(),
        ...(detail.phaseId ? { phaseId: detail.phaseId } : {}),
        ...(detail.wingId ? { wingId: detail.wingId } : {}),
        ...(detail.superBuiltupAreaSqFt !== undefined ? { superBuiltupAreaSqFt: detail.superBuiltupAreaSqFt } : {}),
        ...(detail.parkingSlots ? { parkingSlots: detail.parkingSlots } : {}),
    };
}
function toPropertyNode(node: SocietyHierarchyNode, defaultSocietyId: string): PropertyHierarchyNode {
    const children = node.children?.map((c) => toPropertyNode(c, node.societyId || defaultSocietyId));
    return {
        id: node.id,
        name: node.name,
        code: node.code || node.id,
        level: (node.level || node.type || 'SOCIETY') as PropertyHierarchyLevel,
        societyId: node.societyId || defaultSocietyId,
        orderIndex: node.orderIndex ?? 0,
        createdAt: node.createdAt || new Date().toISOString(),
        updatedAt: node.updatedAt || new Date().toISOString(),
        ...(node.parentId ? { parentId: node.parentId } : {}),
        ...(children && children.length > 0 ? { children } : {}),
    };
}
function getStoredSocieties(): Society[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    catch {
        return [];
    }
}
function setStoredSocieties(societies: Society[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(societies));
}
function getStoredDrafts(): SocietyOnboardingDraft[] {
    try {
        const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    catch {
        return [];
    }
}
function setStoredDrafts(drafts: SocietyOnboardingDraft[]): void {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
}
export class SocietyService {
    static async getSocieties(): Promise<Society[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(getStoredSocieties()), 300);
        });
    }
    static async getSociety(id: string): Promise<Society | Absent> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const societies = getStoredSocieties();
                const society = societies.find((s) => s.id === id);
                resolve(society);
            }, 300);
        });
    }
    static async createSociety(request: CreateSocietyRequest): Promise<Society> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const societies = getStoredSocieties();
                const now = new Date().toISOString();
                const newSociety: Society = {
                    id: generateId('soc'),
                    name: request.name,
                    registrationNumber: request.registrationNumber ?? '',
                    type: request.type,
                    status: 'DRAFT',
                    address: request.address,
                    regionalConfig: request.regionalConfig,
                    planCode: 'PREMIUM',
                    billingMode: 'MONTHLY',
                    totalUnits: 0,
                    activeUsers: 0,
                    enabledModulesCount: 0,
                    createdAt: now,
                    updatedAt: now,
                };
                setStoredSocieties([...societies, newSociety]);
                resolve(newSociety);
            }, 400);
        });
    }
    static async updateSociety(request: UpdateSocietyRequest): Promise<Society> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const societies = getStoredSocieties();
                const index = societies.findIndex((s) => s.id === request.id);
                if (index === -1) {
                    reject(new Error('Society not found'));
                    return;
                }
                const target = societies[index];
                if (!target) {
                    reject(new Error('Society not found'));
                    return;
                }
                const updated: Society = {
                    ...target,
                    ...request,
                    updatedAt: new Date().toISOString(),
                };
                societies[index] = updated;
                setStoredSocieties(societies);
                resolve(updated);
            }, 400);
        });
    }
    static async transitionSocietyStatus(societyId: string, newStatus: SocietyLifecycleStatus, activatedBy?: string): Promise<Society> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const societies = getStoredSocieties();
                const index = societies.findIndex((s) => s.id === societyId);
                if (index === -1) {
                    reject(new Error('Society not found'));
                    return;
                }
                const target = societies[index];
                if (!target) {
                    reject(new Error('Society not found'));
                    return;
                }
                const currentStatus = target.status;
                if (!canTransition(currentStatus, newStatus)) {
                    reject(new Error(`Cannot transition from ${currentStatus} to ${newStatus}`));
                    return;
                }
                const updated: Society = {
                    ...target,
                    status: newStatus,
                    updatedAt: new Date().toISOString(),
                    ...(newStatus === 'ACTIVE' && activatedBy ? { activatedAt: new Date().toISOString() } : {}),
                };
                societies[index] = updated;
                setStoredSocieties(societies);
                resolve(updated);
            }, 400);
        });
    }
    static async getPhases(societyId: string): Promise<Phase[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const hierarchy = mockStore.getState().societyHierarchy;
                const rawPhases = hierarchy.children?.filter((c) => c.level === 'PHASE') || [];
                const phases: Phase[] = rawPhases.map((p) => ({
                    id: p.id,
                    name: p.name,
                    code: p.code || p.id,
                    level: 'PHASE',
                    societyId,
                    orderIndex: p.orderIndex ?? 0,
                    createdAt: p.createdAt || new Date().toISOString(),
                    updatedAt: p.updatedAt || new Date().toISOString(),
                }));
                resolve(phases);
            }, 300);
        });
    }
    static async createPhase(societyId: string, phase: Omit<Phase, 'id' | 'level' | 'societyId' | 'createdAt' | 'updatedAt' | 'children'>): Promise<Phase> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const hierarchy = mockStore.getState().societyHierarchy;
                const now = new Date().toISOString();
                const newPhase: Phase = {
                    ...phase,
                    id: generateId('phase'),
                    level: 'PHASE',
                    societyId,
                    orderIndex: (hierarchy.children?.filter((c) => c.level === 'PHASE').length ?? 0),
                    createdAt: now,
                    updatedAt: now,
                    children: [],
                };
                const newPhaseNode: SocietyHierarchyNode = {
                    id: newPhase.id,
                    name: newPhase.name,
                    code: newPhase.code,
                    level: 'PHASE',
                    societyId,
                    orderIndex: newPhase.orderIndex,
                    createdAt: now,
                    updatedAt: now,
                    children: [],
                };
                mockStore.updateSocietyHierarchy({
                    ...hierarchy,
                    children: [...(hierarchy.children || []), newPhaseNode],
                });
                resolve(newPhase);
            }, 400);
        });
    }
    static async getTowers(societyId: string, phaseId?: string): Promise<Tower[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const hierarchy = mockStore.getState().societyHierarchy;
                let rawTowers: SocietyHierarchyNode[] = [];
                if (phaseId) {
                    const phase = hierarchy.children?.find((c) => c.id === phaseId);
                    rawTowers = phase?.children?.filter((c) => c.level === 'TOWER' || c.type === 'BUILDING') || [];
                }
                else {
                    hierarchy.children?.forEach((phase) => {
                        rawTowers.push(...(phase.children?.filter((c) => c.level === 'TOWER' || c.type === 'BUILDING') || []));
                    });
                }
                const towers: Tower[] = rawTowers.map((t) => ({
                    id: t.id,
                    name: t.name,
                    code: t.code || t.id,
                    level: 'TOWER',
                    phaseId: phaseId || (t.parentId as string) || '',
                    societyId,
                    wingsCount: 0,
                    floorsCount: 0,
                    unitsPerFloor: 0,
                    orderIndex: t.orderIndex ?? 0,
                    createdAt: t.createdAt || new Date().toISOString(),
                    updatedAt: t.updatedAt || new Date().toISOString(),
                }));
                resolve(towers);
            }, 300);
        });
    }
    static async createTower(societyId: string, tower: Omit<Tower, 'id' | 'level' | 'societyId' | 'createdAt' | 'updatedAt' | 'children'>): Promise<Tower> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const hierarchy = mockStore.getState().societyHierarchy;
                const phaseId = tower.metadata?.phaseId as string;
                const phase = hierarchy.children?.find((c) => c.id === phaseId);
                if (!phase) {
                    throw new Error('Phase not found');
                }
                const now = new Date().toISOString();
                const newTower: Tower = {
                    ...tower,
                    id: generateId('tower'),
                    level: 'TOWER',
                    societyId,
                    orderIndex: (phase.children?.filter((c) => c.level === 'TOWER').length ?? 0),
                    createdAt: now,
                    updatedAt: now,
                    children: [],
                };
                const newTowerNode: SocietyHierarchyNode = {
                    id: newTower.id,
                    name: newTower.name,
                    code: newTower.code,
                    level: 'TOWER',
                    type: 'BUILDING',
                    societyId,
                    parentId: phaseId,
                    orderIndex: newTower.orderIndex,
                    createdAt: now,
                    updatedAt: now,
                    children: [],
                };
                const updatedPhase: SocietyHierarchyNode = {
                    ...phase,
                    children: [...(phase.children || []), newTowerNode],
                };
                mockStore.updateSocietyHierarchy({
                    ...hierarchy,
                    children: hierarchy.children?.map((c) => (c.id === phaseId ? updatedPhase : c)) || [],
                });
                resolve(newTower);
            }, 400);
        });
    }
    static async getWings(societyId: string, towerId: string): Promise<Wing[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const hierarchy = mockStore.getState().societyHierarchy;
                let wings: Wing[] = [];
                const findTower = (nodes: SocietyHierarchyNode[]): SocietyHierarchyNode | Absent => {
                    for (const node of nodes) {
                        if (node.id === towerId && (node.level === 'TOWER' || node.type === 'BUILDING'))
                            return node;
                        if (node.children) {
                            const found = findTower(node.children);
                            if (found)
                                return found;
                        }
                    }
                    return absentValue;
                };
                const tower = findTower(hierarchy.children || []);
                if (tower) {
                    const rawWings = tower.children?.filter((c) => c.level === 'WING' || c.level === 'BLOCK' || c.type === 'WING') || [];
                    wings = rawWings.map((w) => ({
                        id: w.id,
                        name: w.name,
                        code: w.code || w.id,
                        level: 'WING',
                        towerId,
                        wingType: (w.level === 'BLOCK' ? 'BLOCK' : 'WING') as 'BLOCK' | 'WING',
                        societyId,
                        orderIndex: w.orderIndex ?? 0,
                        createdAt: w.createdAt || new Date().toISOString(),
                        updatedAt: w.updatedAt || new Date().toISOString(),
                    }));
                }
                resolve(wings);
            }, 300);
        });
    }
    static async createWing(societyId: string, wing: Omit<Wing, 'id' | 'level' | 'societyId' | 'createdAt' | 'updatedAt' | 'children'>): Promise<Wing> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const hierarchy = mockStore.getState().societyHierarchy;
                const towerId = wing.metadata?.towerId as string;
                const findAndUpdateTower = (nodes: SocietyHierarchyNode[]): {
                    updated: SocietyHierarchyNode[];
                    wing: Wing;
                } | null => {
                    for (let i = 0; i < nodes.length; i++) {
                        const node = nodes[i];
                        if (!node) continue;
                        if (node.id === towerId && (node.level === 'TOWER' || node.type === 'BUILDING')) {
                            const now = new Date().toISOString();
                            const newWing: Wing = {
                                ...wing,
                                id: generateId('wing'),
                                level: 'WING',
                                towerId,
                                societyId,
                                orderIndex: (node.children?.filter((c) => c.level === 'WING' || c.level === 'BLOCK' || c.type === 'WING').length ?? 0),
                                createdAt: now,
                                updatedAt: now,
                            };
                            const newWingNode: SocietyHierarchyNode = {
                                id: newWing.id,
                                name: newWing.name,
                                level: 'WING',
                                type: 'WING',
                                code: newWing.code,
                                societyId,
                                orderIndex: newWing.orderIndex,
                                children: [],
                                createdAt: now,
                                updatedAt: now,
                            };
                            const updatedChildren = [...(node.children || []), newWingNode];
                            const updatedTower: SocietyHierarchyNode = { ...node, children: updatedChildren };
                            return { updated: [updatedTower], wing: newWing };
                        }
                        if (node.children) {
                            const result = findAndUpdateTower(node.children);
                            if (result) {
                                const updatedNode: SocietyHierarchyNode = { ...node, children: result.updated };
                                return { updated: [updatedNode], wing: result.wing };
                            }
                        }
                    }
                    return null;
                };
                const result = findAndUpdateTower(hierarchy.children || []);
                if (!result)
                    throw new Error('Tower not found');
                mockStore.updateSocietyHierarchy({
                    ...hierarchy,
                    children: hierarchy.children?.map((c) => {
                        const updated = result.updated.find((u) => u.id === c.id);
                        return updated ?? c;
                    }) || [],
                });
                resolve(result.wing);
            }, 400);
        });
    }
    static async getFloors(societyId: string, wingId: string): Promise<Floor[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const hierarchy = mockStore.getState().societyHierarchy;
                let floors: Floor[] = [];
                const findWing = (nodes: SocietyHierarchyNode[]): SocietyHierarchyNode | Absent => {
                    for (const node of nodes) {
                        if (node.id === wingId && (node.level === 'WING' || node.level === 'BLOCK' || node.type === 'WING'))
                            return node;
                        if (node.children) {
                            const found = findWing(node.children);
                            if (found)
                                return found;
                        }
                    }
                    return absentValue;
                };
                const wing = findWing(hierarchy.children || []);
                if (wing) {
                    const rawFloors = wing.children?.filter((c) => c.level === 'FLOOR' || c.type === 'FLOOR') || [];
                    floors = rawFloors.map((f, idx) => ({
                        id: f.id,
                        name: f.name,
                        code: f.code || f.id,
                        level: 'FLOOR',
                        wingId,
                        floorNumber: idx + 1,
                        societyId,
                        orderIndex: f.orderIndex ?? idx,
                        createdAt: f.createdAt || new Date().toISOString(),
                        updatedAt: f.updatedAt || new Date().toISOString(),
                    }));
                }
                resolve(floors);
            }, 300);
        });
    }
    static async createFloor(societyId: string, floor: Omit<Floor, 'id' | 'level' | 'societyId' | 'createdAt' | 'updatedAt' | 'children'>): Promise<Floor> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const hierarchy = mockStore.getState().societyHierarchy;
                const wingId = floor.metadata?.wingId as string;
                const findAndUpdateWing = (nodes: SocietyHierarchyNode[]): {
                    updated: SocietyHierarchyNode[];
                    floor: Floor;
                } | null => {
                    for (let i = 0; i < nodes.length; i++) {
                        const node = nodes[i];
                        if (!node) continue;
                        if (node.id === wingId && (node.level === 'WING' || node.level === 'BLOCK' || node.type === 'WING')) {
                            const now = new Date().toISOString();
                            const newFloor: Floor = {
                                ...floor,
                                id: generateId('floor'),
                                level: 'FLOOR',
                                societyId,
                                wingId,
                                floorNumber: floor.floorNumber ?? 0,
                                orderIndex: (node.children?.filter((c) => c.level === 'FLOOR' || c.type === 'FLOOR').length ?? 0),
                                createdAt: now,
                                updatedAt: now,
                            };
                            const newFloorNode: SocietyHierarchyNode = {
                                id: newFloor.id,
                                name: newFloor.name,
                                level: 'FLOOR',
                                type: 'FLOOR',
                                code: newFloor.code,
                                societyId,
                                orderIndex: newFloor.orderIndex,
                                children: [],
                                createdAt: now,
                                updatedAt: now,
                            };
                            const updatedChildren = [...(node.children || []), newFloorNode];
                            const updatedWing: SocietyHierarchyNode = { ...node, children: updatedChildren };
                            return { updated: [updatedWing], floor: newFloor };
                        }
                        if (node.children) {
                            const result = findAndUpdateWing(node.children);
                            if (result) {
                                const updatedNode: SocietyHierarchyNode = { ...node, children: result.updated };
                                return { updated: [updatedNode], floor: result.floor };
                            }
                        }
                    }
                    return null;
                };
                const result = findAndUpdateWing(hierarchy.children || []);
                if (!result)
                    throw new Error('Wing not found');
                mockStore.updateSocietyHierarchy({
                    ...hierarchy,
                    children: hierarchy.children?.map((c) => {
                        const updated = result.updated.find((u) => u.id === c.id);
                        return updated ?? c;
                    }) || [],
                });
                resolve(result.floor);
            }, 400);
        });
    }
    static async getUnits(societyId: string, floorId?: string): Promise<Unit[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const units = mockStore.getState().societyUnits;
                let filtered = units.filter((u) => u.societyId === societyId);
                if (floorId) {
                    filtered = filtered.filter((u) => u.floorId === floorId);
                }
                resolve(filtered.map(toUnit));
            }, 300);
        });
    }
    static async checkUnitNumberUnique(societyId: string, unitNumber: string, excludeId?: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const units = mockStore.getState().societyUnits;
                const exists = units.some((u) => u.societyId === societyId && u.unitNumber === unitNumber && u.id !== excludeId);
                resolve(!exists);
            }, 100);
        });
    }
    static async createUnit(request: CreateUnitRequest): Promise<Unit> {
        return new Promise(async (resolve, reject) => {
            const isUnique = await this.checkUnitNumberUnique(request.societyId, request.unitNumber);
            if (!isUnique) {
                reject(new Error(`Unit number ${request.unitNumber} already exists in this society`));
                return;
            }
            setTimeout(() => {
                const now = new Date().toISOString();
                const newUnit: Unit = {
                    id: generateId('unit'),
                    unitNumber: request.unitNumber,
                    societyId: request.societyId,
                    towerId: request.towerId,
                    floorId: request.floorId,
                    type: request.type,
                    carpetAreaSqFt: request.carpetAreaSqFt,
                    builtupAreaSqFt: request.builtupAreaSqFt,
                    occupancyStatus: request.occupancyStatus,
                    billingCategory: request.billingCategory,
                    status: 'ACTIVE',
                    createdAt: now,
                    updatedAt: now,
                    ...(request.phaseId ? { phaseId: request.phaseId } : {}),
                    ...(request.wingId ? { wingId: request.wingId } : {}),
                    ...(request.superBuiltupAreaSqFt !== undefined ? { superBuiltupAreaSqFt: request.superBuiltupAreaSqFt } : {}),
                    ...(request.parkingSlots ? { parkingSlots: request.parkingSlots } : {}),
                };
                const detail: UnitDetailInfo = {
                    id: newUnit.id,
                    unitNumber: newUnit.unitNumber,
                    societyId: newUnit.societyId,
                    towerId: newUnit.towerId,
                    floorId: newUnit.floorId,
                    type: newUnit.type,
                    carpetAreaSqFt: newUnit.carpetAreaSqFt,
                    builtupAreaSqFt: newUnit.builtupAreaSqFt,
                    occupancyStatus: newUnit.occupancyStatus,
                    billingCategory: newUnit.billingCategory,
                    status: newUnit.status,
                    createdAt: now,
                    updatedAt: now,
                    ...(newUnit.phaseId ? { phaseId: newUnit.phaseId } : {}),
                    ...(newUnit.wingId ? { wingId: newUnit.wingId } : {}),
                    ...(newUnit.superBuiltupAreaSqFt !== undefined ? { superBuiltupAreaSqFt: newUnit.superBuiltupAreaSqFt } : {}),
                    ...(newUnit.parkingSlots ? { parkingSlots: newUnit.parkingSlots } : {}),
                };
                mockStore.addSocietyUnitsBulk([detail]);
                resolve(newUnit);
            }, 400);
        });
    }
    static async updateUnit(request: UpdateUnitRequest): Promise<Unit> {
        return new Promise(async (resolve, reject) => {
            if (request.unitNumber && request.societyId) {
                const isUnique = await this.checkUnitNumberUnique(request.societyId, request.unitNumber, request.id);
                if (!isUnique) {
                    reject(new Error(`Unit number ${request.unitNumber} already exists in this society`));
                    return;
                }
            }
            setTimeout(() => {
                const units = mockStore.getState().societyUnits;
                const index = units.findIndex((u) => u.id === request.id);
                if (index === -1) {
                    reject(new Error('Unit not found'));
                    return;
                }
                const existing = units[index];
                if (!existing) {
                    reject(new Error('Unit not found'));
                    return;
                }
                const updated: UnitDetailInfo = {
                    ...existing,
                    ...request,
                    updatedAt: new Date().toISOString(),
                };
                units[index] = updated;
                mockStore.addSocietyUnitsBulk(units);
                resolve(toUnit(updated));
            }, 400);
        });
    }
    static async deleteUnit(unitId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const units = mockStore.getState().societyUnits.filter((u) => u.id !== unitId);
                mockStore.addSocietyUnitsBulk(units);
                resolve(true);
            }, 300);
        });
    }
    static async previewBulkUnits(request: BulkUnitGenerationRequest): Promise<BulkUnitPreviewResult> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const units = mockStore.getState().societyUnits;
                const societyUnits = units.filter((u) => u.societyId === request.societyId);
                const existingNumbers = new Set(societyUnits.map((u) => u.unitNumber));
                const items: BulkUnitPreviewItem[] = [];
                for (let floor = request.startFloor; floor <= request.endFloor; floor++) {
                    for (let i = 1; i <= request.unitsPerFloor; i++) {
                        const unitNumber = request.unitNumberPattern
                            .replace('{floor}', floor.toString().padStart(2, '0'))
                            .replace('{unit}', i.toString().padStart(2, '0'))
                            .replace('{tower}', request.towerId);
                        const isDuplicate = existingNumbers.has(unitNumber);
                        const dupId = isDuplicate ? societyUnits.find((u) => u.unitNumber === unitNumber)?.id : undefined;
                        items.push({
                            unitNumber,
                            floorNumber: floor,
                            towerName: request.towerId,
                            isDuplicate,
                            ...(dupId ? { existingUnitId: dupId } : {}),
                            errors: isDuplicate ? [`Duplicate unit number: ${unitNumber}`] : [],
                        });
                    }
                }
                resolve({
                    totalGenerated: items.length,
                    valid: items.filter((i) => !i.isDuplicate).length,
                    duplicates: items.filter((i) => i.isDuplicate).length,
                    errors: items.filter((i) => i.errors.length > 0).length,
                    items,
                });
            }, 500);
        });
    }
    static async confirmBulkUnits(request: BulkUnitGenerationRequest, previewItems: BulkUnitPreviewItem[]): Promise<Unit[]> {
        return new Promise(async (resolve, reject) => {
            const validItems = previewItems.filter((i) => !i.isDuplicate);
            const newUnits: Unit[] = [];
            for (const item of validItems) {
                try {
                    const unit = await this.createUnit({
                        unitNumber: item.unitNumber,
                        societyId: request.societyId,
                        towerId: request.towerId,
                        ...(request.wingId ? { wingId: request.wingId } : {}),
                        floorId: `floor-${item.floorNumber}`,
                        type: request.unitType,
                        carpetAreaSqFt: request.carpetAreaSqFt,
                        builtupAreaSqFt: request.builtupAreaSqFt,
                        occupancyStatus: 'VACANT',
                        billingCategory: request.billingCategory,
                    });
                    newUnits.push(unit);
                }
                catch (error) {
                    reject(error);
                    return;
                }
            }
            resolve(newUnits);
        });
    }
    static async validateSociety(societyId: string): Promise<ValidationResult> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const societies = getStoredSocieties();
                const society = societies.find((s) => s.id === societyId);
                if (!society) {
                    resolve({
                        societyId,
                        overallStatus: 'FAILED',
                        checks: [],
                        summary: { total: 0, passed: 0, failed: 0, warnings: 0 },
                        validatedAt: new Date().toISOString(),
                    });
                    return;
                }
                const checks: ValidationCheck[] = [];
                const hierarchy = mockStore.getState().societyHierarchy;
                const units = mockStore.getState().societyUnits.filter((u) => u.societyId === societyId);
                checks.push({
                    id: 'society-name',
                    category: 'SOCIETY',
                    name: 'Society Name',
                    description: 'Society must have a valid name',
                    status: society.name ? 'PASS' : 'FAIL',
                    entityId: societyId,
                    entityType: 'SOCIETY',
                    ...(!society.name ? { message: 'Society name is required' } : {}),
                    severity: 'ERROR',
                });
                const hasCompleteAddress = Boolean(society.address?.city && society.address?.state && society.address?.pincode);
                checks.push({
                    id: 'society-address',
                    category: 'SOCIETY',
                    name: 'Society Address',
                    description: 'Society must have a complete address',
                    status: hasCompleteAddress ? 'PASS' : 'FAIL',
                    entityId: societyId,
                    entityType: 'SOCIETY',
                    ...(!hasCompleteAddress ? { message: 'Complete address (city, state, pincode) is required' } : {}),
                    severity: 'ERROR',
                });
                const hasRegional = Boolean(society.regionalConfig?.timezone && society.regionalConfig?.currency && society.regionalConfig?.financialYearStartMonth);
                checks.push({
                    id: 'society-regional',
                    category: 'SOCIETY',
                    name: 'Regional Configuration',
                    description: 'Timezone, currency, and financial year must be configured',
                    status: hasRegional ? 'PASS' : 'FAIL',
                    entityId: societyId,
                    entityType: 'SOCIETY',
                    ...(!hasRegional ? { message: 'Regional configuration incomplete' } : {}),
                    severity: 'ERROR',
                });
                const hasPhases = Boolean(hierarchy.children && hierarchy.children.some((c) => (c.level || c.type) === 'PHASE'));
                const hasTowers = Boolean(hierarchy.children && hierarchy.children.some((c) => c.children?.some((cc) => (cc.level || cc.type) === 'TOWER') || (c.level || c.type) === 'TOWER' || (c.level || c.type) === 'BUILDING'));
                const hasFloors = Boolean(hierarchy.children && hierarchy.children.some((c) => c.children?.some((cc) => cc.children?.some((ccc) => (ccc.level || ccc.type) === 'FLOOR'))));
                checks.push({
                    id: 'property-phases',
                    category: 'PROPERTY',
                    name: 'Phases Configured',
                    description: 'At least one phase must be configured',
                    status: hasPhases ? 'PASS' : 'WARNING',
                    entityType: 'PHASE',
                    ...(!hasPhases ? { message: 'No phases configured (optional but recommended)' } : {}),
                    severity: 'WARNING',
                });
                checks.push({
                    id: 'property-towers',
                    category: 'PROPERTY',
                    name: 'Towers Configured',
                    description: 'At least one tower must be configured',
                    status: hasTowers ? 'PASS' : 'FAIL',
                    entityType: 'TOWER',
                    ...(!hasTowers ? { message: 'At least one tower is required' } : {}),
                    severity: 'ERROR',
                });
                checks.push({
                    id: 'property-floors',
                    category: 'PROPERTY',
                    name: 'Floors Configured',
                    description: 'At least one floor must be configured in each tower',
                    status: hasFloors ? 'PASS' : 'FAIL',
                    entityType: 'FLOOR',
                    ...(!hasFloors ? { message: 'At least one floor per tower is required' } : {}),
                    severity: 'ERROR',
                });
                const duplicateUnits = units.filter((u, i, arr) => arr.findIndex((a) => a.unitNumber === u.unitNumber) !== i);
                checks.push({
                    id: 'units-duplicates',
                    category: 'UNITS',
                    name: 'Duplicate Unit Numbers',
                    description: 'No duplicate unit numbers allowed',
                    status: duplicateUnits.length === 0 ? 'PASS' : 'FAIL',
                    entityType: 'UNIT',
                    ...(duplicateUnits.length > 0 ? { message: `${duplicateUnits.length} duplicate unit(s) found` } : {}),
                    severity: 'ERROR',
                });
                checks.push({
                    id: 'units-count',
                    category: 'UNITS',
                    name: 'Units Created',
                    description: 'At least one unit must exist',
                    status: units.length > 0 ? 'PASS' : 'FAIL',
                    entityType: 'UNIT',
                    ...(units.length === 0 ? { message: 'At least one unit is required' } : {}),
                    severity: 'ERROR',
                });
                const allUnitsValid = units.length > 0 && units.every((u) => Boolean(u.unitNumber && u.type && (u.carpetAreaSqFt ?? 0) > 0 && (u.builtupAreaSqFt ?? 0) > 0));
                checks.push({
                    id: 'units-fields',
                    category: 'UNITS',
                    name: 'Required Unit Fields',
                    description: 'All units must have required fields',
                    status: allUnitsValid ? 'PASS' : 'FAIL',
                    entityType: 'UNIT',
                    ...(!allUnitsValid ? { message: 'Some units missing required fields' } : {}),
                    severity: 'ERROR',
                });
                const passed = checks.filter((c) => c.status === 'PASS').length;
                const failed = checks.filter((c) => c.status === 'FAIL').length;
                const warnings = checks.filter((c) => c.status === 'WARNING').length;
                resolve({
                    societyId,
                    overallStatus: failed > 0 ? 'FAILED' : warnings > 0 ? 'WARNING' : 'READY',
                    checks,
                    summary: { total: checks.length, passed, failed, warnings },
                    validatedAt: new Date().toISOString(),
                });
            }, 800);
        });
    }
    static async activateSociety(request: SocietyActivationRequest): Promise<SocietyActivationResult> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const validation = await this.validateSociety(request.societyId);
                if (validation.overallStatus === 'FAILED') {
                    reject(new Error('Society validation failed. Cannot activate.'));
                    return;
                }
                const societies = getStoredSocieties();
                const index = societies.findIndex((s) => s.id === request.societyId);
                if (index === -1) {
                    reject(new Error('Society not found'));
                    return;
                }
                const target = societies[index];
                if (!target) {
                    reject(new Error('Society not found'));
                    return;
                }
                const updated: Society = {
                    ...target,
                    status: 'ACTIVE',
                    updatedAt: new Date().toISOString(),
                    activatedAt: new Date().toISOString(),
                };
                societies[index] = updated;
                setStoredSocieties(societies);
                resolve({
                    societyId: request.societyId,
                    status: 'ACTIVE',
                    activatedAt: updated.activatedAt!,
                    activatedBy: request.activatedBy,
                });
            }, 500);
        });
    }
    static async getOnboardingDrafts(): Promise<SocietyOnboardingDraft[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(getStoredDrafts()), 300);
        });
    }
    static async getOnboardingDraft(id: string): Promise<SocietyOnboardingDraft | Absent> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const drafts = getStoredDrafts();
                resolve(drafts.find((d) => d.id === id));
            }, 300);
        });
    }
    static async createOnboardingDraft(draft: Omit<SocietyOnboardingDraft, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<SocietyOnboardingDraft> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const drafts = getStoredDrafts();
                const now = new Date().toISOString();
                const newDraft: SocietyOnboardingDraft = {
                    ...draft,
                    id: generateId('draft'),
                    status: 'DRAFT',
                    createdAt: now,
                    updatedAt: now,
                };
                setStoredDrafts([...drafts, newDraft]);
                resolve(newDraft);
            }, 400);
        });
    }
    static async updateOnboardingDraft(id: string, updates: Partial<SocietyOnboardingDraft>): Promise<SocietyOnboardingDraft> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const drafts = getStoredDrafts();
                const index = drafts.findIndex((d) => d.id === id);
                if (index === -1) {
                    reject(new Error('Draft not found'));
                    return;
                }
                const target = drafts[index];
                if (!target) {
                    reject(new Error('Draft not found'));
                    return;
                }
                const updated: SocietyOnboardingDraft = {
                    ...target,
                    ...updates,
                    updatedAt: new Date().toISOString(),
                };
                drafts[index] = updated;
                setStoredDrafts(drafts);
                resolve(updated);
            }, 400);
        });
    }
    static async getPropertyTree(societyId: string): Promise<PropertyHierarchyNode> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const hierarchy = mockStore.getState().societyHierarchy;
                const societyNode: PropertyHierarchyNode = {
                    id: societyId,
                    name: hierarchy.name || 'Society',
                    code: hierarchy.code || societyId,
                    level: 'SOCIETY',
                    societyId,
                    orderIndex: hierarchy.orderIndex ?? 0,
                    createdAt: hierarchy.createdAt || new Date().toISOString(),
                    updatedAt: hierarchy.updatedAt || new Date().toISOString(),
                    ...(hierarchy.children && hierarchy.children.length > 0
                        ? { children: hierarchy.children.map((c) => toPropertyNode(c, societyId)) }
                        : {}),
                };
                resolve(societyNode);
            }, 300);
        });
    }
}

