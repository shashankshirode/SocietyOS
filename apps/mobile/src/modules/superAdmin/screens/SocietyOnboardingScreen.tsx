import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { useCreateOnboardingDraft } from "../hooks/useCreateOnboardingDraft";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/SocietyOnboardingScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SocietyOnboarding'>;
export function SocietyOnboardingScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { submit, isSubmitting } = useCreateOnboardingDraft();
    const [societyName, setSocietyName] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [approximateUnitCount, setApproximateUnitCount] = useState('');
    const [primaryContactName, setPrimaryContactName] = useState('');
    const [primaryContactMobile, setPrimaryContactMobile] = useState('');
    const [initialAdminEmail, setInitialAdminEmail] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const handleOnboard = async () => {
        const nextErrors: Record<string, string> = {};
        if (!societyName.trim())
            nextErrors.societyName = getActiveUiLiteral("m_88ba7bbded5f");
        if (!city.trim())
            nextErrors.city = getActiveUiLiteral("m_077b293e578d");
        if (!state.trim())
            nextErrors.state = getActiveUiLiteral("m_d15125122df6");
        if (!approximateUnitCount.trim())
            nextErrors.approximateUnitCount = getActiveUiLiteral("m_a1ebd51b027e");
        if (!primaryContactName.trim())
            nextErrors.primaryContactName = getActiveUiLiteral("m_e9b86a62317e");
        if (!primaryContactMobile.trim() || primaryContactMobile.length !== 10) {
            nextErrors.primaryContactMobile = getActiveUiLiteral("m_dbd208a6f663");
        }
        if (!initialAdminEmail.trim() || !initialAdminEmail.includes('@')) {
            nextErrors.initialAdminEmail = getActiveUiLiteral("m_ae9fdf4f1f95");
        }
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }
        setErrors({});
        const res = await submit({
            societyName,
            societyType: 'GATED_APARTMENT',
            city,
            state,
            numberOfTowersWings: 4,
            approximateUnitCount: parseInt(approximateUnitCount, 10),
            primaryContactName,
            primaryContactMobile,
            primaryContactEmail: initialAdminEmail,
            initialAdminEmail,
            launchMode: 'FREE_LAUNCH',
            defaultLanguage: 'en',
            enabledModuleTemplate: 'GATED_APARTMENT'
        });
        if (res.ok && res.data) {
            navigation.navigate('SocietyOnboardingReview', { draftId: res.data.id });
        }
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_3362c251f881} subtitle={localizedUiText.m_9f88513588ed}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          <FormField label={localizedUiText.m_ab1a0aa91701} value={societyName} onChangeText={setSocietyName} {...includeWhenPresent("error", errors.societyName)} placeholder={localizedUiText.m_351186298fc9}/>
          <FormField label={localizedUiText.m_fc33f73246f4} value={city} onChangeText={setCity} {...includeWhenPresent("error", errors.city)} placeholder={localizedUiText.m_22021f209024}/>
          <FormField label={localizedUiText.m_a3b50c476732} value={state} onChangeText={setState} {...includeWhenPresent("error", errors.state)} placeholder={localizedUiText.m_85c361081aab}/>
          <FormField label={localizedUiText.m_0094c0767ba7} value={approximateUnitCount} onChangeText={setApproximateUnitCount} keyboardType="numeric" {...includeWhenPresent("error", errors.approximateUnitCount)} placeholder={localizedUiText.m_6a640ab49227}/>
          <FormField label={localizedUiText.m_087361815c0a} value={primaryContactName} onChangeText={setPrimaryContactName} {...includeWhenPresent("error", errors.primaryContactName)} placeholder={localizedUiText.m_f3bd69ffa0eb}/>
          <FormField label={localizedUiText.m_8126489668eb} value={primaryContactMobile} onChangeText={setPrimaryContactMobile} keyboardType="phone-pad" {...includeWhenPresent("error", errors.primaryContactMobile)} placeholder={localizedUiText.m_77290962379c}/>
          <FormField label={localizedUiText.m_ed28b3fd5e49} value={initialAdminEmail} onChangeText={setInitialAdminEmail} keyboardType="email-address" {...includeWhenPresent("error", errors.initialAdminEmail)} placeholder={localizedUiText.m_0fa80a900c83}/>

          <View style={styles.btnBox}>
            <AppButton title={localizedUiText.m_1282d9db3fce} onPress={handleOnboard} loading={isSubmitting}/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

