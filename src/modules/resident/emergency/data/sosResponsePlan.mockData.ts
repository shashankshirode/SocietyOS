import type {
  SosEmergencyContact,
  TrustedContactInvitation,
} from "./sosEmergencyContact.types";
import type {
  SosResponsePlan,
  SosRecipientRule,
  SosEvent,
  SosResidenceContext,
} from "./sosResponsePlan.types";
import type { EmergencyProfile } from "./sosEmergencyProfile.types";

import { sosEmergencyContactMockSource } from "./sosEmergencyContact.mockSource";
import { sosConfigurationMockSource } from "./sosConfiguration.mockSource";
import { sosEventMockSource } from "./sosEvent.mockSource";

export const MOCK_RESIDENCE_A: SosResidenceContext = {
  societyId: "society-green-valley",
  residenceId: "residence-gv-a1204",
  unitId: "unit-gv-a1204",
  flatNumber: "A-1204",
  tower: "A Wing",
  residentRole: "owner",
};

export const MOCK_RESIDENCE_B: SosResidenceContext = {
  societyId: "society-gokhale-park",
  residenceId: "residence-gp-b404",
  unitId: "unit-gp-b404",
  flatNumber: "B-404",
  tower: "B Wing",
  residentRole: "owner",
};

export const MOCK_CONTACTS_RESIDENCE_A: SosEmergencyContact[] = [
  {
    id: "contact-spouse-priya",
    residenceId: "residence-gv-a1204",
    societyId: "society-green-valley",
    displayName: "Priya Shirode",
    category: "familyMember",
    relationship: "spouse",
    phoneNumber: "+917276834907",
    phoneMasked: "******3210",
    email: "priya@example.com",
    preferredChannels: ["push", "sms"],
    active: true,
    verified: true,
    consentStatus: "granted",
    priority: 1,
    availableForSosTypes: [
      "medical",
      "fire",
      "securityThreat",
      "seniorHelp",
      "generalEmergency",
    ],
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-06-01T12:00:00Z",
  },
  {
    id: "contact-doctor-amit",
    residenceId: "residence-gv-a1204",
    societyId: "society-green-valley",
    displayName: "Dr. Amit Patil",
    category: "medicalProfessional",
    relationship: "familyDoctor",
    phoneNumber: "+919812345678",
    phoneMasked: "******5678",
    email: "dr.amit@example.com",
    preferredChannels: ["sms", "call"],
    active: true,
    verified: true,
    consentStatus: "granted",
    priority: 2,
    availableForSosTypes: ["medical", "seniorHelp"],
    createdAt: "2026-02-10T08:00:00Z",
    updatedAt: "2026-05-20T09:00:00Z",
  },
  {
    id: "contact-parent-mother",
    residenceId: "residence-gv-a1204",
    societyId: "society-green-valley",
    displayName: "Sunita Shirode",
    category: "familyMember",
    relationship: "parent",
    phoneNumber: "+919887654321",
    phoneMasked: "******4321",
    preferredChannels: ["push"],
    active: true,
    verified: true,
    consentStatus: "granted",
    priority: 3,
    availableForSosTypes: ["medical", "fire", "generalEmergency"],
    createdAt: "2026-01-15T10:30:00Z",
    updatedAt: "2026-01-15T10:30:00Z",
  },
  {
    id: "contact-inactive-old",
    residenceId: "residence-gv-a1204",
    societyId: "society-green-valley",
    displayName: "Rajesh Kapoor",
    category: "externalContact",
    relationship: "friend",
    phoneNumber: "+919800000000",
    phoneMasked: "******0000",
    preferredChannels: ["push"],
    active: false,
    verified: false,
    consentStatus: "revoked",
    priority: 5,
    availableForSosTypes: ["generalEmergency"],
    createdAt: "2025-06-01T10:00:00Z",
    updatedAt: "2026-03-01T14:00:00Z",
  },
];

export const MOCK_CONTACTS_RESIDENCE_B: SosEmergencyContact[] = [
  {
    id: "contact-b-caretaker",
    residenceId: "residence-gp-b404",
    societyId: "society-gokhale-park",
    displayName: "Ramesh Bhai",
    category: "externalContact",
    relationship: "caretaker",
    phoneNumber: "+919755555555",
    phoneMasked: "******5555",
    preferredChannels: ["sms", "call"],
    active: true,
    verified: true,
    consentStatus: "granted",
    priority: 1,
    availableForSosTypes: [
      "medical",
      "fire",
      "liftStuck",
      "seniorHelp",
      "generalEmergency",
    ],
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-06-15T10:00:00Z",
  },
];

export const MOCK_INVITATIONS: TrustedContactInvitation[] = [
  {
    id: "invite-accepted-neighbour",
    residenceId: "residence-gv-a1204",
    societyId: "society-green-valley",
    requestorResidentId: "user-shashank",
    requestorName: "Shashank Shirode",
    requestorUnit: "A-1204",
    recipientResidentId: "user-meera",
    recipientName: "Meera Desai",
    recipientUnit: "A-1206",
    sosTypesRequested: ["medical", "fire", "generalEmergency"],
    reason: "We are neighbours and trust each other in emergencies.",
    status: "accepted",
    createdAt: "2026-04-01T10:00:00Z",
    respondedAt: "2026-04-02T14:00:00Z",
    expiresAt: "2026-04-08T10:00:00Z",
  },
  {
    id: "invite-pending-volunteer",
    residenceId: "residence-gv-a1204",
    societyId: "society-green-valley",
    requestorResidentId: "user-shashank",
    requestorName: "Shashank Shirode",
    requestorUnit: "A-1204",
    recipientResidentId: "user-rohit",
    recipientName: "Rohit Verma",
    recipientUnit: "B-302",
    sosTypesRequested: ["medical", "seniorHelp"],
    reason: "Rohit is an emergency volunteer.",
    status: "pending",
    createdAt: "2026-06-20T09:00:00Z",
    expiresAt: "2026-06-27T09:00:00Z",
  },
  {
    id: "invite-declined-other",
    residenceId: "residence-gv-a1204",
    societyId: "society-green-valley",
    requestorResidentId: "user-shashank",
    requestorName: "Shashank Shirode",
    requestorUnit: "A-1204",
    recipientResidentId: "user-anita",
    recipientName: "Anita Kumar",
    recipientUnit: "C-101",
    sosTypesRequested: ["generalEmergency"],
    status: "declined",
    createdAt: "2026-05-10T10:00:00Z",
    respondedAt: "2026-05-11T08:00:00Z",
    expiresAt: "2026-05-17T10:00:00Z",
  },
];

const mandatorySecurityRule: SosRecipientRule = {
  recipientId: "society-security-gate",
  recipientType: "societyRole",
  recipientDisplayName: "Security Gate",
  source: "societyDefault",
  mandatory: true,
  enabled: true,
  escalationOrder: 1,
  notifyImmediately: true,
  escalationDelaySeconds: 0,
  notificationChannels: ["push", "inAppAlert"],
};

const mandatoryAdminRule: SosRecipientRule = {
  recipientId: "society-admin",
  recipientType: "societyRole",
  recipientDisplayName: "Society Admin",
  source: "societyDefault",
  mandatory: true,
  enabled: true,
  escalationOrder: 2,
  notifyImmediately: false,
  escalationDelaySeconds: 30,
  notificationChannels: ["push", "sms"],
};

export const MOCK_CUSTOM_MEDICAL_PLAN: SosResponsePlan = {
  id: "plan-gv-a1204-medical-custom",
  societyId: "society-green-valley",
  residenceId: "residence-gv-a1204",
  unitId: "unit-gv-a1204",
  sosType: "medical",
  mode: "custom",
  recipientRules: [
    mandatorySecurityRule,
    mandatoryAdminRule,
    {
      recipientId: "contact-spouse-priya",
      recipientType: "familyMember",
      recipientDisplayName: "Priya Shirode",
      source: "ownerConfigured",
      mandatory: false,
      enabled: true,
      escalationOrder: 3,
      notifyImmediately: true,
      escalationDelaySeconds: 0,
      notificationChannels: ["push", "sms"],
    },
    {
      recipientId: "contact-doctor-amit",
      recipientType: "externalEmergencyContact",
      recipientDisplayName: "Dr. Amit Patil",
      source: "ownerConfigured",
      mandatory: false,
      enabled: true,
      escalationOrder: 4,
      notifyImmediately: false,
      escalationDelaySeconds: 30,
      notificationChannels: ["sms", "call"],
    },
    {
      recipientId: "user-meera",
      recipientType: "trustedResident",
      recipientDisplayName: "Meera Desai (A-1206)",
      source: "ownerConfigured",
      mandatory: false,
      enabled: true,
      escalationOrder: 5,
      notifyImmediately: false,
      escalationDelaySeconds: 60,
      notificationChannels: ["push"],
    },
  ],
  fallbackPolicy: {
    notifySecurityGate: true,
    notifySocietyAdmin: true,
    notifyResidentOwner: true,
    continueWhenPersonalRecipientsUnavailable: true,
  },
  version: 3,
  createdAt: "2026-01-15T10:00:00Z",
  updatedAt: "2026-07-01T14:30:00Z",
  lastTestedAt: "2026-07-01T14:30:00Z",
};

export const MOCK_RESOLVED_EVENT: SosEvent = {
  id: "sos-event-resolved-001",
  sosType: "medical",
  residenceId: "residence-gv-a1204",
  societyId: "society-green-valley",
  unitId: "unit-gv-a1204",
  flatNumber: "A-1204",
  tower: "A Wing",
  triggeredByUserId: "user-shashank",
  triggeredByUserName: "Shashank Shirode",
  status: "resolved",
  isTestMode: false,
  recipientDeliveries: [
    {
      recipientId: "society-security-gate",
      displayName: "Security Gate",
      recipientType: "societyRole",
      deliveryStatus: "acknowledged",
      deliveredAt: "2026-07-10T08:01:00Z",
      acknowledgedAt: "2026-07-10T08:01:30Z",
      channel: "push",
    },
    {
      recipientId: "society-admin",
      displayName: "Society Admin",
      recipientType: "societyRole",
      deliveryStatus: "delivered",
      deliveredAt: "2026-07-10T08:01:30Z",
      channel: "push",
    },
    {
      recipientId: "contact-spouse-priya",
      displayName: "Priya Shirode",
      recipientType: "familyMember",
      deliveryStatus: "acknowledged",
      deliveredAt: "2026-07-10T08:01:00Z",
      acknowledgedAt: "2026-07-10T08:02:00Z",
      channel: "push",
    },
  ],
  planId: "plan-gv-a1204-medical-custom",
  planMode: "custom",
  triggeredAt: "2026-07-10T08:00:30Z",
  acknowledgedAt: "2026-07-10T08:01:30Z",
  resolvedAt: "2026-07-10T08:15:00Z",
};

export const MOCK_CANCELLED_EVENT: SosEvent = {
  id: "sos-event-cancelled-002",
  sosType: "fire",
  residenceId: "residence-gv-a1204",
  societyId: "society-green-valley",
  unitId: "unit-gv-a1204",
  flatNumber: "A-1204",
  tower: "A Wing",
  triggeredByUserId: "user-priya",
  triggeredByUserName: "Priya Shirode",
  status: "cancelled",
  isTestMode: false,
  recipientDeliveries: [
    {
      recipientId: "society-security-gate",
      displayName: "Security Gate",
      recipientType: "societyRole",
      deliveryStatus: "delivered",
      deliveredAt: "2026-07-08T19:00:15Z",
      channel: "push",
    },
  ],
  planId: undefined,
  planMode: "default",
  note: "False alarm — cooking smoke triggered concern.",
  triggeredAt: "2026-07-08T19:00:00Z",
  cancelledAt: "2026-07-08T19:02:00Z",
};

export const MOCK_EMERGENCY_PROFILE_A: EmergencyProfile = {
  id: "profile-gv-a1204",
  residenceId: "residence-gv-a1204",
  societyId: "society-green-valley",
  primaryContactName: "Shashank Shirode",
  primaryContactPhone: "+917276834907",
  secondaryContactName: "Priya Shirode",
  secondaryContactPhone: "+919876543211",
  assistanceMembers: [
    {
      id: "assist-mother",
      name: "Sunita Shirode",
      relationship: "Mother",
      assistanceType: "senior",
      age: 68,
      medicalNotes: "Diabetes Type 2, BP medication",
      bloodGroup: "B+",
      preferredHospital: "City Hospital, Pune",
    },
  ],
  accessInstructions: "Spare key with Mrs. Meera Desai, Flat A-1206",
  floorNumber: 12,
  hasBalconyAccess: true,
  hasAlternateExit: true,
  familyDoctorName: "Dr. Amit Patil",
  familyDoctorPhone: "+919812345678",
  preferredHospital: "City Hospital, Pune",
  medicalEquipmentAtHome: "Blood pressure monitor, glucometer",
  pets: [
    {
      petType: "dog",
      name: "Bruno",
      count: 1,
      specialInstructions:
        "Friendly but anxious during loud noises. Keep leash handy.",
    },
  ],
  temporaryInstructions: [],
  createdAt: "2026-02-01T10:00:00Z",
  updatedAt: "2026-06-30T15:00:00Z",
};

export function seedSosMockData(): void {
  sosEmergencyContactMockSource._seedContacts(
    "residence-gv-a1204",
    MOCK_CONTACTS_RESIDENCE_A,
  );
  sosEmergencyContactMockSource._seedContacts(
    "residence-gp-b404",
    MOCK_CONTACTS_RESIDENCE_B,
  );

  sosEmergencyContactMockSource._seedInvitations(MOCK_INVITATIONS);

  sosEventMockSource._seedEvents([MOCK_RESOLVED_EVENT, MOCK_CANCELLED_EVENT]);
}

export function resetAllSosMockData(): void {
  sosConfigurationMockSource._resetAll();
  sosEmergencyContactMockSource._resetAll();
  sosEventMockSource._resetAll();
}
