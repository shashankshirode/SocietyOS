import * as Calendar from 'expo-calendar';
import type { FacilityBooking } from '../models/facilityBooking.models';

export type FacilityCalendarResult =
  | { readonly status: 'ADDED'; readonly eventId: string }
  | { readonly status: 'ALREADY_ADDED'; readonly eventId: string }
  | { readonly status: 'PERMISSION_DENIED'; readonly eventId: null }
  | { readonly status: 'UNAVAILABLE'; readonly eventId: null }
  | { readonly status: 'FAILED'; readonly eventId: null };

export async function addFacilityBookingToCalendar(
  booking: FacilityBooking,
  societyName: string,
): Promise<FacilityCalendarResult> {
  try {
    if (!await Calendar.isAvailableAsync()) {
      return { status: 'UNAVAILABLE', eventId: null };
    }
    if (booking.calendarEventId) {
      try {
        const existing = await Calendar.getEventAsync(booking.calendarEventId);
        return { status: 'ALREADY_ADDED', eventId: existing.id };
      } catch {}
    }
    const permission = await Calendar.requestCalendarPermissionsAsync();
    if (permission.status !== 'granted') {
      return { status: 'PERMISSION_DENIED', eventId: null };
    }
    const calendar = await Calendar.getDefaultCalendarAsync();
    const eventId = await Calendar.createEventAsync(calendar.id, {
      title: `${booking.facilityName} · ${societyName}`,
      startDate: new Date(booking.startsAt),
      endDate: new Date(booking.endsAt),
      timeZone: booking.timezone,
      location: booking.facilityLocation,
      notes: `Booking ${booking.bookingReference}. Present the booking reference or check-in pass at the facility desk.`,
    });
    return { status: 'ADDED', eventId };
  } catch {
    return { status: 'FAILED', eventId: null };
  }
}
