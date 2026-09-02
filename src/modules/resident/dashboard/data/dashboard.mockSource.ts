import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { enMessages } from '../../../../messages/en';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { getFacilityImage } from '../../facilityBooking/media/facilityImageRegistry';
import { buildScopedFacilities } from '../../facilityBooking/data/facility.mockSource';
import type { ResidentDashboardRequestContext } from './dashboard.repository.types';
import { getDashboardResidenceProfile, type DashboardResidenceProfile, } from './dashboard.residenceProfiles';
import { orderDashboardVisitors } from './dashboard.normalization';
import { formatBillingPeriod } from '../../../../shared/formatters/dateFormatter';
import { getResidentMockRecords } from '../../mock/residentMockRegistry';
import { mockStore } from '../../../../core/mockStore/mockStore';
import { matchesResidentRepositoryContext } from '../../homeContext/utils/matchesResidentRepositoryContext';
import type { AcknowledgementStatus, AmenityBookingItem, AvailabilityStatus, BillStatus, ComplaintPriority, ComplaintStep, DepartmentChatShortcut, DocumentCategory, DocumentStatus, EmergencyAction, HomeActivityItem, MaintenancePaymentData, NoticeCategory, NoticeHighlight, PriorityAction, ResidentContactRequest, ResidentDashboardData, SmartReminder, VisitorAccessItem, VisitorType, AccessType, VisitorStatus, StepStatus, } from './dashboard.types';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { getRequiredProperty } from '../../../../shared/utils/requiredProperty';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
import type { Visitor } from '../../../../shared/types/visitor.types';
function visitorTimeWindow(ordinal: number): {
    validFrom: string;
    validTill: string;
} {
    const windows = [
        { validFrom: 'Today, 6:00 PM', validTill: '9:00 PM' },
        { validFrom: 'Today, 10:00 AM', validTill: '11:00 AM' },
        { validFrom: 'Today, 7:00 AM', validTill: '10:00 AM' },
        { validFrom: 'Tomorrow, 9:00 AM', validTill: '12:00 PM' },
        { validFrom: 'Today, 4:00 PM', validTill: '5:00 PM' },
    ] as const;
    return getRequiredItem(windows, ordinal % windows.length, "dashboard.mockSource.ts");
}
const REALISTIC_VISITOR_NAMES: Record<VisitorType, readonly string[]> = {
    guest: ['Rajesh Kumar', 'Sunita Sharma', 'Vikram Malhotra', 'Priya Nair', 'Amit Joshi'],
    delivery: ['Amazon Delivery', 'Zomato Delivery', 'BlueDart Courier', 'Swiggy Instamart', 'Delhivery Agent'],
    cab: ['Ola Cab · MH15AB1234', 'Uber · MH12CD5678', 'Meru Cab · MH14GH9012', 'BluSmart EV', 'Rapido Auto'],
    vendor: ['Urban Company Plumber', 'AC Technician — CoolServe', 'Pest Control — CleanShield', 'Electrician — SwiftFix'],
    staff: ['Society Maintenance Staff', 'Facility Team — Ravi Sawant'],
    domesticHelp: ['Sunita Bai (Daily Help)', 'Malan Tai (Cleaning)', 'Geeta (Cooking)']
};
const REALISTIC_VISITOR_PURPOSES: Record<VisitorType, string> = {
    guest: 'Family visit',
    delivery: 'Package delivery',
    cab: 'Pickup — Airport',
    vendor: 'Scheduled service call',
    staff: 'Common area maintenance',
    domesticHelp: 'Daily household help'
};
const REALISTIC_NOTICE_TITLES: readonly {
    title: string;
    category: NoticeCategory;
}[] = [
    { title: 'Annual General Meeting — 18 July 2026', category: 'important' },
    { title: 'Water tank cleaning this Sunday, 6 AM – 12 PM', category: 'maintenance' },
    { title: 'Independence Day cultural evening — Register by 12 Aug', category: 'event' },
    { title: 'Tower B lift modernisation — service interruption next week', category: 'maintenance' },
    { title: 'Monsoon parking advisory — no vehicles on lawn', category: 'general' },
    { title: 'Fire-drill on 20 July — mandatory participation', category: 'important' },
    { title: 'Society app update — new visitor OTP feature available', category: 'general' },
    { title: 'New committee members elected at AGM', category: 'important' },
];
const REALISTIC_COMPLAINT_DATA: readonly {
    title: string;
    steps: readonly {
        label: string;
        status: StepStatus;
    }[];
    assignedTo: string;
    slaLabel: string;
    slaPercent: number;
}[] = [
    {
        title: 'Water leakage — basement parking P2-184',
        steps: [
            { label: 'Raised', status: 'done' },
            { label: 'Assigned', status: 'done' },
            { label: 'In Progress', status: 'current' },
            { label: 'Resolved', status: 'pending' },
            { label: 'Feedback', status: 'pending' },
        ],
        assignedTo: 'Plumbing Team',
        slaLabel: '18 hours left',
        slaPercent: 62
    },
    {
        title: 'Lift not working — Tower A, Lift 2',
        steps: [
            { label: 'Raised', status: 'done' },
            { label: 'Assigned', status: 'current' },
            { label: 'In Progress', status: 'pending' },
            { label: 'Resolved', status: 'pending' },
            { label: 'Feedback', status: 'pending' },
        ],
        assignedTo: 'Elevator Maintenance',
        slaLabel: '2 days left',
        slaPercent: 30
    },
    {
        title: 'Common area light not working — B Wing, Level 3',
        steps: [
            { label: 'Raised', status: 'done' },
            { label: 'Assigned', status: 'done' },
            { label: 'In Progress', status: 'done' },
            { label: 'Resolved', status: 'current' },
            { label: 'Feedback', status: 'pending' },
        ],
        assignedTo: 'Electrical Team',
        slaLabel: 'Awaiting your feedback',
        slaPercent: 88
    },
];
const REALISTIC_ACTIVITY_DATA: readonly {
    title: string;
    description: string;
    module: HomeActivityItem['module'];
}[] = [
    { title: 'Visitor pass created', description: 'Rajesh Kumar — Guest · One-day pass · Today 6 PM', module: 'visitor' },
    { title: 'Complaint updated', description: 'Water leakage — moved to In Progress by Plumbing Team', module: 'complaint' },
    { title: 'Bill generated', description: 'July 2026 maintenance — ₹4,180 due in 7 days', module: 'billing' },
    { title: 'Notice published', description: 'AGM scheduled for 18 July 2026 — acknowledgement required', module: 'notice' },
    { title: 'Document verified', description: 'KYC — Aadhaar card verified by society office', module: 'document' },
    { title: 'Amenity booked', description: 'Swimming Pool · Tomorrow, 6:00 AM – 7:00 AM', module: 'facility' },
    { title: 'Contact request accepted', description: 'Flat B-302 request accepted · Messaging now enabled', module: 'residentConnect' },
    { title: 'Visitor exited', description: 'Amazon Delivery confirmed exit · Pass closed', module: 'visitor' },
];
const REALISTIC_DEPARTMENT_CHATS: readonly {
    label: string;
    iconName: string;
}[] = [
    { label: 'Accounts Team', iconName: 'cash-outline' },
    { label: 'Security Desk', iconName: 'shield-half-outline' },
    { label: 'Facility Helpdesk', iconName: 'construct-outline' },
    { label: 'Society Office', iconName: 'business-outline' },
];
const REALISTIC_COMMUNITY_SERVICES: readonly {
    label: string;
    iconName: string;
    description: string;
}[] = [
    { label: 'Car Wash', iconName: 'car-outline', description: 'Doorstep car care' },
    { label: 'Pest Control', iconName: 'bug-outline', description: 'Verified treatment' },
    { label: 'Laundry', iconName: 'shirt-outline', description: 'Pick-up & drop' },
    { label: 'Appliance Repair', iconName: 'construct-outline', description: 'AC, fridge, geyser' },
    { label: 'Tutors', iconName: 'book-outline', description: 'Verified educators' },
    { label: 'Elder Care', iconName: 'heart-circle-outline', description: 'Daily assistance' },
    { label: 'Pet Care', iconName: 'paw-outline', description: 'Grooming & walking' },
    { label: 'Packers & Movers', iconName: 'cube-outline', description: 'Society verified' },
    { label: 'Housekeeping', iconName: 'sparkles-outline', description: 'Deep cleaning' },
];
function getRoleLabel(context: ResidentRepositoryRequestContext): string {
    const role = context.activeHome.residentRole;
    if (role === 'owner')
        return enMessages.resident.homeContext.owner;
    if (role === 'coOwner')
        return enMessages.resident.homeContext.coOwner;
    if (role === 'tenant')
        return enMessages.resident.homeContext.tenant;
    if (role === 'authorizedOccupant')
        return enMessages.resident.homeContext.authorizedOccupant;
    return enMessages.resident.homeContext.familyMember;
}
function getResidentName(context: ResidentRepositoryRequestContext): string {
    return enMessages.resident.mockData.residentNames[context.activeHome.residentRole];
}
function buildReminders(context: ResidentRepositoryRequestContext): SmartReminder[] {
    const severities: readonly SmartReminder['severity'][] = ['warning', 'danger', 'info', 'success'];
    const predefined: SmartReminder[] = [
        {
            id: `${context.dataScopeKey}-rem-1`,
            title: 'Visitor arriving soon',
            description: `${getRequiredItem(REALISTIC_VISITOR_NAMES.guest, 0, "dashboard.mockSource.ts")} — Guest pass active till 9 PM`,
            severity: 'info',
            actionLabel: 'View Pass'
        },
        {
            id: `${context.dataScopeKey}-rem-2`,
            title: 'Maintenance bill due',
            description: `₹4,180 for July 2026 — due in 7 days`,
            severity: 'warning',
            actionLabel: 'Pay Now'
        },
        {
            id: `${context.dataScopeKey}-rem-3`,
            title: 'Police verification pending',
            description: 'Submit document to unblock tenant move-in',
            severity: 'danger',
            actionLabel: 'Upload Now'
        },
        {
            id: `${context.dataScopeKey}-rem-4`,
            title: 'Complaint resolved',
            description: 'Water leakage in parking B2 fixed by facility team',
            severity: 'success',
            actionLabel: 'Give Feedback'
        },
    ];
    const records = getResidentMockRecords(context, 'dashboard');
    if (records.length === 0)
        return predefined;
    return records.map((record, i) => i < predefined.length
        ? { ...getRequiredItem(predefined, i, "dashboard.mockSource.ts"), id: record.id }
        : {
            id: record.id,
            title: `Action needed: ${enMessages.resident.mockData.featureLabels.dashboard}`,
            description: `Residence update pending for ${context.activeHome.societyName}`,
            severity: getRequiredItem(severities, record.ordinal % severities.length, "dashboard.mockSource.ts"),
            actionLabel: 'View'
        });
}
function buildPriorityActions(context: ResidentRepositoryRequestContext): PriorityAction[] {
    return getResidentMockRecords(context, 'todaysPriority').slice(0, 8).map((record, i) => {
        const urgencies: readonly PriorityAction['urgency'][] = ['normal', 'important', 'critical'];
        const predefined: PriorityAction[] = [
            { id: 'act-pay', label: 'Pay Maintenance', description: 'Clear your July 2026 bill', iconName: 'card-outline', urgency: 'important' },
            { id: 'act-visitor', label: 'Create Visitor Pass', description: 'Pre-authorise your next guest', iconName: 'person-add-outline', urgency: 'normal' },
            { id: 'act-complaint', label: 'Raise Complaint', description: 'Report a facility issue', iconName: 'chatbox-ellipses-outline', urgency: 'normal' },
            { id: 'act-sos', label: 'Emergency SOS', description: 'Alert guards immediately', iconName: 'alert-circle', urgency: 'critical' },
        ];
        return i < predefined.length
            ? { ...getRequiredItem(predefined, i, "dashboard.mockSource.ts"), id: record.id }
            : {
                id: record.id,
                label: `Action ${i + 1}`,
                description: `Pending item for ${context.activeHome.societyName}`,
                iconName: 'ellipsis-horizontal',
                ...includeWhenPresent("urgency", getRequiredItem(urgencies, record.ordinal % urgencies.length, "dashboard.mockSource.ts"))
            };
    });
}
function buildVisitorTimeline(context: ResidentRepositoryRequestContext): VisitorAccessItem[] {
    const types: readonly VisitorType[] = ['guest', 'delivery', 'cab', 'domesticHelp', 'vendor', 'staff'];
    const accessTypes: readonly AccessType[] = ['oneDay', 'limitedHours', 'recurring', 'oneDay', 'limitedHours'];
    const statuses: readonly VisitorStatus[] = ['upcoming', 'inside', 'completed', 'upcoming', 'expired'];
    return getResidentMockRecords(context, 'visitors').slice(0, 10).map((record) => {
        const vType = getRequiredItem(types, record.ordinal % types.length, "dashboard.mockSource.ts");
        const names = getRequiredProperty(REALISTIC_VISITOR_NAMES, vType, 'visitor names');
        const timeWindow = visitorTimeWindow(record.ordinal);
        return {
            id: record.id,
            visitorName: getRequiredItem(names, record.ordinal % names.length, 'visitor names'),
            visitorType: vType,
            accessType: getRequiredItem(accessTypes, record.ordinal % accessTypes.length, "dashboard.mockSource.ts"),
            purpose: REALISTIC_VISITOR_PURPOSES[vType],
            validFrom: timeWindow.validFrom,
            validTill: timeWindow.validTill,
            status: getRequiredItem(statuses, record.ordinal % statuses.length, "dashboard.mockSource.ts"),
            gateName: record.ordinal % 2 === 0 ? 'Main Gate' : 'Service Gate',
            otpAvailable: record.ordinal % 2 === 0,
            ...(vType === 'delivery' && record.ordinal === 1 ? {
                exitAlert: {
                    elapsedMinutes: 42,
                    expectedExitAtIso: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                    priority: 'high' as const
                }
            } : {})
        };
    });
}

const visitorStatusToDashboardStatus: Record<Visitor['status'], VisitorStatus> = {
    EXPECTED: 'upcoming',
    WAITING_APPROVAL: 'upcoming',
    APPROVED: 'upcoming',
    CHECKED_IN: 'inside',
    CHECKED_OUT: 'completed',
    COMPLETED: 'completed',
    REJECTED: 'completed',
    EXPIRED: 'expired',
    CANCELLED: 'completed'
};

function mapCreatedVisitorToDashboard(visitor: Visitor): VisitorAccessItem {
    const visitorType: VisitorType = visitor.type === 'DELIVERY'
        ? 'delivery'
        : visitor.type === 'CAB'
            ? 'cab'
            : visitor.type === 'VENDOR'
                ? 'vendor'
                : 'guest';
    return {
        id: visitor.id,
        visitorName: visitor.name,
        visitorType,
        accessType: 'limitedHours',
        purpose: visitor.purpose,
        validFrom: `${visitor.expectedDate}, ${visitor.expectedTime}`,
        validTill: visitor.exitTracking?.expectedExitAtIso
            ? new Date(visitor.exitTracking.expectedExitAtIso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
            : visitor.expectedTime,
        status: visitorStatusToDashboardStatus[visitor.status],
        gateName: 'Main Gate',
        otpAvailable: Boolean(visitor.otp),
        ...includeWhenPresent('enteredAtLabel', visitor.actualEntryTime)
    };
}

function getCreatedVisitors(context: ResidentRepositoryRequestContext): VisitorAccessItem[] {
    const createdIdPrefix = `vis-${context.activeHome.homeContextId}-`;
    return mockStore.getState().visitors
        .filter((visitor) => matchesResidentRepositoryContext(visitor, context) && visitor.id.startsWith(createdIdPrefix))
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .map(mapCreatedVisitorToDashboard);
}
function buildMaintenancePayment(context: ResidentRepositoryRequestContext): MaintenancePaymentData {
    const allBills = mockStore.getState().bills;
    const bills = allBills.filter((bill) => matchesResidentRepositoryContext(bill, context));
    const unpaidBills = bills.filter((bill) => bill.status === 'DUE' || bill.status === 'OVERDUE' || bill.status === 'PARTIALLY_PAID');
    if (unpaidBills.length === 0) {
        const latestPaid = bills.at(0);
        return {
            billingMonth: latestPaid ? formatBillingPeriod(latestPaid.billingPeriod) : 'July 2026',
            billAmount: latestPaid?.amount ?? 0,
            dueInDays: 0,
            status: 'paid',
            chargeTags: [],
            pendingBillsCount: 0
        };
    }
    const current = getRequiredItem(unpaidBills, 0, "dashboard.mockSource.ts");
    const billStatus: BillStatus = current.status === 'OVERDUE'
        ? 'overdue'
        : current.status === 'PARTIALLY_PAID'
            ? 'partial'
            : 'unpaid';
    const tags = current.charges?.map((c) => c.label) ?? [
        'Maintenance',
        'Sinking Fund',
        'Water',
        'Parking',
    ];
    return {
        billingMonth: formatBillingPeriod(current.billingPeriod),
        billAmount: Math.max(0, current.amount - (current.paidAmount ?? 0)),
        dueInDays: 7,
        status: billStatus,
        chargeTags: tags,
        pendingBillsCount: unpaidBills.length,
        lastPaidAmount: 4180,
        lastPaidDate: '5 Jun 2026'
    };
}
function buildContactRequest(context: ResidentRepositoryRequestContext): ResidentContactRequest | Absent {
    const record = getResidentMockRecords(context, 'residentConnect').at(0);
    if (!record)
        return undefined;
    const subjects = [
        'Requesting contact for Diwali event coordination',
        'Carpooling for school pickup — morning slot',
        'Interested in joining the resident WhatsApp group',
    ];
    return {
        id: record.id,
        fromFlat: record.ordinal % 2 === 0 ? 'B-302' : 'C-405',
        subject: getRequiredItem(subjects, record.ordinal % subjects.length, "dashboard.mockSource.ts"),
        status: 'pending'
    };
}
function buildDepartmentChats(context: ResidentRepositoryRequestContext): DepartmentChatShortcut[] {
    return getResidentMockRecords(context, 'chat').slice(0, 4).map((record) => {
        const chat = getRequiredItem(REALISTIC_DEPARTMENT_CHATS, record.ordinal % REALISTIC_DEPARTMENT_CHATS.length, "dashboard.mockSource.ts");
        return {
            id: record.id,
            label: chat.label,
            unreadCount: record.status === 'unread' ? 1 + (record.ordinal % 3) : 0,
            iconName: chat.iconName
        };
    });
}
function buildNotices(context: ResidentRepositoryRequestContext): NoticeHighlight[] {
    const acknowledgements: readonly AcknowledgementStatus[] = ['pending', 'acknowledged', 'notRequired'];
    const relativeLabels = [
        '2 hours ago',
        '1 day ago',
        '3 days ago',
        '5 days ago',
        '1 week ago',
        '10 days ago',
    ] as const;
    return getResidentMockRecords(context, 'notices').slice(0, 8).map((record) => {
        const notice = getRequiredItem(REALISTIC_NOTICE_TITLES, record.ordinal % REALISTIC_NOTICE_TITLES.length, "dashboard.mockSource.ts");
        return {
            id: record.id,
            title: notice.title,
            category: notice.category,
            publishedAtLabel: getRequiredItem(relativeLabels, record.ordinal % relativeLabels.length, "dashboard.mockSource.ts"),
            acknowledgementStatus: getRequiredItem(acknowledgements, record.ordinal % acknowledgements.length, "dashboard.mockSource.ts")
        };
    });
}
function buildDocuments(context: ResidentRepositoryRequestContext) {
    const categories: readonly DocumentCategory[] = ['rentAgreement', 'policeVerification', 'noc', 'certificate', 'kyc', 'vehicle'];
    const statuses: readonly DocumentStatus[] = ['verified', 'pending', 'expired', 'missing'];
    const documentTitles: Record<DocumentCategory, string> = {
        rentAgreement: 'Rent Agreement 2026–27',
        policeVerification: 'Police Verification Certificate',
        noc: 'Move-out NOC',
        certificate: 'Occupancy Certificate',
        kyc: 'KYC — Aadhaar Card',
        vehicle: 'Vehicle Registration — MH15AB1234'
    };
    return getResidentMockRecords(context, 'documents').slice(0, 8).map((record) => {
        const cat = getRequiredItem(categories, record.ordinal % categories.length, "dashboard.mockSource.ts");
        return {
            id: record.id,
            title: documentTitles[cat],
            category: cat,
            status: getRequiredItem(statuses, record.ordinal % statuses.length, "dashboard.mockSource.ts"),
            sensitive: record.ordinal % 2 === 0
        };
    });
}
function buildAmenities(context: ResidentRepositoryRequestContext): AmenityBookingItem[] {
    const facilities = buildScopedFacilities(context);
    return facilities.slice(0, 5).map((facility, index) => {
        const priceLabel = facility.chargeAmount > 0
            ? `₹${facility.chargeAmount} / hr`
            : 'Free';
        let timingLabel = '6:00 AM – 9:00 PM';
        let capacityLabel = `Up to ${facility.capacity} people`;
        const cleanName = facility.name.replace(/\s+\d+$/, '');
        if (cleanName === 'Gym') {
            timingLabel = '5:00 AM – 10:00 PM';
            capacityLabel = 'Up to 25 people';
        }
        else if (cleanName === 'Swimming Pool') {
            timingLabel = '6:00 AM – 9:00 PM';
            capacityLabel = 'Up to 40 people';
        }
        else if (cleanName === 'Clubhouse') {
            timingLabel = '10:00 AM – 10:00 PM';
            capacityLabel = 'Up to 100 people';
        }
        else if (cleanName === 'Yoga Hall') {
            timingLabel = '6:00 AM – 8:00 AM';
            capacityLabel = '30 people';
        }
        else if (cleanName === 'Kids Play Area') {
            timingLabel = '8:00 AM – 7:00 PM';
            capacityLabel = '50 kids';
        }
        else if (cleanName === 'Party Hall') {
            timingLabel = '11:00 AM – 11:00 PM';
            capacityLabel = 'Up to 150 people';
        }
        else if (cleanName === 'Table Tennis') {
            timingLabel = '9:00 AM – 9:00 PM';
            capacityLabel = '4 players';
        }
        else if (cleanName === 'Badminton Court') {
            timingLabel = '6:00 AM – 8:00 PM';
            capacityLabel = '4 players';
        }
        else if (cleanName === 'Tennis Court') {
            timingLabel = '6:00 AM – 8:00 PM';
            capacityLabel = '4 players';
        }
        const imageInfo = getFacilityImage(cleanName);
        let availabilityStatus: AvailabilityStatus = 'available';
        if (facility.status === 'PARTIALLY_AVAILABLE') {
            availabilityStatus = 'limited';
        }
        else if (facility.status === 'UNDER_MAINTENANCE') {
            availabilityStatus = 'closed';
        }
        return {
            id: facility.id,
            name: facility.name,
            timingLabel,
            priceLabel,
            capacityLabel,
            imageUri: imageInfo.url,
            availabilityStatus
        };
    });
}
function buildEmergencyActions(_context: ResidentRepositoryRequestContext): EmergencyAction[] {
    return [
        { id: 'emer-medical', label: 'Medical', iconName: 'medkit-outline' },
        { id: 'emer-fire', label: 'Fire Alert', iconName: 'flame-outline' },
        { id: 'emer-lift', label: 'Lift Stuck', iconName: 'arrow-up-circle-outline' },
        { id: 'emer-security', label: 'Call Security', iconName: 'shield-outline' },
        { id: 'emer-senior', label: 'Senior Help', iconName: 'heart-outline' },
    ];
}
function buildActivities(context: ResidentRepositoryRequestContext): HomeActivityItem[] {
    const relativeLabels = [
        '15 min ago',
        '1 hour ago',
        '3 hours ago',
        '5 hours ago',
        'Yesterday',
        '2 days ago',
    ] as const;
    return getResidentMockRecords(context, 'recentActivity').map((record) => {
        const activity = getRequiredItem(REALISTIC_ACTIVITY_DATA, record.ordinal % REALISTIC_ACTIVITY_DATA.length, "dashboard.mockSource.ts");
        return {
            id: record.id,
            title: activity.title,
            description: activity.description,
            module: activity.module,
            timestampLabel: getRequiredItem(relativeLabels, record.ordinal % relativeLabels.length, "dashboard.mockSource.ts")
        };
    });
}
function buildComplaintProgress(context: ResidentRepositoryRequestContext) {
    const complaint = getResidentMockRecords(context, 'complaints').at(0);
    if (!complaint)
        return undefined;
    const data = getRequiredItem(REALISTIC_COMPLAINT_DATA, complaint.ordinal % REALISTIC_COMPLAINT_DATA.length, "dashboard.mockSource.ts");
    const priorities: readonly ComplaintPriority[] = ['low', 'medium', 'high', 'critical'];
    const steps: ComplaintStep[] = data.steps.map((s, i) => ({
        id: `${complaint.id}:step-${i}`,
        label: s.label,
        status: s.status
    }));
    return {
        complaintId: complaint.id,
        title: data.title,
        priority: getRequiredItem(priorities, complaint.ordinal % priorities.length, "dashboard.mockSource.ts"),
        assignedTo: data.assignedTo,
        slaRemainingLabel: data.slaLabel,
        slaProgressPercent: data.slaPercent,
        steps
    };
}
function buildCommunityServices(context: ResidentRepositoryRequestContext) {
    return getResidentMockRecords(context, 'communityServices').slice(0, 8).map((record) => {
        const svc = getRequiredItem(REALISTIC_COMMUNITY_SERVICES, record.ordinal % REALISTIC_COMMUNITY_SERVICES.length, "dashboard.mockSource.ts");
        return {
            id: record.id,
            label: svc.label,
            iconName: svc.iconName,
            description: svc.description
        };
    });
}
const visitorStatusLabels: Record<VisitorStatus, string> = {
    upcoming: 'Upcoming',
    waitingAtGate: 'Waiting at gate',
    inside: 'Inside society',
    exitConfirmationRequired: 'Exit confirmation required',
    completed: 'Completed',
    expired: 'Expired',
    cancelled: 'Cancelled'
};
function expandProfileReminders(profile: DashboardResidenceProfile): SmartReminder[] {
    const candidates: SmartReminder[] = [];
    if (profile.complaintProgress) {
        candidates.push({
            id: 'derived-complaint',
            actionId: 'act-complaint',
            title: 'Review the latest complaint update',
            description: profile.complaintProgress.nextExpectedAction ?? profile.complaintProgress.title,
            severity: profile.complaintProgress.priority === 'critical' ? 'danger' : 'warning',
            actionLabel: 'View complaint'
        });
    }
    candidates.push({
        id: 'derived-billing',
        actionId: 'act-pay',
        title: profile.maintenancePayment.status === 'paid'
            ? 'Maintenance account is clear'
            : 'Review the current maintenance balance',
        description: profile.maintenancePayment.dueDateLabel ?? profile.maintenancePayment.billingMonth,
        severity: profile.maintenancePayment.status === 'overdue' ? 'danger' : profile.maintenancePayment.status === 'paid' ? 'success' : 'warning',
        actionLabel: profile.maintenancePayment.status === 'paid' ? 'Open ledger' : 'View bill'
    });
    if (profile.contactRequest) {
        candidates.push({
            id: 'derived-contact-request',
            actionId: 'act-connect',
            title: `Contact request from ${profile.contactRequest.fromFlat}`,
            description: profile.contactRequest.subject,
            severity: 'info',
            actionLabel: 'Review request'
        });
    }
    profile.visitorTimeline.forEach((visitor) => {
        candidates.push({
            id: `derived-visitor-${visitor.id}`,
            actionId: 'act-visitor',
            title: `${visitor.visitorName} · ${visitorStatusLabels[visitor.status]}`,
            description: `${visitor.purpose} · ${visitor.gateName}`,
            severity: visitor.status === 'exitConfirmationRequired'
                ? 'danger'
                : visitor.status === 'waitingAtGate' || visitor.status === 'expired'
                    ? 'warning'
                    : visitor.status === 'completed'
                        ? 'success'
                        : 'info',
            actionLabel: 'Open visitor'
        });
    });
    profile.documents
        .filter((document) => document.status !== 'verified')
        .forEach((document) => {
        candidates.push({
            id: `derived-document-${document.id}`,
            actionId: 'act-documents',
            title: `${document.title} needs attention`,
            description: document.readinessLabel ?? 'Review this document in the secure vault.',
            severity: document.status === 'expired' || document.status === 'missing' ? 'danger' : 'warning',
            actionLabel: 'Open vault'
        });
    });
    profile.notices
        .filter((notice) => notice.acknowledgementStatus === 'pending')
        .forEach((notice) => {
        candidates.push({
            id: `derived-notice-${notice.id}`,
            actionId: 'act-notice',
            title: 'Notice acknowledgement pending',
            description: notice.title,
            severity: notice.category === 'emergency' ? 'danger' : 'warning',
            actionLabel: 'Open notice'
        });
    });
    profile.amenities
        .filter((amenity) => amenity.availabilityStatus !== 'available')
        .forEach((amenity) => {
        candidates.push({
            id: `derived-amenity-${amenity.id}`,
            actionId: 'act-amenity',
            title: `${amenity.name} availability update`,
            description: amenity.nextSlotLabel ?? amenity.timingLabel,
            severity: amenity.availabilityStatus === 'closed' ? 'warning' : 'info',
            actionLabel: 'View amenity'
        });
    });
    const existingIds = new Set(profile.reminders.map((reminder) => reminder.id));
    return [
        ...profile.reminders,
        ...candidates.filter((candidate) => !existingIds.has(candidate.id)),
    ].slice(0, 12);
}
function expandProfileActivities(profile: DashboardResidenceProfile): HomeActivityItem[] {
    const visitorActivities: HomeActivityItem[] = profile.visitorTimeline.map((visitor) => ({
        id: `derived-activity-visitor-${visitor.id}`,
        title: `${visitor.visitorName} access updated`,
        description: `${visitorStatusLabels[visitor.status]} · ${visitor.gateName}`,
        module: 'visitor',
        timestampLabel: visitor.validFrom,
        dateGroupLabel: 'Visitor history'
    }));
    const noticeActivities: HomeActivityItem[] = profile.notices.map((notice) => ({
        id: `derived-activity-notice-${notice.id}`,
        title: notice.title,
        description: notice.publishedBy ? `Published by ${notice.publishedBy}` : 'Published by the society office',
        module: 'notice',
        timestampLabel: notice.publishedAtLabel,
        dateGroupLabel: 'Notice history'
    }));
    const documentActivities: HomeActivityItem[] = profile.documents.map((document) => ({
        id: `derived-activity-document-${document.id}`,
        title: `${document.title} readiness updated`,
        description: document.readinessLabel ?? document.status,
        module: 'document',
        timestampLabel: 'Recent',
        dateGroupLabel: 'Document history'
    }));
    const amenityActivities: HomeActivityItem[] = profile.amenities.map((amenity) => ({
        id: `derived-activity-amenity-${amenity.id}`,
        title: `${amenity.name} slot checked`,
        description: amenity.nextSlotLabel ?? amenity.timingLabel,
        module: 'facility',
        timestampLabel: 'Recent',
        dateGroupLabel: 'Amenity history'
    }));
    return [
        ...profile.activities,
        ...visitorActivities,
        ...noticeActivities,
        ...documentActivities,
        ...amenityActivities,
    ].slice(0, 20);
}
function scopeResidenceProfile(profile: DashboardResidenceProfile, context: ResidentDashboardRequestContext): DashboardResidenceProfile {
    const scopeId = (id: string) => `${context.activeHome.unitId}:${id}`;
    return {
        ...profile,
        residentName: context.activeHome.homeContextId === 'context-002'
            ? 'Sunita Deshmukh'
            : profile.residentName,
        reminders: expandProfileReminders(profile).map((item) => ({ ...item, id: scopeId(item.id) })),
        priorityActions: profile.priorityActions.map((item) => ({ ...item })),
        visitorTimeline: profile.visitorTimeline.map((item) => ({
            ...item,
            id: scopeId(item.id),
            ...includeWhenPresent("exitAlert", item.exitAlert ? { ...item.exitAlert } : undefined)
        })),
        maintenancePayment: { ...profile.maintenancePayment },
        ...includeWhenPresent("complaintProgress", profile.complaintProgress
            ? {
                ...profile.complaintProgress,
                complaintId: scopeId(profile.complaintProgress.complaintId),
                steps: profile.complaintProgress.steps.map((step) => ({
                    ...step,
                    id: scopeId(step.id)
                }))
            }
            : undefined),
        ...includeWhenPresent("contactRequest", profile.contactRequest
            ? { ...profile.contactRequest, id: scopeId(profile.contactRequest.id) }
            : undefined),
        departmentChats: profile.departmentChats.map((item) => ({ ...item, id: scopeId(item.id) })),
        notices: profile.notices.map((item) => ({ ...item, id: scopeId(item.id) })),
        documents: profile.documents.map((item) => ({ ...item, id: scopeId(item.id) })),
        amenities: profile.amenities.map((item) => ({ ...item, id: scopeId(item.id) })),
        emergencyActions: profile.emergencyActions.map((item) => ({ ...item })),
        communityServices: profile.communityServices.map((item) => ({ ...item, id: scopeId(item.id) })),
        activities: expandProfileActivities(profile).map((item) => ({ ...item, id: scopeId(item.id) })),
        ...includeWhenPresent("residenceDetails", profile.residenceDetails
            ? {
                ...profile.residenceDetails,
                familyMembers: profile.residenceDetails.familyMembers.map((member) => ({ ...member })),
                tenants: profile.residenceDetails.tenants.map((tenant) => ({ ...tenant })),
                parking: [...profile.residenceDetails.parking],
                featureFlags: [...profile.residenceDetails.featureFlags]
            }
            : undefined)
    };
}
export function getScopedDashboardData(context: ResidentRepositoryRequestContext): ResidentDashboardData {
    const dashboardContext: ResidentDashboardRequestContext = {
        ...context,
        societyId: context.activeHome.societyId,
        unitId: context.activeHome.unitId,
        residentProfileId: context.activeHome.residentId,
        locale: context.activeHome.locale ?? 'en-IN',
        timezone: context.activeHome.timezone ?? 'Asia/Kolkata'
    };
    const notifications = getResidentMockRecords(dashboardContext, 'notifications');
    const residenceProfile = getDashboardResidenceProfile(dashboardContext.societyId);
    const profile = residenceProfile
        ? scopeResidenceProfile(residenceProfile, dashboardContext)
        : null;
    const generatedReminders = buildReminders(dashboardContext);
    const generatedActivities = buildActivities(dashboardContext);
    const createdVisitors = getCreatedVisitors(dashboardContext);
    const profileVisitors = profile?.visitorTimeline ?? buildVisitorTimeline(dashboardContext);
    const visitorTimeline = orderDashboardVisitors([
        ...createdVisitors,
        ...profileVisitors.filter((visitor) => !createdVisitors.some((created) => created.id === visitor.id))
    ]);
    const createdVisitorActivities: HomeActivityItem[] = createdVisitors.map((visitor) => ({
        id: `created-activity-${visitor.id}`,
        title: `${visitor.visitorName} access updated`,
        description: `${visitorStatusLabels[visitor.status]} · ${visitor.gateName}`,
        module: 'visitor',
        timestampLabel: visitor.validFrom,
        dateGroupLabel: 'Visitor history'
    }));
    return {
        contextKey: dashboardContext.dataScopeKey,
        residentProfileId: dashboardContext.residentProfileId,
        locale: dashboardContext.locale,
        timezone: dashboardContext.timezone,
        lastUpdatedLabel: 'Updated just now',
        residentName: profile?.residentName ?? getResidentName(dashboardContext),
        unitLabel: dashboardContext.activeHome.displayUnitName,
        societyName: dashboardContext.activeHome.societyName,
        roleLabel: getRoleLabel(dashboardContext),
        unreadNoticeCount: profile
            ? profile.notices.filter((notice) => notice.acknowledgementStatus === 'pending').length
            : notifications.filter((record) => record.status === 'unread').length,
        pendingActionCount: profile?.reminders.length ?? getResidentMockRecords(dashboardContext, 'todaysPriority').length,
        reminders: profile?.reminders ?? generatedReminders,
        priorityActions: profile?.priorityActions ?? buildPriorityActions(dashboardContext),
        visitorTimeline,
        maintenancePayment: profile?.maintenancePayment ?? buildMaintenancePayment(dashboardContext),
        ...includeWhenPresent("complaintProgress", profile?.complaintProgress ?? buildComplaintProgress(dashboardContext)),
        ...includeWhenPresent("contactRequest", profile?.contactRequest ?? buildContactRequest(dashboardContext)),
        departmentChats: profile?.departmentChats ?? buildDepartmentChats(dashboardContext),
        notices: profile?.notices ?? buildNotices(dashboardContext),
        documents: profile?.documents ?? buildDocuments(dashboardContext),
        amenities: profile?.amenities ?? buildAmenities(dashboardContext),
        emergencyActions: profile?.emergencyActions ?? buildEmergencyActions(dashboardContext),
        communityServices: profile?.communityServices ?? buildCommunityServices(dashboardContext),
        activities: [...createdVisitorActivities, ...(profile?.activities ?? generatedActivities)]
            .filter((activity, index, activities) => activities.findIndex((candidate) => candidate.id === activity.id) === index)
            .slice(0, 20),
        ...includeWhenPresent("residenceDetails", profile?.residenceDetails),
        sectionStates: {
            priorities: { status: 'ready' },
            pulse: { status: 'ready' },
            visitors: { status: 'ready' },
            finance: { status: 'ready' },
            complaints: { status: 'ready' },
            connect: { status: 'ready' },
            notices: { status: 'ready' },
            documents: { status: 'ready' },
            amenities: { status: 'ready' },
            services: { status: 'ready' },
            activity: { status: 'ready' }
        }
    };
}
export const residentDashboardMockSource = {
    async getDashboardSections(context: ResidentRepositoryRequestContext): Promise<RepositoryResult<ResidentDashboardData>> {
        await withMockDelay();
        return repositorySuccess(getScopedDashboardData(context));
    }
};
export default residentDashboardMockSource;
