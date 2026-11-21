import { useState } from "react";
import { ScrollView, Text, View, Pressable, Switch } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { styles } from "../styles/screens/HardwareSettingsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function HardwareSettingsScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [rfidEnabled, setRfidEnabled] = useState(true);
    const [anprEnabled, setAnprEnabled] = useState(true);
    const [cctvGated, setCctvGated] = useState(true);
    const [syncFrequency,] = useState('Hourly');
    const handleSave = () => {
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_63cb1f4ebdcf));
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_ba2f92154ca6}</Text>
          <View style={styles.viewWidth}/>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <HardwareWarningBanner />

          <View style={styles.form}>
            <View style={styles.settingRow}>
              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>{localizedUiText.m_b3a5cc11372c}</Text>
                <Text style={styles.settingDesc}>{localizedUiText.m_960d73fb5f61}</Text>
              </View>
              <Switch value={rfidEnabled} onValueChange={setRfidEnabled} trackColor={{ true: Colors.primary }}/>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>{localizedUiText.m_f2fb27005905}</Text>
                <Text style={styles.settingDesc}>{localizedUiText.m_12a95fbb47d7}</Text>
              </View>
              <Switch value={anprEnabled} onValueChange={setAnprEnabled} trackColor={{ true: Colors.primary }}/>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>{localizedUiText.m_2f1c3e24f5b1}</Text>
                <Text style={styles.settingDesc}>{localizedUiText.m_109538b03129}</Text>
              </View>
              <Switch value={cctvGated} onValueChange={setCctvGated} trackColor={{ true: Colors.primary }}/>
            </View>

            <Text style={styles.label}>{localizedUiText.m_918a0fbbb708}</Text>
            <Pressable style={styles.selector} onPress={() => AppAlert.alert(String(localizedUiText.m_c160f640bd6a), String(localizedUiText.m_42766c3601ff))}>
              <Text style={styles.selectorText}>{syncFrequency}</Text>
              <Ionicons name="chevron-down" size={20} color={Colors.textMuted}/>
            </Pressable>

            <Pressable style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>{localizedUiText.m_ec92e1dc9bb3}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

