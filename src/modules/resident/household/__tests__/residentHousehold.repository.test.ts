import { residentHouseholdRepository } from '../data/residentHousehold.repository';
import { resetResidentHouseholdMockState } from '../data/residentHousehold.mockSource';
import type { AddFamilyMemberInput } from '../data/residentHousehold.types';
import { getRequiredItem } from '../../../../shared/utils/requiredItem';

const familyInput: AddFamilyMemberInput = {
  fullName: 'Priya Deshmukh',
  dateOfBirth: '1991-03-10',
  gender: 'FEMALE',
  relationToOwner: 'OTHER',
  phoneNumber: '9012345678',
  emailAddress: 'priya@example.com',
  isEmergencyContact: false,
  isSeniorCitizen: false,
  isMinor: false,
  bloodGroup: 'A+',
  medicalNotes: '',
  visitorApprovalPermission: true,
  noticeViewPermission: true,
  emergencyAccessPermission: true,
  facilityBookingPermission: true,
  documentAccessPermission: 'NONE',
  profileVisibility: 'HOUSEHOLD_ONLY',
  accessStatus: 'ACTIVE',
};

describe('resident household repository', () => {
  beforeEach(() => {
    resetResidentHouseholdMockState();
  });

  it('adds a family member through mock mutation state', async () => {
    const before = await residentHouseholdRepository.getFamilyMembers();
    const created = await residentHouseholdRepository.addFamilyMember(familyInput);
    const after = await residentHouseholdRepository.getFamilyMembers();

    expect(created.fullName).toBe(familyInput.fullName);
    expect(after).toHaveLength(before.length + 1);
  });

  it('updates family permissions without deleting the member', async () => {
    const member = getRequiredItem(
      await residentHouseholdRepository.getFamilyMembers(),
      0,
      'family members',
    );
    const updated = await residentHouseholdRepository.updateFamilyMemberPermissions(member.id, {
      ...member.permissions,
      visitorApprovalPermission: false,
    });

    expect(updated.permissions.visitorApprovalPermission).toBe(false);
  });

  it('updates tenant document checklist through mock upload', async () => {
    const draft = await residentHouseholdRepository.createTenantOnboardingDraft();
    const updated = await residentHouseholdRepository.uploadTenantDocumentMock(draft.id, {
      documentType: 'RENT_AGREEMENT',
      mockFileName: 'rent-agreement.pdf',
      uploadedBy: 'resident-owner-shashank',
    });

    expect(updated.documents.find((document) => document.documentType === 'RENT_AGREEMENT')?.status).toBe('UPLOADED');
  });
});
