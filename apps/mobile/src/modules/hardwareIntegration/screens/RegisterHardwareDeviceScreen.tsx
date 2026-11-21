import { useState } from "react";
import { ScrollView, Text, View, TextInput, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { useRegisterHardwareDevice } from "../hooks/useRegisterHardwareDevice";
import type { HardwareConnectionType, HardwareDeviceType, HardwareLinkedModule } from "../../../shared/types/hardware.types";
import { styles } from "../styles/screens/RegisterHardwareDeviceScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function RegisterHardwareDeviceScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { submit: registerDevice, isSubmitting } = useRegisterHardwareDevice();
    const [name, setName] = useState('');
    const [type] = useState<HardwareDeviceType>('RFID_READER');
    const [vendor, setVendor] = useState('');
    const [deviceCode, setDeviceCode] = useState('');
    const [location, setLocation] = useState('');
    const [linkedModule] = useState<HardwareLinkedModule>('GATE');
    const [connectionType] = useState<HardwareConnectionType>('API_CONNECTOR');
    const [confirmed, setConfirmed] = useState(false);
    const handleRegister = async () => {
        if (!name || !vendor || !deviceCode || !location || !confirmed) {
            AppAlert.alert(String(localizedUiText.m_142762b3bdf8), String(localizedUiText.m_7c41935e443c));
            return;
        }
        const res = await registerDevice({ name, type, vendor, deviceCode, location, linkedModule, connectionType });
        if (res.ok) {
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_28e1ca58bd75), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.goBack() }
            ]);
        }
        else {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), res.error?.message || String(localizedUiText.m_d40e3b08ef50));
        }
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_171c0cd11a58}</Text>
          <View style={styles.viewWidth}/>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <HardwareWarningBanner />

          <View style={styles.form}>
            <Text style={styles.label}>{localizedUiText.m_d21d48b87613}</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder={localizedUiText.m_997330898203}/>

            <Text style={styles.label}>{localizedUiText.m_675de5d42135}</Text>
            <TextInput style={styles.input} value={type} editable={false} placeholder={localizedUiText.m_1761d7935963}/>

            <Text style={styles.label}>{localizedUiText.m_555fa82915ed}</Text>
            <TextInput style={styles.input} value={vendor} onChangeText={setVendor} placeholder={localizedUiText.m_5d69f5915ffb}/>

            <Text style={styles.label}>{localizedUiText.m_90a859128402}</Text>
            <TextInput style={styles.input} value={deviceCode} onChangeText={setDeviceCode} placeholder={localizedUiText.m_5bd12dbf80b7}/>

            <Text style={styles.label}>{localizedUiText.m_692d4cc7005a}</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder={localizedUiText.m_cf62a209a051}/>

            <Text style={styles.label}>{localizedUiText.m_f9a9437a1a97}</Text>
            <TextInput style={styles.input} value={linkedModule} editable={false} placeholder={localizedUiText.m_dd3bfe5f7da1}/>

            <Text style={styles.label}>{localizedUiText.m_6834afb19545}</Text>
            <TextInput style={styles.input} value={connectionType} editable={false} placeholder={localizedUiText.m_601853136a4f}/>

            <Pressable style={styles.checkboxRow} onPress={() => setConfirmed(!confirmed)}>
              <Ionicons name={confirmed ? "checkbox" : "square-outline"} size={24} color={Colors.primary}/>
              <Text style={styles.checkboxLabel}>{localizedUiText.m_437b716a0e57}</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={handleRegister} disabled={isSubmitting}>
              <Text style={styles.buttonText}>{isSubmitting ? localizedUiText.m_9ef767a32782 : localizedUiText.m_bad34f1d32cf}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

