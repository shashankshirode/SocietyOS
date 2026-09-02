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
export const zeroHomeFallbackContext: ActiveResidentHomeContext = {
    homeContextId: 'ctx-zero-home',
    residentId,
    societyId: 'soc-none',
    societyName: 'No Home Linked',
    societyAreaId: 'area-none',
    societyAreaName: 'None',
    city: 'Pune',
    unitId: 'unit-none',
    flatNumber: '',
    displayUnitName: 'No Active Unit',
    residentRole: 'owner',
    status: 'accessRestricted',
    featureFlagScopeId: 'scope-none',
    permissionScopeId: 'perm-none',
    pendingCount: 0,
    dataScopeKey: 'scope:resident-001:soc-none:unit-none:owner'
};

export function getPrimaryActiveResidentHomeContext(): ResidentHomeContext {
    const primary = mockResidentHomeContexts.find((context) => context.isPrimary && isSelectableResidentHomeContext(context));
    const firstSelectable = mockResidentHomeContexts.find(isSelectableResidentHomeContext);
    const fallback = primary ?? firstSelectable;
    if (!fallback) {
        return {
            homeContextId: 'ctx-zero-home',
            societyId: 'soc-none',
            societyName: 'No Home Linked',
            societyAreaId: 'area-none',
            societyAreaName: 'None',
            city: 'Pune',
            unitId: 'unit-none',
            flatNumber: '',
            displayUnitName: 'No Active Unit',
            residentRole: 'owner',
            status: 'accessRestricted',
            isPrimary: false,
            isCurrent: false,
            unreadNotificationCount: 0,
            activeVisitorCount: 0,
            featureCoverage: 'restricted',
            featureFlagScopeId: 'scope-none',
            permissionScopeId: 'perm-none',
            pendingCount: 0,
        };
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
    setZeroHomeState(status: string = 'INVITED') {
        const isPending = status === 'PENDING_APPROVAL';
        const zeroContext: ActiveResidentHomeContext = {
            ...zeroHomeFallbackContext,
            homeContextId: isPending ? 'ctx-pending-home' : 'ctx-zero-home',
            societyName: isPending ? 'Green Valley Heights (Pending)' : 'No Home Linked',
            displayUnitName: isPending ? 'A-1204 (Under Review)' : 'No Active Unit',
            status: 'accessRestricted',
            dataScopeKey: isPending ? 'scope:resident-001:soc-pending:unit-pending:owner' : 'scope:resident-001:soc-none:unit-none:owner'
        };
        currentActiveContext = zeroContext;
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

