import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../../app/navigation/navigation.types';
import { FamilyMemberForm } from '../components/FamilyMemberForm';
import type { AddFamilyMemberInput, FamilyMember } from '../data/residentHousehold.types';
import { useFamilyMemberForm } from '../hooks/useFamilyMemberForm';
import { useFamilyMembers } from '../hooks/useFamilyMembers';
import { FieldErrorSummary, HouseholdEmptyState, HouseholdScreenLayout, PrimaryAction, useHouseholdMessages } from './HouseholdScreenLayout';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
type Props = NativeStackScreenProps<HomeStackParamList, 'EditFamilyMember'>;
function toInput(member: FamilyMember): AddFamilyMemberInput {
    return {
        fullName: member.fullName,
        dateOfBirth: member.dateOfBirth,
        gender: member.gender,
        relationToOwner: member.relationToOwner,
        phoneNumber: member.phoneNumber,
        ...includeWhenPresent("emailAddress", member.emailAddress),
        ...includeWhenPresent("photoMockUri", member.photoMockUri),
        isEmergencyContact: member.isEmergencyContact,
        isSeniorCitizen: member.isSeniorCitizen,
        isMinor: member.isMinor,
        ...includeWhenPresent("bloodGroup", member.bloodGroup),
        ...includeWhenPresent("medicalNotes", member.medicalNotes),
        visitorApprovalPermission: member.permissions.visitorApprovalPermission,
        noticeViewPermission: member.permissions.noticeViewPermission,
        emergencyAccessPermission: member.permissions.emergencyAccessPermission,
        facilityBookingPermission: member.permissions.facilityBookingPermission,
        documentAccessPermission: member.permissions.documentAccessPermission,
        profileVisibility: member.permissions.profileVisibility,
        accessStatus: member.accessStatus
    };
}
export function EditFamilyMemberScreen({ navigation, route }: Props) {
    const familyMembers = useFamilyMembers();
    const member = familyMembers.data.find((item) => item.id === route.params.familyMemberId);
    const initialInput = React.useMemo(() => (member ? toInput(member) : undefined), [member]);
    const form = useFamilyMemberForm(familyMembers.data, initialInput);
    const { messages, text } = useHouseholdMessages();
    if (!member && !familyMembers.isLoading) {
        return (<HouseholdScreenLayout titleKey="resident.navigation.editFamilyMember.title" subtitleKey="resident.navigation.editFamilyMember.subtitle">
        <HouseholdEmptyState titleKey="resident.family.emptyTitle" descriptionKey="resident.household.errors.familyMemberMissing"/>
      </HouseholdScreenLayout>);
    }
    const fieldError = (field: keyof typeof form.input) => {
        const error = form.validation.fieldErrors.find((item) => item.field === field);
        return error ? text(error.messageKey) : undefined;
    };
    const handleSave = async () => {
        const result = form.validate();
        if (!result.isValid || !member) {
            return;
        }
        await familyMembers.updateFamilyMember(member.id, form.input);
        navigation.replace('FamilyMemberDetail', { familyMemberId: member.id });
    };
    return (<HouseholdScreenLayout titleKey="resident.navigation.editFamilyMember.title" subtitleKey="resident.navigation.editFamilyMember.subtitle">
      <FieldErrorSummary messageKeys={form.validation.fieldErrors.map((error) => error.messageKey)} messages={messages}/>
      <FamilyMemberForm input={form.input} onChange={form.updateInput} fieldError={fieldError}/>
      <PrimaryAction labelKey="resident.buttons.update" onPress={handleSave} disabled={familyMembers.isMutating}/>
    </HouseholdScreenLayout>);
}
export default EditFamilyMemberScreen;

