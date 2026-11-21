import { useState } from "react";
import { View } from "react-native";
import { authMessages } from "../messages/auth.messages";
import { PhoneIdentityField } from "../components/PhoneIdentityField";
import { CountrySelectionSheet } from "../components/CountrySelectionSheet";
import { SecureAccessButton } from "../components/SecureAccessButton";
import { AuthenticationTrustFooter } from "../components/AuthenticationTrustFooter";
import { AuthenticationSurface } from "../components/AuthenticationSurface";
import { AuthenticationErrorBanner } from "../components/AuthenticationErrorBanner";
import type { SupportedCountry } from "../data/membership.types";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/LoginScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface LoginScreenProps {
    country: SupportedCountry;
    setCountry: (country: SupportedCountry) => void;
    phoneNumber: string;
    setPhoneNumber: (number: string) => void;
    isSubmitting: boolean;
    error?: string;
    onSubmit: () => void;
}
export function LoginScreen({ country, setCountry, phoneNumber, setPhoneNumber, isSubmitting, error, onSubmit, }: LoginScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [sheetVisible, setSheetVisible] = useState(false);
    const isFormValid = phoneNumber.length >= country.phoneNumberMinLength &&
        phoneNumber.length <= country.phoneNumberMaxLength;
    return (<View style={styles.container}>
      
      <AuthenticationErrorBanner visible={!!error} message={error || ''}/>

      <AuthenticationSurface eyebrow={authMessages.welcomeEyebrow} title={authMessages.welcomeTitle} description={authMessages.welcomeSubtitle} footer={<AuthenticationTrustFooter />} accessibilityLabel={localizedUiText.m_f5aee833bd59}>
        
        <View style={styles.fieldWrapper}>
          <PhoneIdentityField country={country} value={phoneNumber} onChangeText={setPhoneNumber} onCountryPress={() => setSheetVisible(true)} {...includeWhenPresent("error", error)} editable={!isSubmitting}/>
        </View>

        
        <SecureAccessButton title={authMessages.continueButton} onPress={onSubmit} loading={isSubmitting} disabled={!isFormValid || isSubmitting}/>
      </AuthenticationSurface>

      <CountrySelectionSheet visible={sheetVisible} selectedCountry={country} onSelect={setCountry} onDismiss={() => setSheetVisible(false)}/>
    </View>);
}

