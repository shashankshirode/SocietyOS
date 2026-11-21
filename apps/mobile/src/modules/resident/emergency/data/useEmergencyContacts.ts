import { useState } from 'react';
import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';
import type { EmergencyContact } from '../../../../shared/types/emergency.types';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useEmergencyContacts() {
  const { activeContext } = useActiveResidentHome();
  const { data, isLoading, error, refetch } = useRepositoryResult(async () => {
    const res = await emergencySafetyRepository.getEmergencyContacts();
    return { ok: true, data: res };
  }, [activeContext.dataScopeKey]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addContact = async (input: Omit<EmergencyContact, 'id' | 'mobileMasked' | 'createdAt'>) => {
    setIsSubmitting(true);
    try {
      const res = await emergencySafetyRepository.createEmergencyContact(input);
      void refetch();
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateContact = async (contactId: string, input: Partial<EmergencyContact>) => {
    setIsSubmitting(true);
    try {
      const res = await emergencySafetyRepository.updateEmergencyContact(contactId, input);
      void refetch();
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeContact = async (contactId: string) => {
    setIsSubmitting(true);
    try {
      const res = await emergencySafetyRepository.deleteEmergencyContact(contactId);
      void refetch();
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    contacts: data || [],
    data: data || [],
    isLoading,
    error,
    isSubmitting,
    refetch,
    addContact,
    updateContact,
    removeContact,
  };
}
export default useEmergencyContacts;
