import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { mockStore } from '../../../../core/mockStore/mockStore';
import type { ConfirmVisitorLeftInput, ConfirmVisitorStillInsideInput, ContactSecurityForVisitorExitInput, CreateVisitorPayload, ExtendVisitorExpectedExitInput, Visitor, VisitorExitAlert, VisitorExitEscalationResult, VisitorExitStatus, VisitorStatus, CancelVisitorPassRequest, CancelVisitorPassResult } from '../../../../shared/types/visitor.types';
import { createVisitorExitTracking, ensureVisitorExitTracking, resolveVisitorCategory } from '../utils/visitorExitPolicyResolver';
import { deriveVisitorExitAlerts } from '../utils/contextualVisitorExitStatus';
import { visitorExitAssuranceMockNowIso } from './visitorExitPolicy';
import { resolveRequestContext } from '../../homeContext/utils/resolveRequestContext';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { matchesResidentRepositoryContext } from '../../homeContext/utils/matchesResidentRepositoryContext';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function appendExitTimeline(visitor: Visitor, status: VisitorExitStatus, titleKey: string, descriptionKey: string): Visitor {
    const tracking = ensureVisitorExitTracking(visitor);
    return {
        ...visitor,
        exitTracking: {
            ...tracking,
            timeline: [
                ...tracking.timeline,
                {
                    id: `exit-event-${visitor.id}-${Date.now()}`,
                    titleKey,
                    descriptionKey,
                    occurredAtIso: visitorExitAssuranceMockNowIso,
                    status
                },
            ]
        }
    };
}
function findVisitorOrThrow(visitorPassId: string): Visitor {
    const visitor = mockStore.getState().visitors.find((item) => item.id === visitorPassId);
    if (!visitor) {
        throw new Error('Visitor not found');
    }
    return visitor;
}
function persistVisitor(visitor: Visitor): Visitor {
    mockStore.updateVisitor(visitor.id, visitor);
    return findVisitorOrThrow(visitor.id);
}
export const visitorsMockSource = {
    async list(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Visitor[]>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        const all = mockStore.getState().visitors;
        const scoped = all.filter((visitor) => matchesResidentRepositoryContext(visitor, ctx));
        return repositorySuccess(scoped);
    },
    async detail(context: ResidentRepositoryRequestContext | string, visitorPassId?: string): Promise<RepositoryResult<Visitor | Absent>> {
        await withMockDelay();
        let actualPassId: string;
        if (typeof context === 'string') {
            actualPassId = context;
        }
        else {
            actualPassId = visitorPassId || '';
        }
        const requestContext = typeof context === 'string' ? resolveRequestContext() : context;
        return repositorySuccess(mockStore.getState().visitors.find((visitor) => visitor.id === actualPassId && matchesResidentRepositoryContext(visitor, requestContext)));
    },
    async create(context: ResidentRepositoryRequestContext | CreateVisitorPayload, payload?: CreateVisitorPayload): Promise<RepositoryResult<Visitor>> {
        await withMockDelay();
        let actualContext: ResidentRepositoryRequestContext;
        let actualPayload: CreateVisitorPayload;
        if (payload) {
            actualContext = context as ResidentRepositoryRequestContext;
            actualPayload = payload;
        }
        else {
            actualContext = resolveRequestContext();
            actualPayload = context as CreateVisitorPayload;
        }
        const newVisitor: Visitor = {
            id: `vis-${Date.now()}`,
            name: actualPayload.name.trim(),
            phone: actualPayload.phone.trim(),
            type: actualPayload.type,
            status: 'EXPECTED',
            expectedDate: actualPayload.expectedDate.trim(),
            expectedTime: actualPayload.expectedTime.trim(),
            flatNumber: actualContext.activeHome.flatNumber,
            societyName: actualContext.activeHome.societyName,
            purpose: actualPayload.purpose.trim(),
            ...includeWhenPresent("vehicleNumber", actualPayload.vehicleNumber?.trim() || undefined),
            otp: generateOtp(),
            createdAt: new Date().toISOString(),
            homeContextId: actualContext.activeHome.homeContextId,
            societyId: actualContext.activeHome.societyId,
            unitId: actualContext.activeHome.unitId,
            dataScopeKey: actualContext.dataScopeKey,
            visitorCategory: actualPayload.visitorCategory ?? resolveVisitorCategory(actualPayload.type, actualPayload.purpose),
            exitTracking: createVisitorExitTracking({ payload: actualPayload })
        };
        mockStore.addVisitor(newVisitor);
        return repositorySuccess(newVisitor);
    },
    async updateStatus(context: ResidentRepositoryRequestContext | string, idOrStatus?: string, status?: VisitorStatus): Promise<RepositoryResult<Visitor>> {
        await withMockDelay();
        let actualId: string;
        let actualStatus: VisitorStatus;
        if (status) {
            actualId = idOrStatus as string;
            actualStatus = status;
        }
        else {
            actualId = context as string;
            actualStatus = idOrStatus as VisitorStatus;
        }
        mockStore.updateVisitor(actualId, { status: actualStatus });
        const updated = mockStore.getState().visitors.find((v) => v.id === actualId);
        if (!updated) {
            throw new Error('Visitor not found');
        }
        return repositorySuccess(updated);
    },
    async getVisitorExitAlerts(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<VisitorExitAlert[]>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        const all = mockStore.getState().visitors.filter((visitor) => matchesResidentRepositoryContext(visitor, ctx));
        return repositorySuccess(deriveVisitorExitAlerts(all));
    },
    async confirmVisitorLeft(context: ResidentRepositoryRequestContext | ConfirmVisitorLeftInput, input?: ConfirmVisitorLeftInput): Promise<RepositoryResult<Visitor>> {
        await withMockDelay();
        const actualInput = input || (context as ConfirmVisitorLeftInput);
        const visitor = findVisitorOrThrow(actualInput.visitorPassId);
        const updated = appendExitTimeline({
            ...visitor,
            exitTracking: {
                ...visitor.exitTracking!,
                exitStatus: 'residentConfirmedLeft',
                alertStatus: 'acknowledged',
                residentResponse: 'left',
                residentResponseAtIso: visitorExitAssuranceMockNowIso
            }
        }, 'residentConfirmedLeft', 'visitor.exitAssurance.timelineConfirmLeft', 'visitor.exitAssurance.timelineConfirmLeftDescription');
        return repositorySuccess(persistVisitor(updated));
    },
    async confirmVisitorStillInside(context: ResidentRepositoryRequestContext | ConfirmVisitorStillInsideInput, input?: ConfirmVisitorStillInsideInput): Promise<RepositoryResult<Visitor>> {
        await withMockDelay();
        const actualInput = input || (context as ConfirmVisitorStillInsideInput);
        const visitor = findVisitorOrThrow(actualInput.visitorPassId);
        const updated = appendExitTimeline({
            ...visitor,
            exitTracking: {
                ...visitor.exitTracking!,
                exitStatus: 'residentConfirmedStillInside',
                alertStatus: 'acknowledged',
                residentResponse: 'stillInside',
                residentResponseAtIso: visitorExitAssuranceMockNowIso
            }
        }, 'residentConfirmedStillInside', 'visitor.exitAssurance.timelineStillInside', 'visitor.exitAssurance.timelineStillInsideDescription');
        return repositorySuccess(persistVisitor(updated));
    },
    async extendVisitorExpectedExit(context: ResidentRepositoryRequestContext | ExtendVisitorExpectedExitInput, input?: ExtendVisitorExpectedExitInput): Promise<RepositoryResult<Visitor>> {
        await withMockDelay();
        const actualInput = input || (context as ExtendVisitorExpectedExitInput);
        const visitor = findVisitorOrThrow(actualInput.visitorPassId);
        const updated = appendExitTimeline({
            ...visitor,
            exitTracking: {
                ...visitor.exitTracking!,
                expectedExitAtIso: actualInput.expectedExitAtIso,
                extendedExpectedExitAtIso: actualInput.expectedExitAtIso,
                extensionReason: actualInput.reason,
                exitStatus: 'extended',
                alertStatus: 'snoozed',
                residentResponse: 'extended',
                residentResponseAtIso: visitorExitAssuranceMockNowIso
            }
        }, 'extended', 'visitor.exitAssurance.timelineExtended', 'visitor.exitAssurance.timelineExtendedDescription');
        return repositorySuccess(persistVisitor(updated));
    },
    async contactSecurityForVisitorExit(context: ResidentRepositoryRequestContext | ContactSecurityForVisitorExitInput, input?: ContactSecurityForVisitorExitInput): Promise<RepositoryResult<VisitorExitEscalationResult>> {
        await withMockDelay();
        const actualInput = input || (context as ContactSecurityForVisitorExitInput);
        const visitor = findVisitorOrThrow(actualInput.visitorPassId);
        const updated = appendExitTimeline({
            ...visitor,
            exitTracking: {
                ...visitor.exitTracking!,
                alertStatus: 'escalated',
                exitStatus: 'escalatedToSecurity',
                residentResponse: 'contactSecurity',
                residentResponseAtIso: visitorExitAssuranceMockNowIso,
                escalationReason: 'visitor.exitAssurance.securityContacted'
            }
        }, 'escalatedToSecurity', 'visitor.exitAssurance.timelineSecurityContacted', 'visitor.exitAssurance.timelineSecurityContactedDescription');
        const persisted = persistVisitor(updated);
        return repositorySuccess({
            visitorPassId: persisted.id,
            alertStatus: persisted.exitTracking!.alertStatus,
            exitStatus: persisted.exitTracking!.exitStatus
        });
    },
    async cancelVisitorPass(context: ResidentRepositoryRequestContext | CancelVisitorPassRequest, request?: CancelVisitorPassRequest): Promise<RepositoryResult<CancelVisitorPassResult>> {
        await withMockDelay();
        const actualRequest = request || (context as CancelVisitorPassRequest);
        const visitor = findVisitorOrThrow(actualRequest.visitorPassId);
        if (visitor.status !== 'EXPECTED' && visitor.status !== 'APPROVED' && visitor.status !== 'WAITING_APPROVAL') {
            throw new Error('Visitor pass cannot be cancelled in this status');
        }
        const cancelledAt = new Date().toISOString();
        const updated = {
            ...visitor,
            status: 'CANCELLED' as const,
            cancellationReason: actualRequest.reason,
            cancelledAt,
            cancelledBy: 'Resident',
            otp: '',
            ...(actualRequest.notes ? { cancellationNotes: actualRequest.notes } : {})
        };
        const persisted = persistVisitor(updated);
        return repositorySuccess({
            visitorPass: persisted,
            cancelledAt,
            accessCredentialInvalidated: true
        });
    }
};
export default visitorsMockSource;

