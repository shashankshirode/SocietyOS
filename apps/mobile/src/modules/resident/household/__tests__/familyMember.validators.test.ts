import { mockFamilyMembers } from '../data/residentHousehold.mockData';
import type { AddFamilyMemberInput } from '../data/residentHousehold.types';
import { validateFamilyMemberInput } from '../validators/familyMember.validators';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
const validInput: AddFamilyMemberInput = {
    fullName: 'Meera Shirode',
    dateOfBirth: '1992-02-14',
    gender: 'FEMALE',
    relationToOwner: 'SISTER',
    phoneNumber: '9090909090',
    emailAddress: 'meera@example.com',
    isEmergencyContact: false,
    isSeniorCitizen: false,
    isMinor: false,
    bloodGroup: 'B+',
    medicalNotes: '',
    visitorApprovalPermission: true,
    noticeViewPermission: true,
    emergencyAccessPermission: true,
    facilityBookingPermission: true,
    documentAccessPermission: 'NONE',
    profileVisibility: 'HOUSEHOLD_ONLY',
    accessStatus: 'ACTIVE',
};
describe('family member validators', () => {
    it('catches invalid future date of birth', () => {
        const result = validateFamilyMemberInput({ ...validInput, dateOfBirth: '2999-01-01' }, { existingMembers: mockFamilyMembers, phoneRequiredForAdults: true });
        expect(result.isValid).toBe(false);
        expect(result.fieldErrors).toEqual(expect.arrayContaining([
            expect.objectContaining({ field: 'dateOfBirth', messageKey: 'resident.validation.family.dateOfBirthFuture' }),
        ]));
    });
    it('catches duplicate phone numbers within the unit', () => {
        const result = validateFamilyMemberInput({ ...validInput, phoneNumber: getRequiredItem(mockFamilyMembers, 0, "familyMember.validators.test.ts").phoneNumber }, { existingMembers: mockFamilyMembers, phoneRequiredForAdults: true });
        expect(result.isValid).toBe(false);
        expect(result.fieldErrors).toEqual(expect.arrayContaining([
            expect.objectContaining({ field: 'phoneNumber', messageKey: 'resident.validation.family.phoneDuplicate' }),
        ]));
    });
});

