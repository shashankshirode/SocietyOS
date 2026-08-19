import { mockResidentHomeContexts } from '../../homeContext/data/residentHomeContext.mockData';
import type { ActiveResidentHomeContext } from '../../homeContext/data/residentHomeContext.types';
import type { FacilityBookingResidentScope } from '../models/facilityBooking.models';

export function createFacilityBookingResidentScope(
  activeHome: ActiveResidentHomeContext,
): FacilityBookingResidentScope {
  const configuredHome = mockResidentHomeContexts.find(
    (home) => home.homeContextId === activeHome.homeContextId,
  );
  const isTenant = activeHome.residentRole === 'tenant';
  return {
    userId: activeHome.residentId,
    societyId: activeHome.societyId,
    societyName: activeHome.societyName,
    residenceId: activeHome.homeContextId,
    unitId: activeHome.unitId,
    unitLabel: `${activeHome.flatNumber} · ${activeHome.societyName}`,
    residentName: isTenant ? 'Amit Kulkarni' : 'Shashank Shirode',
    contactNumber: isTenant ? '+91 98230 44551' : '+91 98765 43210',
    role: activeHome.residentRole,
    residenceStatus: activeHome.status,
    timezone: activeHome.timezone ?? 'Asia/Kolkata',
    locale: activeHome.locale ?? 'en-IN',
    currencyCode: 'INR',
    hasResidenceAccess: activeHome.status !== 'inactive',
    isVerified: activeHome.status === 'active' || activeHome.status === 'moveOutPending',
    hasCompletedDocuments: activeHome.status === 'active',
    hasOutstandingDues: (configuredHome?.outstandingBillAmount ?? 0) > 10_000,
    featureEnabled: activeHome.status !== 'inactive' && activeHome.status !== 'pendingApproval',
  };
}
