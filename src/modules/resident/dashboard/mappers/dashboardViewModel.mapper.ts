import type { ResidentDashboardData } from '../data/dashboard.types';
import type { ResidentDashboardViewModel, DashboardHomeSummaryViewModel, DashboardReminderViewModel, DashboardReminderTone, DashboardPriorityActionViewModel, DashboardVisitorViewModel, DashboardPaymentViewModel, DashboardComplaintViewModel, DashboardContactRequestViewModel, DashboardChatViewModel, DashboardNoticeViewModel, DashboardDocumentViewModel, DashboardAmenityViewModel, DashboardEmergencyViewModel, DashboardServiceViewModel, DashboardActivityViewModel, } from '../data/dashboard.viewModel.types';
import { safeString, safeNumber, safeArray } from '../../../../shared/data/safeData';
import { safeCurrencyFormat } from '../../../../shared/utils/formatters';
import { safeGetStatusPresentation } from '../../../../shared/utils/statusPresentation';
import type { BadgeType } from '../../../../shared/utils/statusPresentation';
import { enMessages } from '../../../../messages/en';
import type { EnglishMessagesType } from '../../../../messages/en';
import { formatResidentDate, formatResidentTime } from '../../../../core/localization/dateTimeFormatters';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
function mapReminders(reminders: ResidentDashboardData['reminders'] | Absent): DashboardReminderViewModel[] {
    return safeArray(reminders).map((r) => {
        const validTones: DashboardReminderTone[] = ['info', 'warning', 'danger', 'success'];
        const tone: DashboardReminderTone = validTones.includes(r.severity as DashboardReminderTone)
            ? (r.severity as DashboardReminderTone)
            : 'info';
        return {
            id: safeString(r.id, `reminder-${Math.random()}`),
            title: safeString(r.title, 'Reminder'),
            description: safeString(r.description, ''),
            tone,
            actionLabel: safeString(r.actionLabel, 'View')
        };
    });
}
function mapPriorityActions(actions: ResidentDashboardData['priorityActions'] | Absent): DashboardPriorityActionViewModel[] {
    return safeArray(actions).map((a) => ({
        id: safeString(a.id, `action-${Math.random()}`),
        label: safeString(a.label, 'Action'),
        description: safeString(a.description, ''),
        iconName: safeString(a.iconName, 'ellipsis-horizontal'),
        isUrgent: a.urgency === 'critical' || a.urgency === 'important'
    }));
}
function mapVisitorTimeline(visitors: ResidentDashboardData['visitorTimeline'] | Absent): DashboardVisitorViewModel[] {
    return safeArray(visitors).map((v) => ({
        id: safeString(v.id, `visitor-${Math.random()}`),
        visitorName: safeString(v.visitorName, 'Visitor'),
        visitorType: safeString(v.visitorType, 'guest'),
        accessType: safeString(v.accessType, 'oneDay'),
        purpose: safeString(v.purpose, ''),
        validFrom: safeString(v.validFrom, ''),
        validTill: safeString(v.validTill, ''),
        status: safeString(v.status, 'upcoming'),
        gateName: safeString(v.gateName, ''),
        otpAvailable: v.otpAvailable ?? false,
        ...includeWhenPresent("exitAlert", v.exitAlert
            ? {
                elapsedMinutes: safeNumber(v.exitAlert.elapsedMinutes, 0),
                expectedExitAtIso: safeString(v.exitAlert.expectedExitAtIso, ''),
                priority: safeString(v.exitAlert.priority, 'normal')
            }
            : undefined)
    }));
}
function mapPayment(payment: ResidentDashboardData['maintenancePayment'] | Absent): DashboardPaymentViewModel {
    if (!payment) {
        return {
            billingMonth: '—',
            formattedAmount: '—',
            rawAmount: 0,
            dueInDaysLabel: '—',
            statusLabel: 'No Bill',
            statusTone: 'neutral',
            chargeTags: [],
            lastPaidLabel: '—'
        };
    }
    const statusPresentation = safeGetStatusPresentation(payment.status, 'billing');
    const dueInDays = safeNumber(payment.dueInDays, 0);
    const dueLabel = dueInDays > 0 ? `Due in ${dueInDays} days` : dueInDays === 0 ? 'Due today' : 'Overdue';
    return {
        billingMonth: safeString(payment.billingMonth, '—'),
        formattedAmount: safeCurrencyFormat(payment.billAmount, '—'),
        rawAmount: safeNumber(payment.billAmount, 0),
        dueInDaysLabel: dueLabel,
        statusLabel: statusPresentation.label,
        statusTone: statusPresentation.type,
        chargeTags: safeArray(payment.chargeTags),
        lastPaidLabel: payment.lastPaidAmount
            ? `Last paid ${safeCurrencyFormat(payment.lastPaidAmount)} on ${safeString(payment.lastPaidDate, '—')}`
            : '—'
    };
}
function mapComplaint(complaint: ResidentDashboardData['complaintProgress'] | Absent): DashboardComplaintViewModel | null {
    if (!complaint)
        return null;
    const priorityPresentation = safeGetStatusPresentation(complaint.priority, 'complaint');
    return {
        complaintId: safeString(complaint.complaintId, '—'),
        title: safeString(complaint.title, 'Complaint'),
        priorityLabel: priorityPresentation.label,
        priorityTone: priorityPresentation.type,
        assignedTo: safeString(complaint.assignedTo, '—'),
        slaRemainingLabel: safeString(complaint.slaRemainingLabel, '—'),
        slaProgressPercent: safeNumber(complaint.slaProgressPercent, 0),
        steps: safeArray(complaint.steps).map((s) => ({
            id: safeString(s.id, ''),
            label: safeString(s.label, ''),
            status: safeString(s.status, 'pending')
        }))
    };
}
function mapContactRequest(request: ResidentDashboardData['contactRequest'] | Absent): DashboardContactRequestViewModel | null {
    if (!request)
        return null;
    const statusPresentation = safeGetStatusPresentation(request.status, 'visitor');
    return {
        id: safeString(request.id, ''),
        fromFlat: safeString(request.fromFlat, '—'),
        subject: safeString(request.subject, '—'),
        statusLabel: statusPresentation.label,
        statusTone: statusPresentation.type
    };
}
function mapChats(chats: ResidentDashboardData['departmentChats'] | Absent): DashboardChatViewModel[] {
    return safeArray(chats).map((c) => ({
        id: safeString(c.id, ''),
        label: safeString(c.label, 'Chat'),
        unreadCount: safeNumber(c.unreadCount, 0),
        iconName: safeString(c.iconName, 'chatbox-outline')
    }));
}
function formatNoticeTimestamp(dateString: string | Absent, messages: EnglishMessagesType): string {
    if (!dateString) {
        return messages.resident.dashboard.noticeMessages?.recentlyPublished || 'Recently published';
    }
    const isRelative = /ago|hour|day|min|sec/i.test(dateString) || Number.isNaN(Date.parse(dateString));
    if (isRelative) {
        const trimmed = dateString.trim();
        return trimmed.length > 0 ? trimmed : (messages.resident.dashboard.noticeMessages?.recentlyPublished || 'Recently published');
    }
    const parsedDate = new Date(dateString);
    const now = new Date();
    if (parsedDate.getTime() > now.getTime()) {
        return messages.resident.dashboard.noticeMessages?.recentlyPublished || 'Recently published';
    }
    const isToday = parsedDate.toDateString() === now.toDateString();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const isYesterday = parsedDate.toDateString() === yesterday.toDateString();
    if (isToday) {
        const timePart = formatResidentTime(parsedDate);
        return `Today, ${timePart}`;
    }
    else if (isYesterday) {
        return 'Yesterday';
    }
    else {
        return formatResidentDate(parsedDate);
    }
}
function mapNotices(notices: ResidentDashboardData['notices'] | Absent): DashboardNoticeViewModel[] {
    const messages = enMessages;
    return safeArray(notices).map((n) => {
        let status: 'acknowledgementRequired' | 'acknowledged' | 'informational' | 'expired' = 'informational';
        if (n.publishedAtLabel === 'Expired') {
            status = 'expired';
        }
        else if (n.acknowledgementRequired) {
            status = n.acknowledgementStatus === 'acknowledged' ? 'acknowledged' : 'acknowledgementRequired';
        }
        else if (n.acknowledgementStatus === 'acknowledged') {
            status = 'acknowledged';
        }
        const publishedAt = n.publishedDate || n.publishedAtLabel || '';
        let attachmentCount = 0;
        if (n.attachmentName) {
            attachmentCount = 1;
        }
        let priority: 'normal' | 'important' | 'urgent' = 'normal';
        if (n.category === 'important') {
            priority = 'important';
        }
        else if (n.category === 'emergency') {
            priority = 'urgent';
        }
        const cardData = {
            id: safeString(n.id, `notice-${Math.random()}`),
            category: safeString(n.category, 'general'),
            title: safeString(n.title, 'Notice'),
            summary: n.summary,
            publishedAt,
            publisherName: n.publishedBy,
            status,
            acknowledgementRequired: n.acknowledgementRequired ?? false,
            attachmentCount,
            priority
        };
        const categoryKeys: Record<string, string> = {
            important: messages.resident.notices.categories.AGM_MEETING,
            maintenance: messages.resident.notices.categories.MAINTENANCE,
            event: messages.resident.notices.categories.FESTIVAL_EVENT,
            emergency: messages.resident.notices.categories.EMERGENCY,
            general: messages.resident.notices.categories.GENERAL
        };
        const categoryLabel = categoryKeys[cardData.category] || safeString(cardData.category, 'General');
        const title = safeString(cardData.title, 'Notice').replace(/\s+/g, ' ').trim();
        let summary = safeString(cardData.summary, '').replace(/\s+/g, ' ').trim();
        if (!summary) {
            summary = messages.resident.dashboard.noticeMessages?.noNoticesMessage || 'Open this notice to view the complete update.';
        }
        const formattedPublishedTime = formatNoticeTimestamp(cardData.publishedAt, messages);
        let attachmentLabel = undefined;
        if (cardData.attachmentCount > 0) {
            attachmentLabel = cardData.attachmentCount === 1
                ? `1 ${messages.resident.dashboard.noticeMessages?.attachment || 'attachment'}`
                : `${cardData.attachmentCount} ${messages.resident.dashboard.noticeMessages?.attachments || 'attachments'}`;
        }
        let statusLabel = undefined;
        let statusTone: 'neutral' | 'info' | 'warning' | 'success' | 'danger' = 'neutral';
        if (cardData.status === 'acknowledgementRequired') {
            statusLabel = messages.resident.dashboard.noticeMessages?.acknowledgementPending || 'Acknowledgement pending';
            statusTone = 'warning';
        }
        else if (cardData.status === 'acknowledged') {
            statusLabel = messages.resident.dashboard.noticeMessages?.acknowledged || 'Acknowledged';
            statusTone = 'success';
        }
        return {
            id: cardData.id,
            categoryLabel,
            title,
            summary,
            formattedPublishedTime,
            ...includeWhenPresent("attachmentLabel", attachmentLabel),
            ...includeWhenPresent("statusLabel", statusLabel),
            statusTone,
            acknowledgementRequired: cardData.acknowledgementRequired
        };
    });
}
function mapDocuments(documents: ResidentDashboardData['documents'] | Absent): DashboardDocumentViewModel[] {
    const categoryLabels: Record<string, string> = {
        rentAgreement: 'Rent Agreement',
        policeVerification: 'Police Verification',
        noc: 'NOC',
        certificate: 'Certificate',
        kyc: 'KYC',
        vehicle: 'Vehicle Document'
    };
    return safeArray(documents).map((d) => {
        const statusPresentation = safeGetStatusPresentation(d.status, 'document');
        return {
            id: safeString(d.id, ''),
            title: safeString(d.title, 'Document'),
            categoryLabel: categoryLabels[d.category] ?? safeString(d.category, 'Document'),
            statusLabel: statusPresentation.label,
            statusTone: statusPresentation.type,
            sensitive: d.sensitive ?? false
        };
    });
}
function mapAmenities(amenities: ResidentDashboardData['amenities'] | Absent): DashboardAmenityViewModel[] {
    const availLabels: Record<string, string> = {
        available: 'Available',
        limited: 'Limited',
        closed: 'Closed'
    };
    const availTones: Record<string, BadgeType> = {
        available: 'success',
        limited: 'warning',
        closed: 'danger'
    };
    return safeArray(amenities).map((a) => ({
        id: safeString(a.id, ''),
        name: safeString(a.name, 'Amenity'),
        timingLabel: safeString(a.timingLabel, '—'),
        priceLabel: safeString(a.priceLabel, '—'),
        capacityLabel: safeString(a.capacityLabel, '—'),
        ...includeWhenPresent("imageUri", a.imageUri),
        availabilityLabel: availLabels[a.availabilityStatus] ?? 'Unknown',
        availabilityTone: availTones[a.availabilityStatus] ?? 'neutral'
    }));
}
function mapEmergency(actions: ResidentDashboardData['emergencyActions'] | Absent): DashboardEmergencyViewModel[] {
    return safeArray(actions).map((e) => ({
        id: safeString(e.id, ''),
        label: safeString(e.label, 'Emergency'),
        iconName: safeString(e.iconName, 'alert-circle-outline')
    }));
}
function mapServices(services: ResidentDashboardData['communityServices'] | Absent): DashboardServiceViewModel[] {
    return safeArray(services).map((s) => ({
        id: safeString(s.id, ''),
        label: safeString(s.label, 'Service'),
        iconName: safeString(s.iconName, 'ellipsis-horizontal'),
        description: safeString(s.description, '')
    }));
}
function mapActivities(activities: ResidentDashboardData['activities'] | Absent): DashboardActivityViewModel[] {
    return safeArray(activities).map((a) => ({
        id: safeString(a.id, ''),
        title: safeString(a.title, 'Activity'),
        description: safeString(a.description, ''),
        module: safeString(a.module, 'visitor'),
        timestampLabel: safeString(a.timestampLabel, '—')
    }));
}
export function mapDashboardToViewModel(data: ResidentDashboardData, overrides?: {
    greeting?: string;
    unitLabel?: string;
    societyName?: string;
    roleLabel?: string;
    unreadNoticeCount?: number;
    pendingActionCount?: number;
}): ResidentDashboardViewModel {
    const activeHome: DashboardHomeSummaryViewModel = {
        greeting: safeString(overrides?.greeting, ''),
        residentName: safeString(data.residentName, 'Resident'),
        unitLabel: safeString(overrides?.unitLabel ?? data.unitLabel, '—'),
        societyName: safeString(overrides?.societyName ?? data.societyName, '—'),
        roleLabel: safeString(overrides?.roleLabel ?? data.roleLabel, 'Resident'),
        unreadNoticeCount: safeNumber(overrides?.unreadNoticeCount ?? data.unreadNoticeCount, 0),
        pendingActionCount: safeNumber(overrides?.pendingActionCount ?? data.pendingActionCount, 0)
    };
    const reminders = mapReminders(data.reminders);
    const priorityActions = mapPriorityActions(data.priorityActions);
    const visitorTimeline = mapVisitorTimeline(data.visitorTimeline);
    const maintenancePayment = mapPayment(data.maintenancePayment);
    const complaintProgress = mapComplaint(data.complaintProgress);
    const contactRequest = mapContactRequest(data.contactRequest);
    const departmentChats = mapChats(data.departmentChats);
    const notices = mapNotices(data.notices);
    const documents = mapDocuments(data.documents);
    const amenities = mapAmenities(data.amenities);
    const emergencyActions = mapEmergency(data.emergencyActions);
    const communityServices = mapServices(data.communityServices);
    const activities = mapActivities(data.activities);
    const isEmpty = reminders.length === 0 &&
        priorityActions.length === 0 &&
        visitorTimeline.length === 0 &&
        notices.length === 0 &&
        activities.length === 0;
    return {
        activeHome,
        reminders,
        priorityActions,
        visitorTimeline,
        maintenancePayment,
        complaintProgress,
        contactRequest,
        departmentChats,
        notices,
        documents,
        amenities,
        emergencyActions,
        communityServices,
        activities,
        isEmpty,
        hasRestrictedSections: false
    };
}

