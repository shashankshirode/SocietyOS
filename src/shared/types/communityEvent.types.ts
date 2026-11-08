export type CommunityEventCategory =
  | 'SOCIAL'
  | 'SPORTS'
  | 'FESTIVAL'
  | 'WORKSHOP'
  | 'GENERAL_BODY';

export type CommunityEventStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export type RsvpStatus = 'GOING' | 'INTERESTED' | 'NOT_GOING' | 'WAITLIST';

export interface CommunityEventRsvp {
  residentId: string;
  residentName: string;
  residentUnit: string;
  status: RsvpStatus;
  guestCount: number;
  timestamp: string;
}

export interface CommunityEvent {
  id: string;
  societyId: string;
  title: string;
  description: string;
  category: CommunityEventCategory;
  venue: string;
  startDateIso: string;
  endDateIso: string;
  maxCapacity: number;
  currentAttendees: number;
  waitlistCount: number;
  status: CommunityEventStatus;
  rsvps: Record<string, CommunityEventRsvp>;
  myRsvpStatus?: RsvpStatus;
  isWaitlistAllowed: boolean;
}

export interface SubmitRsvpInput {
  eventId: string;
  status: RsvpStatus;
  guestCount?: number;
  residentId?: string;
  residentName?: string;
  residentUnit?: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  category: CommunityEventCategory;
  venue: string;
  startDateIso: string;
  endDateIso: string;
  maxCapacity: number;
  isWaitlistAllowed?: boolean;
}

