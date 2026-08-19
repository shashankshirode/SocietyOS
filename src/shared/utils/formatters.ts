import { VisitorStatus, VisitorType } from '../types/visitor.types';
import { ComplaintStatus, ComplaintPriority, ComplaintCategory } from '../types/complaint.types';
import { BillStatus } from '../types/bill.types';
import { Messages } from '../constants/messages';
import type { Absent } from "../types/absence.types";
export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12)
        return Messages.home.greetingMorning;
    if (hour < 17)
        return Messages.home.greetingAfternoon;
    return Messages.home.greetingEvening;
}
export function formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}`;
}
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
export function formatRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0)
        return 'Today';
    if (diffDays === 1)
        return 'Yesterday';
    if (diffDays < 7)
        return `${diffDays} days ago`;
    return formatDate(dateString);
}
export function getVisitorStatusLabel(status: VisitorStatus): string {
    const labels: Record<VisitorStatus, string> = {
        EXPECTED: Messages.visitors.statusExpected,
        WAITING_APPROVAL: Messages.visitors.statusWaitingApproval,
        APPROVED: Messages.visitors.statusApproved,
        COMPLETED: Messages.visitors.statusCompleted,
        CHECKED_IN: Messages.visitors.statusInside,
        CHECKED_OUT: Messages.visitors.statusCompleted,
        REJECTED: Messages.visitors.statusRejected,
        EXPIRED: Messages.visitors.statusExpired,
        CANCELLED: 'Cancelled',
    };
    return labels[status];
}
export function getVisitorTypeLabel(type: VisitorType): string {
    const labels: Record<VisitorType, string> = {
        GUEST: Messages.visitors.typeGuest,
        DELIVERY: Messages.visitors.typeDelivery,
        CAB: Messages.visitors.typeCab,
        VENDOR: Messages.visitors.typeVendor,
    };
    return labels[type];
}
export function getVisitorTypeIconName(type: VisitorType): string {
    const icons: Record<VisitorType, string> = {
        GUEST: 'person-outline',
        DELIVERY: 'cube-outline',
        CAB: 'car-outline',
        VENDOR: 'construct-outline',
    };
    return icons[type];
}
export function getComplaintStatusLabel(status: ComplaintStatus): string {
    const labels: Record<ComplaintStatus, string> = {
        OPEN: Messages.complaints.statusOpen,
        IN_PROGRESS: Messages.complaints.statusInProgress,
        WAITING_FOR_RESIDENT: Messages.complaints.statusWaitingForResident,
        RESOLVED: Messages.complaints.statusResolved,
        CLOSED: Messages.complaints.statusClosed,
        REOPENED: Messages.complaints.statusReopened,
    };
    return labels[status];
}
export function getComplaintPriorityLabel(priority: ComplaintPriority): string {
    const labels: Record<ComplaintPriority, string> = {
        LOW: Messages.complaints.priorityLow,
        MEDIUM: Messages.complaints.priorityMedium,
        HIGH: Messages.complaints.priorityHigh,
        URGENT: Messages.complaints.priorityUrgent,
    };
    return labels[priority];
}
export function getComplaintCategoryLabel(category: ComplaintCategory): string {
    const labels: Record<ComplaintCategory, string> = {
        PLUMBING: Messages.complaints.categoryPlumbing,
        LIFT: Messages.complaints.categoryLift,
        SECURITY: Messages.complaints.categorySecurity,
        HOUSEKEEPING: Messages.complaints.categoryHousekeeping,
        PARKING: Messages.complaints.categoryParking,
        NOISE: Messages.complaints.categoryNoise,
        WATER_LEAKAGE: Messages.complaints.categoryWaterLeakage,
        ELECTRICAL: Messages.complaints.categoryElectrical,
        OTHER: Messages.complaints.categoryOther,
    };
    return labels[category];
}
export function getComplaintCategoryIconName(category: ComplaintCategory): string {
    const icons: Record<ComplaintCategory, string> = {
        PLUMBING: 'water-outline',
        LIFT: 'swap-vertical-outline',
        SECURITY: 'shield-checkmark-outline',
        HOUSEKEEPING: 'sparkles-outline',
        PARKING: 'car-sport-outline',
        NOISE: 'volume-high-outline',
        WATER_LEAKAGE: 'rainy-outline',
        ELECTRICAL: 'flash-outline',
        OTHER: 'document-text-outline',
    };
    return icons[category];
}
export function getBillStatusLabel(status: BillStatus): string {
    const labels: Record<string, string> = {
        DRAFT: 'Draft',
        GENERATED: 'Generated',
        DUE: 'Due',
        PENDING: Messages.bills.statusPending,
        PAID: Messages.bills.statusPaid,
        OVERDUE: Messages.bills.statusOverdue,
        PARTIALLY_PAID: Messages.bills.statusPartiallyPaid,
        CANCELLED: 'Cancelled',
    };
    return labels[status] || 'Unknown';
}
export function getNoticeCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
        GENERAL: Messages.notices.filterGeneral,
        MAINTENANCE: 'Maintenance',
        WATER_SUPPLY: 'Water Supply',
        AGM_MEETING: Messages.notices.filterMeetings,
        FIRE_SAFETY: 'Fire Safety',
        BILLING: 'Billing',
        PARKING: 'Parking',
        FESTIVAL_EVENT: 'Festival & Event',
        EMERGENCY: Messages.home.emergency,
    };
    return labels[category] || category;
}
export function getNoticePriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
        LOW: 'Low',
        NORMAL: 'Normal',
        IMPORTANT: 'Important',
        URGENT: 'Urgent',
    };
    return labels[priority] || priority;
}
export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    return `${formattedDate}, ${formattedTime}`;
}
export function generateMockTransactionId(): string {
    return `TXN${Math.floor(1000000000 + Math.random() * 9000000000)}`;
}
export function generateMockReceiptNumber(): string {
    return `REC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
}
export function getDocumentCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
        OWNER_KYC: 'Owner Identity KYC',
        TENANT_KYC: 'Tenant Identity KYC',
        SALE_DEED: 'Sale Deed Purchase Registry',
        SHARE_CERTIFICATE: 'Society Allotment Share Certificate',
        RENT_AGREEMENT: 'Rent/Lease Agreement',
        POLICE_VERIFICATION: 'Police Verification Record',
        VEHICLE_DOCUMENT: 'Vehicle Insurance/RC',
        PARKING_ALLOTMENT: 'Designated Parking Slot',
        MOVE_IN_FORM: 'Unit Move-In Document',
        RULE_ACKNOWLEDGEMENT: 'Society Rule Undertaking',
        SOCIETY_REGISTRATION: 'Society Registrar Registration',
        BYLAWS: 'Approved Society Bylaws',
        AGM_MINUTES: 'AGM Committee Meeting Minutes',
        FIRE_NOC: 'Fire Safety NOC Clearance',
        LIFT_CERTIFICATE: 'Elevator Safe Fitness Audit',
        INSURANCE: 'Building Fire/Casualty Policy',
        AUDIT_REPORT: 'Annual Audited Balance Sheet',
        CIRCULAR: 'Official Circular Notification',
        OTHER: 'Miscellaneous Documentation',
    };
    return labels[category] || category;
}
export function getNocTypeLabel(nocType: string): string {
    const labels: Record<string, string> = {
        NO_DUES: 'No Outstanding Dues Certificate',
        MOVE_OUT: 'Move-out NOC Clearance',
        TENANT_NOC: 'Tenant NOC Agreement',
        PARKING_NOC: 'Parking Sticker/Slot NOC',
        RENOVATION_NOC: 'Apartment Renovation NOC',
        RESIDENCE_CERTIFICATE: 'Society Residence Certificate',
        VEHICLE_NOC: 'Vehicle Entry NOC Sticker',
    };
    return labels[nocType] || nocType;
}
export function getDocumentSensitivityLabel(level: string): string {
    const labels: Record<string, string> = {
        PUBLIC: 'Public Access',
        RESIDENT_ONLY: 'Residents & Owners Only',
        OWNER_ONLY: 'Owners Only',
        TENANT_ONLY: 'Tenants Only',
        COMMITTEE_ONLY: 'Committee Members Only',
        ADMIN_ONLY: 'Society Office Admin Only',
        RESTRICTED: 'Confidential Access Restricted',
    };
    return labels[level] || level;
}
export function getContactCategoryLabel(cat: string): string {
    const labels: Record<string, string> = {
        WATER_LEAKAGE: 'Water Seepage / Leakage',
        PARKING_ISSUE: 'Parking Dispute / Space',
        PARCEL_HANDOVER: 'Courier / Parcel Handover',
        NOISE: 'Noise / Disturbance',
        RENOVATION_NOTICE: 'Renovation Work',
        PET_CONCERN: 'Pet Concern / Complaint',
        COMMUNITY_HELP: 'Community Helper Request',
        OTHER: 'Other / Custom Coordination',
    };
    return labels[cat] || cat;
}
export function getFacilityCategoryLabel(cat: string): string {
    const labels: Record<string, string> = {
        CLUBHOUSE: 'Clubhouse Space',
        SPORTS: 'Sports & Recreational',
        FITNESS: 'Gym & Fitness',
        EVENT_SPACE: 'Event & Banquet Halls',
        GUEST_ROOM: 'Guest Room Suites',
        KIDS: 'Kids & Play Areas',
        COMMUNITY: 'Common Community spaces',
        OTHER: 'Other Amenity',
    };
    return labels[cat] || cat;
}
const SAFE_FALLBACK_DASH = '—';
export function safeCurrencyFormat(amount: number | null | Absent, fallback: string = SAFE_FALLBACK_DASH): string {
    if (amount === null || amount === undefined || !Number.isFinite(amount)) {
        return fallback;
    }
    return formatCurrency(amount);
}
export function safeDateFormat(dateString: string | null | Absent, fallback: string = SAFE_FALLBACK_DASH): string {
    if (!dateString)
        return fallback;
    const date = new Date(dateString);
    if (isNaN(date.getTime()))
        return fallback;
    return formatDate(dateString);
}
export function safeRelativeDateFormat(dateString: string | null | Absent, fallback: string = SAFE_FALLBACK_DASH): string {
    if (!dateString)
        return fallback;
    const date = new Date(dateString);
    if (isNaN(date.getTime()))
        return fallback;
    return formatRelativeDate(dateString);
}
export function safePhoneFormat(phone: string | null | Absent, fallback: string = SAFE_FALLBACK_DASH): string {
    if (!phone || phone.trim().length === 0)
        return fallback;
    return phone;
}
export function formatConversationTimestamp(dateString: string | null | Absent): string {
    if (!dateString)
        return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime()))
        return '';
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (itemDate.getTime() === today.getTime()) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    if (itemDate.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    }
    const diffTime = today.getTime() - itemDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7 && diffDays > 0) {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}
export function formatMessageTime(dateString: string | null | Absent): string {
    if (!dateString)
        return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime()))
        return '';
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
export function formatMessageDateSeparator(dateString: string | null | Absent): string {
    if (!dateString)
        return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime()))
        return '';
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const fullDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    if (itemDate.getTime() === today.getTime()) {
        return `Today, ${fullDate}`;
    }
    if (itemDate.getTime() === yesterday.getTime()) {
        return `Yesterday, ${fullDate}`;
    }
    return fullDate;
}
export function formatRelativeUpdateTime(dateString: string | null | Absent): string {
    if (!dateString)
        return 'Updated long ago';
    const date = new Date(dateString);
    if (isNaN(date.getTime()))
        return 'Updated long ago';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0)
        return 'Updated just now';
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1)
        return 'Updated just now';
    if (diffMins < 60)
        return `Updated ${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
        return `Updated ${diffHours} hr ago`;
    if (diffHours < 48)
        return 'Updated yesterday';
    return `Updated on ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
}
export function formatResidentLocalDate(dateString: string | null | Absent): string {
    if (!dateString)
        return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime()))
        return '';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

