import { useState } from "react";
import { ScrollView, Text, View, TextInput, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { useMeterReadingImport } from "../hooks/useMeterReadingImport";
import { styles } from "../styles/screens/MeterReadingImportPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function MeterReadingImportPlaceholderScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { submit: importReadings, isSubmitting } = useMeterReadingImport();
    const [meterType, setMeterType] = useState('ELECTRICITY');
    const [source, setSource] = useState('FILE_IMPORT');
    const [billingMonth, setBillingMonth] = useState('June 2026');
    const [confirmed, setConfirmed] = useState(false);
    const handleImport = async () => {
        if (!meterType || !source || !billingMonth || !confirmed) {
            AppAlert.alert(String(localizedUiText.m_142762b3bdf8), String(localizedUiText.m_7c41935e443c));
            return;
        }
        const res = await importReadings({ meterType, source, billingMonth });
        if (res.ok) {
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_ac8a8155114a), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.goBack() }
            ]);
        }
        else {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), res.error?.message || String(localizedUiText.m_0a26f41abd00));
        }
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_7e04a6c6db5b}</Text>
          <View style={styles.viewWidth}/>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <HardwareWarningBanner />

          <View style={styles.form}>
            <Text style={styles.label}>{localizedUiText.m_6b71470c16af}</Text>
            <TextInput style={styles.input} value={meterType} onChangeText={setMeterType} placeholder={localizedUiText.m_69532d2c294c}/>

            <Text style={styles.label}>{localizedUiText.m_f4c6b84ab3c1}</Text>
            <TextInput style={styles.input} value={source} onChangeText={setSource} placeholder={localizedUiText.m_5cbfe7bdd085}/>

            <Text style={styles.label}>{localizedUiText.m_46ee0e058cf8}</Text>
            <TextInput style={styles.input} value={billingMonth} onChangeText={setBillingMonth} placeholder={localizedUiText.m_4f78cec5fa50}/>

            <Pressable style={styles.checkboxRow} onPress={() => setConfirmed(!confirmed)}>
              <Ionicons name={confirmed ? "checkbox" : "square-outline"} size={24} color={Colors.primary}/>
              <Text style={styles.checkboxLabel}>{localizedUiText.m_76a0ab228201}</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={handleImport} disabled={isSubmitting}>
              <Text style={styles.buttonText}>{isSubmitting ? localizedUiText.m_d6e3ff1af9ac : localizedUiText.m_1c04972de39f}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

