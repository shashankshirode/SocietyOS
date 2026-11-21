const residenceBase = (residenceId: string) => `/api/resident/residences/${residenceId}`;

export const facilityBookingEndpoints = {
  facilities: (residenceId: string) => `${residenceBase(residenceId)}/facilities`,
  facility: (residenceId: string, facilityId: string) => `${residenceBase(residenceId)}/facilities/${facilityId}`,
  availability: (residenceId: string, facilityId: string) => `${residenceBase(residenceId)}/facilities/${facilityId}/availability`,
  eligibility: (residenceId: string, facilityId: string) => `${residenceBase(residenceId)}/facilities/${facilityId}/eligibility`,
  slotHolds: (residenceId: string, facilityId: string) => `${residenceBase(residenceId)}/facilities/${facilityId}/slot-holds`,
  slotHold: (residenceId: string, holdId: string) => `${residenceBase(residenceId)}/facility-slot-holds/${holdId}`,
  quotes: (residenceId: string) => `${residenceBase(residenceId)}/facility-bookings/quotes`,
  bookings: (residenceId: string) => `${residenceBase(residenceId)}/facility-bookings`,
  booking: (residenceId: string, bookingId: string) => `${residenceBase(residenceId)}/facility-bookings/${bookingId}`,
  payment: (residenceId: string, bookingId: string) => `${residenceBase(residenceId)}/facility-bookings/${bookingId}/payment`,
  cancel: (residenceId: string, bookingId: string) => `${residenceBase(residenceId)}/facility-bookings/${bookingId}/cancel`,
  reschedule: (residenceId: string, bookingId: string) => `${residenceBase(residenceId)}/facility-bookings/${bookingId}/reschedule`,
  checkIn: (residenceId: string, bookingId: string) => `${residenceBase(residenceId)}/facility-bookings/${bookingId}/check-in`,
  qrToken: (residenceId: string, bookingId: string) => `${residenceBase(residenceId)}/facility-bookings/${bookingId}/qr-token`,
  calendarLink: (residenceId: string, bookingId: string) => `${residenceBase(residenceId)}/facility-bookings/${bookingId}/calendar-link`,
  waitlist: (residenceId: string, facilityId: string) => `${residenceBase(residenceId)}/facilities/${facilityId}/waitlist`,
  waitlistEntries: (residenceId: string) => `${residenceBase(residenceId)}/facility-waitlist`,
  waitlistEntry: (residenceId: string, waitlistId: string) => `${residenceBase(residenceId)}/facility-waitlist/${waitlistId}`,
  dashboard: (residenceId: string) => `${residenceBase(residenceId)}/facility-bookings/dashboard`,
} as const;
