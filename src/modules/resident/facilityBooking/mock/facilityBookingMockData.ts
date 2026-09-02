import {
  FacilityAvailabilityStatus,
  FacilityBookingCancellationReason,
  FacilityBookingStatus,
  FacilityCategory,
  FacilityCheckInMode,
  FacilityPaymentMethod,
  FacilityPaymentStatus,
  FacilityRefundStatus,
  FacilitySlotStatus,
} from '../models/facilityBooking.enums';
import type {
  Facility,
  FacilityActivityItem,
  FacilityBooking,
  FacilityBookingPayment,
  FacilityBookingPriceBreakdown,
  FacilityBookingQrPass,
  FacilityBookingQuote,
  FacilityBookingRefund,
  FacilityBookingTimelineItem,
  FacilityImage,
  FacilityNotificationItem,
  FacilityOperatingSchedule,
  FacilityRule,
  FacilitySlot,
  FacilityWaitlistEntry,
} from '../models/facilityBooking.models';

const openDailySchedule: readonly FacilityOperatingSchedule[] = Array.from(
  { length: 7 },
  (_, dayOfWeek) => ({
    dayOfWeek,
    opensAtLocalTime: '06:00',
    closesAtLocalTime: '22:00',
    closed: false,
  }),
);

const commonRules: readonly FacilityRule[] = [
  {
    id: 'resident-responsibility',
    title: 'Resident responsibility',
    description: 'The booking resident is responsible for guests, conduct, and facility condition.',
    required: true,
  },
  {
    id: 'booked-time',
    title: 'Booked time only',
    description: 'Use the facility only within the confirmed reservation window.',
    required: true,
  },
  {
    id: 'clean-exit',
    title: 'Leave the space ready',
    description: 'Remove personal items and leave the facility ready for the next resident.',
    required: true,
  },
];

const cancellationPolicy = {
  fullRefundCutoffMinutes: 1_440,
  partialRefundCutoffMinutes: 360,
  partialRefundPercentage: 50,
  depositRefundable: true,
  convenienceFeeRefundable: false,
  noShowRefundPercentage: 0,
} as const;

const eligibilityPolicy = {
  allowedRoles: ['owner', 'coOwner', 'tenant', 'familyMember', 'authorizedOccupant'],
  requiresVerifiedResidence: true,
  requiresCompletedDocuments: false,
  blockWhenDuesOutstanding: false,
  dailyLimitPerUnit: 2,
  weeklyLimitPerUnit: 4,
  monthlyLimitPerUnit: 10,
} as const;

function image(
  id: string,
  uri: string,
  accessibilityLabel: string,
  fallbackIcon: string,
  fallbackGradient: readonly string[],
): FacilityImage {
  return {
    id,
    uri,
    accessibilityLabel,
    fallbackIcon,
    fallbackGradient,
    isPrimary: true,
  };
}

function facility(
  values: Pick<Facility,
    | 'id'
    | 'societyId'
    | 'name'
    | 'category'
    | 'description'
    | 'locationName'
    | 'floorOrZone'
    | 'images'
    | 'amenities'
    | 'capacity'
    | 'minimumGuests'
    | 'maximumGuests'
    | 'baseFeeInMinorUnits'
    | 'refundableDepositInMinorUnits'
    | 'availabilityStatus'
    | 'waitlistEnabled'
    | 'requiresGuestDetails'
    | 'checkInMode'
    | 'setupOptions'
    | 'nextAvailableAt'
  > & Partial<Pick<Facility,
    | 'bookingEnabled'
    | 'rescheduleEnabled'
    | 'requiresPayment'
    | 'requiresConsent'
    | 'timezone'
    | 'currencyCode'
    | 'minimumBookingDurationMinutes'
    | 'maximumBookingDurationMinutes'
    | 'bookingIntervalMinutes'
    | 'includedGuestCount'
    | 'guestSurchargeInMinorUnits'
    | 'taxRateBasisPoints'
    | 'convenienceFeeInMinorUnits'
    | 'eligibilityPolicy'
  >>,
): Facility {
  return {
    ...values,
    operatingSchedule: openDailySchedule,
    minimumBookingDurationMinutes: values.minimumBookingDurationMinutes ?? 60,
    maximumBookingDurationMinutes: values.maximumBookingDurationMinutes ?? 240,
    bookingIntervalMinutes: values.bookingIntervalMinutes ?? 60,
    minimumAdvanceBookingMinutes: 60,
    maximumAdvanceBookingDays: 45,
    cancellationCutoffMinutes: 360,
    checkInStartOffsetMinutes: 15,
    checkInEndOffsetMinutes: 30,
    cleanupBufferMinutes: 30,
    includedGuestCount: values.includedGuestCount ?? values.maximumGuests,
    guestSurchargeInMinorUnits: values.guestSurchargeInMinorUnits ?? 0,
    taxRateBasisPoints: values.taxRateBasisPoints ?? 0,
    convenienceFeeInMinorUnits: values.convenienceFeeInMinorUnits ?? 0,
    currencyCode: values.currencyCode ?? 'INR',
    timezone: values.timezone ?? 'Asia/Kolkata',
    bookingEnabled: values.bookingEnabled ?? true,
    rescheduleEnabled: values.rescheduleEnabled ?? true,
    recurringBookingEnabled: false,
    requiresPayment: values.requiresPayment ?? (
      values.baseFeeInMinorUnits > 0 || values.refundableDepositInMinorUnits > 0
    ),
    requiresConsent: values.requiresConsent ?? true,
    rules: commonRules,
    eligibilityPolicy: (values as any).eligibilityPolicy ?? eligibilityPolicy,
    cancellationPolicy,
  };
}

export const facilityBookingMockFacilities: readonly Facility[] = [
  facility({
    id: 'gv-clubhouse',
    societyId: 'society-gv',
    name: 'Clubhouse',
    category: FacilityCategory.Clubhouse,
    description: 'A premium resident lounge with indoor games, conversation areas, and flexible community seating.',
    locationName: 'Central Clubhouse',
    floorOrZone: 'Level 1',
    images: [image('clubhouse-main', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85', 'Premium clubhouse lounge with comfortable seating', 'home-outline', ['#0F766E', '#164E63'])],
    amenities: [
      { id: 'lounge', name: 'Lounge seating', iconName: 'albums-outline' },
      { id: 'ac', name: 'Air conditioning', iconName: 'snow-outline' },
      { id: 'accessible', name: 'Accessible entry', iconName: 'accessibility-outline' },
      { id: 'water', name: 'Drinking water', iconName: 'water-outline' },
    ],
    capacity: 40,
    minimumGuests: 1,
    maximumGuests: 40,
    baseFeeInMinorUnits: 50_000,
    refundableDepositInMinorUnits: 100_000,
    availabilityStatus: FacilityAvailabilityStatus.Available,
    waitlistEnabled: true,
    requiresGuestDetails: false,
    checkInMode: FacilityCheckInMode.Qr,
    setupOptions: [
      { id: 'club-projector', name: 'Projector', description: 'HD projector with HDMI cable', feeInMinorUnits: 20_000, maximumQuantity: 1 },
      { id: 'club-housekeeping', name: 'Housekeeping', description: 'Post-event housekeeping support', feeInMinorUnits: 35_000, maximumQuantity: 1 },
    ],
    nextAvailableAt: '2026-07-18T03:30:00.000Z',
    taxRateBasisPoints: 1_800,
    eligibilityPolicy: {
      ...eligibilityPolicy,
      allowedRoles: ['owner', 'coOwner'],
    },
  }),
  facility({
    id: 'gv-badminton',
    societyId: 'society-gv',
    name: 'Badminton Court',
    category: FacilityCategory.Sports,
    description: 'An indoor wooden court with anti-glare lighting and professional markings.',
    locationName: 'Sports Pavilion',
    floorOrZone: 'Court 1',
    images: [image('badminton-main', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=85', 'Indoor badminton court with net and marked wooden floor', 'trophy-outline', ['#15803D', '#166534'])],
    amenities: [
      { id: 'lighting', name: 'Court lighting', iconName: 'bulb-outline' },
      { id: 'change', name: 'Changing room', iconName: 'shirt-outline' },
      { id: 'equipment', name: 'Racket rental', iconName: 'tennisball-outline' },
    ],
    capacity: 4,
    minimumGuests: 1,
    maximumGuests: 4,
    baseFeeInMinorUnits: 15_000,
    refundableDepositInMinorUnits: 0,
    availabilityStatus: FacilityAvailabilityStatus.LimitedSlots,
    waitlistEnabled: true,
    requiresGuestDetails: false,
    checkInMode: FacilityCheckInMode.Qr,
    setupOptions: [
      { id: 'badminton-rackets', name: 'Racket set', description: 'Two rackets and shuttlecocks', feeInMinorUnits: 5_000, maximumQuantity: 2 },
    ],
    nextAvailableAt: '2026-07-18T05:30:00.000Z',
  }),
  facility({
    id: 'gv-gym',
    societyId: 'society-gv',
    name: 'Gym',
    category: FacilityCategory.Fitness,
    description: 'A resident fitness studio with cardio, strength, and functional training zones.',
    locationName: 'Central Clubhouse',
    floorOrZone: 'Ground Floor',
    images: [image('gym-main', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85', 'Modern community gym with strength and cardio equipment', 'barbell-outline', ['#1E3A8A', '#312E81'])],
    amenities: [
      { id: 'cardio', name: 'Cardio equipment', iconName: 'pulse-outline' },
      { id: 'weights', name: 'Free weights', iconName: 'barbell-outline' },
      { id: 'lockers', name: 'Lockers', iconName: 'lock-closed-outline' },
    ],
    capacity: 12,
    minimumGuests: 1,
    maximumGuests: 2,
    baseFeeInMinorUnits: 0,
    refundableDepositInMinorUnits: 0,
    availabilityStatus: FacilityAvailabilityStatus.Available,
    waitlistEnabled: false,
    requiresGuestDetails: false,
    checkInMode: FacilityCheckInMode.Reference,
    setupOptions: [],
    nextAvailableAt: '2026-07-18T00:30:00.000Z',
    requiresPayment: false,
  }),
  facility({
    id: 'gv-pool',
    societyId: 'society-gv',
    name: 'Swimming Pool',
    category: FacilityCategory.Fitness,
    description: 'A supervised outdoor pool with a separate shallow family area and changing rooms.',
    locationName: 'Pool Deck',
    floorOrZone: 'Garden Level',
    images: [image('pool-main', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85', 'Clean blue outdoor community swimming pool', 'water-outline', ['#0284C7', '#0369A1'])],
    amenities: [
      { id: 'lifeguard', name: 'Lifeguard', iconName: 'shield-checkmark-outline' },
      { id: 'changing', name: 'Changing rooms', iconName: 'shirt-outline' },
      { id: 'shower', name: 'Showers', iconName: 'water-outline' },
    ],
    capacity: 24,
    minimumGuests: 1,
    maximumGuests: 4,
    baseFeeInMinorUnits: 0,
    refundableDepositInMinorUnits: 0,
    availabilityStatus: FacilityAvailabilityStatus.UnderMaintenance,
    bookingEnabled: false,
    waitlistEnabled: false,
    requiresGuestDetails: false,
    checkInMode: FacilityCheckInMode.Qr,
    setupOptions: [],
    nextAvailableAt: null,
    requiresPayment: false,
  }),
  facility({
    id: 'gv-guest-room',
    societyId: 'society-gv',
    name: 'Guest Room',
    category: FacilityCategory.GuestStay,
    description: 'A comfortable air-conditioned guest suite with attached bathroom and fresh linen.',
    locationName: 'Guest Wing',
    floorOrZone: 'Level 2',
    images: [image('guest-main', 'https://images.unsplash.com/photo-1611891487122-2075b9627798?auto=format&fit=crop&w=1200&q=85', 'Comfortable furnished guest room with double bed', 'bed-outline', ['#7C3AED', '#4C1D95'])],
    amenities: [
      { id: 'linen', name: 'Fresh linen', iconName: 'bed-outline' },
      { id: 'bath', name: 'Attached bathroom', iconName: 'water-outline' },
      { id: 'ac', name: 'Air conditioning', iconName: 'snow-outline' },
    ],
    capacity: 3,
    minimumGuests: 1,
    maximumGuests: 3,
    baseFeeInMinorUnits: 250_000,
    refundableDepositInMinorUnits: 500_000,
    availabilityStatus: FacilityAvailabilityStatus.Available,
    waitlistEnabled: false,
    requiresGuestDetails: true,
    checkInMode: FacilityCheckInMode.Qr,
    setupOptions: [
      { id: 'guest-extra-bed', name: 'Additional bed', description: 'Single rollaway bed with linen', feeInMinorUnits: 75_000, maximumQuantity: 1 },
    ],
    nextAvailableAt: '2026-07-21T06:30:00.000Z',
    minimumBookingDurationMinutes: 360,
    maximumBookingDurationMinutes: 1_440,
    bookingIntervalMinutes: 360,
    taxRateBasisPoints: 1_200,
  }),
  facility({
    id: 'gv-party-hall',
    societyId: 'society-gv',
    name: 'Party Hall',
    category: FacilityCategory.EventSpace,
    description: 'An elegant celebration hall with stage, buffet zone, and flexible event seating.',
    locationName: 'Central Clubhouse',
    floorOrZone: 'Level 2',
    images: [image('party-main', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85', 'Elegant celebration hall with tables and warm lighting', 'sparkles-outline', ['#BE123C', '#881337'])],
    amenities: [
      { id: 'stage', name: 'Stage', iconName: 'mic-outline' },
      { id: 'buffet', name: 'Buffet zone', iconName: 'restaurant-outline' },
      { id: 'washroom', name: 'Washrooms', iconName: 'water-outline' },
      { id: 'access', name: 'Accessible entry', iconName: 'accessibility-outline' },
    ],
    capacity: 100,
    minimumGuests: 10,
    maximumGuests: 100,
    baseFeeInMinorUnits: 500_000,
    refundableDepositInMinorUnits: 1_000_000,
    availabilityStatus: FacilityAvailabilityStatus.FullyBooked,
    waitlistEnabled: true,
    requiresGuestDetails: false,
    checkInMode: FacilityCheckInMode.Qr,
    setupOptions: [
      { id: 'party-chairs', name: 'Chair package', description: 'Twenty additional chairs', feeInMinorUnits: 30_000, maximumQuantity: 4 },
      { id: 'party-sound', name: 'Sound system', description: 'Society-approved sound setup', feeInMinorUnits: 50_000, maximumQuantity: 1 },
      { id: 'party-housekeeping', name: 'Housekeeping', description: 'Event cleanup service', feeInMinorUnits: 65_000, maximumQuantity: 1 },
    ],
    nextAvailableAt: '2026-07-25T11:30:00.000Z',
    includedGuestCount: 50,
    guestSurchargeInMinorUnits: 2_500,
    taxRateBasisPoints: 1_800,
    convenienceFeeInMinorUnits: 2_000,
  }),
  facility({
    id: 'gp-tennis',
    societyId: 'society-gp',
    name: 'Tennis Court',
    category: FacilityCategory.Sports,
    description: 'An outdoor synthetic tennis court with evening floodlights and spectator seating.',
    locationName: 'Recreation Ground',
    floorOrZone: 'East Court',
    images: [image('tennis-main', 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=85', 'Outdoor tennis court with net and clear markings', 'tennisball-outline', ['#166534', '#14532D'])],
    amenities: [{ id: 'lights', name: 'Floodlights', iconName: 'bulb-outline' }, { id: 'seating', name: 'Spectator seating', iconName: 'people-outline' }],
    capacity: 4,
    minimumGuests: 1,
    maximumGuests: 4,
    baseFeeInMinorUnits: 20_000,
    refundableDepositInMinorUnits: 0,
    availabilityStatus: FacilityAvailabilityStatus.Available,
    waitlistEnabled: true,
    requiresGuestDetails: false,
    checkInMode: FacilityCheckInMode.Qr,
    setupOptions: [{ id: 'tennis-rackets', name: 'Racket set', description: 'Two rackets and tennis balls', feeInMinorUnits: 8_000, maximumQuantity: 2 }],
    nextAvailableAt: '2026-07-18T02:30:00.000Z',
  }),
  facility({
    id: 'gp-yoga',
    societyId: 'society-gp',
    name: 'Yoga Studio',
    category: FacilityCategory.Fitness,
    description: 'A quiet, naturally lit studio for yoga, meditation, and low-impact group fitness.',
    locationName: 'Wellness Centre',
    floorOrZone: 'First Floor',
    images: [image('yoga-main', 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=85', 'Calm yoga studio with mats and natural light', 'leaf-outline', ['#0F766E', '#134E4A'])],
    amenities: [{ id: 'mats', name: 'Yoga mats', iconName: 'fitness-outline' }, { id: 'ac', name: 'Air conditioning', iconName: 'snow-outline' }],
    capacity: 16,
    minimumGuests: 1,
    maximumGuests: 8,
    baseFeeInMinorUnits: 0,
    refundableDepositInMinorUnits: 0,
    availabilityStatus: FacilityAvailabilityStatus.Available,
    waitlistEnabled: false,
    requiresGuestDetails: false,
    checkInMode: FacilityCheckInMode.Reference,
    setupOptions: [],
    nextAvailableAt: '2026-07-18T00:30:00.000Z',
    requiresPayment: false,
  }),
  facility({
    id: 'gp-conference',
    societyId: 'society-gp',
    name: 'Conference Room',
    category: FacilityCategory.Community,
    description: 'A focused meeting room with display, whiteboard, and hybrid-call equipment.',
    locationName: 'Administration Building',
    floorOrZone: 'Ground Floor',
    images: [image('conference-main', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85', 'Modern conference room with meeting table and presentation screen', 'people-circle-outline', ['#334155', '#0F172A'])],
    amenities: [{ id: 'display', name: 'Presentation display', iconName: 'tv-outline' }, { id: 'whiteboard', name: 'Whiteboard', iconName: 'create-outline' }],
    capacity: 12,
    minimumGuests: 1,
    maximumGuests: 12,
    baseFeeInMinorUnits: 40_000,
    refundableDepositInMinorUnits: 50_000,
    availabilityStatus: FacilityAvailabilityStatus.LimitedSlots,
    waitlistEnabled: true,
    requiresGuestDetails: false,
    checkInMode: FacilityCheckInMode.Qr,
    setupOptions: [{ id: 'conference-video', name: 'Video conference kit', description: 'Camera, speaker, and display connection', feeInMinorUnits: 15_000, maximumQuantity: 1 }],
    nextAvailableAt: '2026-07-19T04:30:00.000Z',
    taxRateBasisPoints: 1_800,
  }),
  facility({
    id: 'gp-kids',
    societyId: 'society-gp',
    name: 'Kids Play Area',
    category: FacilityCategory.Outdoor,
    description: 'A shaded outdoor play zone with age-appropriate equipment and soft flooring.',
    locationName: 'Central Garden',
    floorOrZone: 'Play Zone',
    images: [image('kids-main', 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1200&q=85', 'Colourful outdoor children play area with safe equipment', 'happy-outline', ['#EA580C', '#C2410C'])],
    amenities: [{ id: 'shade', name: 'Shaded seating', iconName: 'umbrella-outline' }, { id: 'water', name: 'Drinking water', iconName: 'water-outline' }],
    capacity: 20,
    minimumGuests: 1,
    maximumGuests: 6,
    baseFeeInMinorUnits: 0,
    refundableDepositInMinorUnits: 0,
    availabilityStatus: FacilityAvailabilityStatus.Available,
    waitlistEnabled: false,
    requiresGuestDetails: false,
    checkInMode: FacilityCheckInMode.NotRequired,
    setupOptions: [],
    nextAvailableAt: '2026-07-18T00:30:00.000Z',
    requiresPayment: false,
  }),
];

const slotStarts = [
  '2026-07-18T03:30:00.000Z',
  '2026-07-18T05:30:00.000Z',
  '2026-07-18T10:30:00.000Z',
  '2026-07-18T12:30:00.000Z',
  '2026-07-19T03:30:00.000Z',
  '2026-07-19T05:30:00.000Z',
  '2026-07-19T10:30:00.000Z',
  '2026-07-20T03:30:00.000Z',
] as const;

export const facilityBookingMockSlots: readonly FacilitySlot[] = facilityBookingMockFacilities.flatMap(
  (item, facilityIndex) => slotStarts.map((startsAt, slotIndex) => {
    const durationMinutes = item.category === FacilityCategory.GuestStay ? 360 : 60;
    const endsAt = new Date(Date.parse(startsAt) + durationMinutes * 60_000).toISOString();
    let status = FacilitySlotStatus.Available;
    if (!item.bookingEnabled) status = FacilitySlotStatus.Maintenance;
    else if (item.availabilityStatus === FacilityAvailabilityStatus.FullyBooked) status = FacilitySlotStatus.Full;
    else if ((facilityIndex + slotIndex) % 7 === 3) status = FacilitySlotStatus.Full;
    else if ((facilityIndex + slotIndex) % 5 === 2) status = FacilitySlotStatus.Limited;
    return {
      id: `${item.id}-slot-${slotIndex + 1}`,
      societyId: item.societyId,
      residenceId: item.societyId === 'society-gv' ? 'context-001' : 'context-003',
      facilityId: item.id,
      startsAt,
      endsAt,
      status,
      remainingCapacity: status === FacilitySlotStatus.Full || status === FacilitySlotStatus.Maintenance
        ? 0
        : status === FacilitySlotStatus.Limited ? 2 : item.capacity,
      slotFeeInMinorUnits: slotIndex >= 2 ? Math.round(item.baseFeeInMinorUnits * 0.2) : 0,
      heldByResidenceId: null,
      holdExpiresAt: null,
    };
  }),
);

const zeroBreakdown: FacilityBookingPriceBreakdown = {
  facilityFeeInMinorUnits: 0,
  slotFeeInMinorUnits: 0,
  equipmentFeeInMinorUnits: 0,
  guestSurchargeInMinorUnits: 0,
  taxInMinorUnits: 0,
  convenienceFeeInMinorUnits: 0,
  discountInMinorUnits: 0,
  refundableDepositInMinorUnits: 0,
  totalPayableInMinorUnits: 0,
};

function quote(
  id: string,
  residenceId: string,
  facilityId: string,
  slotId: string,
  breakdown: FacilityBookingPriceBreakdown,
): FacilityBookingQuote {
  return {
    id,
    residenceId,
    facilityId,
    slotId,
    holdId: `seed-hold-${id}`,
    breakdown,
    currencyCode: 'INR',
    createdAt: '2026-07-16T08:00:00.000Z',
    expiresAt: '2026-07-31T08:00:00.000Z',
  };
}

function timeline(
  reference: string,
  status: FacilityBookingStatus,
): readonly FacilityBookingTimelineItem[] {
  const items: FacilityBookingTimelineItem[] = [
    { id: `${reference}-created`, title: 'Booked', description: 'Reservation details were submitted.', occurredAt: '2026-07-16T08:00:00.000Z', completed: true },
  ];
  if (status !== FacilityBookingStatus.PaymentPending && status !== FacilityBookingStatus.Waitlisted) {
    items.push({ id: `${reference}-confirmed`, title: 'Confirmed', description: 'The facility reservation is confirmed.', occurredAt: '2026-07-16T08:02:00.000Z', completed: true });
  }
  if ([FacilityBookingStatus.CheckedIn, FacilityBookingStatus.InUse, FacilityBookingStatus.Completed].includes(status)) {
    items.push({ id: `${reference}-checkin`, title: 'Checked in', description: 'Facility access was recorded.', occurredAt: '2026-07-16T08:45:00.000Z', completed: true });
  }
  if (status === FacilityBookingStatus.Completed) {
    items.push({ id: `${reference}-completed`, title: 'Completed', description: 'The reserved time ended successfully.', occurredAt: '2026-07-16T10:00:00.000Z', completed: true });
  }
  return items;
}

function paidPayment(amountInMinorUnits: number, reference: string): FacilityBookingPayment {
  return {
    status: FacilityPaymentStatus.Paid,
    method: FacilityPaymentMethod.Upi,
    transactionId: `TXN-${reference}`,
    receiptNumber: `RCP-${reference}`,
    paidAt: '2026-07-16T08:01:00.000Z',
    amountPaidInMinorUnits: amountInMinorUnits,
  };
}

const noRefund: FacilityBookingRefund = {
  status: FacilityRefundStatus.NotApplicable,
  amountInMinorUnits: 0,
  requestedAt: null,
  processedAt: null,
  referenceNumber: null,
  explanation: 'No refund is currently required.',
};

function qr(reference: string, startsAt: string, endsAt: string, active: boolean): FacilityBookingQrPass {
  return {
    token: `societyos:facility:${reference}:opaque-9f4c2e`,
    fallbackCode: reference.replaceAll('-', '').slice(-8).toUpperCase(),
    validFrom: new Date(Date.parse(startsAt) - 15 * 60_000).toISOString(),
    validUntil: new Date(Date.parse(startsAt) + 30 * 60_000).toISOString(),
    presentationLocation: 'Facility reception desk',
    active,
  };
}

interface SeedBookingValues {
  readonly id: string;
  readonly reference: string;
  readonly residenceId: string;
  readonly unitId: string;
  readonly unitLabel: string;
  readonly societyId: string;
  readonly facilityId: string;
  readonly facilityName: string;
  readonly facilityLocation: string;
  readonly startsAt: string;
  readonly endsAt: string;
  readonly status: FacilityBookingStatus;
  readonly purpose: string;
  readonly guestCount: number;
  readonly breakdown: FacilityBookingPriceBreakdown;
  readonly payment: FacilityBookingPayment;
  readonly refund: FacilityBookingRefund;
  readonly societyCancellationReason: string | null;
}

function booking(values: SeedBookingValues): FacilityBooking {
  const residentName = values.residenceId === 'context-003' ? 'Amit Kulkarni' : 'Shashank Shirode';
  const contactNumber = values.residenceId === 'context-003' ? '+91 98230 44551' : '+91 98765 43210';
  const activeQr = [FacilityBookingStatus.Confirmed, FacilityBookingStatus.CheckedIn, FacilityBookingStatus.InUse].includes(values.status);
  return {
    id: values.id,
    bookingReference: values.reference,
    userId: 'resident-001',
    societyId: values.societyId,
    residenceId: values.residenceId,
    unitId: values.unitId,
    unitLabel: values.unitLabel,
    facilityId: values.facilityId,
    facilityName: values.facilityName,
    facilityLocation: values.facilityLocation,
    residentName,
    contactNumber,
    startsAt: values.startsAt,
    endsAt: values.endsAt,
    timezone: 'Asia/Kolkata',
    status: values.status,
    guestCount: values.guestCount,
    purpose: values.purpose,
    additionalInstructions: '',
    guestDetails: [],
    setupSelections: [],
    consentAccepted: true,
    acceptedRuleIds: commonRules.map((rule) => rule.id),
    quote: quote(`${values.id}-quote`, values.residenceId, values.facilityId, `${values.facilityId}-slot-1`, values.breakdown),
    payment: values.payment,
    refund: values.refund,
    qrPass: values.status === FacilityBookingStatus.Waitlisted || values.status === FacilityBookingStatus.PaymentPending
      ? null
      : qr(values.reference, values.startsAt, values.endsAt, activeQr),
    timeline: timeline(values.reference, values.status),
    rescheduleHistory: values.id.includes('rescheduled') ? [{
      id: `${values.id}-move`,
      previousSlotId: `${values.facilityId}-slot-4`,
      nextSlotId: `${values.facilityId}-slot-1`,
      previousStartsAt: '2026-07-17T10:30:00.000Z',
      nextStartsAt: values.startsAt,
      changedAt: '2026-07-16T09:00:00.000Z',
      priceDifferenceInMinorUnits: 0,
    }] : [],
    cancellationReason: values.status === FacilityBookingStatus.CancelledByResident
      ? FacilityBookingCancellationReason.PlansChanged
      : null,
    cancellationNotes: values.status === FacilityBookingStatus.CancelledByResident
      ? 'Family plans changed.'
      : null,
    cancelledAt: [FacilityBookingStatus.CancelledByResident, FacilityBookingStatus.CancelledBySociety].includes(values.status)
      ? '2026-07-16T10:00:00.000Z'
      : null,
    societyCancellationReason: values.societyCancellationReason,
    calendarEventId: null,
    createdAt: '2026-07-16T08:00:00.000Z',
    updatedAt: '2026-07-16T10:00:00.000Z',
  };
}

const clubhouseBreakdown: FacilityBookingPriceBreakdown = {
  facilityFeeInMinorUnits: 50_000,
  slotFeeInMinorUnits: 0,
  equipmentFeeInMinorUnits: 20_000,
  guestSurchargeInMinorUnits: 0,
  taxInMinorUnits: 12_600,
  convenienceFeeInMinorUnits: 0,
  discountInMinorUnits: 0,
  refundableDepositInMinorUnits: 100_000,
  totalPayableInMinorUnits: 182_600,
};

const guestRoomBreakdown: FacilityBookingPriceBreakdown = {
  facilityFeeInMinorUnits: 250_000,
  slotFeeInMinorUnits: 50_000,
  equipmentFeeInMinorUnits: 75_000,
  guestSurchargeInMinorUnits: 0,
  taxInMinorUnits: 45_000,
  convenienceFeeInMinorUnits: 0,
  discountInMinorUnits: 20_000,
  refundableDepositInMinorUnits: 500_000,
  totalPayableInMinorUnits: 900_000,
};

export const facilityBookingMockBookings: readonly FacilityBooking[] = [
  booking({ id: 'booking-confirmed-paid', reference: 'FB-GVH-260718-01', residenceId: 'context-001', unitId: 'unit-gv-a-1204', unitLabel: 'A-1204 · Green Valley Heights', societyId: 'society-gv', facilityId: 'gv-clubhouse', facilityName: 'Clubhouse', facilityLocation: 'Central Clubhouse · Level 1', startsAt: '2026-07-18T03:30:00.000Z', endsAt: '2026-07-18T05:30:00.000Z', status: FacilityBookingStatus.Confirmed, purpose: 'Family get-together', guestCount: 12, breakdown: clubhouseBreakdown, payment: paidPayment(182_600, 'GVH-01'), refund: noRefund, societyCancellationReason: null }),
  booking({ id: 'booking-free', reference: 'FB-GVH-260719-02', residenceId: 'context-001', unitId: 'unit-gv-a-1204', unitLabel: 'A-1204 · Green Valley Heights', societyId: 'society-gv', facilityId: 'gv-gym', facilityName: 'Gym', facilityLocation: 'Central Clubhouse · Ground Floor', startsAt: '2026-07-19T03:30:00.000Z', endsAt: '2026-07-19T04:30:00.000Z', status: FacilityBookingStatus.Confirmed, purpose: 'Strength training', guestCount: 1, breakdown: zeroBreakdown, payment: { status: FacilityPaymentStatus.NotRequired, method: null, transactionId: null, receiptNumber: null, paidAt: null, amountPaidInMinorUnits: 0 }, refund: noRefund, societyCancellationReason: null }),
  booking({ id: 'booking-payment-pending', reference: 'FB-GVH-260721-03', residenceId: 'context-001', unitId: 'unit-gv-a-1204', unitLabel: 'A-1204 · Green Valley Heights', societyId: 'society-gv', facilityId: 'gv-guest-room', facilityName: 'Guest Room', facilityLocation: 'Guest Wing · Level 2', startsAt: '2026-07-21T06:30:00.000Z', endsAt: '2026-07-21T12:30:00.000Z', status: FacilityBookingStatus.PaymentPending, purpose: 'Parents visiting for the weekend', guestCount: 2, breakdown: guestRoomBreakdown, payment: { status: FacilityPaymentStatus.Pending, method: null, transactionId: null, receiptNumber: null, paidAt: null, amountPaidInMinorUnits: 0 }, refund: noRefund, societyCancellationReason: null }),
  booking({ id: 'booking-checked-in', reference: 'FB-GVH-260717-04', residenceId: 'context-001', unitId: 'unit-gv-a-1204', unitLabel: 'A-1204 · Green Valley Heights', societyId: 'society-gv', facilityId: 'gv-badminton', facilityName: 'Badminton Court', facilityLocation: 'Sports Pavilion · Court 1', startsAt: '2026-07-17T10:30:00.000Z', endsAt: '2026-07-17T11:30:00.000Z', status: FacilityBookingStatus.CheckedIn, purpose: 'Badminton practice', guestCount: 2, breakdown: { ...zeroBreakdown, facilityFeeInMinorUnits: 15_000, totalPayableInMinorUnits: 15_000 }, payment: paidPayment(15_000, 'GVH-04'), refund: noRefund, societyCancellationReason: null }),
  booking({ id: 'booking-completed', reference: 'FB-GVH-260716-05', residenceId: 'context-001', unitId: 'unit-gv-a-1204', unitLabel: 'A-1204 · Green Valley Heights', societyId: 'society-gv', facilityId: 'gv-gym', facilityName: 'Gym', facilityLocation: 'Central Clubhouse · Ground Floor', startsAt: '2026-07-16T01:30:00.000Z', endsAt: '2026-07-16T02:30:00.000Z', status: FacilityBookingStatus.Completed, purpose: 'Morning workout', guestCount: 1, breakdown: zeroBreakdown, payment: { status: FacilityPaymentStatus.NotRequired, method: null, transactionId: null, receiptNumber: null, paidAt: null, amountPaidInMinorUnits: 0 }, refund: noRefund, societyCancellationReason: null }),
  booking({ id: 'booking-resident-cancelled', reference: 'FB-GVH-260714-06', residenceId: 'context-001', unitId: 'unit-gv-a-1204', unitLabel: 'A-1204 · Green Valley Heights', societyId: 'society-gv', facilityId: 'gv-clubhouse', facilityName: 'Clubhouse', facilityLocation: 'Central Clubhouse · Level 1', startsAt: '2026-07-20T10:30:00.000Z', endsAt: '2026-07-20T12:30:00.000Z', status: FacilityBookingStatus.CancelledByResident, purpose: 'Household meeting', guestCount: 8, breakdown: clubhouseBreakdown, payment: paidPayment(182_600, 'GVH-06'), refund: { status: FacilityRefundStatus.Refunded, amountInMinorUnits: 182_600, requestedAt: '2026-07-16T10:00:00.000Z', processedAt: '2026-07-16T15:00:00.000Z', referenceNumber: 'RF-GVH-06', explanation: 'Cancelled within the full-refund window.' }, societyCancellationReason: null }),
  booking({ id: 'booking-society-cancelled', reference: 'FB-GVH-260715-07', residenceId: 'context-001', unitId: 'unit-gv-a-1204', unitLabel: 'A-1204 · Green Valley Heights', societyId: 'society-gv', facilityId: 'gv-pool', facilityName: 'Swimming Pool', facilityLocation: 'Pool Deck · Garden Level', startsAt: '2026-07-18T10:30:00.000Z', endsAt: '2026-07-18T11:30:00.000Z', status: FacilityBookingStatus.CancelledBySociety, purpose: 'Swimming practice', guestCount: 2, breakdown: zeroBreakdown, payment: { status: FacilityPaymentStatus.NotRequired, method: null, transactionId: null, receiptNumber: null, paidAt: null, amountPaidInMinorUnits: 0 }, refund: noRefund, societyCancellationReason: 'Pool filtration maintenance requires an extended closure.' }),
  booking({ id: 'booking-no-show', reference: 'FB-GVH-260713-08', residenceId: 'context-001', unitId: 'unit-gv-a-1204', unitLabel: 'A-1204 · Green Valley Heights', societyId: 'society-gv', facilityId: 'gv-badminton', facilityName: 'Badminton Court', facilityLocation: 'Sports Pavilion · Court 1', startsAt: '2026-07-13T03:30:00.000Z', endsAt: '2026-07-13T04:30:00.000Z', status: FacilityBookingStatus.NoShow, purpose: 'Weekend practice', guestCount: 2, breakdown: { ...zeroBreakdown, facilityFeeInMinorUnits: 15_000, totalPayableInMinorUnits: 15_000 }, payment: paidPayment(15_000, 'GVH-08'), refund: { status: FacilityRefundStatus.NotRefundable, amountInMinorUnits: 0, requestedAt: null, processedAt: null, referenceNumber: null, explanation: 'The no-show policy does not return the facility fee.' }, societyCancellationReason: null }),
  booking({ id: 'booking-refund-pending', reference: 'FB-GVH-260712-09', residenceId: 'context-001', unitId: 'unit-gv-a-1204', unitLabel: 'A-1204 · Green Valley Heights', societyId: 'society-gv', facilityId: 'gv-guest-room', facilityName: 'Guest Room', facilityLocation: 'Guest Wing · Level 2', startsAt: '2026-07-22T06:30:00.000Z', endsAt: '2026-07-22T12:30:00.000Z', status: FacilityBookingStatus.RefundPending, purpose: 'Guest accommodation', guestCount: 2, breakdown: guestRoomBreakdown, payment: paidPayment(900_000, 'GVH-09'), refund: { status: FacilityRefundStatus.Pending, amountInMinorUnits: 650_000, requestedAt: '2026-07-16T10:00:00.000Z', processedAt: null, referenceNumber: null, explanation: 'Eligible charges and the refundable deposit are being processed.' }, societyCancellationReason: null }),
  booking({ id: 'booking-rescheduled', reference: 'FB-GVH-260720-10', residenceId: 'context-001', unitId: 'unit-gv-a-1204', unitLabel: 'A-1204 · Green Valley Heights', societyId: 'society-gv', facilityId: 'gv-badminton', facilityName: 'Badminton Court', facilityLocation: 'Sports Pavilion · Court 1', startsAt: '2026-07-20T03:30:00.000Z', endsAt: '2026-07-20T04:30:00.000Z', status: FacilityBookingStatus.Confirmed, purpose: 'Rescheduled practice', guestCount: 2, breakdown: { ...zeroBreakdown, facilityFeeInMinorUnits: 15_000, totalPayableInMinorUnits: 15_000 }, payment: paidPayment(15_000, 'GVH-10'), refund: noRefund, societyCancellationReason: null }),
  booking({ id: 'booking-gp-confirmed', reference: 'FB-GPR-260719-01', residenceId: 'context-003', unitId: 'unit-gp-c-503', unitLabel: 'C-503 · Gokhale Park Residency', societyId: 'society-gp', facilityId: 'gp-tennis', facilityName: 'Tennis Court', facilityLocation: 'Recreation Ground · East Court', startsAt: '2026-07-19T03:30:00.000Z', endsAt: '2026-07-19T04:30:00.000Z', status: FacilityBookingStatus.Confirmed, purpose: 'Tennis coaching', guestCount: 2, breakdown: { ...zeroBreakdown, facilityFeeInMinorUnits: 20_000, totalPayableInMinorUnits: 20_000 }, payment: paidPayment(20_000, 'GPR-01'), refund: noRefund, societyCancellationReason: null }),
];

export const facilityBookingMockWaitlist: readonly FacilityWaitlistEntry[] = [
  {
    id: 'waitlist-gv-party-1',
    userId: 'resident-001',
    societyId: 'society-gv',
    residenceId: 'context-001',
    unitId: 'unit-gv-a-1204',
    facilityId: 'gv-party-hall',
    slotId: 'gv-party-hall-slot-1',
    position: 2,
    joinedAt: '2026-07-16T12:00:00.000Z',
    expiresAt: '2026-07-19T12:00:00.000Z',
    offeredHoldId: null,
  },
];

export const facilityBookingMockActivities: readonly FacilityActivityItem[] = [
  { id: 'activity-1', residenceId: 'context-001', title: 'Clubhouse booking confirmed', description: 'Your Saturday reservation is ready.', occurredAt: '2026-07-16T08:02:00.000Z' },
  { id: 'activity-2', residenceId: 'context-001', title: 'Refund completed', description: 'A previous Clubhouse cancellation was refunded.', occurredAt: '2026-07-16T15:00:00.000Z' },
  { id: 'activity-3', residenceId: 'context-003', title: 'Tennis Court booking confirmed', description: 'Your court reservation is ready.', occurredAt: '2026-07-16T08:02:00.000Z' },
];

export const facilityBookingMockNotifications: readonly FacilityNotificationItem[] = [
  { id: 'notification-1', residenceId: 'context-001', title: 'Swimming Pool booking cancelled', description: 'The pool is closed for filtration maintenance. No payment was required.', createdAt: '2026-07-16T10:00:00.000Z', highPriority: true, read: false },
  { id: 'notification-2', residenceId: 'context-001', title: 'Check-in opens soon', description: 'Your Clubhouse check-in window opens 15 minutes before the booking.', createdAt: '2026-07-17T08:00:00.000Z', highPriority: false, read: false },
];
