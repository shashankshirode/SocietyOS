import * as React from 'react';
import { residentHouseholdRepository } from '../data/residentHousehold.repository';
import type {
  AddFamilyMemberInput,
  FamilyMember,
  RemoveFamilyMemberAccessInput,
  UpdateFamilyAccessPermissionsInput,
  UpdateFamilyMemberInput,
} from '../data/residentHousehold.types';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useFamilyMembers() {
  const { activeContext } = useActiveResidentHome();
  const context = React.useMemo(() => ({
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  }), [activeContext]);

  const [data, setData] = React.useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [isMutating, setIsMutating] = React.useState(false);

  const refetch = React.useCallback(async () => {
    setIsLoading(true);
    try {
      setData(await residentHouseholdRepository.getFamilyMembers(context));
      setError(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError : new Error('resident.household.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [context]);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const addFamilyMember = React.useCallback(async (input: AddFamilyMemberInput) => {
    setIsMutating(true);
    try {
      const member = await residentHouseholdRepository.addFamilyMember(input);
      setData((current) => [...current, member]);
      return member;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const updateFamilyMember = React.useCallback(async (familyMemberId: string, input: UpdateFamilyMemberInput) => {
    setIsMutating(true);
    try {
      const member = await residentHouseholdRepository.updateFamilyMember(familyMemberId, input);
      setData((current) => current.map((item) => (item.id === familyMemberId ? member : item)));
      return member;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const updateFamilyMemberPermissions = React.useCallback(
    async (familyMemberId: string, input: UpdateFamilyAccessPermissionsInput) => {
      setIsMutating(true);
      try {
        const member = await residentHouseholdRepository.updateFamilyMemberPermissions(familyMemberId, input);
        setData((current) => current.map((item) => (item.id === familyMemberId ? member : item)));
        return member;
      } finally {
        setIsMutating(false);
      }
    },
    []
  );

  const removeFamilyMemberAccess = React.useCallback(
    async (familyMemberId: string, input: RemoveFamilyMemberAccessInput) => {
      setIsMutating(true);
      try {
        const member = await residentHouseholdRepository.removeFamilyMemberAccess(familyMemberId, input);
        setData((current) => current.map((item) => (item.id === familyMemberId ? member : item)));
        return member;
      } finally {
        setIsMutating(false);
      }
    },
    []
  );

  return {
    data,
    isLoading,
    error,
    isMutating,
    refetch,
    addFamilyMember,
    updateFamilyMember,
    updateFamilyMemberPermissions,
    removeFamilyMemberAccess,
  };
}
export default useFamilyMembers;
