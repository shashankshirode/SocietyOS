import { mockStore } from '../../../core/mockStore/mockStore';
import type { SocietyHierarchyNode, UnitDetailInfo, TowerSetupData } from './societySetup.types';
import type { Absent } from "../../../shared/types/absence.types";
export class SocietySetupRepository {
    static async getHierarchy(): Promise<SocietyHierarchyNode> {
        return new Promise((resolve) => setTimeout(() => resolve(mockStore.getState().societyHierarchy), 300));
    }
    static async getUnitsList(): Promise<UnitDetailInfo[]> {
        return new Promise((resolve) => setTimeout(() => resolve(mockStore.getState().societyUnits), 300));
    }
    static async getUnitDetail(id: string): Promise<UnitDetailInfo | Absent> {
        return new Promise((resolve) => {
            const unit = mockStore.getState().societyUnits.find((u) => u.id === id);
            setTimeout(() => resolve(unit), 300);
        });
    }
    static async saveTowerSetup(data: TowerSetupData): Promise<boolean> {
        return new Promise((resolve) => {
            const currentHierarchy = mockStore.getState().societyHierarchy;
            const newTowerNode: SocietyHierarchyNode = {
                id: `tower-${Date.now()}`,
                name: data.towerName,
                type: 'BUILDING',
                children: Array.from({ length: data.wingsCount }, (_, wIdx) => ({
                    id: `wing-${Date.now()}-${wIdx}`,
                    name: `Wing ${String.fromCharCode(65 + wIdx)}`,
                    type: 'WING',
                    children: Array.from({ length: data.floorsCount }, (_, fIdx) => ({
                        id: `floor-${Date.now()}-${wIdx}-${fIdx}`,
                        name: `Floor ${fIdx + 1}`,
                        type: 'FLOOR',
                        children: Array.from({ length: data.unitsPerFloor }, (_, uIdx) => {
                            const unitNum = `${String.fromCharCode(65 + wIdx)}-${(fIdx + 1) * 100 + uIdx + 1}`;
                            return {
                                id: `unit-${Date.now()}-${wIdx}-${fIdx}-${uIdx}`,
                                name: unitNum,
                                type: 'UNIT',
                            };
                        }),
                    })),
                })),
            };
            const updatedChildren = [...(currentHierarchy.children || []), newTowerNode];
            mockStore.updateSocietyHierarchy({
                ...currentHierarchy,
                children: updatedChildren,
            });
            const newUnits: UnitDetailInfo[] = [];
            newTowerNode.children?.forEach((wing) => {
                wing.children?.forEach((floor) => {
                    floor.children?.forEach((unit) => {
                        newUnits.push({
                            id: unit.id,
                            unitNumber: unit.name,
                            wing: wing.name,
                            floor: parseInt(floor.name.replace('Floor ', ''), 10) || 1,
                            occupancyStatus: 'VACANT',
                            areaSqFt: 1200,
                            billingFrequency: 'MONTHLY',
                            kycVerified: false,
                        });
                    });
                });
            });
            mockStore.addSocietyUnitsBulk(newUnits);
            setTimeout(() => resolve(true), 400);
        });
    }
    static async getSocietyHierarchy(_input?: JsonValue): Promise<SocietyHierarchyNode> {
        return this.getHierarchy();
    }
    static async updateSocietyHierarchy(_input?: JsonValue): Promise<boolean> {
        const currentHierarchy = mockStore.getState().societyHierarchy;
        mockStore.updateSocietyHierarchy(currentHierarchy);
        return true;
    }
    static async addTower(input?: Partial<TowerSetupData>): Promise<boolean> {
        return this.saveTowerSetup({
            towerName: input?.towerName ?? 'Mock Tower',
            wingsCount: input?.wingsCount ?? 1,
            floorsCount: input?.floorsCount ?? 1,
            unitsPerFloor: input?.unitsPerFloor ?? 2,
        });
    }
    static async addWing(): Promise<boolean> {
        return this.addTower({ towerName: 'Mock Wing Tower', wingsCount: 1, floorsCount: 1, unitsPerFloor: 1 });
    }
    static async addFloor(): Promise<boolean> {
        return this.addTower({ towerName: 'Mock Floor Tower', wingsCount: 1, floorsCount: 1, unitsPerFloor: 1 });
    }
    static async listUnits(_input?: JsonValue): Promise<UnitDetailInfo[]> {
        return this.getUnitsList();
    }
    static async searchUnits(_input?: JsonValue): Promise<UnitDetailInfo[]> {
        return this.getUnitsList();
    }
    static async filterUnits(_input?: JsonValue): Promise<UnitDetailInfo[]> {
        return this.getUnitsList();
    }
    static async getUnitById(input: string | {
        id?: string;
    } = 'unit-1'): Promise<UnitDetailInfo | Absent> {
        const id = typeof input === 'string' ? input : input.id ?? 'unit-1';
        return this.getUnitDetail(id);
    }
    static async updateUnitOccupancyStatus(id = 'unit-1', occupancyStatus: UnitDetailInfo['occupancyStatus'] = 'OWNER_OCCUPIED'): Promise<boolean> {
        const units = mockStore.getState().societyUnits.map((unit) => unit.id === id ? { ...unit, occupancyStatus } : unit);
        mockStore.addSocietyUnitsBulk(units);
        return true;
    }
    static async previewUnitImport(_input?: JsonValue): Promise<UnitDetailInfo[]> {
        return this.getUnitsList();
    }
    static async confirmUnitImport(): Promise<boolean> {
        return true;
    }
    static async rollbackUnitImport(): Promise<boolean> {
        return true;
    }
}

