import { useState } from "react";
import { ScrollView, Text, View, TextInput, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { useAnprVehicleMatchReview } from "../hooks/useAnprVehicleMatchReview";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HardwareIntegrationStackParamList } from "../../../app/navigation/navigation.types";
import type { AnprReviewDecision } from "../../../shared/types/gateHardware.types";
import { styles } from "../styles/screens/AnprVehicleMatchReviewScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function AnprVehicleMatchReviewScreen({ route, navigation }: NativeStackScreenProps<HardwareIntegrationStackParamList, 'AnprVehicleMatchReview'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { eventId } = route.params;
    const { submit: reviewMatch, isSubmitting } = useAnprVehicleMatchReview(eventId);
    const [decision,] = useState<AnprReviewDecision>('MATCH_TO_VEHICLE');
    const [notes, setNotes] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const handleReview = async () => {
        if (!notes || !confirmed) {
            AppAlert.alert(String(localizedUiText.m_142762b3bdf8), String(localizedUiText.m_1f1f6f4b7833));
            return;
        }
        const res = await reviewMatch({ reviewerDecision: decision, notes });
        if (res.ok) {
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_cebe0fca4865), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.goBack() }
            ]);
        }
        else {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), res.error?.message || String(localizedUiText.m_13ddd866499a));
        }
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_d163d8ef8b0c}</Text>
          <View style={styles.viewWidth}/>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <HardwareWarningBanner />

          <View style={styles.form}>
            <Text style={styles.label}>{localizedUiText.m_3045abafb173}</Text>
            <Text style={styles.value}>{eventId}</Text>

            <Text style={styles.label}>{localizedUiText.m_4ac3983e2041}</Text>
            <TextInput style={styles.input} value={decision} editable={false} placeholder={localizedUiText.m_85ebe3cb072f}/>

            <Text style={styles.label}>{localizedUiText.m_f1d25d8315fc}</Text>
            <TextInput style={[styles.input, styles.textArea]} value={notes} onChangeText={setNotes} placeholder={localizedUiText.m_75b98c8e5fcb} multiline numberOfLines={3}/>

            <Pressable style={styles.checkboxRow} onPress={() => setConfirmed(!confirmed)}>
              <Ionicons name={confirmed ? "checkbox" : "square-outline"} size={24} color={Colors.primary}/>
              <Text style={styles.checkboxLabel}>{localizedUiText.m_af339afc326c}</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={handleReview} disabled={isSubmitting}>
              <Text style={styles.buttonText}>{isSubmitting ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_f6cc12201a36}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

