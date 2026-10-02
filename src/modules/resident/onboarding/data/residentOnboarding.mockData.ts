import type {
  OnboardingSociety,
  OnboardingUnit,
  OnboardingDocument,
  ResidentOnboardingDraft,
} from './residentOnboarding.types';

export const MOCK_SOCIETIES: OnboardingSociety[] = [
  {
    id: 'society-gv',
    name: 'Green Valley Heights',
    city: 'Nashik',
    state: 'Maharashtra',
    category: 'Residential Community',
    totalUnits: 240,
    isVerified: true,
  },
  {
    id: 'society-gw',
    name: 'Greenwood Heights',
    city: 'Pune',
    state: 'Maharashtra',
    category: 'Residential Community',
    totalUnits: 180,
    isVerified: true,
  },
  {
    id: 'society-sky',
    name: 'Skyline Towers',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'Residential Community',
    totalUnits: 320,
    isVerified: true,
  },
];

export const MOCK_UNITS_GREEN_VALLEY: OnboardingUnit[] = [
  { id: 'u-a1201', societyId: 'society-gv', unitNumber: 'A-1201', tower: 'Tower A', wing: 'East Wing', floor: 12 },
  { id: 'u-a1202', societyId: 'society-gv', unitNumber: 'A-1202', tower: 'Tower A', wing: 'East Wing', floor: 12 },
  { id: 'u-a1203', societyId: 'society-gv', unitNumber: 'A-1203', tower: 'Tower A', wing: 'East Wing', floor: 12 },
  { id: 'u-a1204', societyId: 'society-gv', unitNumber: 'A-1204', tower: 'Tower A', wing: 'East Wing', floor: 12 },
  { id: 'u-a1205', societyId: 'society-gv', unitNumber: 'A-1205', tower: 'Tower A', wing: 'East Wing', floor: 12 },
  { id: 'u-b401', societyId: 'society-gv', unitNumber: 'B-401', tower: 'Tower B', wing: 'West Wing', floor: 4 },
  { id: 'u-b402', societyId: 'society-gv', unitNumber: 'B-402', tower: 'Tower B', wing: 'West Wing', floor: 4 },
];

export const DEFAULT_DOCUMENTS: OnboardingDocument[] = [
  {
    id: 'doc-id-proof',
    type: 'identity_proof',
    label: 'Identity proof',
    description: 'Government issued photo ID (Aadhaar / PAN / Passport)',
    isRequired: true,
    acceptedFormats: ['PDF', 'JPG', 'PNG'],
    maxSizeMB: 5,
    status: 'NOT_UPLOADED',
  },
  {
    id: 'doc-address-proof',
    type: 'address_proof',
    label: 'Address / residence proof',
    description: 'Recent electricity bill, bank statement, or registered deed',
    isRequired: true,
    acceptedFormats: ['PDF', 'JPG', 'PNG'],
    maxSizeMB: 5,
    status: 'NOT_UPLOADED',
  },
  {
    id: 'doc-rental-agreement',
    type: 'rental_agreement',
    label: 'Rental agreement',
    description: 'Registered leave & license agreement signed with owner',
    isRequired: false, // will be true for tenant
    acceptedFormats: ['PDF'],
    maxSizeMB: 10,
    status: 'NOT_UPLOADED',
  },
];

export const INITIAL_ONBOARDING_DRAFT: ResidentOnboardingDraft = {
  step: 'VERIFY_MOBILE',
  mobileNumber: '9820011234',
  maskedMobile: '+91 ••••• ••1234',
  isMobileVerified: false,
  selectedSociety: null,
  selectedUnit: null,
  residentRole: null,
  profile: {
    fullName: '',
    preferredName: '',
    email: '',
  },
  documents: DEFAULT_DOCUMENTS,
  verificationOutcome: 'APPROVED',
  notificationPermissionGranted: false,
  progressPercent: 10,
  lastSavedAt: new Date().toISOString(),
};

export const MOCK_DUPLICATE_ACCOUNTS = [
  {
    mobileNumber: '9876543210',
    maskedMobile: '+91 ••••• ••3210',
    existingName: 'Rahul Sharma',
    existingSociety: 'Green Valley Heights',
    existingUnit: 'B-302',
  },
];
