import type { Visitor, VisitorCategory, VisitorExitAlertStatus, VisitorExitStatus, VisitorType, } from "../types/visitor.types";
import { addMinutesToIso, getVisitorExitPolicy, } from "../../modules/resident/visitors/utils/visitorExitPolicyResolver";
import { visitorExitAssuranceMockNowIso } from "../../modules/resident/visitors/data/visitorExitPolicy";
import { includeWhenPresent } from "../utils/presentProperty";
type MockVisitorSeed = {
    id: string;
    name: string;
    phone: string;
    type: VisitorType;
    category: VisitorCategory;
    status: Visitor["status"];
    purpose: string;
    expectedEntryAtIso: string;
    actualEntryAtIso?: string;
    expectedExitAtIso?: string;
    actualExitAtIso?: string;
    exitStatus: VisitorExitStatus;
    alertStatus: VisitorExitAlertStatus;
    vehicleNumber?: string;
    residentResponse?: NonNullable<Visitor["exitTracking"]>["residentResponse"];
    extensionReason?: string;
    escalationReason?: string;
    flatNumber?: string;
    societyName?: string;
};
function formatDate(iso: string): string {
    return iso.slice(0, 10);
}
function formatTime(iso: string): string {
    return new Intl.DateTimeFormat("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata"
    }).format(new Date(iso));
}
function buildVisitor(seed: MockVisitorSeed): Visitor {
    const policy = getVisitorExitPolicy(seed.category);
    const expectedExitAtIso = seed.expectedExitAtIso ??
        addMinutesToIso(seed.expectedEntryAtIso, policy.defaultExpectedDurationMinutes);
    const alertDueAtIso = addMinutesToIso(expectedExitAtIso, policy.gracePeriodMinutes);
    return {
        id: seed.id,
        name: seed.name,
        phone: seed.phone,
        type: seed.type,
        status: seed.status,
        expectedDate: formatDate(seed.expectedEntryAtIso),
        expectedTime: formatTime(seed.expectedEntryAtIso),
        ...includeWhenPresent("actualEntryTime", seed.actualEntryAtIso
            ? formatTime(seed.actualEntryAtIso)
            : undefined),
        ...includeWhenPresent("actualExitTime", seed.actualExitAtIso
            ? formatTime(seed.actualExitAtIso)
            : undefined),
        flatNumber: seed.flatNumber ?? "A-1204",
        societyName: seed.societyName ?? "Green Valley Heights",
        purpose: seed.purpose,
        ...includeWhenPresent("vehicleNumber", seed.vehicleNumber),
        otp: seed.id.slice(-3).padStart(6, "4"),
        createdAt: addMinutesToIso(seed.expectedEntryAtIso, -20),
        visitorCategory: seed.category,
        exitTracking: {
            expectedEntryAtIso: seed.expectedEntryAtIso,
            ...includeWhenPresent("actualEntryAtIso", seed.actualEntryAtIso),
            expectedExitAtIso,
            ...includeWhenPresent("actualExitAtIso", seed.actualExitAtIso),
            gracePeriodMinutes: policy.gracePeriodMinutes,
            exitStatus: seed.exitStatus,
            alertStatus: seed.alertStatus,
            alertDueAtIso,
            ...includeWhenPresent("lastAlertSentAtIso", seed.alertStatus === "sent" || seed.alertStatus === "escalated"
                ? visitorExitAssuranceMockNowIso
                : undefined),
            ...includeWhenPresent("residentResponseAtIso", seed.residentResponse
                ? visitorExitAssuranceMockNowIso
                : undefined),
            ...includeWhenPresent("residentResponse", seed.residentResponse),
            ...includeWhenPresent("extensionReason", seed.extensionReason),
            ...includeWhenPresent("extendedExpectedExitAtIso", seed.exitStatus === "extended" ? expectedExitAtIso : undefined),
            ...includeWhenPresent("escalationReason", seed.escalationReason),
            timeline: [
                {
                    id: `${seed.id}-tracking-created`,
                    titleKey: "visitor.exitAssurance.timelinePassCreated",
                    descriptionKey: "visitor.exitAssurance.timelinePassCreatedDescription",
                    occurredAtIso: addMinutesToIso(seed.expectedEntryAtIso, -20),
                    status: "scheduled"
                },
            ]
        }
    };
}
export const mockVisitors: Visitor[] = [
    buildVisitor({
        id: "vis-ola-cab-overdue",
        name: "Ola Cab MH15AB1234",
        phone: "9812345678",
        type: "CAB",
        category: "cab",
        status: "APPROVED",
        purpose: "Airport pickup cab",
        expectedEntryAtIso: "2026-07-09T11:15:00.000Z",
        actualEntryAtIso: "2026-07-09T11:15:00.000Z",
        exitStatus: "overdue",
        alertStatus: "sent",
        vehicleNumber: "MH-15-AB-1234"
    }),
    buildVisitor({
        id: "vis-amazon-delivery-overdue",
        name: "Amazon Delivery",
        phone: "9998887770",
        type: "DELIVERY",
        category: "delivery",
        status: "APPROVED",
        purpose: "Package delivery",
        expectedEntryAtIso: "2026-07-09T11:20:00.000Z",
        actualEntryAtIso: "2026-07-09T11:20:00.000Z",
        exitStatus: "overdue",
        alertStatus: "sent"
    }),
    buildVisitor({
        id: "vis-blue-dart-parcel-overdue",
        name: "Blue Dart Parcel",
        phone: "9887766550",
        type: "DELIVERY",
        category: "parcel",
        status: "APPROVED",
        purpose: "Parcel handover",
        expectedEntryAtIso: "2026-07-09T11:25:00.000Z",
        actualEntryAtIso: "2026-07-09T11:25:00.000Z",
        exitStatus: "expectedExitDue",
        alertStatus: "sent"
    }),
    buildVisitor({
        id: "vis-urban-company-ac",
        name: "Urban Company AC Repair",
        phone: "9765432100",
        type: "VENDOR",
        category: "repairTechnician",
        status: "APPROVED",
        purpose: "AC repair technician",
        expectedEntryAtIso: "2026-07-09T10:30:00.000Z",
        actualEntryAtIso: "2026-07-09T10:30:00.000Z",
        expectedExitAtIso: "2026-07-09T14:00:00.000Z",
        exitStatus: "inside",
        alertStatus: "scheduled"
    }),
    buildVisitor({
        id: "vis-nobroker-painting",
        name: "NoBroker Painting Team",
        phone: "7276834907",
        type: "VENDOR",
        category: "paintingWorker",
        status: "APPROVED",
        purpose: "Painting work still going on",
        expectedEntryAtIso: "2026-07-09T09:00:00.000Z",
        actualEntryAtIso: "2026-07-09T09:00:00.000Z",
        expectedExitAtIso: "2026-07-09T18:00:00.000Z",
        exitStatus: "inside",
        alertStatus: "scheduled"
    }),
    buildVisitor({
        id: "vis-local-plumber-extended",
        name: "Local Plumber",
        phone: "9654321098",
        type: "VENDOR",
        category: "repairTechnician",
        status: "APPROVED",
        purpose: "Plumbing repair",
        expectedEntryAtIso: "2026-07-09T08:30:00.000Z",
        actualEntryAtIso: "2026-07-09T08:30:00.000Z",
        expectedExitAtIso: "2026-07-09T13:30:00.000Z",
        exitStatus: "extended",
        alertStatus: "snoozed",
        residentResponse: "extended",
        extensionReason: "visitor.exitAssurance.repairTakingLonger"
    }),
    buildVisitor({
        id: "vis-guest-family",
        name: "Guest Family Visit",
        phone: "9123456780",
        type: "GUEST",
        category: "guest",
        status: "EXPECTED",
        purpose: "Family visit",
        expectedEntryAtIso: "2026-07-09T17:00:00.000Z",
        expectedExitAtIso: "2026-07-09T21:00:00.000Z",
        exitStatus: "notEntered",
        alertStatus: "notRequired"
    }),
    buildVisitor({
        id: "vis-domestic-help",
        name: "Sunita Bai",
        phone: "9000000001",
        type: "VENDOR",
        category: "domesticHelp",
        status: "APPROVED",
        purpose: "Daily household help",
        expectedEntryAtIso: "2026-07-09T02:00:00.000Z",
        actualEntryAtIso: "2026-07-09T02:00:00.000Z",
        expectedExitAtIso: "2026-07-09T05:30:00.000Z",
        actualExitAtIso: "2026-07-09T05:20:00.000Z",
        exitStatus: "exitMarked",
        alertStatus: "resolved"
    }),
    buildVisitor({
        id: "vis-swiggy-exited",
        name: "Swiggy Delivery",
        phone: "9000000002",
        type: "DELIVERY",
        category: "delivery",
        status: "COMPLETED",
        purpose: "Food delivery",
        expectedEntryAtIso: "2026-07-09T09:00:00.000Z",
        actualEntryAtIso: "2026-07-09T09:00:00.000Z",
        actualExitAtIso: "2026-07-09T09:08:00.000Z",
        exitStatus: "exitMarked",
        alertStatus: "resolved"
    }),
    buildVisitor({
        id: "vis-resident-confirmed-left",
        name: "Courier Pickup",
        phone: "9000000003",
        type: "DELIVERY",
        category: "delivery",
        status: "APPROVED",
        purpose: "Return parcel pickup",
        expectedEntryAtIso: "2026-07-09T10:00:00.000Z",
        actualEntryAtIso: "2026-07-09T10:00:00.000Z",
        exitStatus: "residentConfirmedLeft",
        alertStatus: "acknowledged",
        residentResponse: "left"
    }),
    buildVisitor({
        id: "vis-still-inside",
        name: "Appliance Repair Person",
        phone: "9000000004",
        type: "VENDOR",
        category: "repairTechnician",
        status: "APPROVED",
        purpose: "Appliance repair",
        expectedEntryAtIso: "2026-07-09T08:45:00.000Z",
        actualEntryAtIso: "2026-07-09T08:45:00.000Z",
        exitStatus: "residentConfirmedStillInside",
        alertStatus: "acknowledged",
        residentResponse: "stillInside"
    }),
    buildVisitor({
        id: "vis-escalated-security",
        name: "Renovation Worker",
        phone: "9000000005",
        type: "VENDOR",
        category: "renovationWorker",
        status: "APPROVED",
        purpose: "Renovation worker",
        expectedEntryAtIso: "2026-07-09T06:00:00.000Z",
        actualEntryAtIso: "2026-07-09T06:00:00.000Z",
        exitStatus: "escalatedToSecurity",
        alertStatus: "escalated",
        residentResponse: "contactSecurity",
        escalationReason: "visitor.exitAssurance.securityContacted"
    }),
    buildVisitor({
        id: "vis-nashik-1",
        name: "Nashik Local Courier",
        phone: "9888877771",
        type: "DELIVERY",
        category: "delivery",
        status: "APPROVED",
        purpose: "Document delivery",
        expectedEntryAtIso: "2026-07-09T12:00:00.000Z",
        actualEntryAtIso: "2026-07-09T12:00:00.000Z",
        exitStatus: "exitMarked",
        alertStatus: "resolved",
        flatNumber: "C-503",
        societyName: "Gokhale Park Nashik"
    }),
    buildVisitor({
        id: "vis-nashik-2",
        name: "Nashik Grocery Delivery",
        phone: "9888877772",
        type: "DELIVERY",
        category: "delivery",
        status: "APPROVED",
        purpose: "Daily grocery delivery",
        expectedEntryAtIso: "2026-07-09T14:30:00.000Z",
        actualEntryAtIso: "2026-07-09T14:30:00.000Z",
        exitStatus: "overdue",
        alertStatus: "sent",
        flatNumber: "C-503",
        societyName: "Gokhale Park Nashik"
    }),
    buildVisitor({
        id: "vis-ra-1",
        name: "Rohan Ananta Broadband Tech",
        phone: "9777766661",
        type: "VENDOR",
        category: "repairTechnician",
        status: "APPROVED",
        purpose: "Wifi installation check",
        expectedEntryAtIso: "2026-07-09T15:00:00.000Z",
        actualEntryAtIso: "2026-07-09T15:00:00.000Z",
        exitStatus: "exitMarked",
        alertStatus: "resolved",
        flatNumber: "B-2101",
        societyName: "Rohan Ananta Tathawade"
    }),
];

