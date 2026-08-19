import { View } from "react-native";
import { FormField } from "../../../../shared/forms/FormField";
import { AppSelect } from "../../../../shared/forms/AppSelect";
import { AppCheckbox } from "../../../../shared/forms/AppCheckbox";
import type { AddFamilyMemberInput, BloodGroup, FamilyRelation, ResidentGender } from "../data/residentHousehold.types";
import { FamilyAccessPermissionPanel } from "./FamilyAccessPermissionPanel";
import { EmergencyContactToggle } from "./EmergencyContactToggle";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "./householdComponentUtils";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
import { styles } from "../styles/components/FamilyMemberForm.styles";
type FamilyMemberFormProps = {
    input: AddFamilyMemberInput;
    onChange: (patch: Partial<AddFamilyMemberInput>) => void;
    fieldError: (field: keyof AddFamilyMemberInput) => string | Absent;
};
const familyRelations: FamilyRelation[] = ['SPOUSE', 'FATHER', 'MOTHER', 'SON', 'DAUGHTER', 'BROTHER', 'SISTER', 'GRANDFATHER', 'GRANDMOTHER', 'OTHER'];
const genders: ResidentGender[] = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];
const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN'];
export function FamilyMemberForm({ input, onChange, fieldError }: FamilyMemberFormProps) {
    const messages = useMessages();
    return (<View style={styles.form}>
      <FormField label={t(messages, 'resident.family.fields.fullName')} value={input.fullName} onChangeText={(fullName) => onChange({ fullName })} placeholder={t(messages, 'resident.family.placeholders.fullName')} {...includeWhenPresent("error", fieldError('fullName'))} required/>
      <FormField label={t(messages, 'resident.family.fields.dateOfBirth')} value={input.dateOfBirth} onChangeText={(dateOfBirth) => onChange({ dateOfBirth })} placeholder={t(messages, 'resident.family.placeholders.dateOfBirth')} {...includeWhenPresent("error", fieldError('dateOfBirth'))} required/>
      <AppSelect<FamilyRelation> label={t(messages, 'resident.family.fields.relationToOwner')} value={input.relationToOwner} options={familyRelations.map((relation) => ({ label: t(messages, `resident.family.relations.${relation}`), value: relation }))} onChange={(relationToOwner) => onChange({ relationToOwner })} {...includeWhenPresent("error", fieldError('relationToOwner'))} required/>
      <AppSelect<ResidentGender> label={t(messages, 'resident.family.fields.gender')} value={input.gender} options={genders.map((gender) => ({ label: t(messages, `resident.family.gender.${gender}`), value: gender }))} onChange={(gender) => onChange({ gender })} required/>
      <FormField label={t(messages, 'resident.family.fields.phoneNumber')} value={input.phoneNumber} onChangeText={(phoneNumber) => onChange({ phoneNumber })} placeholder={t(messages, 'resident.family.placeholders.phoneNumber')} {...includeWhenPresent("error", fieldError('phoneNumber'))} keyboardType="phone-pad"/>
      <FormField label={t(messages, 'resident.family.fields.emailAddress')} value={input.emailAddress ?? ''} onChangeText={(emailAddress) => onChange({ emailAddress })} placeholder={t(messages, 'resident.family.placeholders.emailAddress')} {...includeWhenPresent("error", fieldError('emailAddress'))} keyboardType="email-address" autoCapitalize="none"/>
      <AppSelect<BloodGroup> label={t(messages, 'resident.family.fields.bloodGroup')} value={input.bloodGroup ?? 'UNKNOWN'} options={bloodGroups.map((bloodGroup) => ({ label: t(messages, `resident.family.bloodGroup.${bloodGroup}`), value: bloodGroup }))} onChange={(bloodGroup) => onChange({ bloodGroup })}/>
      <FormField label={t(messages, 'resident.family.fields.medicalNotes')} value={input.medicalNotes ?? ''} onChangeText={(medicalNotes) => onChange({ medicalNotes })} placeholder={t(messages, 'resident.family.placeholders.medicalNotes')} multiline numberOfLines={3}/>
      <EmergencyContactToggle checked={input.isEmergencyContact} disabled={input.isMinor} onPress={() => onChange({ isEmergencyContact: !input.isEmergencyContact })}/>
      <AppCheckbox checked={input.isMinor} onPress={() => onChange({ isMinor: !input.isMinor })} label={t(messages, 'resident.family.fields.isMinor')}/>
      <AppCheckbox checked={input.isSeniorCitizen} onPress={() => onChange({ isSeniorCitizen: !input.isSeniorCitizen })} label={t(messages, 'resident.family.fields.isSeniorCitizen')}/>
      <FamilyAccessPermissionPanel value={{
            visitorApprovalPermission: input.visitorApprovalPermission,
            noticeViewPermission: input.noticeViewPermission,
            emergencyAccessPermission: input.emergencyAccessPermission,
            facilityBookingPermission: input.facilityBookingPermission,
            documentAccessPermission: input.documentAccessPermission,
            profileVisibility: input.profileVisibility
        }} disabledDocumentAccess={input.isMinor} onChange={(permissions) => onChange({ ...permissions })}/>
    </View>);
}

