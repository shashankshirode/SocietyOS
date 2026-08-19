import type { ActiveResidentHomeContext, ResidentHomeContext } from '../data/residentHomeContext.types';
import { createResidenceDataScopeKey } from '../../../../shared/data/scope/createResidenceDataScopeKey';
import { mockResidentHomeContexts } from '../data/residentHomeContext.mockData';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
const residentId = 'resident-001';
export function isSelectableResidentHomeContext(context: ResidentHomeContext): boolean {
    const effectiveFrom = context.effectiveFrom ? new Date(context.effectiveFrom) : null;
    const hasStarted = !effectiveFrom ||
        (!Number.isNaN(effectiveFrom.getTime()) && effectiveFrom.getTime() <= Date.now());
    return hasStarted && (context.status === 'active' ||
        context.status === 'moveOutPending' ||
        context.status === 'accessRestricted');
}
export function getPrimaryActiveResidentHomeContext(): ResidentHomeContext {
    const primary = mockResidentHomeContexts.find((context) => context.isPrimary && isSelectableResidentHomeContext(context));
    const firstSelectable = mockResidentHomeContexts.find(isSelectableResidentHomeContext);
    const fallback = primary ?? firstSelectable;
    if (!fallback) {
        throw new Error('RESIDENT_HOME_CONTEXT_CONFIGURATION_INVALID');
    }
    return fallback;
}
export function mapContextToActive(ctx: ResidentHomeContext): ActiveResidentHomeContext {
    return {
        homeContextId: ctx.homeContextId,
        residentId,
        societyId: ctx.societyId,
        societyName: ctx.societyName,
        societyAreaId: ctx.societyAreaId,
        societyAreaName: ctx.societyAreaName,
        city: ctx.city,
        ...includeWhenPresent("country", ctx.country),
        ...includeWhenPresent("locale", ctx.locale),
        ...includeWhenPresent("timezone", ctx.timezone),
        unitId: ctx.unitId,
        flatNumber: ctx.flatNumber,
        displayUnitName: ctx.displayUnitName,
        ...includeWhenPresent("buildingName", ctx.buildingName),
        ...includeWhenPresent("towerName", ctx.towerName),
        ...includeWhenPresent("wingName", ctx.wingName),
        residentRole: ctx.residentRole,
        status: ctx.status,
        featureFlagScopeId: ctx.featureFlagScopeId,
        permissionScopeId: ctx.permissionScopeId,
        ...includeWhenPresent("isGuardianManaged", ctx.isGuardianManaged),
        pendingCount: ctx.pendingCount,
        ...includeWhenPresent("effectiveFrom", ctx.effectiveFrom),
        dataScopeKey: createResidenceDataScopeKey({
            residentId,
            societyId: ctx.societyId,
            unitId: ctx.unitId,
            residentRole: ctx.residentRole
        })
    };
}
type Listener = () => void;
const listeners = new Set<Listener>();
let currentActiveContext: ActiveResidentHomeContext = mapContextToActive(getPrimaryActiveResidentHomeContext());
export const residentHomeContextStore = {
    getActiveContext(): ActiveResidentHomeContext {
        return currentActiveContext;
    },
    setActiveContext(context: ActiveResidentHomeContext) {
        if (currentActiveContext.homeContextId === context.homeContextId &&
            currentActiveContext.dataScopeKey === context.dataScopeKey) {
            return;
        }
        currentActiveContext = context;
        listeners.forEach((l) => l());
    },
    setActiveContextById(homeContextId: string): boolean {
        const target = mockResidentHomeContexts.find((context) => context.homeContextId === homeContextId && isSelectableResidentHomeContext(context));
        if (!target) {
            return false;
        }
        this.setActiveContext(mapContextToActive(target));
        return true;
    },
    resolveRestoredContext(homeContextId: string | null): ActiveResidentHomeContext {
        const restored = mockResidentHomeContexts.find((context) => context.homeContextId === homeContextId && isSelectableResidentHomeContext(context));
        return mapContextToActive(restored ?? getPrimaryActiveResidentHomeContext());
    },
    subscribe(listener: Listener): () => void {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }
};
export default residentHomeContextStore;

