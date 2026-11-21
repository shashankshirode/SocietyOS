export enum FacilityBookingFilter {
  All = 'ALL',
  Upcoming = 'UPCOMING',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
}

export const facilityBookingFilters = [
  FacilityBookingFilter.All,
  FacilityBookingFilter.Upcoming,
  FacilityBookingFilter.Completed,
  FacilityBookingFilter.Cancelled,
] as const;
