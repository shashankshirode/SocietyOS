import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import type { RequestContext } from '../../../../core/api/requestContext';
import { mapContextRoleToAppRole } from '../../homeContext/utils/residentHomeContextPermissions';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { ResidentLifecycleRepository } from './residentLifecycle.types';

function requestContext(context: ResidentRepositoryRequestContext): RequestContext {
  return {
    societyId: context.activeHome.societyId,
    unitId: context.activeHome.unitId,
    residentProfileId: context.activeHome.residentId,
    activeRole: mapContextRoleToAppRole(context.activeHome.residentRole),
    locale: context.activeHome.locale ?? 'en-IN',
    timezone: context.activeHome.timezone ?? 'Asia/Kolkata',
  };
}

export const residentLifecycleApiSource: ResidentLifecycleRepository = {
  getFamilyPortabilityPlan: (context) => apiClient.get(
    apiEndpoints.residentLifecycle.familyPortabilityPlan(context.activeHome.homeContextId),
    { context: requestContext(context) }
  ),
  executeFamilyPortability: (input) => {
    const payload: JsonObject = {
      sourceHomeContextId: input.sourceContext.activeHome.homeContextId,
      targetHomeContextId: input.targetContext.activeHome.homeContextId,
      familyMemberIds: [...input.familyMemberIds],
      relationToOwner: input.relationToOwner,
      stayPattern: input.stayPattern,
      permissions: {
        visitorApprovalPermission: input.permissions.visitorApprovalPermission,
        noticeViewPermission: input.permissions.noticeViewPermission,
        emergencyAccessPermission: input.permissions.emergencyAccessPermission,
        facilityBookingPermission: input.permissions.facilityBookingPermission,
        documentAccessPermission: input.permissions.documentAccessPermission,
        profileVisibility: input.permissions.profileVisibility,
      },
      consentConfirmed: input.consentConfirmed,
    };
    return apiClient.post(
      apiEndpoints.residentLifecycle.copyFamilyMembers,
      payload,
      {
      context: requestContext(input.sourceContext),
      idempotencyKey: createIdempotencyKey(`family-portability-${input.sourceContext.dataScopeKey}-${input.targetContext.dataScopeKey}`),
      }
    );
  },
  getRentalDeclaration: (context) => apiClient.get(
    apiEndpoints.residentLifecycle.rentalDeclaration(context.activeHome.homeContextId),
    { context: requestContext(context) }
  ),
  submitRentalDeclaration: (input) => apiClient.put(
    apiEndpoints.residentLifecycle.rentalDeclaration(input.context.activeHome.homeContextId),
    input,
    {
      context: requestContext(input.context),
      idempotencyKey: createIdempotencyKey(`rental-declaration-${input.context.dataScopeKey}`),
    }
  ),
  listShortStays: (context) => apiClient.get(
    apiEndpoints.residentLifecycle.shortStays(context.activeHome.homeContextId),
    { context: requestContext(context) }
  ),
  createShortStay: (input) => apiClient.post(
    apiEndpoints.residentLifecycle.shortStays(input.context.activeHome.homeContextId),
    input,
    {
      context: requestContext(input.context),
      idempotencyKey: createIdempotencyKey(`short-stay-${input.context.dataScopeKey}-${input.listingIdentifier}`),
    }
  ),
  updateShortStayStatus: (input) => apiClient.post(
    apiEndpoints.residentLifecycle.shortStayAction(input.context.activeHome.homeContextId, input.stayId, input.action),
    input.extendedCheckOutAt ? { extendedCheckOutAt: input.extendedCheckOutAt } : undefined,
    {
      context: requestContext(input.context),
      idempotencyKey: createIdempotencyKey(`short-stay-${input.stayId}-${input.action}`),
    }
  ),
};
