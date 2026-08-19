import { View } from "react-native";
import { AppDateField } from "../../../../ui/forms/AppDateField";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../components/householdComponentUtils";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle } from "../styles/components/FamilyDateOfBirthField.styles";
export interface FamilyDateOfBirthFieldProps {
    value?: string;
    onChange: (dob: string, isMinor: boolean, isSenior: boolean) => void;
    error?: string;
}
export function FamilyDateOfBirthField({ value, onChange, error, }: FamilyDateOfBirthFieldProps) {
    const messages = useMessages();
    const { colors } = useAppTheme();
    const handleDobChange = (dobString: string) => {
        const birthDate = new Date(dobString);
        const currentDate = new Date();
        if (birthDate > currentDate) {
            onChange(dobString, false, false);
            return;
        }
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const m = currentDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }
        const isMinor = age < 18;
        const isSenior = age >= 60;
        onChange(dobString, isMinor, isSenior);
    };
    const getAgeLabel = () => {
        if (!value)
            return null;
        const birthDate = new Date(value);
        const currentDate = new Date();
        if (birthDate > currentDate) {
            return null;
        }
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const m = currentDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }
        let category = t(messages, 'resident.family.datePicker.adult');
        if (age < 18)
            category = t(messages, 'resident.family.datePicker.minor');
        else if (age >= 60)
            category = t(messages, 'resident.family.datePicker.seniorCitizen');
        return t(messages, 'resident.family.agePreview', age, category);
    };
    return (<View style={styles.container}>
      <AppDateField label={t(messages, 'resident.family.fields.dateOfBirth')} {...includeWhenPresent("value", value)} onChange={handleDobChange} {...includeWhenPresent("error", error)} required/>
      {value && getAgeLabel() && !error && (<SafeText variant="tiny" style={[styles.preview, createSafeTextColorStyle(colors.textSecondary)]}>
          {getAgeLabel()}
        </SafeText>)}
    </View>);
}
export default FamilyDateOfBirthField;

