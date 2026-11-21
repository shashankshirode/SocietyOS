import { View } from "react-native";
import { AppSelectField } from "../../../../ui/forms/AppSelectField";
import { AppTextField } from "../../../../ui/forms/AppTextField";
import { AppCheckbox } from "../../../../shared/forms/AppCheckbox";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../components/householdComponentUtils";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { BloodGroup } from "../data/residentHousehold.types";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
import { styles, createSafeTextColorStyle, createViewBorderColorBackgroundColorStyle, createViewBorderColorBackgroundColorStyle2, createViewBorderColorBackgroundColorStyle3 } from "../styles/components/FamilyHealthEmergencySection.styles";
export interface FamilyHealthEmergencySectionProps {
    input: {
        bloodGroup?: BloodGroup;
        medicalNotes?: string;
        isEmergencyContact: boolean;
        isMinor: boolean;
        isSeniorCitizen: boolean;
    };
    updateInput: (changes: Partial<FamilyHealthEmergencySectionProps['input']>) => void;
    getFieldErrorMsg: (field: string) => string | Absent;
}
const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN'];
export function FamilyHealthEmergencySection({ input, updateInput, getFieldErrorMsg, }: FamilyHealthEmergencySectionProps) {
    const localizedUiText = useMessages().uiLiterals;
    const messages = useMessages();
    const { colors } = useAppTheme();
    return (<View style={styles.container}>
      <AppSelectField<BloodGroup> label={t(messages, 'resident.family.fields.bloodGroup')} value={input.bloodGroup ?? 'UNKNOWN'} options={bloodGroups.map((bloodGroup) => ({
            label: t(messages, `resident.family.bloodGroup.${bloodGroup}`),
            value: bloodGroup
        }))} onChange={(bloodGroup) => updateInput({ bloodGroup })}/>

      <AppTextField label={t(messages, 'resident.family.fields.medicalNotes')} value={input.medicalNotes ?? ''} onChangeText={(medicalNotes) => updateInput({ medicalNotes })} placeholder={t(messages, 'resident.family.placeholders.medicalNotes')} {...includeWhenPresent("error", getFieldErrorMsg('medicalNotes'))} multiline numberOfLines={3}/>

      <View style={[styles.optionCard, createViewBorderColorBackgroundColorStyle(colors.border, colors.surface)]}>
        <AppCheckbox checked={input.isEmergencyContact} disabled={input.isMinor} onPress={() => updateInput({ isEmergencyContact: !input.isEmergencyContact })} label={t(messages, 'resident.family.emergencyContact')} testID="emergency-contact-checkbox"/>
        <SafeText variant="tiny" color="secondary" style={styles.optionDescription}>
          {t(messages, 'resident.family.emergencyContactDescription')}
        </SafeText>
        {input.isMinor && (<SafeText variant="tiny" style={createSafeTextColorStyle(colors.danger)}>{localizedUiText.m_9c2c0f2960a5}</SafeText>)}
      </View>

      <View style={[styles.optionCard, createViewBorderColorBackgroundColorStyle2(colors.border, colors.surface)]}>
        <AppCheckbox checked={input.isMinor} disabled={true} label={t(messages, 'resident.family.minorMember')} testID="minor-member-checkbox"/>
        <SafeText variant="tiny" color="secondary" style={styles.optionDescription}>
          {t(messages, 'resident.family.minorMemberAutoDescription')}
        </SafeText>
      </View>

      <View style={[styles.optionCard, createViewBorderColorBackgroundColorStyle3(colors.border, colors.surface)]}>
        <AppCheckbox checked={input.isSeniorCitizen} disabled={true} label={t(messages, 'resident.family.seniorCitizen')} testID="senior-citizen-checkbox"/>
        <SafeText variant="tiny" color="secondary" style={styles.optionDescription}>
          {t(messages, 'resident.family.seniorCitizenAutoDescription')}
        </SafeText>
      </View>
    </View>);
}
export default FamilyHealthEmergencySection;

