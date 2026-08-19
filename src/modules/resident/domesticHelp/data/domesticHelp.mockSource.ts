import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { DomesticHelpAccessInput, DomesticHelpServiceActionInput, ResidentDomesticHelpProfile } from './domesticHelp.types';
import type { Absent } from "../../../../shared/types/absence.types";
const recordsByScope = new Map<string, ResidentDomesticHelpProfile[]>();
function createRecords(context: ResidentRepositoryRequestContext): ResidentDomesticHelpProfile[] {
    const home = context.activeHome;
    return [
        {
            id: `${context.dataScopeKey}-dh-1`,
            homeContextId: home.homeContextId,
            societyId: home.societyId,
            unitId: home.unitId,
            dataScopeKey: context.dataScopeKey,
            name: 'Meena Patil',
            service: 'Housekeeping',
            maskedPhone: '+91 ••••• 48210',
            photoInitials: 'MP',
            verificationStatus: 'verified',
            accessStatus: 'active',
            serviceStatus: 'active',
            passStatus: 'valid',
            passExpiresAt: '2027-01-31T18:29:59.000Z',
            temporaryAccessExpiresAt: null,
            entryExitNotificationsEnabled: true,
            replacementRequestId: null,
            lastFeedbackRating: 5,
            approvedSchedule: 'Monday–Saturday, 8:00 AM–10:00 AM',
            lastVisitLabel: 'Today, 9:42 AM',
            attendance: [
                { id: 'att-1', dateLabel: 'Today', entryTime: '8:06 AM', exitTime: '9:42 AM', status: 'present' },
                { id: 'att-2', dateLabel: 'Yesterday', entryTime: '8:11 AM', exitTime: '9:37 AM', status: 'present' },
                { id: 'att-3', dateLabel: '12 Jul', status: 'absent' },
            ],
        },
        {
            id: `${context.dataScopeKey}-dh-2`,
            homeContextId: home.homeContextId,
            societyId: home.societyId,
            unitId: home.unitId,
            dataScopeKey: context.dataScopeKey,
            name: 'Rakesh Kumar',
            service: 'Cooking',
            maskedPhone: '+91 ••••• 73165',
            photoInitials: 'RK',
            verificationStatus: 'verified',
            accessStatus: 'suspended',
            serviceStatus: 'onLeave',
            passStatus: 'expiring',
            passExpiresAt: '2026-07-20T18:29:59.000Z',
            temporaryAccessExpiresAt: null,
            entryExitNotificationsEnabled: false,
            replacementRequestId: null,
            lastFeedbackRating: 4,
            approvedSchedule: 'Monday–Friday, 6:00 PM–8:00 PM',
            lastVisitLabel: '11 Jul, 7:54 PM',
            attendance: [
                { id: 'att-4', dateLabel: '11 Jul', entryTime: '6:09 PM', exitTime: '7:54 PM', status: 'present' },
                { id: 'att-5', dateLabel: '10 Jul', entryTime: '6:02 PM', exitTime: '7:48 PM', status: 'present' },
            ],
        },
        {
            id: `${context.dataScopeKey}-dh-3`,
            homeContextId: home.homeContextId,
            societyId: home.societyId,
            unitId: home.unitId,
            dataScopeKey: context.dataScopeKey,
            name: 'Sunita Devi',
            service: 'Childcare & Nanny',
            maskedPhone: '+91 ••••• 91823',
            photoInitials: 'SD',
            verificationStatus: 'verified',
            accessStatus: 'active',
            serviceStatus: 'active',
            passStatus: 'valid',
            passExpiresAt: '2026-12-31T18:29:59.000Z',
            temporaryAccessExpiresAt: '2026-08-01T23:59:59.000Z',
            entryExitNotificationsEnabled: true,
            replacementRequestId: null,
            lastFeedbackRating: 5,
            approvedSchedule: 'Monday–Friday, 9:00 AM–5:00 PM',
            lastVisitLabel: 'Today, 9:02 AM (Inside)',
            attendance: [
                { id: 'att-6', dateLabel: 'Today', entryTime: '9:02 AM', status: 'present' },
                { id: 'att-7', dateLabel: 'Yesterday', entryTime: '8:58 AM', exitTime: '5:04 PM', status: 'present' },
            ],
        },
        {
            id: `${context.dataScopeKey}-dh-4`,
            homeContextId: home.homeContextId,
            societyId: home.societyId,
            unitId: home.unitId,
            dataScopeKey: context.dataScopeKey,
            name: 'Ramesh Pawar',
            service: 'Personal Driver',
            maskedPhone: '+91 ••••• 33912',
            photoInitials: 'RP',
            verificationStatus: 'verified',
            accessStatus: 'active',
            serviceStatus: 'active',
            passStatus: 'valid',
            passExpiresAt: '2027-03-15T18:29:59.000Z',
            temporaryAccessExpiresAt: null,
            entryExitNotificationsEnabled: true,
            replacementRequestId: null,
            lastFeedbackRating: 5,
            approvedSchedule: 'All Days, 7:30 AM–6:30 PM',
            lastVisitLabel: 'Today, 7:35 AM',
            attendance: [
                { id: 'att-8', dateLabel: 'Today', entryTime: '7:35 AM', status: 'present' },
            ],
        },
        {
            id: `${context.dataScopeKey}-dh-5`,
            homeContextId: home.homeContextId,
            societyId: home.societyId,
            unitId: home.unitId,
            dataScopeKey: context.dataScopeKey,
            name: 'Manoj Shinde',
            service: 'Car Washer',
            maskedPhone: '+91 ••••• 66291',
            photoInitials: 'MS',
            verificationStatus: 'pendingPoliceVerification',
            accessStatus: 'active',
            serviceStatus: 'active',
            passStatus: 'valid',
            passExpiresAt: '2026-09-30T18:29:59.000Z',
            temporaryAccessExpiresAt: null,
            entryExitNotificationsEnabled: false,
            replacementRequestId: null,
            lastFeedbackRating: 4,
            approvedSchedule: 'Monday–Saturday, 6:30 AM–8:00 AM',
            lastVisitLabel: 'Today, 7:15 AM',
            attendance: [
                { id: 'att-9', dateLabel: 'Today', entryTime: '6:35 AM', exitTime: '7:15 AM', status: 'present' },
            ],
        },
        {
            id: `${context.dataScopeKey}-dh-6`,
            homeContextId: home.homeContextId,
            societyId: home.societyId,
            unitId: home.unitId,
            dataScopeKey: context.dataScopeKey,
            name: 'Savita Jadhav',
            service: 'Elderly Care Nurse',
            maskedPhone: '+91 ••••• 88204',
            photoInitials: 'SJ',
            verificationStatus: 'verified',
            accessStatus: 'active',
            serviceStatus: 'active',
            passStatus: 'valid',
            passExpiresAt: '2027-02-28T18:29:59.000Z',
            temporaryAccessExpiresAt: null,
            entryExitNotificationsEnabled: true,
            replacementRequestId: null,
            lastFeedbackRating: 5,
            approvedSchedule: 'Monday–Saturday, 10:00 AM–4:00 PM',
            lastVisitLabel: 'Yesterday, 3:55 PM',
            attendance: [
                { id: 'att-10', dateLabel: 'Yesterday', entryTime: '10:01 AM', exitTime: '3:55 PM', status: 'present' },
            ],
        },
        {
            id: `${context.dataScopeKey}-dh-7`,
            homeContextId: home.homeContextId,
            societyId: home.societyId,
            unitId: home.unitId,
            dataScopeKey: context.dataScopeKey,
            name: 'Rekha Bai',
            service: 'Ironing & Laundry',
            maskedPhone: '+91 ••••• 11094',
            photoInitials: 'RB',
            verificationStatus: 'unverified',
            accessStatus: 'suspended',
            serviceStatus: 'replacementRequested',
            passStatus: 'expired',
            passExpiresAt: '2026-06-01T18:29:59.000Z',
            temporaryAccessExpiresAt: null,
            entryExitNotificationsEnabled: false,
            replacementRequestId: `${context.dataScopeKey}-rep-rb`,
            lastFeedbackRating: 2,
            approvedSchedule: 'Tuesday & Friday, 3:00 PM–5:00 PM',
            lastVisitLabel: '28 Jun, 4:45 PM',
            attendance: [
                { id: 'att-11', dateLabel: '28 Jun', entryTime: '3:05 PM', exitTime: '4:45 PM', status: 'present' },
            ],
        },
    ];
}
function getScopedRecords(context: ResidentRepositoryRequestContext): ResidentDomesticHelpProfile[] {
    const existing = recordsByScope.get(context.dataScopeKey);
    if (existing)
        return existing;
    const created = createRecords(context);
    recordsByScope.set(context.dataScopeKey, created);
    return created;
}
export const domesticHelpMockSource = {
    async list(context: ResidentRepositoryRequestContext): Promise<RepositoryResult<ResidentDomesticHelpProfile[]>> {
        await withMockDelay();
        return repositorySuccess(getScopedRecords(context).filter((record) => record.serviceStatus !== 'removed'));
    },
    async detail(context: ResidentRepositoryRequestContext, domesticHelpId: string): Promise<RepositoryResult<ResidentDomesticHelpProfile | Absent>> {
        await withMockDelay();
        return repositorySuccess(getScopedRecords(context).find((record) => record.id === domesticHelpId));
    },
    async setAccess(input: DomesticHelpAccessInput): Promise<RepositoryResult<ResidentDomesticHelpProfile | Absent>> {
        await withMockDelay();
        const records = getScopedRecords(input.context);
        const current = records.find((record) => record.id === input.domesticHelpId);
        if (!current)
            return repositorySuccess(undefined);
        if (current.accessStatus === input.accessStatus)
            return repositorySuccess(current);
        const updated = { ...current, accessStatus: input.accessStatus };
        recordsByScope.set(input.context.dataScopeKey, records.map((record) => record.id === input.domesticHelpId ? updated : record));
        return repositorySuccess(updated);
    },
    async applyServiceAction(input: DomesticHelpServiceActionInput): Promise<RepositoryResult<ResidentDomesticHelpProfile | Absent>> {
        await withMockDelay();
        const records = getScopedRecords(input.context);
        const current = records.find((record) => record.id === input.domesticHelpId);
        if (!current)
            return repositorySuccess(undefined);
        const action = input.action;
        let updated: ResidentDomesticHelpProfile;
        if (action.type === 'startLeave') {
            updated = { ...current, serviceStatus: 'onLeave', accessStatus: 'suspended' };
        }
        else if (action.type === 'endLeave') {
            updated = { ...current, serviceStatus: 'active', accessStatus: 'active' };
        }
        else if (action.type === 'requestReplacement') {
            updated = {
                ...current,
                serviceStatus: 'replacementRequested',
                replacementRequestId: current.replacementRequestId ?? `${input.context.dataScopeKey}-replacement-${current.id}`,
            };
        }
        else if (action.type === 'grantTemporaryAccess') {
            updated = { ...current, accessStatus: 'active', temporaryAccessExpiresAt: action.expiresAt };
        }
        else if (action.type === 'setEntryExitNotifications') {
            updated = { ...current, entryExitNotificationsEnabled: action.enabled };
        }
        else if (action.type === 'submitFeedback') {
            updated = { ...current, lastFeedbackRating: action.rating };
        }
        else {
            updated = { ...current, serviceStatus: 'removed', accessStatus: 'suspended', temporaryAccessExpiresAt: null };
        }
        if (JSON.stringify(updated) === JSON.stringify(current))
            return repositorySuccess(current);
        recordsByScope.set(input.context.dataScopeKey, records.map((record) => record.id === input.domesticHelpId ? updated : record));
        return repositorySuccess(updated);
    },
    reset(): void {
        recordsByScope.clear();
    },
};

