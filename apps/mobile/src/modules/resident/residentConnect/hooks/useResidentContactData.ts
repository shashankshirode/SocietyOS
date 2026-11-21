import { useRepositoryMutation, useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { residentContactRepository } from '../data/residentContact.repository';
import type { CreateResidentContactRequestInput, ReportContactRequestInput, RespondToContactRequestInput, ResidentDirectMessage, } from '../domain/residentContact.types';
import { useResidentContactScope } from './useResidentContactScope';
import { useCursorPagination, type CursorPage } from '../../../../shared/hooks/useCursorPagination';
import { useCallback } from 'react';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function useResidentDirectory(query: string) {
    const scope = useResidentContactScope();
    const normalizedQuery = query.trim();
    return useRepositoryResult(() => normalizedQuery
        ? residentContactRepository.searchDirectory({ ...scope, query: normalizedQuery })
        : residentContactRepository.getDirectory(scope), [scope.dataScopeKey, normalizedQuery]);
}
export function useResidentDirectoryProfile(residentProfileId: string) {
    const scope = useResidentContactScope();
    return useRepositoryResult(() => residentContactRepository.getResident({ ...scope, residentProfileIdToFind: residentProfileId }), [scope.dataScopeKey, residentProfileId]);
}
export function useResidentContactRequests() {
    const scope = useResidentContactScope();
    const outgoing = useRepositoryResult(() => residentContactRepository.getOutgoingRequests(scope), [scope.dataScopeKey]);
    const incoming = useRepositoryResult(() => residentContactRepository.getIncomingRequests(scope), [scope.dataScopeKey]);
    return { scope, outgoing, incoming };
}
export function useResidentDirectConversations() {
    const scope = useResidentContactScope();
    return useRepositoryResult(() => residentContactRepository.getConversations(scope), [scope.dataScopeKey]);
}
export function useResidentDirectMessages(conversationId: string) {
    const scope = useResidentContactScope();
    const fetchPage = useCallback(async (cursor?: string): Promise<CursorPage<ResidentDirectMessage>> => {
        const input = {
            ...scope,
            conversationId,
            ...includeWhenPresent("cursor", cursor),
            limit: 20
        };
        const res = await residentContactRepository.getConversationMessages(input);
        if (!res.ok) {
            throw new Error(res.error?.message || 'Failed to fetch messages');
        }
        return {
            items: res.data,
            ...includeWhenPresent("nextCursor", (res.data).nextCursor),
            hasMore: (res.data).hasMore || false
        };
    }, [conversationId, scope]);
    const pagination = useCursorPagination(fetchPage, [scope.dataScopeKey, conversationId]);
    const send = useRepositoryMutation((input: {
        text: string;
    }) => residentContactRepository.sendDirectMessage({ ...scope, conversationId, text: input.text }));
    return { scope, pagination, send };
}
export function useCreateResidentContactRequest() {
    return useRepositoryMutation((input: CreateResidentContactRequestInput) => residentContactRepository.createRequest(input));
}
export function useResidentContactDecision() {
    const accept = useRepositoryMutation((input: RespondToContactRequestInput) => residentContactRepository.acceptRequest(input));
    const reject = useRepositoryMutation((input: RespondToContactRequestInput) => residentContactRepository.rejectRequest(input));
    const cancel = useRepositoryMutation((input: RespondToContactRequestInput) => residentContactRepository.cancelRequest(input));
    const block = useRepositoryMutation((input: RespondToContactRequestInput) => residentContactRepository.blockRequester(input));
    const report = useRepositoryMutation((input: ReportContactRequestInput) => residentContactRepository.reportRequest(input));
    return { accept, reject, cancel, block, report };
}

