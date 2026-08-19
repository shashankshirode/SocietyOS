import type { SosEmergencyContact, CreateSosEmergencyContactInput, UpdateSosEmergencyContactInput, TrustedContactInvitation, TrustedContactInvitationStatus, CreateTrustedContactInvitationInput, } from './sosEmergencyContact.types';
import type { SosResidenceContext } from './sosResponsePlan.types';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
const contactStore = new Map<string, SosEmergencyContact[]>();
const invitationStore: TrustedContactInvitation[] = [];
let contactIdCounter = 100;
let invitationIdCounter = 200;
function delay(ms: number = 350): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function maskPhone(phone: string): string {
    if (phone.length <= 4)
        return '****';
    return phone.slice(0, -4).replace(/./g, '*') + phone.slice(-4);
}
function getContactsForResidence(residenceId: string): SosEmergencyContact[] {
    if (!contactStore.has(residenceId)) {
        contactStore.set(residenceId, []);
    }
    return contactStore.get(residenceId) as SosEmergencyContact[];
}
export const sosEmergencyContactMockSource = {
    async getContacts(context: SosResidenceContext): Promise<SosEmergencyContact[]> {
        await delay();
        return getContactsForResidence(context.residenceId).filter((c) => c.societyId === context.societyId);
    },
    async getContact(context: SosResidenceContext, contactId: string): Promise<SosEmergencyContact | Absent> {
        await delay(200);
        const contacts = getContactsForResidence(context.residenceId);
        return contacts.find((c) => c.id === contactId);
    },
    async addContact(context: SosResidenceContext, input: CreateSosEmergencyContactInput): Promise<SosEmergencyContact> {
        await delay(300);
        contactIdCounter += 1;
        const now = new Date().toISOString();
        const contact: SosEmergencyContact = {
            id: `sos-contact-${contactIdCounter}`,
            residenceId: context.residenceId,
            societyId: context.societyId,
            displayName: input.displayName,
            category: input.category,
            relationship: input.relationship,
            phoneNumber: input.phoneNumber,
            phoneMasked: maskPhone(input.phoneNumber),
            ...includeWhenPresent("email", input.email),
            ...includeWhenPresent("residentReferenceId", input.residentReferenceId),
            preferredChannels: input.preferredChannels,
            active: true,
            verified: false,
            consentStatus: input.residentReferenceId ? 'pending' : 'granted',
            priority: input.priority,
            availableForSosTypes: input.availableForSosTypes,
            ...includeWhenPresent("notes", input.notes),
            createdAt: now,
            updatedAt: now
        };
        getContactsForResidence(context.residenceId).push(contact);
        return contact;
    },
    async updateContact(context: SosResidenceContext, contactId: string, input: UpdateSosEmergencyContactInput): Promise<SosEmergencyContact> {
        await delay(300);
        const contacts = getContactsForResidence(context.residenceId);
        const index = contacts.findIndex((c) => c.id === contactId);
        if (index === -1)
            throw new Error(`Contact ${contactId} not found`);
        const existing = getRequiredItem(contacts, index, "sosEmergencyContact.mockSource.ts");
        const updated: SosEmergencyContact = {
            ...existing,
            ...(input.displayName !== undefined && { displayName: input.displayName }),
            ...(input.category !== undefined && { category: input.category }),
            ...(input.relationship !== undefined && { relationship: input.relationship }),
            ...(input.phoneNumber !== undefined && {
                phoneNumber: input.phoneNumber,
                phoneMasked: maskPhone(input.phoneNumber)
            }),
            ...(input.email !== undefined && { email: input.email }),
            ...(input.preferredChannels !== undefined && { preferredChannels: input.preferredChannels }),
            ...(input.priority !== undefined && { priority: input.priority }),
            ...(input.availableForSosTypes !== undefined && { availableForSosTypes: input.availableForSosTypes }),
            ...(input.active !== undefined && { active: input.active }),
            ...(input.notes !== undefined && { notes: input.notes }),
            updatedAt: new Date().toISOString()
        };
        contacts[index] = updated;
        return updated;
    },
    async removeContact(context: SosResidenceContext, contactId: string): Promise<void> {
        await delay(250);
        const contacts = getContactsForResidence(context.residenceId);
        const index = contacts.findIndex((c) => c.id === contactId);
        if (index !== -1) {
            contacts.splice(index, 1);
        }
    },
    async getInvitations(context: SosResidenceContext): Promise<TrustedContactInvitation[]> {
        await delay();
        return invitationStore.filter((inv) => inv.societyId === context.societyId && inv.residenceId === context.residenceId);
    },
    async sendInvitation(context: SosResidenceContext, input: CreateTrustedContactInvitationInput): Promise<TrustedContactInvitation> {
        await delay(300);
        invitationIdCounter += 1;
        const now = new Date().toISOString();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const invitation: TrustedContactInvitation = {
            id: `sos-invite-${invitationIdCounter}`,
            residenceId: context.residenceId,
            societyId: context.societyId,
            requestorResidentId: 'current-user-id',
            requestorName: 'Current User',
            requestorUnit: `${context.flatNumber}`,
            recipientResidentId: input.recipientResidentId,
            recipientName: 'Invited Resident',
            recipientUnit: 'Unknown',
            sosTypesRequested: input.sosTypesRequested,
            ...includeWhenPresent("reason", input.reason),
            status: 'pending',
            createdAt: now,
            expiresAt
        };
        invitationStore.push(invitation);
        return invitation;
    },
    async acceptInvitation(invitationId: string): Promise<TrustedContactInvitation> {
        await delay(300);
        const inv = invitationStore.find((i) => i.id === invitationId);
        if (!inv)
            throw new Error(`Invitation ${invitationId} not found`);
        const updated: TrustedContactInvitation = {
            ...inv,
            status: 'accepted' as TrustedContactInvitationStatus,
            respondedAt: new Date().toISOString()
        };
        const idx = invitationStore.indexOf(inv);
        invitationStore[idx] = updated;
        return updated;
    },
    async declineInvitation(invitationId: string): Promise<TrustedContactInvitation> {
        await delay(300);
        const inv = invitationStore.find((i) => i.id === invitationId);
        if (!inv)
            throw new Error(`Invitation ${invitationId} not found`);
        const updated: TrustedContactInvitation = {
            ...inv,
            status: 'declined' as TrustedContactInvitationStatus,
            respondedAt: new Date().toISOString()
        };
        const idx = invitationStore.indexOf(inv);
        invitationStore[idx] = updated;
        return updated;
    },
    async cancelInvitation(invitationId: string): Promise<TrustedContactInvitation> {
        await delay(200);
        const inv = invitationStore.find((i) => i.id === invitationId);
        if (!inv)
            throw new Error(`Invitation ${invitationId} not found`);
        const updated: TrustedContactInvitation = {
            ...inv,
            status: 'cancelled' as TrustedContactInvitationStatus,
            respondedAt: new Date().toISOString()
        };
        const idx = invitationStore.indexOf(inv);
        invitationStore[idx] = updated;
        return updated;
    },
    _seedContacts(residenceId: string, contacts: SosEmergencyContact[]): void {
        contactStore.set(residenceId, [...contacts]);
    },
    _seedInvitations(invitations: TrustedContactInvitation[]): void {
        invitationStore.length = 0;
        invitationStore.push(...invitations);
    },
    _resetAll(): void {
        contactStore.clear();
        invitationStore.length = 0;
        contactIdCounter = 100;
        invitationIdCounter = 200;
    }
};

