import { repositoryFailure, repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { mockMeetingsList, mockMeetingNotices, mockAgendaItemsList, mockQuestionsList, mockProxyDelegationsList, mockRsvpRecords } from '../../../../shared/mock/meetings.mock';
import { mockMinutesList } from '../../../../shared/mock/minutes.mock';
import { mockResolutionsList } from '../../../../shared/mock/resolutions.mock';
import { mockPollsList, mockPollResultsList } from '../../../../shared/mock/polls.mock';
import { mockElectionReadinessConfig, mockCandidateNominations, mockElectionsList } from '../../../../shared/mock/elections.mock';
import { mockBylawsList } from '../../../../shared/mock/governanceDocuments.mock';
import { mockMemberRegisterList } from '../../../../shared/mock/memberRegister.mock';
import { mockComplianceItemList } from '../../../../shared/mock/complianceCalendar.mock';
import { mockLegalNoticesList } from '../../../../shared/mock/legalNotices.mock';
import { mockAuditLogList } from '../../../../shared/mock/governanceAudit.mock';
import type { GovernanceHome, Meeting as GovernanceMeeting, MeetingAttendance } from '../../../../shared/types/governance.types';
import type { AgendaItem, Meeting, MeetingMinutes, MeetingNotice, ProxyDelegation, MeetingQuestion } from '../../../../shared/types/meeting.types';
import type { Resolution } from '../../../../shared/types/resolution.types';
import type { Poll, PollResults } from '../../../../shared/types/poll.types';
import type { Election, ElectionCandidate } from '../../../../shared/types/election.types';
import type { ComplianceItem, LegalNotice, BylawDocument, MemberRecord, AuditLogEntry } from '../../../../shared/types/complianceCalendar.types';
import type { MeetingRsvpInput, SubmitQuestionInput, ProxyAuthorizationInput, SubmitNominationInput, CreatePollInput } from './governance.dto';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { resolveRequestContext } from '../../homeContext/utils/resolveRequestContext';
import { getResidentMockRecords } from '../../mock/residentMockRegistry';
import { enMessages } from '../../../../messages/en';
import type { CreateGovernanceMeetingInput, ElectionReadiness, ResolutionVoteSummary, VotingEligibility } from './governance.contracts';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
const meetings = [...mockMeetingsList];
const notices = { ...mockMeetingNotices };
const agendas = [...mockAgendaItemsList];
const questions = [...mockQuestionsList];
const proxies = [...mockProxyDelegationsList];
const rsvps = [...mockRsvpRecords];
const minutes = [...mockMinutesList];
const resolutions = [...mockResolutionsList];
const polls = [...mockPollsList];
const pollResults = { ...mockPollResultsList };
const candidateNominations = [...mockCandidateNominations];
const elections = [...mockElectionsList];
const bylaws = [...mockBylawsList];
const members = [...mockMemberRegisterList];
const complianceItems = [...mockComplianceItemList];
const legalNotices = [...mockLegalNoticesList];
const auditLogs = [...mockAuditLogList];
const rsvpAdjustments = new Map<string, {
    confirmedDelta: number;
    proxyDelta: number;
}>();
const scopedPollVotes = new Map<string, string[]>();
const scopedMinutesAcknowledgements = new Map<string, string>();
function getScopedPollVoteKey(context: ResidentRepositoryRequestContext, pollId: string): string {
    return `${context.dataScopeKey}:${pollId}`;
}
function getScopedMinutesKey(context: ResidentRepositoryRequestContext, minutesId: string): string {
    return `${context.dataScopeKey}:${minutesId}`;
}
function resolveMinutesForContext(item: MeetingMinutes, context?: ResidentRepositoryRequestContext): MeetingMinutes {
    if (!context)
        return item;
    const scopedAcknowledgedAt = scopedMinutesAcknowledgements.get(getScopedMinutesKey(context, item.id));
    const seededAcknowledgedAt = context.activeHome.homeContextId === 'context-001'
        ? item.acknowledgedAt
        : undefined;
    const acknowledgedAt = scopedAcknowledgedAt ?? seededAcknowledgedAt;
    return {
        ...item,
        acknowledged: Boolean(acknowledgedAt),
        ...includeWhenPresent("acknowledgedAt", acknowledgedAt)
    };
}
function resolvePollForContext(poll: Poll, context?: ResidentRepositoryRequestContext): Poll {
    if (!context)
        return poll;
    const scopedVote = scopedPollVotes.get(getScopedPollVoteKey(context, poll.id));
    const seedVote = context.activeHome.homeContextId === 'context-001' ? poll.myVotedOptionIds : undefined;
    const selectedOptionIds = scopedVote ?? seedVote;
    const addedVote = scopedVote ? 1 : 0;
    const totalVotes = poll.totalVotes + addedVote;
    const options = poll.options.map((option) => {
        const voteCount = option.voteCount + (scopedVote?.includes(option.id) ? 1 : 0);
        return {
            ...option,
            voteCount,
            percentage: totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0
        };
    });
    return {
        ...poll,
        societyId: context.activeHome.societyId,
        options,
        totalVotes,
        participationRate: Math.round((totalVotes / poll.totalEligibleVoters) * 100),
        myVoteStatus: selectedOptionIds ? 'VOTED' : 'NOT_VOTED',
        ...includeWhenPresent("myVotedOptionIds", selectedOptionIds ? [...selectedOptionIds] : undefined)
    };
}
const filterQuery = (query: string | Absent, list: string[]) => {
    const norm = query?.trim().toLowerCase();
    return !norm || list.some((item) => item?.toLowerCase().includes(norm));
};
function getRoleForGovernance(role: ResidentRepositoryRequestContext['activeHome']['residentRole']): string {
    if (role === 'owner' || role === 'coOwner')
        return 'OWNER';
    if (role === 'tenant')
        return 'TENANT';
    return 'FAMILY_MEMBER';
}
export const governanceMockSource = {
    async getGovernanceHome(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<GovernanceHome>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        const records = getResidentMockRecords(ctx, 'governance');
        const recordTitle = (ordinal: number) => enMessages.resident.mockData.recordTitle(enMessages.resident.mockData.featureLabels.governance, ordinal + 1, ctx.activeHome.displayUnitName);
        const recordDescription = () => enMessages.resident.mockData.recordDescription(enMessages.resident.mockData.featureLabels.governance, ctx.activeHome.societyName);
        const scopedMeetings: GovernanceMeeting[] = records.slice(0, 8).map((record) => ({
            id: record.id,
            societyId: record.societyId,
            title: recordTitle(record.ordinal),
            description: recordDescription(),
            meetingType: getRequiredItem((['AGM', 'EGM', 'COMMITTEE', 'BOARD'] as const), record.ordinal % 4, "governance.mockSource.ts"),
            status: getRequiredItem((['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'POSTPONED'] as const), record.ordinal % 4, "governance.mockSource.ts"),
            scheduledDate: record.createdAtIso.slice(0, 10),
            scheduledTime: record.createdAtIso.slice(11, 16),
            venue: ctx.activeHome.societyName,
            organizer: enMessages.resident.mockData.societyOffice,
            organizerRole: getRoleForGovernance(ctx.activeHome.residentRole),
            quorumRequired: 25,
            quorumStatus: record.ordinal % 3 === 0 ? 'MET' : 'PENDING',
            totalMembers: 100,
            confirmedCount: 30 + record.ordinal,
            presentCount: 20 + record.ordinal,
            proxyCount: record.ordinal,
            agendaItemCount: 4 + record.ordinal,
            resolutionCount: 1 + (record.ordinal % 4),
            hasMinutes: record.ordinal % 3 === 2,
            createdAt: record.createdAtIso,
            updatedAt: record.updatedAtIso
        }));
        return repositorySuccess({
            upcomingMeetingsCount: scopedMeetings.filter((meeting) => meeting.status === 'SCHEDULED').length,
            activePollsCount: records.filter((record) => record.ordinal % 3 === 0).length,
            pendingResolutionsCount: records.filter((record) => record.ordinal % 3 === 1).length,
            activeElectionsCount: records.filter((record) => record.ordinal % 3 === 2).length,
            upcomingMeetings: scopedMeetings,
            activePolls: records.slice(0, 10).map((record) => ({
                id: `${record.id}:poll`,
                title: recordTitle(record.ordinal),
                status: record.ordinal % 2 === 0 ? 'OPEN' : 'CLOSED',
                expiresAt: record.updatedAtIso
            })),
            recentResolutions: records.slice(0, 8).map((record) => ({
                id: `${record.id}:resolution`,
                title: recordTitle(record.ordinal),
                status: getRequiredItem((['DRAFT', 'OPEN_FOR_VOTING', 'PASSED', 'REJECTED'] as const), record.ordinal % 4, "governance.mockSource.ts")
            }))
        });
    },
    async getMeetings(params: {
        query?: string;
        type?: string;
        status?: string;
    } = {}): Promise<RepositoryResult<Meeting[]>> {
        await withMockDelay();
        let result = meetings;
        if (params.type)
            result = result.filter(m => m.meetingType === params.type);
        if (params.status)
            result = result.filter(m => m.status === params.status);
        if (params.query) {
            result = result.filter(m => filterQuery(params.query, [m.title, m.description, m.venue]));
        }
        return repositorySuccess(result);
    },
    async createMeeting(input: CreateGovernanceMeetingInput): Promise<RepositoryResult<Meeting>> {
        await withMockDelay();
        const nm: Meeting = {
            id: `meet-${Date.now()}`,
            societyId: 'soc-001',
            title: input.title,
            description: input.description,
            meetingType: input.meetingType,
            status: 'SCHEDULED',
            scheduledDate: input.scheduledDate,
            scheduledTime: input.scheduledTime,
            venue: input.venue,
            organizer: 'Chairperson',
            organizerRole: 'CHAIRPERSON',
            quorumRequired: input.quorumRequired,
            quorumStatus: 'PENDING',
            confirmedCount: 0,
            presentCount: 0,
            proxyCount: 0,
            totalMembers: 100,
            agendaItemCount: 0,
            resolutionCount: 0,
            hasMinutes: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        meetings.unshift(nm);
        return repositorySuccess(nm);
    },
    async submitMeetingRsvp(meetingId: string, input: MeetingRsvpInput, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<{
        success: boolean;
    }>> {
        await withMockDelay();
        const meeting = meetings.find((candidate) => candidate.id === meetingId);
        if (!meeting)
            return repositoryFailure({ code: 'MEETING_NOT_FOUND', message: 'This meeting is no longer available.' });
        if (!['SCHEDULED', 'RSVP_OPEN', 'NOTICE_PUBLISHED'].includes(meeting.status)) {
            return repositoryFailure({ code: 'RSVP_CLOSED', message: 'RSVP is closed for this meeting.' });
        }
        const residentId = context?.activeHome.residentId ?? 'resident-001';
        const residentUnit = context?.activeHome.flatNumber ?? 'A-1204';
        const scopeKey = `${context?.dataScopeKey ?? 'default'}:${meetingId}`;
        const adjustment = rsvpAdjustments.get(scopeKey) ?? { confirmedDelta: 0, proxyDelta: 0 };
        const existing = rsvps.find((record) => record.meetingId === meetingId && record.memberId === residentId && record.unit === residentUnit);
        const wasConfirmed = existing?.choice === 'ATTENDING' || existing?.choice === 'PROXY_ASSIGNED';
        const isConfirmed = input.rsvpStatus === 'ATTENDING' || input.rsvpStatus === 'PROXY_ASSIGNED';
        const wasProxy = existing?.choice === 'PROXY_ASSIGNED';
        const isProxy = input.rsvpStatus === 'PROXY_ASSIGNED';
        if (wasConfirmed !== isConfirmed) {
            adjustment.confirmedDelta += isConfirmed ? 1 : -1;
        }
        if (wasProxy !== isProxy) {
            adjustment.proxyDelta += isProxy ? 1 : -1;
        }
        rsvpAdjustments.set(scopeKey, adjustment);
        if (existing) {
            existing.choice = input.rsvpStatus;
            existing.mode = input.attendanceMode || 'NOT_APPLICABLE';
            if (input.notes !== undefined) {
                existing.notes = input.notes;
            }
            existing.checkedInAt = new Date().toISOString();
        }
        else {
            rsvps.push({
                id: `rsvp-${Date.now()}`,
                meetingId,
                memberId: residentId,
                memberName: 'Current resident',
                unit: residentUnit,
                role: getRoleForGovernance(context?.activeHome.residentRole ?? 'owner'),
                choice: input.rsvpStatus,
                mode: input.attendanceMode || 'NOT_APPLICABLE',
                ...includeWhenPresent("notes", input.notes),
                checkedInAt: new Date().toISOString()
            });
        }
        return repositorySuccess({ success: true });
    },
    async getMeetingDetail(meetingId: string, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Meeting | Absent>> {
        await withMockDelay();
        const meeting = meetings.find((candidate) => candidate.id === meetingId);
        if (!meeting)
            return repositorySuccess(undefined);
        const residentId = context?.activeHome.residentId ?? 'resident-001';
        const residentUnit = context?.activeHome.flatNumber ?? 'A-1204';
        const scopeKey = `${context?.dataScopeKey ?? 'default'}:${meetingId}`;
        const adjustment = rsvpAdjustments.get(scopeKey) ?? { confirmedDelta: 0, proxyDelta: 0 };
        const rsvp = rsvps.find((record) => record.meetingId === meetingId && record.memberId === residentId && record.unit === residentUnit);
        return repositorySuccess({
            ...meeting,
            societyId: context?.activeHome.societyId ?? meeting.societyId,
            confirmedCount: Math.max(0, meeting.confirmedCount + adjustment.confirmedDelta),
            proxyCount: Math.max(0, meeting.proxyCount + adjustment.proxyDelta),
            ...includeWhenPresent("myRsvpStatus", rsvp?.choice ?? meeting.myRsvpStatus),
            ...includeWhenPresent("myRsvpMode", rsvp?.mode ?? meeting.myRsvpMode)
        });
    },
    async getMeetingNotice(meetingId: string): Promise<RepositoryResult<MeetingNotice | Absent>> {
        await withMockDelay();
        return repositorySuccess(notices[meetingId]);
    },
    async acknowledgeMeetingNotice(meetingId: string): Promise<RepositoryResult<{
        success: boolean;
    }>> {
        await withMockDelay();
        const notice = notices[meetingId];
        if (notice) {
            notice.acknowledged = true;
            notice.acknowledgedAt = new Date().toISOString();
            auditLogs.unshift({
                id: `aud-${Date.now()}`,
                eventType: 'NOTICE_ACKNOWLEDGED',
                actorName: 'Shashank Shirode',
                actorRole: 'OWNER',
                timestamp: new Date().toISOString(),
                entityType: 'NOTICE',
                entityReference: meetingId,
                devicePlaceholder: 'Mobile App · IP: 192.168.1.102',
                auditNote: `Acknowledged notice for meeting: ${meetingId}`
            });
        }
        return repositorySuccess({ success: true });
    },
    async getMeetingAgenda(meetingId: string): Promise<RepositoryResult<AgendaItem[]>> {
        await withMockDelay();
        return repositorySuccess(agendas.filter(a => a.meetingId === meetingId));
    },
    async getAgendaItems(meetingId: string): Promise<RepositoryResult<AgendaItem[]>> {
        return this.getMeetingAgenda(meetingId);
    },
    async getMeetingAttendance(meetingId: string): Promise<RepositoryResult<MeetingAttendance[]>> {
        await withMockDelay();
        const records = rsvps.filter(r => r.meetingId === meetingId);
        const mapped: MeetingAttendance[] = records.map(r => ({
            id: r.id,
            meetingId: r.meetingId,
            memberId: r.memberId,
            memberName: r.memberName,
            memberUnit: r.unit,
            memberRole: r.role,
            status: r.choice === 'ATTENDING' ? 'PRESENT' : 'ABSENT',
            rsvpStatus: r.choice === 'PROXY_ASSIGNED' ? 'PROXY' : r.choice === 'ATTENDING' ? 'ATTENDING' : r.choice === 'NOT_ATTENDING' ? 'NOT_ATTENDING' : 'PENDING',
            ...includeWhenPresent("checkInTime", r.checkedInAt)
        }));
        return repositorySuccess(mapped);
    },
    async submitQuestion(meetingId: string, input: SubmitQuestionInput, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<MeetingQuestion>> {
        await withMockDelay();
        if (!meetings.some((meeting) => meeting.id === meetingId)) {
            return repositoryFailure({ code: 'MEETING_NOT_FOUND', message: 'This meeting is no longer available.' });
        }
        if (input.title.trim().length < 5 || input.details.trim().length < 15) {
            return repositoryFailure({ code: 'INVALID_QUESTION', message: 'Add a clear question and enough supporting detail.' });
        }
        const q: MeetingQuestion = {
            id: `q-${Date.now()}`,
            meetingId,
            ...includeWhenPresent("agendaItemId", input.agendaItemId),
            residentId: context?.activeHome.residentId ?? 'resident-001',
            residentName: 'Current resident',
            unit: context?.activeHome.flatNumber ?? 'A-1204',
            title: input.title,
            details: input.details,
            category: input.category,
            visibility: input.visibility,
            referenceNumber: `GVH-Q-2026-${questions.length + 1}`,
            createdAt: new Date().toISOString()
        };
        questions.push(q);
        auditLogs.unshift({
            id: `aud-${Date.now()}`,
            eventType: 'QUESTION_SUBMITTED',
            actorName: 'Shashank Shirode',
            actorRole: 'OWNER',
            timestamp: new Date().toISOString(),
            entityType: 'MEETING_QUESTION',
            entityReference: q.referenceNumber,
            devicePlaceholder: 'Mobile App',
            auditNote: `Submitted AGM question: "${input.title}"`
        });
        return repositorySuccess(q);
    },
    async submitProxyAuthorization(meetingId: string, input: ProxyAuthorizationInput, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<ProxyDelegation>> {
        await withMockDelay();
        if (!meetings.some((meeting) => meeting.id === meetingId)) {
            return repositoryFailure({ code: 'MEETING_NOT_FOUND', message: 'This meeting is no longer available.' });
        }
        if (context && context.activeHome.residentRole !== 'owner' && context.activeHome.residentRole !== 'coOwner') {
            return repositoryFailure({ code: 'PERMISSION_DENIED', message: 'Only an owner or co-owner can assign a proxy.' });
        }
        if (proxies.some((proxy) => proxy.meetingId === meetingId && !proxy.isCancelled && proxy.unit === (context?.activeHome.flatNumber ?? 'A-1204'))) {
            return repositoryFailure({ code: 'PROXY_ALREADY_ASSIGNED', message: 'An active proxy already exists for this membership and meeting.' });
        }
        if (!/^\d{10}$/.test(input.proxyMobile)) {
            return repositoryFailure({ code: 'INVALID_PROXY_MOBILE', message: 'Enter a valid 10-digit mobile number.' });
        }
        const pd: ProxyDelegation = {
            id: `proxy-${Date.now()}`,
            meetingId,
            meetingTitle: meetings.find(m => m.id === meetingId)?.title || 'General Meeting',
            ownerName: 'Current owner',
            unit: context?.activeHome.flatNumber ?? 'A-1204',
            proxyName: input.proxyName,
            relation: input.relation,
            proxyMobile: input.proxyMobile,
            scope: input.scope,
            isCancelled: false,
            consentGiven: true,
            createdAt: new Date().toISOString()
        };
        proxies.push(pd);
        auditLogs.unshift({
            id: `aud-${Date.now()}`,
            eventType: 'PROXY_AUTHORIZATION_SUBMITTED',
            actorName: 'Shashank Shirode',
            actorRole: 'OWNER',
            timestamp: new Date().toISOString(),
            entityType: 'PROXY_DELEGATION',
            entityReference: pd.id,
            devicePlaceholder: 'Mobile App',
            auditNote: `Delegated proxy voting to ${input.proxyName}`
        });
        return repositorySuccess(pd);
    },
    async getMinutes(params: {
        query?: string;
    } = {}): Promise<RepositoryResult<MeetingMinutes[]>> {
        await withMockDelay();
        return repositorySuccess(minutes);
    },
    async getMinutesDetail(minutesId: string): Promise<RepositoryResult<MeetingMinutes | Absent>> {
        await withMockDelay();
        return repositorySuccess(minutes.find(m => m.id === minutesId));
    },
    async getMeetingMinutes(meetingId: string, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<MeetingMinutes | Absent>> {
        await withMockDelay();
        const item = minutes.find(m => m.meetingId === meetingId);
        return repositorySuccess(item ? resolveMinutesForContext(item, context) : undefined);
    },
    async acknowledgeMeetingMinutes(minutesId: string, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<{
        acknowledgedAt: string;
    }>> {
        await withMockDelay();
        const item = minutes.find((candidate) => candidate.id === minutesId);
        if (!item) {
            return repositoryFailure({ code: 'MINUTES_NOT_FOUND', message: 'These meeting minutes are no longer available.' });
        }
        if (!context) {
            return repositoryFailure({ code: 'RESIDENCE_CONTEXT_REQUIRED', message: 'Select a residence before acknowledging meeting minutes.' });
        }
        if (item.status !== 'APPROVED' && item.status !== 'PUBLISHED') {
            return repositoryFailure({ code: 'MINUTES_NOT_PUBLISHED', message: 'These minutes are not ready for acknowledgment.' });
        }
        const key = getScopedMinutesKey(context, minutesId);
        const existingAcknowledgedAt = scopedMinutesAcknowledgements.get(key);
        if (existingAcknowledgedAt) {
            return repositorySuccess({ acknowledgedAt: existingAcknowledgedAt });
        }
        const acknowledgedAt = new Date().toISOString();
        scopedMinutesAcknowledgements.set(key, acknowledgedAt);
        auditLogs.unshift({
            id: `aud-${Date.now()}`,
            eventType: 'MINUTES_ACKNOWLEDGED',
            actorName: 'Current resident',
            actorRole: getRoleForGovernance(context.activeHome.residentRole),
            timestamp: acknowledgedAt,
            entityType: 'MINUTES',
            entityReference: minutesId,
            devicePlaceholder: 'Mobile App',
            auditNote: `Meeting minutes acknowledged for ${context.activeHome.flatNumber}`
        });
        return repositorySuccess({ acknowledgedAt });
    },
    async approveMinutes(minutesId: string): Promise<RepositoryResult<{
        success: boolean;
    }>> {
        await withMockDelay();
        const mom = minutes.find(m => m.id === minutesId);
        if (mom) {
            mom.status = 'APPROVED';
            mom.acknowledged = true;
            mom.acknowledgedAt = new Date().toISOString();
            auditLogs.unshift({
                id: `aud-${Date.now()}`,
                eventType: 'MOM_APPROVED',
                actorName: 'Sunil Patil',
                actorRole: 'CHAIRPERSON',
                timestamp: new Date().toISOString(),
                entityType: 'MINUTES',
                entityReference: minutesId,
                devicePlaceholder: 'Mobile App',
                auditNote: 'Minutes of Meeting marked APPROVED by Chairperson.'
            });
        }
        return repositorySuccess({ success: true });
    },
    async requestMinutesChanges(minutesId: string, input: {
        feedback: string;
    }): Promise<RepositoryResult<{
        success: boolean;
    }>> {
        await withMockDelay();
        const mom = minutes.find(m => m.id === minutesId);
        if (mom) {
            mom.status = 'CHANGES_REQUESTED';
            mom.versions.push({
                version: Math.round((getRequiredItem(mom.versions, mom.versions.length - 1, "governance.mockSource.ts").version + 0.1) * 10) / 10,
                updatedAt: new Date().toISOString(),
                updatedBy: 'Shashank Shirode',
                changeSummary: `Requested: ${input.feedback}`
            });
        }
        return repositorySuccess({ success: true });
    },
    async getResolutions(params: {
        query?: string;
        type?: string;
        status?: string;
    } = {}): Promise<RepositoryResult<Resolution[]>> {
        await withMockDelay();
        let result = resolutions;
        if (params.type)
            result = result.filter(r => r.type === params.type);
        if (params.status)
            result = result.filter(r => r.status === params.status);
        if (params.query) {
            result = result.filter(r => filterQuery(params.query, [r.title, r.description, r.resolutionNumber]));
        }
        return repositorySuccess(result);
    },
    async getResolutionDetail(resolutionId: string): Promise<RepositoryResult<Resolution | Absent>> {
        await withMockDelay();
        return repositorySuccess(resolutions.find(r => r.id === resolutionId));
    },
    async getResolutionVotes(resolutionId: string): Promise<RepositoryResult<ResolutionVoteSummary[]>> {
        await withMockDelay();
        return repositorySuccess([
            { id: 'v-1', voterName: 'Sunil Patil', voterUnit: 'A-1002', choice: 'FOR' },
            { id: 'v-2', voterName: 'Amit Joshi', voterUnit: 'B-404', choice: 'FOR' },
            { id: 'v-3', voterName: 'Karan Malhotra', voterUnit: 'A-601', choice: 'AGAINST' },
            { id: 'v-4', voterName: 'Vikas Sharma', voterUnit: 'C-201', choice: 'ABSTAIN' },
        ]);
    },
    async castResolutionVote(resolutionId: string, choice: 'FOR' | 'AGAINST' | 'ABSTAIN'): Promise<RepositoryResult<{
        success: boolean;
    }>> {
        await withMockDelay();
        const res = resolutions.find(r => r.id === resolutionId);
        if (res) {
            res.myVoteChoice = choice;
            if (choice === 'FOR')
                res.votesFor += 1;
            else if (choice === 'AGAINST')
                res.votesAgainst += 1;
            else
                res.votesAbstained += 1;
            auditLogs.unshift({
                id: `aud-${Date.now()}`,
                eventType: 'RESOLUTION_VOTE_CAST',
                actorName: 'Shashank Shirode',
                actorRole: 'OWNER',
                timestamp: new Date().toISOString(),
                entityType: 'RESOLUTION',
                entityReference: resolutionId,
                devicePlaceholder: 'Mobile App',
                auditNote: `Voted ${choice} on resolution: ${res.resolutionNumber}`
            });
        }
        return repositorySuccess({ success: true });
    },
    async getPolls(params: {
        query?: string;
        type?: string;
        status?: string;
    } = {}, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Poll[]>> {
        await withMockDelay();
        let result = polls;
        if (params.type)
            result = result.filter(p => p.pollType === params.type);
        if (params.status)
            result = result.filter(p => p.status === params.status);
        if (params.query) {
            result = result.filter(p => filterQuery(params.query, [p.title, p.description]));
        }
        return repositorySuccess(result.map((poll) => resolvePollForContext(poll, context)));
    },
    async getPollDetail(pollId: string, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Poll | Absent>> {
        await withMockDelay();
        const poll = polls.find((candidate) => candidate.id === pollId);
        return repositorySuccess(poll ? resolvePollForContext(poll, context) : undefined);
    },
    async createPoll(input: CreatePollInput): Promise<RepositoryResult<Poll>> {
        await withMockDelay();
        const np: Poll = {
            id: `poll-${Date.now()}`,
            societyId: 'society-001',
            title: input.title,
            description: input.description,
            pollType: input.pollType,
            questionType: input.questionType,
            status: 'OPEN',
            eligibility: input.eligibility,
            createdBy: 'Shashank Shirode',
            createdByRole: 'OWNER',
            options: input.options.map((o, idx) => ({
                id: `opt-${Date.now()}-${idx}`,
                pollId: `poll-${Date.now()}`,
                label: o.label,
                order: idx + 1,
                voteCount: 0,
                percentage: 0
            })),
            totalVotes: 0,
            totalEligibleVoters: 120,
            participationRate: 0,
            myVoteStatus: 'NOT_VOTED',
            allowAnonymous: input.allowAnonymous,
            showResultsBeforeClose: input.showResultsBeforeClose,
            startsAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + input.durationDays * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        polls.unshift(np);
        return repositorySuccess(np);
    },
    async submitPollVote(pollId: string, selectedOptionIds: string[], context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<{
        success: boolean;
    }>> {
        await withMockDelay();
        const p = polls.find(poll => poll.id === pollId);
        if (!p)
            return repositoryFailure({ code: 'POLL_NOT_FOUND', message: 'This poll is no longer available.' });
        if (p.status !== 'OPEN' && p.status !== 'ACTIVE') {
            return repositoryFailure({ code: 'POLL_CLOSED', message: 'Voting is closed for this poll.' });
        }
        const resolvedPoll = resolvePollForContext(p, context);
        if (resolvedPoll.myVoteStatus === 'VOTED') {
            return repositoryFailure({ code: 'DUPLICATE_VOTE', message: 'A vote is already recorded for this membership.' });
        }
        const isOwner = context?.activeHome.residentRole === 'owner' || context?.activeHome.residentRole === 'coOwner';
        if (p.eligibility === 'OWNERS_ONLY' && !isOwner) {
            return repositoryFailure({ code: 'PERMISSION_DENIED', message: 'This poll is restricted to owner memberships.' });
        }
        const validOptionIds = new Set(p.options.map((option) => option.id));
        if (selectedOptionIds.length === 0 || selectedOptionIds.some((id) => !validOptionIds.has(id))) {
            return repositoryFailure({ code: 'INVALID_BALLOT', message: 'Choose a valid option before submitting.' });
        }
        if (p.questionType !== 'MULTI_CHOICE' && selectedOptionIds.length !== 1) {
            return repositoryFailure({ code: 'INVALID_BALLOT', message: 'Choose exactly one option for this poll.' });
        }
        if (context)
            scopedPollVotes.set(getScopedPollVoteKey(context, pollId), [...selectedOptionIds]);
        else {
            p.myVoteStatus = 'VOTED';
            p.myVotedOptionIds = [...selectedOptionIds];
        }
        auditLogs.unshift({
            id: `aud-${Date.now()}`,
            eventType: 'POLL_VOTE_SUBMITTED',
            actorName: p.allowAnonymous ? 'Anonymous Member' : 'Shashank Shirode',
            actorRole: 'OWNER',
            timestamp: new Date().toISOString(),
            entityType: 'POLL',
            entityReference: pollId,
            devicePlaceholder: 'Mobile App',
            auditNote: `Submitted poll vote. Anonymous: ${p.allowAnonymous}`
        });
        return repositorySuccess({ success: true });
    },
    async getPollResult(pollId: string, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<PollResults | Absent>> {
        await withMockDelay();
        const basePoll = polls.find((poll) => poll.id === pollId);
        if (!basePoll)
            return repositorySuccess(pollResults[pollId]);
        const p = resolvePollForContext(basePoll, context);
        const max = Math.max(...p.options.map(o => o.voteCount));
        return repositorySuccess({
            pollId: p.id,
            title: p.title,
            pollType: p.pollType,
            questionType: p.questionType,
            status: p.status,
            totalVotes: p.totalVotes,
            totalEligibleVoters: p.totalEligibleVoters,
            participationRate: p.participationRate,
            options: p.options.map(o => ({
                id: o.id,
                label: o.label,
                voteCount: o.voteCount,
                percentage: o.percentage,
                isWinner: o.voteCount === max && max > 0
            })),
            ...includeWhenPresent("winnerOptionId", p.options.find(o => o.voteCount === max && max > 0)?.id),
            ...includeWhenPresent("closedAt", p.closedAt)
        });
    },
    async getPollResults(pollId: string, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<PollResults | Absent>> {
        return this.getPollResult(pollId, context);
    },
    async getVotingEligibility(params: {
        pollId?: string;
        resolutionId?: string;
    } = {}): Promise<RepositoryResult<VotingEligibility>> {
        await withMockDelay();
        const member = members.find(m => m.id === 'res-001');
        return repositorySuccess({
            eligible: member?.votingEligibility === 'ELIGIBLE',
            status: member?.votingEligibility || 'NOT_ELIGIBLE',
            ...includeWhenPresent("reason", member?.ineligibilityReason),
            duesPending: false,
            ownershipVerified: true
        });
    },
    async getElectionReadiness(): Promise<RepositoryResult<ElectionReadiness>> {
        await withMockDelay();
        return repositorySuccess(mockElectionReadinessConfig);
    },
    async getElections(params: {
        status?: string;
    } = {}): Promise<RepositoryResult<Election[]>> {
        await withMockDelay();
        return repositorySuccess(elections);
    },
    async getElectionDetail(electionId: string): Promise<RepositoryResult<Election | Absent>> {
        await withMockDelay();
        return repositorySuccess(elections.find(e => e.id === electionId));
    },
    async submitNomination(electionId: string, input: SubmitNominationInput): Promise<RepositoryResult<ElectionCandidate>> {
        await withMockDelay();
        const nomination: ElectionCandidate = {
            id: `cand-${Date.now()}`,
            positionId: input.positionId,
            residentId: 'resident-001',
            name: input.candidateName,
            unit: 'A-1204',
            nominationStatus: 'SUBMITTED',
            proposedBy: 'Anil Deshmukh',
            manifesto: input.manifesto,
            voteCount: 0,
            isElected: false
        };
        candidateNominations.push(nomination);
        auditLogs.unshift({
            id: `aud-${Date.now()}`,
            eventType: 'ELECTION_NOMINATION_SUBMITTED',
            actorName: 'Shashank Shirode',
            actorRole: 'OWNER',
            timestamp: new Date().toISOString(),
            entityType: 'NOMINATION',
            entityReference: nomination.id,
            devicePlaceholder: 'Mobile App',
            auditNote: `Submitted candidate nomination for position: ${input.positionId}`
        });
        return repositorySuccess(nomination);
    },
    async getCandidateProfile(electionId: string, candidateId: string): Promise<RepositoryResult<ElectionCandidate | Absent>> {
        await withMockDelay();
        return repositorySuccess(candidateNominations.find(c => c.id === candidateId));
    },
    async getGovernanceDocuments(params: {
        query?: string;
    } = {}): Promise<RepositoryResult<BylawDocument[]>> {
        await withMockDelay();
        return repositorySuccess(bylaws);
    },
    async acknowledgeBylaw(documentId: string): Promise<RepositoryResult<{
        success: boolean;
    }>> {
        await withMockDelay();
        const doc = bylaws.find(b => b.id === documentId);
        if (doc) {
            doc.acknowledged = true;
            doc.acknowledgedAt = new Date().toISOString();
            auditLogs.unshift({
                id: `aud-${Date.now()}`,
                eventType: 'BYLAW_ACKNOWLEDGED',
                actorName: 'Shashank Shirode',
                actorRole: 'OWNER',
                timestamp: new Date().toISOString(),
                entityType: 'BYLAW_DOCUMENT',
                entityReference: documentId,
                devicePlaceholder: 'Mobile App',
                auditNote: `Acknowledged society bylaw document: "${doc.title}"`
            });
        }
        return repositorySuccess({ success: true });
    },
    async getMemberRegister(params: {
        query?: string;
    } = {}): Promise<RepositoryResult<MemberRecord[]>> {
        await withMockDelay();
        return repositorySuccess(members);
    },
    async getComplianceCalendar(params: {
        query?: string;
    } = {}): Promise<RepositoryResult<ComplianceItem[]>> {
        await withMockDelay();
        return repositorySuccess(complianceItems);
    },
    async markComplianceComplete(complianceItemId: string): Promise<RepositoryResult<{
        success: boolean;
    }>> {
        await withMockDelay();
        const item = complianceItems.find(c => c.id === complianceItemId);
        if (item) {
            item.status = 'COMPLETED';
            item.completedDate = getRequiredItem(new Date().toISOString().split('T'), 0, "governance.mockSource.ts");
            item.completedBy = 'Shashank Shirode (Chairman)';
            auditLogs.unshift({
                id: `aud-${Date.now()}`,
                eventType: 'COMPLIANCE_ITEM_CLOSED',
                actorName: 'Shashank Shirode',
                actorRole: 'CHAIRPERSON',
                timestamp: new Date().toISOString(),
                entityType: 'COMPLIANCE',
                entityReference: complianceItemId,
                devicePlaceholder: 'Mobile App',
                auditNote: `Marked compliance item complete: "${item.title}"`
            });
        }
        return repositorySuccess({ success: true });
    },
    async getLegalNotices(params: {
        query?: string;
    } = {}): Promise<RepositoryResult<LegalNotice[]>> {
        await withMockDelay();
        return repositorySuccess(legalNotices);
    },
    async getGovernanceAuditLogs(params: {
        query?: string;
    } = {}): Promise<RepositoryResult<AuditLogEntry[]>> {
        await withMockDelay();
        return repositorySuccess(auditLogs);
    },
    async createMeetingNotice(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async listAgendaItems(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async submitMeetingQuestion(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async createMinutesOfMeeting(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async listResolutions(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async getElectionReadinessStatus(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    }
};

