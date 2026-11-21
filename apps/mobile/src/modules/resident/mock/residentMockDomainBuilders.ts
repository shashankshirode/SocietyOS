import { enMessages } from '../../../messages/en';
import type { Bill, BillLineItem, BillLineItemType, BillStatus, PaymentRecord, } from '../../../shared/types/bill.types';
import { formatBillingPeriod } from '../../../shared/formatters/dateFormatter';
import type { Complaint, ComplaintPriority, ComplaintStatus, } from '../../../shared/types/complaint.types';
import type { DocumentCategory, DocumentInfo, DocumentSensitivity, DocumentStatus, } from '../../../shared/types/document.types';
import type { NocRequest, NocStatus, NocType } from '../../../shared/types/noc.types';
import type { Notice, NoticeCategory, NoticePriority, NoticeStatus } from '../../../shared/types/notice.types';
import type { Visitor, VisitorCategory, VisitorStatus, VisitorType, } from '../../../shared/types/visitor.types';
import type { Vehicle } from '../../../shared/types/vehicle.types';
import type { ChatThread } from '../../../shared/types/chat.types';
import type { ResidentDirectoryEntry } from '../../../shared/types/residentConnect.types';
import { mockResidentHomeContexts } from '../homeContext/data/residentHomeContext.mockData';
import type { ResidentHomeContext } from '../homeContext/data/residentHomeContext.types';
import { residentMockSeed } from './residentMockSeed';
import type { ResidentMockFeatureKey, ResidentMockRecord } from './residentMockScenario.types';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import type { Absent } from "../../../shared/types/absence.types";
function getHome(homeContextId: string): ResidentHomeContext {
    const home = mockResidentHomeContexts.find((candidate) => candidate.homeContextId === homeContextId);
    if (!home) {
        throw new Error('RESIDENT_MOCK_HOME_CONFIGURATION_INVALID');
    }
    return home;
}
function getFeatureLabel(feature: ResidentMockFeatureKey): string {
    return enMessages.resident.mockData.featureLabels[feature];
}
function getRecordTitle(record: ResidentMockRecord, home: ResidentHomeContext): string {
    return enMessages.resident.mockData.recordTitle(getFeatureLabel(record.feature), record.ordinal + 1, home.displayUnitName);
}
function getRecordDescription(record: ResidentMockRecord, home: ResidentHomeContext): string {
    return enMessages.resident.mockData.recordDescription(getFeatureLabel(record.feature), home.societyName);
}
function getResidentName(home: ResidentHomeContext): string {
    return enMessages.resident.mockData.residentNames[home.residentRole];
}
function visitorStatus(ordinal: number): VisitorStatus {
    if (ordinal < 10)
        return 'EXPECTED';
    if (ordinal < 18)
        return 'CHECKED_IN';
    if (ordinal < 26)
        return 'COMPLETED';
    if (ordinal < 31)
        return 'EXPIRED';
    if (ordinal < 36)
        return 'REJECTED';
    return 'APPROVED';
}
function visitorType(ordinal: number): VisitorType {
    return getRequiredItem((['GUEST', 'DELIVERY', 'CAB', 'VENDOR'] as const), ordinal % 4, "residentMockDomainBuilders.ts");
}
function visitorCategory(ordinal: number): VisitorCategory {
    const categories: readonly VisitorCategory[] = [
        'guest',
        'delivery',
        'cab',
        'parcel',
        'serviceProvider',
        'repairTechnician',
        'domesticHelp',
        'vendor',
    ];
    return getRequiredItem(categories, ordinal % categories.length, "residentMockDomainBuilders.ts");
}
function getRealisticVisitorName(ordinal: number, type: VisitorType): string {
    const guests = ['Rajesh Kumar', 'Sunita Sharma', 'Amit Patel', 'Priya Singh', 'Vikram Malhotra', 'Neha Gupta'];
    const deliveries = ['Amazon Delivery', 'Zomato Delivery', 'Swiggy Instamart', 'BlueDart Courier', 'Delhivery Agent', 'FedEx Driver'];
    const cabs = ['Uber Cab', 'Ola Auto', 'BluSmart Driver', 'Meru Cab', 'Kalyan Travels', 'Locoshare Auto'];
    const vendors = ['Urban Company Plumber', 'Milk Delivery (Amul)', 'Newspaper Vendor', 'Ironing Service', 'Trash Collector'];
    if (type === 'GUEST')
        return getRequiredItem(guests, ordinal % guests.length, "residentMockDomainBuilders.ts");
    if (type === 'DELIVERY')
        return getRequiredItem(deliveries, ordinal % deliveries.length, "residentMockDomainBuilders.ts");
    if (type === 'CAB')
        return getRequiredItem(cabs, ordinal % cabs.length, "residentMockDomainBuilders.ts");
    return getRequiredItem(vendors, ordinal % vendors.length, "residentMockDomainBuilders.ts");
}
function buildVisitor(record: ResidentMockRecord): Visitor {
    const home = getHome(record.homeContextId);
    const status = visitorStatus(record.ordinal);
    const isOverdue = record.ordinal >= 10 && record.ordinal < 15;
    const expectedEntryAtIso = status === 'EXPECTED' || status === 'APPROVED'
        ? `2026-07-09T${String(14 + (record.ordinal % 6)).padStart(2, '0')}:00:00.000Z`
        : '2026-07-09T09:00:00.000Z';
    const expectedExitAtIso = isOverdue
        ? '2026-07-09T10:30:00.000Z'
        : '2026-07-09T20:00:00.000Z';
    const actualEntryAtIso = status === 'CHECKED_IN' || status === 'COMPLETED'
        ? '2026-07-09T09:00:00.000Z'
        : undefined;
    const actualExitAtIso = status === 'COMPLETED' ? '2026-07-09T10:00:00.000Z' : undefined;
    return {
        id: record.id,
        homeContextId: record.homeContextId,
        societyId: record.societyId,
        unitId: record.unitId,
        dataScopeKey: record.dataScopeKey,
        name: getRealisticVisitorName(record.ordinal, visitorType(record.ordinal)),
        phone: `90000${String(record.ordinal + 1).padStart(5, '0')}`,
        type: visitorType(record.ordinal),
        status,
        expectedDate: expectedEntryAtIso.slice(0, 10),
        expectedTime: expectedEntryAtIso.slice(11, 16),
        ...includeWhenPresent("actualEntryTime", actualEntryAtIso),
        ...includeWhenPresent("actualExitTime", actualExitAtIso),
        flatNumber: home.flatNumber,
        societyName: home.societyName,
        purpose: enMessages.resident.mockData.visitorPurpose,
        otp: String(410000 + record.ordinal),
        createdAt: record.createdAtIso,
        visitorCategory: visitorCategory(record.ordinal),
        exitTracking: {
            expectedEntryAtIso,
            ...includeWhenPresent("actualEntryAtIso", actualEntryAtIso),
            expectedExitAtIso,
            ...includeWhenPresent("actualExitAtIso", actualExitAtIso),
            gracePeriodMinutes: 15,
            exitStatus: isOverdue ? 'overdue' : status === 'CHECKED_IN' ? 'inside' : status === 'COMPLETED' ? 'exitMarked' : 'notEntered',
            alertStatus: isOverdue ? 'sent' : status === 'COMPLETED' ? 'resolved' : 'scheduled',
            alertDueAtIso: expectedExitAtIso,
            timeline: [
                {
                    id: `${record.id}:timeline:created`,
                    titleKey: 'visitor.exitAssurance.timelinePassCreated',
                    descriptionKey: 'visitor.exitAssurance.timelinePassCreatedDescription',
                    occurredAtIso: record.createdAtIso,
                    status: 'scheduled'
                },
            ]
        }
    };
}
function billStatus(ordinal: number): BillStatus {
    const statuses: readonly BillStatus[] = [
        'OVERDUE',
        'PARTIALLY_PAID',
        'DUE',
        'PAID',
        'PAID',
        'DUE',
        'CANCELLED',
        'OVERDUE',
        'PAID',
        'GENERATED',
        'DUE',
        'PAID',
    ];
    return getRequiredItem(statuses, ordinal % statuses.length, "residentMockDomainBuilders.ts");
}
function getBillPeriod(ordinal: number): string {
    const date = new Date(Date.UTC(2026, 6 - ordinal, 1));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}
function getRealisticBillTitle(ordinal: number, period: string): string {
    const titles = enMessages.resident.billing.mockTitles;
    const specialTitles = [
        titles.clubhouseDeposit,
        titles.latePaymentFee,
        titles.waterAdjustment,
        titles.parkingRenewal,
        titles.repairFund,
        titles.sinkingFund,
        titles.festivalContribution,
        titles.guestParkingPenalty,
    ] as const;
    return ordinal % 4 === 0
        ? titles.maintenance(formatBillingPeriod(period))
        : getRequiredItem(specialTitles, (ordinal - 1) % specialTitles.length, "residentMockDomainBuilders.ts");
}
function createBillLineItem(billId: string, type: BillLineItemType, amount: number, index: number): BillLineItem {
    const label = enMessages.resident.billing.lineItem[type];
    return {
        lineItemId: `${billId}:line-item:${index + 1}`,
        type,
        label,
        labelMessageKey: `resident.billing.lineItem.${type}`,
        amount,
        currencyCode: 'INR',
        isCredit: amount < 0
    };
}
function buildBillLineItems(record: ResidentMockRecord, status: BillStatus): BillLineItem[] {
    const amount = record.amount ?? 0;
    const supplementary: {
        type: BillLineItemType;
        amount: number;
    }[] = [
        { type: 'sinkingFund', amount: Math.round(amount * 0.05) },
        { type: 'repairFund', amount: Math.round(amount * 0.1) },
        { type: 'water', amount: 220 + (record.ordinal % 4) * 20 },
        { type: 'parking', amount: 300 },
    ];
    if (record.ordinal % 5 === 1) {
        supplementary.push({ type: 'facility', amount: 450 });
    }
    if (status === 'OVERDUE') {
        supplementary.push({ type: 'lateFee', amount: 150 });
    }
    if (record.ordinal % 9 === 8) {
        supplementary.push({ type: 'penalty', amount: 200 });
    }
    if (record.ordinal % 10 === 4) {
        supplementary.push({ type: 'adjustment', amount: -100 });
    }
    if (record.ordinal % 6 === 0) {
        supplementary.push({ type: 'tax', amount: 180 });
    }
    const supplementaryTotal = supplementary.reduce((sum, item) => sum + item.amount, 0);
    const values = [
        { type: 'maintenance' as const, amount: amount - supplementaryTotal },
        ...supplementary,
    ];
    return values.map((item, index) => createBillLineItem(record.id, item.type, item.amount, index));
}
function buildPaymentRecords(record: ResidentMockRecord, status: BillStatus, amount: number, period: string): PaymentRecord[] | Absent {
    if (status !== 'PAID' && status !== 'PARTIALLY_PAID') {
        return undefined;
    }
    const amountPaid = status === 'PAID' ? amount : Math.round(amount / 2);
    return [{
            id: `${record.id}:payment:1`,
            amountPaid,
            paymentDate: `${period}-25`,
            paymentMethod: getRequiredItem((['UPI', 'CARD', 'NET_BANKING'] as const), record.ordinal % 3, "residentMockDomainBuilders.ts"),
            transactionId: `TXN${record.homeContextId.replace(/\D/g, '')}${String(record.ordinal + 1).padStart(8, '0')}`,
            receiptNumber: `REC-${period.replace('-', '')}-${String(record.ordinal + 1).padStart(3, '0')}`
        }];
}
function buildBill(record: ResidentMockRecord): Bill {
    const home = getHome(record.homeContextId);
    const amount = record.amount ?? 0;
    const status = billStatus(record.ordinal);
    const period = getBillPeriod(record.ordinal);
    const payments = buildPaymentRecords(record, status, amount, period);
    const paidAmount = payments?.reduce((sum, payment) => sum + payment.amountPaid, 0);
    const latestPayment = payments?.[0];
    return {
        id: record.id,
        homeContextId: record.homeContextId,
        societyId: record.societyId,
        unitId: record.unitId,
        dataScopeKey: record.dataScopeKey,
        billNumber: `INV-${home.societyId.replace('society-', '').toUpperCase()}-${period.replace('-', '')}-${String(record.ordinal + 1).padStart(3, '0')}`,
        flatNumber: home.flatNumber,
        societyName: home.societyName,
        title: getRealisticBillTitle(record.ordinal, period),
        amount,
        dueDate: `${period}-28`,
        status,
        billingPeriod: period,
        ...includeWhenPresent("paidAmount", paidAmount),
        ...includeWhenPresent("lateFee", status === 'OVERDUE' ? 150 : undefined),
        charges: buildBillLineItems(record, status),
        ...includeWhenPresent("payments", payments),
        ...includeWhenPresent("receiptNumber", latestPayment?.receiptNumber),
        ...includeWhenPresent("transactionId", latestPayment?.transactionId),
        ...includeWhenPresent("paidDate", latestPayment?.paymentDate),
        notes: enMessages.resident.mockData.billingNote
    };
}
function complaintStatus(ordinal: number): ComplaintStatus {
    const statuses: readonly ComplaintStatus[] = [
        'OPEN',
        'IN_PROGRESS',
        'WAITING_FOR_RESIDENT',
        'RESOLVED',
        'REOPENED',
        'CLOSED',
    ];
    return getRequiredItem(statuses, ordinal % statuses.length, "residentMockDomainBuilders.ts");
}
function complaintPriority(ordinal: number): ComplaintPriority {
    return getRequiredItem((['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const), ordinal % 4, "residentMockDomainBuilders.ts");
}
function buildComplaint(record: ResidentMockRecord): Complaint {
    const home = getHome(record.homeContextId);
    const status = complaintStatus(record.ordinal);
    return {
        id: record.id,
        homeContextId: record.homeContextId,
        societyId: record.societyId,
        unitId: record.unitId,
        dataScopeKey: record.dataScopeKey,
        title: getRecordTitle(record, home),
        description: getRecordDescription(record, home),
        category: getRequiredItem((['WATER_LEAKAGE', 'PLUMBING', 'LIFT', 'SECURITY', 'PARKING'] as const), record.ordinal % 5, "residentMockDomainBuilders.ts"),
        status,
        priority: complaintPriority(record.ordinal),
        location: enMessages.resident.mockData.complaintLocation(home.displayUnitName),
        flatNumber: home.flatNumber,
        residentName: getResidentName(home),
        createdAt: record.createdAtIso,
        updatedAt: record.updatedAtIso,
        slaText: enMessages.resident.mockData.complaintSla,
        ...includeWhenPresent("assignedTo", status === 'OPEN' ? undefined : enMessages.resident.mockData.societyOffice),
        updates: [
            {
                id: `${record.id}:update:1`,
                status,
                note: getRecordDescription(record, home),
                timestamp: record.updatedAtIso
            },
        ]
    };
}
function documentStatus(ordinal: number): DocumentStatus {
    return getRequiredItem((['VERIFIED', 'PENDING_VERIFICATION', 'REQUIRED', 'EXPIRED', 'REJECTED', 'UPLOADED'] as const), ordinal % 6, "residentMockDomainBuilders.ts");
}
function documentCategory(ordinal: number): DocumentCategory {
    return getRequiredItem((['OWNER_KYC', 'TENANT_KYC', 'VEHICLE_DOCUMENT', 'PARKING_ALLOTMENT', 'RENT_AGREEMENT', 'POLICE_VERIFICATION'] as const), ordinal % 6, "residentMockDomainBuilders.ts");
}
function documentSensitivity(home: ResidentHomeContext, ordinal: number): DocumentSensitivity {
    if (home.residentRole === 'tenant')
        return ordinal % 2 === 0 ? 'TENANT_ONLY' : 'RESIDENT_ONLY';
    if (home.residentRole === 'familyMember')
        return 'RESIDENT_ONLY';
    return ordinal % 3 === 0 ? 'OWNER_ONLY' : 'RESIDENT_ONLY';
}
function buildDocument(record: ResidentMockRecord): DocumentInfo {
    const home = getHome(record.homeContextId);
    const status = documentStatus(record.ordinal);
    return {
        id: record.id,
        homeContextId: record.homeContextId,
        societyId: record.societyId,
        unitId: record.unitId,
        dataScopeKey: record.dataScopeKey,
        title: getRecordTitle(record, home),
        category: documentCategory(record.ordinal),
        flatNumber: home.flatNumber,
        status,
        ...includeWhenPresent("uploadedDate", status === 'REQUIRED' ? undefined : record.createdAtIso.slice(0, 10)),
        ...includeWhenPresent("uploadedBy", status === 'REQUIRED' ? undefined : getResidentName(home)),
        ...includeWhenPresent("verifiedDate", status === 'VERIFIED' ? record.updatedAtIso.slice(0, 10) : undefined),
        ...includeWhenPresent("verifiedBy", status === 'VERIFIED' ? enMessages.resident.mockData.societyOffice : undefined),
        ...includeWhenPresent("expiryDate", status === 'EXPIRED' ? record.updatedAtIso.slice(0, 10) : undefined),
        fileType: 'pdf',
        fileSize: `${record.ordinal + 1}.2 MB`,
        sensitivity: documentSensitivity(home, record.ordinal),
        description: enMessages.resident.mockData.documentDescription,
        isSocietyDoc: record.ordinal % 10 === 9
    };
}
function noticeCategory(ordinal: number): NoticeCategory {
    return getRequiredItem((['GENERAL', 'MAINTENANCE', 'WATER_SUPPLY', 'AGM_MEETING', 'EMERGENCY', 'BILLING'] as const), ordinal % 6, "residentMockDomainBuilders.ts");
}
function noticeStatus(ordinal: number): NoticeStatus {
    return getRequiredItem((['UNREAD', 'READ', 'PINNED', 'EXPIRED'] as const), ordinal % 4, "residentMockDomainBuilders.ts");
}
function noticePriority(ordinal: number): NoticePriority {
    return getRequiredItem((['LOW', 'NORMAL', 'IMPORTANT', 'URGENT'] as const), ordinal % 4, "residentMockDomainBuilders.ts");
}
function buildNotice(record: ResidentMockRecord): Notice {
    const home = getHome(record.homeContextId);
    const priority = noticePriority(record.ordinal);
    const contentKeys = ['water', 'annualMeeting', 'lift', 'monsoon', 'billing', 'yoga'] as const;
    const content = enMessages.resident.notices.content[getRequiredItem(contentKeys, record.ordinal % contentKeys.length, "residentMockDomainBuilders.ts")];
    return {
        id: record.id,
        homeContextId: record.homeContextId,
        societyId: record.societyId,
        unitId: record.unitId,
        dataScopeKey: record.dataScopeKey,
        title: content.title,
        body: content.body,
        category: noticeCategory(record.ordinal),
        date: record.createdAtIso.slice(0, 10),
        postedBy: content.publisher,
        isImportant: priority === 'IMPORTANT' || priority === 'URGENT',
        priority,
        status: noticeStatus(record.ordinal),
        societyName: home.societyName,
        targetAudience: enMessages.resident.mockData.noticeAudience,
        acknowledgementRequired: record.ordinal % 3 === 0,
        acknowledged: record.ordinal % 3 !== 0
    };
}
function nocStatus(ordinal: number): NocStatus {
    return getRequiredItem((['SUBMITTED', 'UNDER_REVIEW', 'PENDING_DUES_CLEARANCE', 'APPROVED', 'REJECTED', 'GENERATED', 'EXPIRED'] as const), ordinal % 7, "residentMockDomainBuilders.ts");
}
function nocType(ordinal: number): NocType {
    return getRequiredItem((['MOVE_OUT', 'RENOVATION_NOC', 'NO_DUES', 'TENANT_NOC', 'VEHICLE_NOC', 'RESIDENCE_CERTIFICATE', 'PARKING_NOC'] as const), ordinal % 7, "residentMockDomainBuilders.ts");
}
function buildNocRequest(record: ResidentMockRecord): NocRequest {
    const home = getHome(record.homeContextId);
    const status = nocStatus(record.ordinal);
    return {
        id: record.id,
        homeContextId: record.homeContextId,
        societyId: record.societyId,
        unitId: record.unitId,
        dataScopeKey: record.dataScopeKey,
        requestNumber: `NOC-${record.homeContextId}-${String(record.ordinal + 1).padStart(3, '0')}`,
        nocType: nocType(record.ordinal),
        flatNumber: home.flatNumber,
        residentName: getResidentName(home),
        submittedDate: record.createdAtIso.slice(0, 10),
        requiredByDate: record.updatedAtIso.slice(0, 10),
        status,
        reason: enMessages.resident.mockData.nocReason,
        timeline: [
            {
                title: enMessages.resident.mockData.nocTimelineSubmitted,
                description: enMessages.resident.mockData.nocTimelineDescription,
                status: 'COMPLETED',
                updatedAt: record.createdAtIso,
                actor: getResidentName(home)
            },
            {
                title: enMessages.resident.mockData.nocTimelineReview,
                description: enMessages.resident.mockData.nocTimelineDescription,
                status: status === 'REJECTED' ? 'REJECTED' : status === 'APPROVED' || status === 'GENERATED' ? 'COMPLETED' : 'CURRENT',
                updatedAt: record.updatedAtIso,
                actor: enMessages.resident.mockData.societyOffice
            },
        ]
    };
}
function buildVehicle(record: ResidentMockRecord): Vehicle {
    const home = getHome(record.homeContextId);
    const isEv = record.ordinal % 4 === 0;
    return {
        id: record.id,
        societyId: record.societyId,
        unitId: record.unitId,
        vehicleNumber: `${home.city.slice(0, 2).toUpperCase()}-${String(record.ordinal + 1).padStart(2, '0')}-RS-${String(1000 + record.ordinal)}`,
        vehicleType: isEv ? 'EV' : record.ordinal % 2 === 0 ? 'CAR' : 'TWO_WHEELER',
        makeModel: getRecordTitle(record, home),
        color: getRecordDescription(record, home),
        fuelType: isEv ? 'ELECTRIC' : record.ordinal % 2 === 0 ? 'PETROL' : 'CNG',
        isEv,
        ownerName: getResidentName(home),
        linkedResidentName: getResidentName(home),
        linkedFlat: home.flatNumber,
        parkingSlotId: `${record.id}:slot`,
        parkingSlotNumber: `P-${String(record.ordinal + 1).padStart(2, '0')}`,
        stickerStatus: record.ordinal % 5 === 0 ? 'EXPIRED' : 'ISSUED',
        stickerNumber: `ST-${record.homeContextId}-${record.ordinal + 1}`,
        rfidStatus: record.ordinal % 6 === 0 ? 'REQUESTED' : 'ACTIVE',
        rfidTagNumber: `RF-${record.homeContextId}-${record.ordinal + 1}`,
        verificationStatus: record.ordinal % 7 === 0 ? 'PENDING' : 'VERIFIED',
        registrationDocumentStatus: record.ordinal % 6 === 0 ? 'UPLOADED' : 'VERIFIED',
        insuranceExpiry: record.updatedAtIso.slice(0, 10),
        ...includeWhenPresent("pollutionCertificateExpiry", isEv ? undefined : record.updatedAtIso.slice(0, 10)),
        lastGateEntry: record.updatedAtIso,
        lastUpdatedAt: record.updatedAtIso
    };
}
function buildResidentDirectoryEntry(record: ResidentMockRecord): ResidentDirectoryEntry {
    const home = getHome(record.homeContextId);
    return {
        id: `${record.id}:resident`,
        homeContextId: record.homeContextId,
        societyId: record.societyId,
        unitId: record.unitId,
        dataScopeKey: record.dataScopeKey,
        name: getRecordTitle(record, home),
        flatNumber: `${home.towerName ?? home.buildingName ?? home.flatNumber}-${record.ordinal + 1}`,
        tower: home.towerName ?? home.buildingName ?? home.societyName,
        residentType: record.ordinal % 3 === 0 ? 'TENANT' : record.ordinal % 3 === 1 ? 'FAMILY_MEMBER' : 'OWNER',
        visibilityStatus: record.ordinal % 7 === 0 ? 'LIMITED' : 'VISIBLE',
        connectionStatus: record.ordinal % 5 === 0 ? 'REQUEST_RECEIVED' : 'CONNECTED',
        lastActiveText: record.updatedAtIso,
        allowedTopics: ['COMMUNITY_HELP', 'PARCEL_HANDOVER'],
        mutualContext: [home.societyName],
        bio: getRecordDescription(record, home)
    };
}
function buildChatThread(record: ResidentMockRecord): ChatThread {
    const home = getHome(record.homeContextId);
    return {
        id: record.id,
        homeContextId: record.homeContextId,
        societyId: record.societyId,
        unitId: record.unitId,
        dataScopeKey: record.dataScopeKey,
        otherResidentId: `${record.homeContextId}:residentConnect:${String(record.ordinal + 1).padStart(3, '0')}:resident`,
        otherResidentName: getRecordTitle(record, home),
        otherFlat: `${home.flatNumber}-${record.ordinal + 1}`,
        lastMessage: getRecordDescription(record, home),
        lastMessageTime: record.updatedAtIso,
        unreadCount: record.status === 'unread' ? record.ordinal + 1 : 0,
        status: record.status === 'restricted' ? 'BLOCKED' : record.status === 'failed' ? 'REPORTED' : 'ACTIVE',
        isMuted: record.ordinal % 6 === 0,
        isArchived: record.ordinal % 9 === 0
    };
}
export const residentScopedVisitors: readonly Visitor[] = residentMockSeed.flatMap((scenario) => scenario.records.visitors.map(buildVisitor));
export const residentScopedBills: readonly Bill[] = residentMockSeed.flatMap((scenario) => scenario.records.billing.map(buildBill));
export const residentScopedComplaints: readonly Complaint[] = residentMockSeed.flatMap((scenario) => scenario.records.complaints.map(buildComplaint));
export const residentScopedDocuments: readonly DocumentInfo[] = residentMockSeed.flatMap((scenario) => scenario.records.documents.map(buildDocument));
export const residentScopedNotices: readonly Notice[] = residentMockSeed.flatMap((scenario) => scenario.records.notices.map(buildNotice));
export const residentScopedNocRequests: readonly NocRequest[] = residentMockSeed.flatMap((scenario) => scenario.records.noc.map(buildNocRequest));
export const residentScopedVehicles: readonly Vehicle[] = residentMockSeed.flatMap((scenario) => scenario.records.parking.map(buildVehicle));
export const residentScopedDirectoryEntries: readonly ResidentDirectoryEntry[] = residentMockSeed.flatMap((scenario) => scenario.records.residentConnect.map(buildResidentDirectoryEntry));
export const residentScopedChatThreads: readonly ChatThread[] = residentMockSeed.flatMap((scenario) => scenario.records.chat.map(buildChatThread));

