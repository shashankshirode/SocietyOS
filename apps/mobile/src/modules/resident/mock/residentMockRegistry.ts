import type { ResidentRepositoryRequestContext } from '../homeContext/data/residentHomeContext.types';
import { residentMockContextIndex } from './residentMockContextIndex';
import { residentMockSeed } from './residentMockSeed';
import type { ResidentMockFeatureKey, ResidentMockRecord, ResidentMockScenario, } from './residentMockScenario.types';
import { residentMockEdgeCaseFixtures } from './residentMockEdgeCaseFixtures';
import type { Absent } from "../../../shared/types/absence.types";
export function getResidentMockScenario(homeContextId: string): ResidentMockScenario | Absent {
    return residentMockContextIndex.get(homeContextId);
}
export function getResidentMockRecords(context: ResidentRepositoryRequestContext, feature: ResidentMockFeatureKey): readonly ResidentMockRecord[] {
    const scenario = residentMockContextIndex.get(context.activeHome.homeContextId);
    if (!scenario ||
        scenario.societyId !== context.activeHome.societyId ||
        scenario.unitId !== context.activeHome.unitId ||
        scenario.dataScopeKey !== context.dataScopeKey) {
        return [];
    }
    return scenario.records[feature].filter((record) => record.homeContextId === context.activeHome.homeContextId &&
        record.societyId === context.activeHome.societyId &&
        record.unitId === context.activeHome.unitId &&
        record.dataScopeKey === context.dataScopeKey);
}
export const residentMockRegistry = {
    scenarios: residentMockSeed,
    contextIndex: residentMockContextIndex,
    getScenario: getResidentMockScenario,
    getRecords: getResidentMockRecords,
    edgeCaseFixtures: residentMockEdgeCaseFixtures,
} as const;
export default residentMockRegistry;

