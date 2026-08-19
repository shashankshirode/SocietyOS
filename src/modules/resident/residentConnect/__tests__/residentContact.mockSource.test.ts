import { residentContactMockSource, resetResidentContactMockState, getResidentContactMockNotificationEvents, } from '../data/residentContact.mockSource';
import type { ResidentContactScope } from '../domain/residentContact.types';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
const primaryScope: ResidentContactScope = {
    societyId: 'society-gv',
    activeUnitId: 'unit-gv-a-1204',
    authenticatedUserId: 'user-resident-001',
    residentProfileId: 'resident-001',
};
beforeEach(() => resetResidentContactMockState());
describe('resident contact directory privacy and residence isolation', () => {
    it('groups eligible adults by floor and removes hidden, inactive and own-unit profiles', async () => {
        const result = await residentContactMockSource.getDirectory(primaryScope);
        expect(result.ok).toBe(true);
        if (!result.ok)
            return;
        expect(result.data.some((group) => group.floorLabel === 'Floor 12')).toBe(true);
        const profiles = result.data.flatMap((group) => group.units.flatMap((unit) => unit.residents));
        expect(profiles.some((profile) => profile.residentProfileId === 'gv-hidden')).toBe(false);
        expect(profiles.some((profile) => profile.residentProfileId === 'gv-inactive')).toBe(false);
        expect(profiles.some((profile) => profile.residentProfileId === 'gv-b-804-minor')).toBe(false);
        expect(profiles.some((profile) => profile.unitId === primaryScope.activeUnitId)).toBe(false);
    });
    it('never returns profiles from another society', async () => {
        const result = await residentContactMockSource.getDirectory(primaryScope);
        if (!result.ok)
            return;
        const profiles = result.data.flatMap((group) => group.units.flatMap((unit) => unit.residents));
        expect(profiles.every((profile) => profile.societyId === primaryScope.societyId)).toBe(true);
        expect(profiles.some((profile) => profile.residentProfileId === 'gp-c-501-neha')).toBe(false);
    });
    it('does not leak a conversation into another residence in the same society', async () => {
        const switchedResidenceScope: ResidentContactScope = {
            ...primaryScope,
            activeUnitId: 'unit-gv-b-804',
        };
        const result = await residentContactMockSource.getConversations(switchedResidenceScope);
        expect(result.ok && result.data).toEqual([]);
    });
    it('provides at least six floors with multiple flats for each seeded society', async () => {
        const scopes: ResidentContactScope[] = [
            primaryScope,
            { societyId: 'society-gp', activeUnitId: 'unit-gp-c-503', authenticatedUserId: 'user-resident-001', residentProfileId: 'resident-001' },
            { societyId: 'society-ra', activeUnitId: 'unit-ra-b-2101', authenticatedUserId: 'user-resident-001', residentProfileId: 'resident-001' },
        ];
        const results = await Promise.all(scopes.map((scope) => residentContactMockSource.getDirectory(scope)));
        results.forEach((result) => {
            expect(result.ok).toBe(true);
            if (!result.ok)
                return;
            expect(new Set(result.data.map((group) => group.floorLabel)).size).toBeGreaterThanOrEqual(6);
            expect(result.data.filter((group) => group.units.length >= 2).length).toBeGreaterThanOrEqual(6);
        });
    });
    it('searches only privacy-safe visible fields with normalized casing and whitespace', async () => {
        const result = await residentContactMockSource.searchDirectory({ ...primaryScope, query: '  floor   12 ' });
        if (!result.ok)
            return;
        expect(result.data).toHaveLength(1);
        expect(getRequiredItem(result.data, 0, "residentContact.mockSource.test.ts").floorLabel).toBe('Floor 12');
        const maskedNameResult = await residentContactMockSource.searchDirectory({ ...primaryScope, query: 'Meera Shah' });
        if (!maskedNameResult.ok)
            return;
        expect(maskedNameResult.data).toHaveLength(0);
    });
});
describe('resident contact request lifecycle', () => {
    it('does not create a conversation while a request is pending and rejects duplicates', async () => {
        const before = await residentContactMockSource.getConversations(primaryScope);
        const created = await residentContactMockSource.createRequest({
            ...primaryScope,
            recipientResidentProfileId: 'gv-c-g01-sana',
            subject: 'Neighbour question',
            introductoryMessage: 'Could we coordinate about the ground-floor notice?',
            topic: 'neighbourCoordination',
        });
        const after = await residentContactMockSource.getConversations(primaryScope);
        expect(created.ok).toBe(true);
        expect(getResidentContactMockNotificationEvents()).toContainEqual(expect.objectContaining({
            societyId: primaryScope.societyId,
            recipientResidentProfileId: 'gv-c-g01-sana',
            kind: 'contactRequestReceived',
        }));
        expect(before.ok && after.ok ? after.data.length : -1).toBe(before.ok ? before.data.length : -2);
        const duplicate = await residentContactMockSource.createRequest({
            ...primaryScope,
            recipientResidentProfileId: 'gv-c-g01-sana',
            subject: 'Second request',
            introductoryMessage: 'This repeated request must not be accepted.',
            topic: 'other',
        });
        expect(duplicate.ok).toBe(false);
    });
    it('accepts idempotently and creates exactly one conversation', async () => {
        const input = { ...primaryScope, requestId: 'contact-incoming-1' };
        const first = await residentContactMockSource.acceptRequest(input);
        const second = await residentContactMockSource.acceptRequest(input);
        const conversations = await residentContactMockSource.getConversations(primaryScope);
        expect(first.ok).toBe(true);
        expect(second.ok).toBe(true);
        if (!first.ok || !second.ok || !conversations.ok)
            return;
        expect(first.data.conversationId).toBe(second.data.conversationId);
        expect(conversations.data.filter((item) => item.contactRequestId === input.requestId)).toHaveLength(1);
    });
    it('rejects without creating a conversation', async () => {
        const input = { ...primaryScope, requestId: 'contact-incoming-1' };
        const before = await residentContactMockSource.getConversations(primaryScope);
        const rejected = await residentContactMockSource.rejectRequest(input);
        const after = await residentContactMockSource.getConversations(primaryScope);
        expect(rejected.ok).toBe(true);
        expect(before.ok && after.ok ? after.data.length : -1).toBe(before.ok ? before.data.length : -2);
    });
    it('blocking prevents the requester from appearing in future directory results', async () => {
        const before = await residentContactMockSource.getDirectory(primaryScope);
        await residentContactMockSource.blockRequester({ ...primaryScope, requestId: 'contact-incoming-1' });
        const after = await residentContactMockSource.getDirectory(primaryScope);
        if (!before.ok || !after.ok)
            return;
        const beforeIds = before.data.flatMap((group) => group.units.flatMap((unit) => unit.residents.map((resident) => resident.residentProfileId)));
        const afterIds = after.data.flatMap((group) => group.units.flatMap((unit) => unit.residents.map((resident) => resident.residentProfileId)));
        expect(beforeIds).toContain('gv-a-1202-rahul');
        expect(afterIds).not.toContain('gv-a-1202-rahul');
    });
    it('rejects requests that attempt to cross society boundaries', async () => {
        const result = await residentContactMockSource.createRequest({
            ...primaryScope,
            recipientResidentProfileId: 'gp-c-501-neha',
            subject: 'Cross society request',
            introductoryMessage: 'This request must be rejected by residence isolation.',
            topic: 'other',
        });
        expect(result.ok).toBe(false);
    });
    it('rejects a request from a resident profile without contact permission', async () => {
        const result = await residentContactMockSource.createRequest({
            ...primaryScope,
            canInitiateResidentContact: false,
            recipientResidentProfileId: 'gv-c-g01-sana',
            subject: 'Permission check',
            introductoryMessage: 'This request must not be created for a restricted family profile.',
            topic: 'other',
        });
        expect(result.ok).toBe(false);
    });
    it('rejects a request to a hidden directory profile', async () => {
        const result = await residentContactMockSource.createRequest({
            ...primaryScope,
            recipientResidentProfileId: 'gv-hidden',
            subject: 'Hidden profile check',
            introductoryMessage: 'This request must not bypass resident directory privacy.',
            topic: 'other',
        });
        expect(result.ok).toBe(false);
    });
    it('reports a pending request without creating a conversation', async () => {
        const before = await residentContactMockSource.getConversations(primaryScope);
        const reported = await residentContactMockSource.reportRequest({
            ...primaryScope,
            requestId: 'contact-incoming-1',
            reportCategory: 'privacyConcern',
            explanation: 'The request asks for information that should remain private.',
        });
        const after = await residentContactMockSource.getConversations(primaryScope);
        expect(reported.ok && reported.data.status).toBe('reported');
        expect(before.ok && after.ok ? after.data.length : -1).toBe(before.ok ? before.data.length : -2);
    });
    it('does not accept an expired request', async () => {
        const recipientScope: ResidentContactScope = {
            societyId: 'society-gv',
            activeUnitId: 'unit-gv-a-1102',
            authenticatedUserId: 'user-gv-a-1102-kavita',
            residentProfileId: 'gv-a-1102-kavita',
        };
        const result = await residentContactMockSource.acceptRequest({ ...recipientScope, requestId: 'contact-expired-out' });
        expect(result.ok).toBe(false);
    });
    it('persists text messages with delivery state inside the active conversation', async () => {
        const sent = await residentContactMockSource.sendDirectMessage({
            ...primaryScope,
            conversationId: 'resident-conversation-1',
            text: '  This should be stored without exposing contact details.  ',
        });
        const messages = await residentContactMockSource.getConversationMessages({ ...primaryScope, conversationId: 'resident-conversation-1' });
        expect(sent.ok && sent.data.deliveryStatus).toBe('sent');
        if (!messages.ok)
            return;
        expect(messages.data.at(-1)?.text).toBe('This should be stored without exposing contact details.');
        expect(new Set(messages.data.map((message) => message.deliveryStatus))).toEqual(new Set(['delivered', 'seen', 'sent']));
    });
});

