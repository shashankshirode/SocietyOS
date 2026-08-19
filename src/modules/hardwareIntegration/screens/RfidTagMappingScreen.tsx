import { useState } from "react";
import { ScrollView, Text, View, TextInput, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { styles } from "../styles/screens/RfidTagMappingScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function RfidTagMappingScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [tagCode, setTagCode] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [accessZone, setAccessZone] = useState('All Gates');
    const [confirmed, setConfirmed] = useState(false);
    const handleSave = () => {
        if (!tagCode || !vehicleNumber || !unitNumber || !confirmed) {
            AppAlert.alert(String(localizedUiText.m_142762b3bdf8), String(localizedUiText.m_7c41935e443c));
            return;
        }
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_897515a03bbb), [
            { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.goBack() }
        ]);
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_765c62b38bdd}</Text>
          <View style={styles.viewWidth}/>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <HardwareWarningBanner />

          <View style={styles.form}>
            <Text style={styles.label}>{localizedUiText.m_bf796b8a4a2a}</Text>
            <TextInput style={styles.input} value={tagCode} onChangeText={setTagCode} placeholder={localizedUiText.m_c1d1f55ad372}/>

            <Text style={styles.label}>{localizedUiText.m_aa2fdab42c4a}</Text>
            <TextInput style={styles.input} value={vehicleNumber} onChangeText={setVehicleNumber} placeholder={localizedUiText.m_ec4eda8cfc20}/>

            <Text style={styles.label}>{localizedUiText.m_80ecbfd8c296}</Text>
            <TextInput style={styles.input} value={unitNumber} onChangeText={setUnitNumber} placeholder={localizedUiText.m_41e5c8422994}/>

            <Text style={styles.label}>{localizedUiText.m_8e9d9e398eca}</Text>
            <TextInput style={styles.input} value={accessZone} onChangeText={setAccessZone} placeholder={localizedUiText.m_af831c2fcfb0}/>

            <Pressable style={styles.checkboxRow} onPress={() => setConfirmed(!confirmed)}>
              <Ionicons name={confirmed ? "checkbox" : "square-outline"} size={24} color={Colors.primary}/>
              <Text style={styles.checkboxLabel}>{localizedUiText.m_1b782b0e04d6}</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>{localizedUiText.m_7d4535ed309b}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

