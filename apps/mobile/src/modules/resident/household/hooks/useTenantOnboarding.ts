import * as React from 'react';
import { residentHouseholdRepository } from '../data/residentHousehold.repository';
import type {
  SubmitTenantOnboardingInput,
  TenantAccessPermissionsInput,
  TenantAgreementInput,
  TenantOnboardingRequest,
  TenantPersonalInfoInput,
  UploadTenantDocumentInput,
} from '../data/residentHousehold.types';

export function useTenantOnboarding(initialRequestId?: string) {
  const [request, setRequest] = React.useState<TenantOnboardingRequest>();
  const [isLoading, setIsLoading] = React.useState(Boolean(initialRequestId));
  const [isMutating, setIsMutating] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const loadRequest = React.useCallback(async (requestId: string) => {
    setIsLoading(true);
    try {
      setRequest(await residentHouseholdRepository.getTenantOnboardingRequestById(requestId));
      setError(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError : new Error('resident.household.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (initialRequestId) {
      loadRequest(initialRequestId);
    }
  }, [initialRequestId, loadRequest]);

  const mutate = React.useCallback(async (operation: () => Promise<TenantOnboardingRequest>) => {
    setIsMutating(true);
    try {
      const nextRequest = await operation();
      setRequest(nextRequest);
      setError(null);
      return nextRequest;
    } catch (caughtError) {
      const nextError = caughtError instanceof Error ? caughtError : new Error('resident.household.errors.mutationFailed');
      setError(nextError);
      throw nextError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const createDraft = React.useCallback(
    () => mutate(() => residentHouseholdRepository.createTenantOnboardingDraft()),
    [mutate],
  );

  const updatePersonalInfo = React.useCallback(
    (requestId: string, input: TenantPersonalInfoInput) =>
      mutate(() => residentHouseholdRepository.updateTenantPersonalInfo(requestId, input)),
    [mutate],
  );

  const updateAgreementInfo = React.useCallback(
    (requestId: string, input: TenantAgreementInput) =>
      mutate(() => residentHouseholdRepository.updateTenantAgreementInfo(requestId, input)),
    [mutate],
  );

  const uploadDocument = React.useCallback(
    (requestId: string, input: UploadTenantDocumentInput) =>
      mutate(() => residentHouseholdRepository.uploadTenantDocumentMock(requestId, input)),
    [mutate],
  );

  const updateAccessPermissions = React.useCallback(
    (requestId: string, input: TenantAccessPermissionsInput) =>
      mutate(() => residentHouseholdRepository.updateTenantAccessPermissions(requestId, input)),
    [mutate],
  );

  const submitRequest = React.useCallback(
    (requestId: string, input: SubmitTenantOnboardingInput) =>
      mutate(() => residentHouseholdRepository.submitTenantOnboardingRequest(requestId, input)),
    [mutate],
  );

  return {
    request,
    isLoading,
    isMutating,
    error,
    loadRequest,
    createDraft,
    updatePersonalInfo,
    updateAgreementInfo,
    uploadDocument,
    updateAccessPermissions,
    submitRequest,
  };
}

