import type { SosEmergencyContact, CreateSosEmergencyContactInput, UpdateSosEmergencyContactInput, TrustedContactInvitation, CreateTrustedContactInvitationInput, } from './sosEmergencyContact.types';
import type { SosResidenceContext } from './sosResponsePlan.types';
import { sosEmergencyContactMockSource } from './sosEmergencyContact.mockSource';
import type { Absent } from "../../../../shared/types/absence.types";
export interface SosEmergencyContactRepositoryContract {
    getContacts(context: SosResidenceContext): Promise<SosEmergencyContact[]>;
    getContact(context: SosResidenceContext, contactId: string): Promise<SosEmergencyContact | Absent>;
    addContact(context: SosResidenceContext, input: CreateSosEmergencyContactInput): Promise<SosEmergencyContact>;
    updateContact(context: SosResidenceContext, contactId: string, input: UpdateSosEmergencyContactInput): Promise<SosEmergencyContact>;
    removeContact(context: SosResidenceContext, contactId: string): Promise<void>;
}
export interface TrustedContactInvitationRepositoryContract {
    getInvitations(context: SosResidenceContext): Promise<TrustedContactInvitation[]>;
    sendInvitation(context: SosResidenceContext, input: CreateTrustedContactInvitationInput): Promise<TrustedContactInvitation>;
    acceptInvitation(invitationId: string): Promise<TrustedContactInvitation>;
    declineInvitation(invitationId: string): Promise<TrustedContactInvitation>;
    cancelInvitation(invitationId: string): Promise<TrustedContactInvitation>;
}
export const sosEmergencyContactRepository: SosEmergencyContactRepositoryContract = {
    getContacts(context: SosResidenceContext) {
        return sosEmergencyContactMockSource.getContacts(context);
    },
    getContact(context: SosResidenceContext, contactId: string) {
        return sosEmergencyContactMockSource.getContact(context, contactId);
    },
    addContact(context: SosResidenceContext, input: CreateSosEmergencyContactInput) {
        return sosEmergencyContactMockSource.addContact(context, input);
    },
    updateContact(context: SosResidenceContext, contactId: string, input: UpdateSosEmergencyContactInput) {
        return sosEmergencyContactMockSource.updateContact(context, contactId, input);
    },
    removeContact(context: SosResidenceContext, contactId: string) {
        return sosEmergencyContactMockSource.removeContact(context, contactId);
    },
};
export const trustedContactInvitationRepository: TrustedContactInvitationRepositoryContract = {
    getInvitations(context: SosResidenceContext) {
        return sosEmergencyContactMockSource.getInvitations(context);
    },
    sendInvitation(context: SosResidenceContext, input: CreateTrustedContactInvitationInput) {
        return sosEmergencyContactMockSource.sendInvitation(context, input);
    },
    acceptInvitation(invitationId: string) {
        return sosEmergencyContactMockSource.acceptInvitation(invitationId);
    },
    declineInvitation(invitationId: string) {
        return sosEmergencyContactMockSource.declineInvitation(invitationId);
    },
    cancelInvitation(invitationId: string) {
        return sosEmergencyContactMockSource.cancelInvitation(invitationId);
    },
};

