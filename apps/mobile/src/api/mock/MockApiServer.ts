import type { ApiResponse, PaginatedResponse, ApiError } from '../contracts/api.types';
import type { UserProfile, SocietyMembership, UserRole, VerifyOtpRequest, VerifyOtpResponse, SendOtpRequest, SendOtpResponse, RefreshTokenRequest, RefreshTokenResponse } from '../contracts/domains/auth.contracts';
import type { Resident, Unit, Vehicle, FamilyMember, KycDocument } from '../contracts/domains/resident.contracts';
import type { VisitorPass, VisitorPassListParams, CreateVisitorPassRequest, PreApproveVisitorRequest, VisitorExitAlert } from '../contracts/domains/visitor.contracts';
import type { Complaint, CreateComplaintRequest, UpdateComplaintRequest, AssignComplaintRequest, ReopenComplaintRequest, ComplaintFeedback, ComplaintComment, ComplaintSlaSummary, ComplaintCategory, ComplaintStatus } from '../contracts/domains/complaint.contracts';
import type { Bill, BillingCycle, ChargeHead, Payment, PaymentOrder, LedgerEntry, BillingSummary, CreateBillRequest, CreatePaymentOrderRequest, PaymentCallbackRequest } from '../contracts/domains/billing.contracts';
import type { Facility, FacilityBooking, CreateBookingRequest, UpdateBookingRequest, AvailabilitySlot, AvailabilityRequest } from '../contracts/domains/facility.contracts';
import type { Notice, CreateNoticeRequest, UpdateNoticeRequest, NoticeListParams, NoticeAttachment, Acknowledgement } from '../contracts/domains/notice.contracts';

export interface MockDataStore {
  users: Map<string, UserProfile>;
  residents: Map<string, Resident>;
  units: Map<string, Unit>;
  vehicles: Map<string, Vehicle>;
  familyMembers: Map<string, FamilyMember>;
  kycDocuments: Map<string, KycDocument>;
  visitorPasses: Map<string, VisitorPass>;
  visitorExitAlerts: Map<string, VisitorExitAlert>;
  complaints: Map<string, Complaint>;
  complaintComments: Map<string, ComplaintComment[]>;
  bills: Map<string, Bill>;
  billingCycles: Map<string, BillingCycle>;
  chargeHeads: Map<string, ChargeHead>;
  payments: Map<string, Payment>;
  paymentOrders: Map<string, PaymentOrder>;
  ledgerEntries: Map<string, LedgerEntry>;
  facilities: Map<string, Facility>;
  facilityBookings: Map<string, FacilityBooking>;
  notices: Map<string, Notice>;
  noticeAcknowledgements: Map<string, Acknowledgement[]>;
  otpStore: Map<string, { code: string; expiresAt: number; purpose: string; phone: string }>;
  refreshTokens: Map<string, { userId: string; expiresAt: number }>;
  accessTokens: Map<string, { userId: string; expiresAt: number }>;
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createMockDataStore(): MockDataStore {
  const store = {
    users: new Map<string, UserProfile>(),
    residents: new Map<string, Resident>(),
    units: new Map<string, Unit>(),
    vehicles: new Map<string, Vehicle>(),
    familyMembers: new Map<string, FamilyMember>(),
    kycDocuments: new Map<string, KycDocument>(),
    visitorPasses: new Map<string, VisitorPass>(),
    visitorExitAlerts: new Map<string, VisitorExitAlert>(),
    complaints: new Map<string, Complaint>(),
    complaintComments: new Map<string, ComplaintComment[]>(),
    bills: new Map<string, Bill>(),
    billingCycles: new Map<string, BillingCycle>(),
    chargeHeads: new Map<string, ChargeHead>(),
    payments: new Map<string, Payment>(),
    paymentOrders: new Map<string, PaymentOrder>(),
    ledgerEntries: new Map<string, LedgerEntry>(),
    facilities: new Map<string, Facility>(),
    facilityBookings: new Map<string, FacilityBooking>(),
    notices: new Map<string, Notice>(),
    noticeAcknowledgements: new Map<string, Acknowledgement[]>(),
    otpStore: new Map(),
    refreshTokens: new Map(),
    accessTokens: new Map(),
  };

  initializeMockData(store);
  return store;
}

function initializeMockData(store: MockDataStore): void {
  const userId = 'user_001';
  const societyId = 'society_001';
  const unitId = 'unit_001';
  const now = new Date().toISOString();

  const user: UserProfile = {
    id: userId,
    phone: '+919876543210',
    email: 'resident@societyos.com',
    fullName: 'Rajesh Kumar',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
    roles: ['RESIDENT_OWNER'],
    societies: [{
      societyId,
      societyName: 'Green Valley Heights',
      unitId,
      unitNumber: 'A-1203',
      tower: 'A',
      floor: 12,
      role: 'RESIDENT_OWNER',
      status: 'ACTIVE',
      joinedAt: '2023-01-15T00:00:00Z',
    }],
    preferences: {
      language: 'en',
      timezone: 'Asia/Kolkata',
      notifications: {
        push: true,
        sms: true,
        email: true,
        inApp: true,
        quietHours: { enabled: true, start: '22:00', end: '07:00' },
      },
      privacy: {
        profileVisibility: 'RESIDENTS_ONLY',
        showPhone: true,
        showEmail: false,
        showUnit: true,
      },
      theme: 'system',
    },
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: now,
  };
  store.users.set(userId, user);

  const resident: Resident = {
    id: 'resident_001',
    userId,
    societyId,
    unitId,
    unitNumber: 'A-1203',
    tower: 'A',
    floor: 12,
    type: 'OWNER',
    status: 'ACTIVE',
    fullName: 'Rajesh Kumar',
    phone: '+919876543210',
    email: 'resident@societyos.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
    dateOfBirth: '1985-06-15',
    gender: 'MALE',
    occupation: 'Software Engineer',
    emergencyContact: {
      name: 'Priya Kumar',
      phone: '+919876543211',
      relationship: 'Spouse',
      isPrimary: true,
    },
    kycStatus: 'VERIFIED',
    kycDocuments: [],
    vehicles: [],
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: now,
  };
  store.residents.set(resident.id, resident);

  const unit: Unit = {
    id: unitId,
    societyId,
    unitNumber: 'A-1203',
    tower: 'A',
    floor: 12,
    type: 'RESIDENTIAL',
    status: 'OCCUPIED',
    area: 1250,
    bedrooms: 3,
    bathrooms: 2,
    balcony: true,
    parkingSlots: [
      { id: 'parking_001', slotNumber: 'B1-12', type: 'COVERED', status: 'ALLOCATED', allocatedTo: resident },
    ],
    currentOwner: resident,
    currentTenant: undefined,
    residents: [resident],
  };
  store.units.set(unitId, unit);

  const vehicle: Vehicle = {
    id: 'vehicle_001',
    vehicleNumber: 'MH12AB1234',
    type: 'CAR',
    make: 'Honda',
    model: 'City',
    color: 'White',
    rfidTag: 'RFID001234',
    isPrimary: true,
    status: 'ACTIVE',
  };
  store.vehicles.set(vehicle.id, vehicle);
  resident.vehicles = [vehicle];

  const familyMember: FamilyMember = {
    id: 'family_001',
    residentId: resident.id,
    fullName: 'Priya Kumar',
    relationship: 'SPOUSE',
    dateOfBirth: '1988-03-22',
    gender: 'FEMALE',
    phone: '+919876543211',
    email: 'priya@email.com',
    isDependent: false,
    kycStatus: 'VERIFIED',
    documents: [],
  };
  store.familyMembers.set(familyMember.id, familyMember);

  const kycs: KycDocument[] = [
    {
      id: 'kyc_001',
      type: 'AADHAAR',
      documentUrl: 'https://example.com/kyc/aadhaar.pdf',
      status: 'VERIFIED',
      verifiedAt: '2023-01-20T00:00:00Z',
      verifiedBy: 'admin_001',
      expiryDate: '2033-01-20',
    },
    {
      id: 'kyc_002',
      type: 'PAN',
      documentUrl: 'https://example.com/kyc/pan.pdf',
      status: 'VERIFIED',
      verifiedAt: '2023-01-20T00:00:00Z',
      verifiedBy: 'admin_001',
    },
  ];
  kycs.forEach(k => store.kycDocuments.set(k.id, k));
  resident.kycDocuments = kycs;

  const visitorPass: VisitorPass = {
    id: 'visitor_001',
    societyId,
    unitId,
    unitNumber: 'A-1203',
    tower: 'A',
    hostResidentId: resident.id,
    hostName: resident.fullName,
    hostPhone: resident.phone,
    visitorName: 'Amit Sharma',
    visitorPhone: '+919876543220',
    visitorEmail: 'amit@email.com',
    visitorPhotoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
    purpose: 'Personal visit',
    expectedArrival: new Date(Date.now() + 3600000).toISOString(),
    expectedDeparture: new Date(Date.now() + 10800000).toISOString(),
    status: 'APPROVED',
    otp: '123456',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=visitor_001',
    vehicleNumber: 'MH12CD5678',
    vehicleType: 'CAR',
    numberOfGuests: 2,
    approvedBy: resident.id,
    approvedAt: new Date(Date.now() - 1800000).toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  };
  store.visitorPasses.set(visitorPass.id, visitorPass);

  const exitAlert: VisitorExitAlert = {
    id: 'exit_001',
    visitorPassId: visitorPass.id,
    visitorName: visitorPass.visitorName,
    visitorPhone: visitorPass.visitorPhone,
    unitNumber: visitorPass.unitNumber,
    tower: visitorPass.tower,
    expectedDeparture: visitorPass.expectedDeparture,
    alertType: 'EXIT_DUE',
    status: 'PENDING',
    createdAt: new Date(Date.now() + 7200000).toISOString(),
  };
  store.visitorExitAlerts.set(exitAlert.id, exitAlert);

  const complaint: Complaint = {
    id: 'complaint_001',
    societyId,
    unitId,
    tower: 'A',
    floor: 12,
    reportedBy: resident.id,
    reporterName: resident.fullName,
    reporterPhone: resident.phone,
    category: 'PLUMBING',
    subCategory: 'Leakage',
    title: 'Water leakage in bathroom',
    description: 'There is a continuous water leakage from the bathroom ceiling since morning. Water is dripping on the floor.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    slaHours: 4,
    slaDeadline: new Date(Date.now() + 4 * 3600000).toISOString(),
    assignedTo: 'staff_001',
    assigneeName: 'Ramesh Plumber',
    assigneeRole: 'STAFF',
    mediaUrls: ['https://example.com/complaint/leakage1.jpg'],
    location: 'Bathroom',
    tags: ['urgent', 'water_damage'],
    childComplaintIds: [],
    resolutionMediaUrls: [],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  };
  store.complaints.set(complaint.id, complaint);
  store.complaintComments.set(complaint.id, []);

  const billingCycle: BillingCycle = {
    id: 'cycle_001',
    societyId,
    name: 'Jan 2024 Maintenance',
    periodStart: '2024-01-01',
    periodEnd: '2024-01-31',
    dueDate: '2024-02-10',
    status: 'PUBLISHED',
    totalBills: 150,
    totalAmount: 2250000,
    collectedAmount: 1800000,
    generatedAt: '2024-01-05T00:00:00Z',
    publishedAt: '2024-01-05T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: now,
  };
  store.billingCycles.set(billingCycle.id, billingCycle);

  const chargeHeads: ChargeHead[] = [
    { id: 'charge_001', societyId, name: 'Maintenance Charges', code: 'MAINT', description: 'Monthly maintenance', type: 'RECURRING', category: 'MAINTENANCE', defaultAmount: 12000, taxRate: 18, isActive: true, applicableTo: ['OWNER', 'TENANT'], frequency: 'MONTHLY', createdAt: now, updatedAt: now },
    { id: 'charge_002', societyId, name: 'Parking Charges', code: 'PARK', description: 'Monthly parking', type: 'RECURRING', category: 'PARKING', defaultAmount: 2000, taxRate: 18, isActive: true, applicableTo: ['OWNER', 'TENANT'], frequency: 'MONTHLY', createdAt: now, updatedAt: now },
    { id: 'charge_003', societyId, name: 'Clubhouse Booking', code: 'CLUB', description: 'Clubhouse usage', type: 'ONE_TIME', category: 'AMENITY', defaultAmount: 500, taxRate: 18, isActive: true, applicableTo: ['OWNER', 'TENANT'], createdAt: now, updatedAt: now },
  ];
  chargeHeads.forEach(c => store.chargeHeads.set(c.id, c));

  const bill: Bill = {
    id: 'bill_001',
    societyId,
    billingCycleId: billingCycle.id,
    unitId,
    unitNumber: 'A-1203',
    tower: 'A',
    residentId: resident.id,
    residentName: resident.fullName,
    billNumber: 'BILL-2024-000123',
    status: 'PARTIALLY_PAID',
    dueDate: '2024-02-10',
    issuedDate: '2024-01-05',
    lineItems: [
      { id: 'line_001', billId: 'bill_001', chargeHeadId: 'charge_001', chargeHeadName: 'Maintenance Charges', description: 'Jan 2024 Maintenance', quantity: 1, unitPrice: 12000, taxRate: 18, taxAmount: 2160, discountAmount: 0, totalAmount: 14160 },
      { id: 'line_002', billId: 'bill_001', chargeHeadId: 'charge_002', chargeHeadName: 'Parking Charges', description: 'Jan 2024 Parking', quantity: 1, unitPrice: 2000, taxRate: 18, taxAmount: 360, discountAmount: 0, totalAmount: 2360 },
    ],
    subtotal: 14000,
    taxAmount: 2520,
    discountAmount: 0,
    totalAmount: 16520,
    paidAmount: 8000,
    balanceAmount: 8520,
    lateFee: 0,
    payments: [],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: now,
  };
  store.bills.set(bill.id, bill);

  const payment: Payment = {
    id: 'payment_001',
    billId: bill.id,
    paymentOrderId: 'order_001',
    amount: 8000,
    method: 'UPI',
    status: 'SUCCESS',
    transactionId: 'upi_123456789',
    paidAt: '2024-01-10T14:30:00Z',
    receiptNumber: 'RCP-2024-000123',
    receiptUrl: 'https://example.com/receipts/RCP-2024-000123.pdf',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  };
  store.payments.set(payment.id, payment);
  bill.payments = [payment];

  const paymentOrder: PaymentOrder = {
    id: 'order_001',
    billId: bill.id,
    residentId: resident.id,
    amount: 8520,
    method: 'UPI',
    status: 'COMPLETED',
    gatewayOrderId: 'upi_order_123456',
    expiresAt: '2024-01-10T14:40:00Z',
    completedAt: '2024-01-10T14:30:00Z',
    createdAt: '2024-01-10T14:25:00Z',
  };
  store.paymentOrders.set(paymentOrder.id, paymentOrder);

  const facility: Facility = {
    id: 'facility_001',
    societyId,
    name: 'Clubhouse Hall',
    description: 'Spacious hall for events and gatherings',
    category: 'HALL',
    location: 'Ground Floor, Tower A',
    capacity: 100,
    amenities: ['AC', 'Projector', 'Sound System', 'Kitchen', 'Washrooms'],
    images: ['https://example.com/facility/clubhouse1.jpg'],
    rules: ['No smoking', 'No alcohol', 'Max 3 hours per booking', 'Clean up after use'],
    operatingHours: {
      monday: [{ start: '06:00', end: '22:00', isClosed: false }],
      tuesday: [{ start: '06:00', end: '22:00', isClosed: false }],
      wednesday: [{ start: '06:00', end: '22:00', isClosed: false }],
      thursday: [{ start: '06:00', end: '22:00', isClosed: false }],
      friday: [{ start: '06:00', end: '23:00', isClosed: false }],
      saturday: [{ start: '08:00', end: '23:00', isClosed: false }],
      sunday: [{ start: '08:00', end: '22:00', isClosed: false }],
      holidays: [{ start: '08:00', end: '22:00', isClosed: false }],
    },
    bookingRules: {
      advanceBookingDays: 30,
      minBookingDuration: 1,
      maxBookingDuration: 4,
      bufferTime: 30,
      cancellationWindow: 2,
      maxConcurrentBookings: 1,
      allowRecurring: true,
      recurringMaxWeeks: 4,
    },
    pricing: {
      basePrice: 1000,
      priceUnit: 'HOUR',
      memberDiscount: 20,
      peakHoursMultiplier: 1.5,
      peakHours: [{ start: '18:00', end: '22:00', isClosed: false }],
      depositAmount: 2000,
      taxRate: 18,
    },
    status: 'ACTIVE',
    requiresApproval: true,
    createdAt: now,
    updatedAt: now,
  };
  store.facilities.set(facility.id, facility);

  const facilityBooking: FacilityBooking = {
    id: 'booking_001',
    facilityId: facility.id,
    facilityName: facility.name,
    facilityCategory: facility.category,
    unitId,
    unitNumber: 'A-1203',
    tower: 'A',
    bookedBy: resident.id,
    bookedByName: resident.fullName,
    bookedByPhone: resident.phone,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0] ?? '',
    startTime: '18:00',
    endTime: '21:00',
    duration: 3,
    purpose: 'Birthday party',
    numberOfGuests: 30,
    status: 'CONFIRMED',
    totalAmount: 3000,
    depositAmount: 2000,
    taxAmount: 540,
    paymentStatus: 'PAID',
    paymentOrderId: 'order_002',
    approvedBy: 'admin_001',
    approvedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: now,
  };
  store.facilityBookings.set(facilityBooking.id, facilityBooking);

  const notice: Notice = {
    id: 'notice_001',
    societyId,
    title: 'Water Supply Interruption',
    content: 'Dear residents, Due to maintenance work, water supply will be interrupted on 25th Jan 2024 from 10:00 AM to 2:00 PM. Please store water in advance.',
    summary: 'Water supply interruption on 25th Jan 10AM-2PM',
    category: 'MAINTENANCE',
    priority: 'HIGH',
    status: 'PUBLISHED',
    targetAudience: 'ALL',
    publishedAt: '2024-01-20T09:00:00Z',
    expiresAt: '2024-01-25T14:00:00Z',
    attachments: [],
    authorId: 'admin_001',
    authorName: 'Society Admin',
    authorRole: 'ADMIN',
    acknowledgeRequired: true,
    acknowledgements: [],
    views: 142,
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
  };
  store.notices.set(notice.id, notice);

  const facilities: Facility[] = [
    facility,
    {
      id: 'facility_002',
      societyId,
      name: 'Swimming Pool',
      description: 'Olympic size swimming pool with lifeguard',
      category: 'POOL',
      location: 'Rooftop, Tower B',
      capacity: 50,
      amenities: ['Lifeguard', 'Changing rooms', 'Showers', 'Lockers'],
      images: ['https://example.com/facility/pool1.jpg'],
      rules: ['Swim cap mandatory', 'No diving', 'Children under 12 must be accompanied'],
      operatingHours: {
        monday: [{ start: '06:00', end: '21:00', isClosed: false }],
        tuesday: [{ start: '06:00', end: '21:00', isClosed: false }],
        wednesday: [{ start: '06:00', end: '21:00', isClosed: false }],
        thursday: [{ start: '06:00', end: '21:00', isClosed: false }],
        friday: [{ start: '06:00', end: '22:00', isClosed: false }],
        saturday: [{ start: '07:00', end: '22:00', isClosed: false }],
        sunday: [{ start: '07:00', end: '21:00', isClosed: false }],
        holidays: [{ start: '08:00', end: '21:00', isClosed: false }],
      },
      bookingRules: {
        advanceBookingDays: 7,
        minBookingDuration: 1,
        maxBookingDuration: 2,
        bufferTime: 15,
        cancellationWindow: 1,
        maxConcurrentBookings: 2,
        allowRecurring: false,
        recurringMaxWeeks: 0,
      },
      pricing: {
        basePrice: 200,
        priceUnit: 'HOUR',
        memberDiscount: 50,
        peakHoursMultiplier: 1,
        peakHours: [],
        depositAmount: 0,
        taxRate: 18,
      },
      status: 'ACTIVE',
      requiresApproval: false,
      createdAt: now,
      updatedAt: now,
    },
  ];
  facilities.forEach(f => store.facilities.set(f.id, f));
}

export class MockApiServer {
  private store: MockDataStore;
  private delay: number;

  constructor(delay = 300) {
    this.store = createMockDataStore();
    this.delay = delay;
  }

  getStore(): MockDataStore {
    return this.store;
  }

  setDelay(delay: number): void {
    this.delay = delay;
  }

  private async simulateDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, this.delay));
  }

  private createResponse<T>(data: T, meta?: PaginatedResponse<T>['meta']): ApiResponse<T> {
    return {
      success: true,
      data,
      meta,
      traceId: `trace_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
  }

  private createErrorResponse(error: Partial<ApiError>): ApiResponse<never> {
    return {
      success: false,
      data: undefined as never,
      error: {
        code: error.code || 'INTERNAL_ERROR',
        message: error.message || 'An error occurred',
        details: error.details,
        fieldErrors: error.fieldErrors,
        statusCode: error.statusCode,
        stack: error.stack,
      },
      traceId: `trace_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
  }

  private paginate<T>(items: T[], page = 1, pageSize = 20): PaginatedResponse<T> {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      items: items.slice(start, end),
      meta: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  async sendOtp(request: SendOtpRequest): Promise<ApiResponse<SendOtpResponse>> {
    await this.simulateDelay();
    
    const otpId = generateId('otp');
    const code = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    
    this.store.otpStore.set(otpId, {
      code,
      expiresAt,
      purpose: request.purpose,
      phone: request.phone,
    });

    console.log(`[MOCK] OTP sent to ${request.phone}: ${code}`);

    return this.createResponse({
      otpId,
      expiresIn: 300,
      maskedPhone: request.phone.replace(/\d(?=\d{4})/g, '*'),
    });
  }

  async verifyOtp(request: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponse>> {
    await this.simulateDelay();

    const otpEntry = this.store.otpStore.get(request.otpId);
    if (!otpEntry) {
      return this.createErrorResponse({
        code: 'OTP_EXPIRED',
        message: 'OTP has expired or is invalid',
        statusCode: 400,
      });
    }

    if (Date.now() > otpEntry.expiresAt) {
      this.store.otpStore.delete(request.otpId);
      return this.createErrorResponse({
        code: 'OTP_EXPIRED',
        message: 'OTP has expired',
        statusCode: 400,
      });
    }

    if (otpEntry.code !== request.code) {
      return this.createErrorResponse({
        code: 'INVALID_OTP',
        message: 'Invalid OTP code',
        statusCode: 400,
      });
    }

    this.store.otpStore.delete(request.otpId);

    let user = Array.from(this.store.users.values()).find(u => u.phone === otpEntry.phone);
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = {
        id: generateId('user'),
        phone: otpEntry.phone,
        fullName: 'New User',
        roles: ['RESIDENT_OWNER'],
        societies: [],
        preferences: {
          language: 'en',
          timezone: 'Asia/Kolkata',
          notifications: { push: true, sms: true, email: true, inApp: true, quietHours: { enabled: true, start: '22:00', end: '07:00' } },
          privacy: { profileVisibility: 'RESIDENTS_ONLY', showPhone: true, showEmail: false, showUnit: true },
          theme: 'system',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.store.users.set(user.id, user);
    }

    const accessToken = `access_${generateId('token')}`;
    const refreshToken = `refresh_${generateId('token')}`;
    const expiresIn = 3600;

    this.store.accessTokens.set(accessToken, { userId: user.id, expiresAt: Date.now() + expiresIn * 1000 });
    this.store.refreshTokens.set(refreshToken, { userId: user.id, expiresAt: Date.now() + 30 * 24 * 3600 * 1000 });

    return this.createResponse({
      accessToken,
      refreshToken,
      expiresIn,
      tokenType: 'Bearer',
      user,
      isNewUser,
    });
  }

  async refreshToken(request: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
    await this.simulateDelay();

    const tokenEntry = this.store.refreshTokens.get(request.refreshToken);
    if (!tokenEntry || Date.now() > tokenEntry.expiresAt) {
      return this.createErrorResponse({
        code: 'TOKEN_EXPIRED',
        message: 'Refresh token has expired',
        statusCode: 401,
      });
    }

    const user = this.store.users.get(tokenEntry.userId);
    if (!user) {
      return this.createErrorResponse({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
        statusCode: 404,
      });
    }

    const accessToken = `access_${generateId('token')}`;
    const newRefreshToken = `refresh_${generateId('token')}`;
    const expiresIn = 3600;

    this.store.refreshTokens.delete(request.refreshToken);
    this.store.accessTokens.set(accessToken, { userId: user.id, expiresAt: Date.now() + expiresIn * 1000 });
    this.store.refreshTokens.set(newRefreshToken, { userId: user.id, expiresAt: Date.now() + 30 * 24 * 3600 * 1000 });

    return this.createResponse({
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    });
  }

  async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    await this.simulateDelay();
    const user = this.store.users.get(userId);
    if (!user) {
      return this.createErrorResponse({ code: 'NOT_FOUND', message: 'User not found', statusCode: 404 });
    }
    return this.createResponse(user);
  }

  async getResident(residentId: string): Promise<ApiResponse<Resident>> {
    await this.simulateDelay();
    const resident = this.store.residents.get(residentId);
    if (!resident) {
      return this.createErrorResponse({ code: 'NOT_FOUND', message: 'Resident not found', statusCode: 404 });
    }
    return this.createResponse(resident);
  }

  async getUnits(userId: string): Promise<ApiResponse<Unit[]>> {
    await this.simulateDelay();
    const user = this.store.users.get(userId);
    if (!user) {
      return this.createErrorResponse({ code: 'NOT_FOUND', message: 'User not found', statusCode: 404 });
    }
    const units = Array.from(this.store.units.values()).filter(u => 
      u.residents.some(r => r.userId === userId)
    );
    return this.createResponse(units);
  }

  async getVehicles(residentId: string): Promise<ApiResponse<Vehicle[]>> {
    await this.simulateDelay();
    const resident = this.store.residents.get(residentId);
    if (!resident) {
      return this.createErrorResponse({ code: 'NOT_FOUND', message: 'Resident not found', statusCode: 404 });
    }
    const vehicles = Array.from(this.store.vehicles.values()).filter(v => resident.vehicles.includes(v));
    return this.createResponse(vehicles);
  }

  async getFamilyMembers(residentId: string): Promise<ApiResponse<FamilyMember[]>> {
    await this.simulateDelay();
    const members = Array.from(this.store.familyMembers.values()).filter(m => m.residentId === residentId);
    return this.createResponse(members);
  }

  async listVisitorPasses(params: VisitorPassListParams): Promise<ApiResponse<PaginatedResponse<VisitorPass>>> {
    await this.simulateDelay();
    let passes = Array.from(this.store.visitorPasses.values());
    
    if (params.status?.length) {
      passes = passes.filter(p => params.status!.includes(p.status));
    }
    if (params.dateFrom) {
      passes = passes.filter(p => p.expectedArrival >= params.dateFrom!);
    }
    if (params.dateTo) {
      passes = passes.filter(p => p.expectedArrival <= params.dateTo!);
    }
    if (params.search) {
      const search = params.search.toLowerCase();
      passes = passes.filter(p => 
        p.visitorName.toLowerCase().includes(search) ||
        p.visitorPhone.includes(search) ||
        p.unitNumber.toLowerCase().includes(search)
      );
    }
    
    const sortBy = params.sortBy || 'expectedArrival';
    const sortOrder = params.sortOrder || 'desc';
    passes.sort((a, b) => {
      const aVal = a[sortBy as keyof VisitorPass];
      const bVal = b[sortBy as keyof VisitorPass];
      if (aVal !== undefined && bVal !== undefined) {
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const paginated = this.paginate(passes, page, pageSize);
    
    return this.createResponse(paginated);
  }

  async getVisitorPass(passId: string): Promise<ApiResponse<VisitorPass>> {
    await this.simulateDelay();
    const pass = this.store.visitorPasses.get(passId);
    if (!pass) {
      return this.createErrorResponse({ code: 'NOT_FOUND', message: 'Visitor pass not found', statusCode: 404 });
    }
    return this.createResponse(pass);
  }

  async createVisitorPass(request: CreateVisitorPassRequest): Promise<ApiResponse<VisitorPass>> {
    await this.simulateDelay();
    const pass: VisitorPass = {
      id: generateId('visitor'),
      societyId: 'society_001',
      unitId: 'unit_001',
      unitNumber: 'A-1203',
      tower: 'A',
      hostResidentId: 'resident_001',
      hostName: 'Rajesh Kumar',
      hostPhone: '+919876543210',
      visitorName: request.visitorName,
      visitorPhone: request.visitorPhone,
      visitorEmail: request.visitorEmail,
      purpose: request.purpose,
      expectedArrival: request.expectedArrival,
      expectedDeparture: request.expectedDeparture,
      status: 'PENDING',
      otp: generateOtp(),
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?data=visitor_${Date.now()}`,
      vehicleNumber: request.vehicleNumber,
      vehicleType: request.vehicleType,
      numberOfGuests: request.numberOfGuests,
      specialInstructions: request.specialInstructions,
      visitorIdProof: request.visitorIdProof,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.visitorPasses.set(pass.id, pass);
    return this.createResponse(pass);
  }

  async listComplaints(params: {
    page?: number;
    pageSize?: number;
    status?: ComplaintStatus[];
    category?: ComplaintCategory[];
    priority?: Complaint['priority'][];
    assignedTo?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<PaginatedResponse<Complaint>>> {
    await this.simulateDelay();
    let complaints = Array.from(this.store.complaints.values());
    
    if (params.status?.length) complaints = complaints.filter(c => params.status!.includes(c.status));
    if (params.category?.length) complaints = complaints.filter(c => params.category!.includes(c.category));
    if (params.priority?.length) complaints = complaints.filter(c => params.priority!.includes(c.priority));
    if (params.assignedTo) complaints = complaints.filter(c => c.assignedTo === params.assignedTo);
    if (params.dateFrom) complaints = complaints.filter(c => c.createdAt >= params.dateFrom!);
    if (params.dateTo) complaints = complaints.filter(c => c.createdAt <= params.dateTo!);
    if (params.search) {
      const search = params.search.toLowerCase();
      complaints = complaints.filter(c => 
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.reporterName.toLowerCase().includes(search)
      );
    }

    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';
    complaints.sort((a, b) => {
      const aVal = a[sortBy as keyof Complaint];
      const bVal = b[sortBy as keyof Complaint];
      if (aVal !== undefined && bVal !== undefined) {
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    const paginated = this.paginate(complaints, params.page || 1, params.pageSize || 20);
    return this.createResponse(paginated);
  }

  async getComplaint(complaintId: string): Promise<ApiResponse<Complaint>> {
    await this.simulateDelay();
    const complaint = this.store.complaints.get(complaintId);
    if (!complaint) {
      return this.createErrorResponse({ code: 'NOT_FOUND', message: 'Complaint not found', statusCode: 404 });
    }
    return this.createResponse(complaint);
  }

  async createComplaint(request: CreateComplaintRequest, userId: string): Promise<ApiResponse<Complaint>> {
    await this.simulateDelay();
    const user = this.store.users.get(userId);
    const resident = Array.from(this.store.residents.values()).find(r => r.userId === userId);
    
    const complaint: Complaint = {
      id: generateId('complaint'),
      societyId: 'society_001',
      unitId: resident?.unitId || 'unit_001',
      tower: resident?.tower || 'A',
      floor: resident?.floor || 1,
      reportedBy: userId,
      reporterName: user?.fullName || 'Unknown',
      reporterPhone: user?.phone || '',
      category: request.category,
      subCategory: request.subCategory,
      title: request.title,
      description: request.description,
      priority: request.priority || 'NORMAL',
      status: 'CREATED',
      slaHours: this.getSlaHours(request.category),
      slaDeadline: new Date(Date.now() + this.getSlaHours(request.category) * 3600000).toISOString(),
      mediaUrls: request.mediaUrls || [],
      location: request.location,
      tags: request.tags || [],
      childComplaintIds: [],
      resolutionMediaUrls: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.complaints.set(complaint.id, complaint);
    this.store.complaintComments.set(complaint.id, []);
    return this.createResponse(complaint);
  }

  private getSlaHours(category: ComplaintCategory): number {
    const slaMap: Record<ComplaintCategory, number> = {
      PLUMBING: 4, ELECTRICAL: 4, HVAC: 24, STRUCTURAL: 2,
      SECURITY: 1, HOUSEKEEPING: 24, PEST_CONTROL: 48,
      WATER_SUPPLY: 2, POWER_BACKUP: 4, LIFT: 2,
      FIRE_SAFETY: 1, WASTE_MANAGEMENT: 24, NOISE: 24,
      PARKING: 24, OTHER: 24,
    };
    return slaMap[category] || 24;
  }

  async listBills(params: { page?: number; pageSize?: number; status?: string[]; unitId?: string; dateFrom?: string; dateTo?: string; }): Promise<ApiResponse<PaginatedResponse<Bill>>> {
    await this.simulateDelay();
    let bills = Array.from(this.store.bills.values());
    
    if (params.status?.length) bills = bills.filter(b => params.status!.includes(b.status));
    if (params.unitId) bills = bills.filter(b => b.unitId === params.unitId);
    if (params.dateFrom) bills = bills.filter(b => b.issuedDate >= params.dateFrom!);
    if (params.dateTo) bills = bills.filter(b => b.issuedDate <= params.dateTo!);
    
    bills.sort((a, b) => new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime());
    
    const paginated = this.paginate(bills, params.page || 1, params.pageSize || 20);
    return this.createResponse(paginated);
  }

  async listFacilities(params: { page?: number; pageSize?: number; category?: string; status?: string; }): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    await this.simulateDelay();
    let facilities = Array.from(this.store.facilities.values());
    
    if (params.category) facilities = facilities.filter(f => f.category === params.category);
    if (params.status) facilities = facilities.filter(f => f.status === params.status);
    
    const paginated = this.paginate(facilities, params.page || 1, params.pageSize || 20);
    return this.createResponse(paginated);
  }

  async listNotices(params: NoticeListParams): Promise<ApiResponse<PaginatedResponse<Notice>>> {
    await this.simulateDelay();
    let notices = Array.from(this.store.notices.values());
    
    if (params.category?.length) notices = notices.filter(n => params.category!.includes(n.category));
    if (params.priority?.length) notices = notices.filter(n => params.priority!.includes(n.priority));
    if (params.status?.length) notices = notices.filter(n => params.status!.includes(n.status));
    if (params.dateFrom) notices = notices.filter(n => n.publishedAt && n.publishedAt >= params.dateFrom!);
    if (params.dateTo) notices = notices.filter(n => n.publishedAt && n.publishedAt <= params.dateTo!);
    if (params.search) {
      const search = params.search.toLowerCase();
      notices = notices.filter(n => n.title.toLowerCase().includes(search) || n.content.toLowerCase().includes(search));
    }
    if (params.acknowledged !== undefined) {
      notices = notices.filter(n => {
        const acked = this.store.noticeAcknowledgements.get(n.id)?.some(a => a.residentId === 'resident_001') || false;
        return params.acknowledged === acked;
      });
    }

    const sortBy = params.sortBy || 'publishedAt';
    const sortOrder = params.sortOrder || 'desc';
    notices.sort((a, b) => {
      const aVal = a[sortBy as keyof Notice];
      const bVal = b[sortBy as keyof Notice];
      if (aVal !== undefined && bVal !== undefined) {
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    const paginated = this.paginate(notices, params.page || 1, params.pageSize || 20);
    return this.createResponse(paginated);
  }
}

export const mockApiServer = new MockApiServer();
export { createMockDataStore, generateId, generateOtp };