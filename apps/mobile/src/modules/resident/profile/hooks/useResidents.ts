import { useState, useEffect } from 'react';
import { ResidentsRepository } from '../data/residents.repository';
import type { ResidentProfileInfo } from '../data/residents.types';

export function useResidents() {
  const [residents, setResidents] = useState<ResidentProfileInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const list = await ResidentsRepository.getResidents();
        setResidents(list);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return {
    residents,
    isLoading,
    error,
    setResidents,
  };
}
