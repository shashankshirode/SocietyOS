import { useState, useEffect, useCallback } from 'react';
import type { SosEmergencyContact, CreateSosEmergencyContactInput, UpdateSosEmergencyContactInput } from '../data/sosEmergencyContact.types';
import type { SosResidenceContext } from '../data/sosResponsePlan.types';
import { sosEmergencyContactRepository } from '../data/sosEmergencyContact.repository';
import type { Absent } from "../../../../shared/types/absence.types";
export interface UseSosEmergencyContactsResult {
    contacts: SosEmergencyContact[];
    isLoading: boolean;
    error: Error | null;
    refresh: () => void;
    addContact: (input: CreateSosEmergencyContactInput) => Promise<SosEmergencyContact>;
    updateContact: (contactId: string, input: UpdateSosEmergencyContactInput) => Promise<SosEmergencyContact>;
    removeContact: (contactId: string) => Promise<void>;
    isSubmitting: boolean;
}
export function useSosEmergencyContacts(context: SosResidenceContext | Absent): UseSosEmergencyContactsResult {
    const [contacts, setContacts] = useState<SosEmergencyContact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const load = useCallback(async () => {
        if (!context) {
            setContacts([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await sosEmergencyContactRepository.getContacts(context);
            setContacts(result);
        }
        catch (e) {
            setError(e instanceof Error ? e : new Error('Failed to load contacts'));
        }
        finally {
            setIsLoading(false);
        }
    }, [context]);
    useEffect(() => {
        load();
    }, [load]);
    const addContact = useCallback(async (input: CreateSosEmergencyContactInput): Promise<SosEmergencyContact> => {
        if (!context)
            throw new Error('No active residence context');
        setIsSubmitting(true);
        try {
            const newContact = await sosEmergencyContactRepository.addContact(context, input);
            setContacts((prev) => [...prev, newContact]);
            return newContact;
        }
        finally {
            setIsSubmitting(false);
        }
    }, [context]);
    const updateContact = useCallback(async (contactId: string, input: UpdateSosEmergencyContactInput): Promise<SosEmergencyContact> => {
        if (!context)
            throw new Error('No active residence context');
        setIsSubmitting(true);
        try {
            const updated = await sosEmergencyContactRepository.updateContact(context, contactId, input);
            setContacts((prev) => prev.map((c) => (c.id === contactId ? updated : c)));
            return updated;
        }
        finally {
            setIsSubmitting(false);
        }
    }, [context]);
    const removeContact = useCallback(async (contactId: string): Promise<void> => {
        if (!context)
            throw new Error('No active residence context');
        setIsSubmitting(true);
        try {
            await sosEmergencyContactRepository.removeContact(context, contactId);
            setContacts((prev) => prev.filter((c) => c.id !== contactId));
        }
        finally {
            setIsSubmitting(false);
        }
    }, [context]);
    return { contacts, isLoading, error, refresh: load, addContact, updateContact, removeContact, isSubmitting };
}

