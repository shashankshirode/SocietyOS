import { View } from "react-native";
import { AppButton } from "../../../../shared/components/AppButton";
import { FormField } from "../../../../shared/forms/FormField";
import { AuthenticationSurface } from "../components/AuthenticationSurface";
import { AuthenticationErrorBanner } from "../components/AuthenticationErrorBanner";
import { authMessages } from "../messages/auth.messages";
import { styles } from "../styles/screens/RegistrationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface RegistrationScreenProps {
    fullName: string;
    setFullName: (text: string) => void;
    isSubmitting: boolean;
    error?: string;
    onSubmit: () => void;
}
export function RegistrationScreen({ fullName, setFullName, isSubmitting, error, onSubmit, }: RegistrationScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={styles.container}>
      <AuthenticationErrorBanner visible={!!error} message={error || ''}/>

      <AuthenticationSurface eyebrow={authMessages.profileEyebrow} title={authMessages.profileTitle} description={authMessages.profileSubtitle} accessibilityLabel={localizedUiText.m_af40c58bb525}>
        <FormField label={authMessages.profileNameLabel} value={fullName} onChangeText={setFullName} placeholder={authMessages.profileNamePlaceholder} editable={!isSubmitting} autoCapitalize="words" required/>

        <AppButton title={authMessages.profileSubmitButton} onPress={onSubmit} loading={isSubmitting} disabled={fullName.trim().length < 2 || isSubmitting} fullWidth/>
      </AuthenticationSurface>
    </View>);
}

