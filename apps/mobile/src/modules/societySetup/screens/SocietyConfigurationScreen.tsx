import { useState } from "react";
import { ScrollView } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppButton } from "../../../shared/components/AppButton";
import { AppText } from "../../../shared/components/AppText";
import { FormField } from "../../../shared/forms/FormField";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { styles, createSafeAreaViewBackgroundColorStyle } from "../styles/screens/SocietyConfigurationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function SocietyConfigurationScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [societyName, setSocietyName] = useState('Orchid Towers Society');
    const [address, setAddress] = useState('Sector 45, Gurgaon, Haryana');
    const [regNo, setRegNo] = useState('REG-2026-99081');
    const handleSave = () => {
        AppAlert.alert(String(localizedUiText.m_d3c7b8958f3a), String(localizedUiText.m_1cd89dce473b));
        navigation.goBack();
    };
    return (<SafeAreaView style={[styles.container, createSafeAreaViewBackgroundColorStyle(colors.background)]} edges={['top']}>
      <AppHeader title={localizedUiText.m_45483e6c2774} showBack onBack={navigation.goBack}/>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant="h3" style={styles.title}>{localizedUiText.m_3b9b200c8d97}</AppText>
        <FormField label={localizedUiText.m_f8d5e3040e03} value={societyName} onChangeText={setSocietyName}/>
        <FormField label={localizedUiText.m_4aebd6b40ebe} value={address} onChangeText={setAddress}/>
        <FormField label={localizedUiText.m_6904678e77dc} value={regNo} onChangeText={setRegNo}/>

        <AppButton title={localizedUiText.m_ec92e1dc9bb3} onPress={handleSave} style={styles.btn}/>
      </ScrollView>
    </SafeAreaView>);
}

