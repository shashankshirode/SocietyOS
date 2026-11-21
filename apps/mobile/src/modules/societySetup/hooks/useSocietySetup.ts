import { useState, useEffect } from 'react';
import { SocietySetupRepository } from '../data/societySetup.repository';
import type { SocietyHierarchyNode, UnitDetailInfo } from '../data/societySetup.types';

export function useSocietySetup() {
  const [hierarchy, setHierarchy] = useState<SocietyHierarchyNode | null>(null);
  const [units, setUnits] = useState<UnitDetailInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const hier = await SocietySetupRepository.getHierarchy();
        const list = await SocietySetupRepository.getUnitsList();
        setHierarchy(hier);
        setUnits(list);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return {
    hierarchy,
    units,
    isLoading,
    error,
  };
}
