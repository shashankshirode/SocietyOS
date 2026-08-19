import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { CctvPrivacyNotice } from "../components/CctvPrivacyNotice";
import { useCctvAccessPlaceholder } from "../hooks/useCctvAccessPlaceholder";
import { styles } from "../styles/screens/CctvAccessPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function CctvAccessPlaceholderScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { requestAccess, isRequesting } = useCctvAccessPlaceholder();
    const [reason, setReason] = useState('');
    const [duration, setDuration] = useState('30');
    const handleRequest = async () => {
        if (!reason) {
            AppAlert.alert(String(localizedUiText.m_142762b3bdf8), String(localizedUiText.m_14eef0f5e77b));
            return;
        }
        const res = await requestAccess({ cameraId: 'dev-016', reason, durationMinutes: parseInt(duration, 10) });
        if (res.ok) {
            AppAlert.alert(String(localizedUiText.m_b86344e8b4d6), String(localizedUiText.m_80d3c9d9e9c4));
            setReason('');
        }
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_bac7f2dc4b0e}</Text>
          <Pressable onPress={() => navigation.navigate('CctvCameraRegistry')} style={styles.addButton}>
            <Ionicons name="list" size={24} color={Colors.primary}/>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <CctvPrivacyNotice />

          <View style={styles.form}>
            <Text style={styles.label}>{localizedUiText.m_c910af040ee4}</Text>
            <Text style={styles.desc}>{localizedUiText.m_5b46fd7a66d9}</Text>

            <Text style={styles.fieldLabel}>{localizedUiText.m_58d870f0bdf5}</Text>
            <TextInput style={[styles.input, styles.textArea]} value={reason} onChangeText={setReason} placeholder={localizedUiText.m_9dc590d030f0} multiline numberOfLines={3}/>

            <Text style={styles.fieldLabel}>{localizedUiText.m_9bef6b258e7e}</Text>
            <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType="number-pad"/>

            <Pressable style={styles.button} onPress={handleRequest} disabled={isRequesting}>
              <Text style={styles.buttonText}>{isRequesting ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_26d8e72d5342}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

