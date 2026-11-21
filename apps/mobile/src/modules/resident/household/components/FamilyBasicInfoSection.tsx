import { View } from "react-native";
import { AppTextField } from "../../../../ui/forms/AppTextField";
import { AppSelectField } from "../../../../ui/forms/AppSelectField";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../components/householdComponentUtils";
import type { FamilyRelation, ResidentGender } from "../data/residentHousehold.types";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
import { styles } from "../styles/components/FamilyBasicInfoSection.styles";
export interface FamilyBasicInfoSectionProps {
    input: {
        fullName: string;
        phoneNumber?: string;
        emailAddress?: string;
        gender: ResidentGender;
        relationToOwner: FamilyRelation;
        isMinor: boolean;
        isSeniorCitizen: boolean;
    };
    updateInput: (changes: Partial<FamilyBasicInfoSectionProps['input']>) => void;
    getFieldErrorMsg: (field: string) => string | Absent;
}
const familyRelations: FamilyRelation[] = [
    'SPOUSE',
    'FATHER',
    'MOTHER',
    'SON',
    'DAUGHTER',
    'BROTHER',
    'SISTER',
    'GRANDFATHER',
    'GRANDMOTHER',
    'OTHER',
];
const genders: ResidentGender[] = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];
export function FamilyBasicInfoSection({ input, updateInput, getFieldErrorMsg, }: FamilyBasicInfoSectionProps) {
    const messages = useMessages();
    return (<View style={styles.container}>
      <AppTextField label={t(messages, 'resident.family.fields.fullName')} value={input.fullName} onChangeText={(fullName) => updateInput({ fullName })} placeholder={t(messages, 'resident.family.placeholders.fullName')} {...includeWhenPresent("error", getFieldErrorMsg('fullName'))} required/>

      <AppSelectField<FamilyRelation> label={t(messages, 'resident.family.fields.relationToOwner')} value={input.relationToOwner} options={familyRelations.map((relation) => ({
            label: t(messages, `resident.family.relations.${relation}`),
            value: relation
        }))} onChange={(relationToOwner) => updateInput({ relationToOwner })} {...includeWhenPresent("error", getFieldErrorMsg('relationToOwner'))} required/>

      <AppSelectField<ResidentGender> label={t(messages, 'resident.family.fields.gender')} value={input.gender} options={genders.map((gender) => ({
            label: t(messages, `resident.family.gender.${gender}`),
            value: gender
        }))} onChange={(gender) => updateInput({ gender })} required/>



      <AppTextField label={t(messages, 'resident.family.fields.phoneNumber')} {...includeWhenPresent("value", input.phoneNumber)} onChangeText={(phoneNumber) => updateInput({ phoneNumber })} placeholder={t(messages, 'resident.family.placeholders.phoneNumber')} {...includeWhenPresent("error", getFieldErrorMsg('phoneNumber'))} keyboardType="phone-pad"/>

      <AppTextField label={t(messages, 'resident.family.fields.emailAddress')} value={input.emailAddress ?? ''} onChangeText={(emailAddress) => updateInput({ emailAddress })} placeholder={t(messages, 'resident.family.placeholders.emailAddress')} {...includeWhenPresent("error", getFieldErrorMsg('emailAddress'))} keyboardType="email-address" autoCapitalize="none"/>
    </View>);
}
export default FamilyBasicInfoSection;

