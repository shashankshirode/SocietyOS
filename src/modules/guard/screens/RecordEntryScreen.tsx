import { useState } from "react";
import { Text, TextInput, View, ScrollView } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { AppHeader } from "../../../shared/components/AppHeader";
import { InfoRow } from "../../../shared/components/InfoRow";
import type { RecordEntryScreenProps } from "../../../app/navigation/navigation.types";
import { useRecordGateEntry } from "../data/useRecordGateEntry";
import { styles } from "../styles/screens/RecordEntryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function RecordEntryScreen({ navigation, route }: RecordEntryScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { pass } = route.params;
    const [note, setNote] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const { submit: recordGateEntry, isSubmitting } = useRecordGateEntry();
    const entryTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    const handleConfirmEntry = async () => {
        const result = await recordGateEntry({
            personName: pass.visitorName,
            entryType: pass.visitorType === 'STAFF' ? 'STAFF' : 'GUEST',
            flatNumber: pass.visitingFlat,
            passId: pass.id,
        });
        if (result.ok) {
            setIsSuccess(true);
        }
        else {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), result.error.message || String(localizedUiText.m_c6daa4e82e60));
        }
    };
    const handleDone = () => {
        navigation.popToTop();
    };
    if (isSuccess) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.successContainer}>
          <Animated.View entering={ZoomIn.duration(400)} style={styles.successIconOuter}>
            <Ionicons name="checkmark-circle" size={80} color={Colors.success}/>
          </Animated.View>
          <Text style={styles.successTitle}>{localizedUiText.m_019b1053513a}</Text>
          <Text style={styles.successSubtitle}>{localizedUiText.m_cf9f5896322a}{pass.visitorName}{" " + localizedUiText.m_940039c3be53 + " "}{pass.visitingFlat}{" " + localizedUiText.m_b1d6b91b67c2 + " "}{entryTime}.
          </Text>

          <AppCard style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{localizedUiText.m_aaa5fe6f863f}</Text>
            <InfoRow label={localizedUiText.m_cf9f5896322a} value={pass.visitorName}/>
            <InfoRow label={localizedUiText.m_9285cedcf26a} value={pass.visitingFlat}/>
            <InfoRow label={localizedUiText.m_280eda6fb8fa} value={pass.residentName}/>
            <InfoRow label={localizedUiText.m_294ef7803b6f} value={entryTime}/>
            {note.trim() ? <InfoRow label={localizedUiText.m_8a7525b1492f} value={note} isLast/> : null}
          </AppCard>

          <AppButton title={localizedUiText.m_6ac30e7d74f4} onPress={handleDone} variant="primary" fullWidth style={styles.doneBtn}/>
        </View>
      </SafeAreaView>);
    }
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_3eeb6fb66ace} showBack onBack={() => navigation.goBack()}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <Animated.View entering={FadeInDown.duration(400)}>
          <AppCard style={styles.card}>
            <Text style={styles.cardSectionTitle}>{localizedUiText.m_61c8e6b56b65}</Text>
            
            <InfoRow label={localizedUiText.m_e319edcedc59} value={pass.visitorName}/>
            <InfoRow label={localizedUiText.m_a97ab90aadfd} value={pass.visitorType}/>
            <InfoRow label={localizedUiText.m_7ebc765e1de9} value={pass.visitingFlat}/>
            <InfoRow label={localizedUiText.m_01541f06cf6b} value="Main Gate"/>
            <InfoRow label={localizedUiText.m_eb30e652fc3e} value={entryTime} isLast/>
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(100).duration(450)}>
          <AppCard style={styles.card}>
            <Text style={styles.cardSectionTitle}>{localizedUiText.m_95cae460fca0}</Text>
            <View style={styles.photoContainer}>
              <Ionicons name="camera-outline" size={32} color={Colors.textMuted}/>
              <Text style={styles.photoText}>{localizedUiText.m_b7ec8a188bbc}</Text>
              <Text style={styles.photoSubtext}>{localizedUiText.m_6c8a943ba185}</Text>
            </View>
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(150).duration(450)}>
          <AppCard style={styles.card}>
            <Text style={styles.cardSectionTitle}>{localizedUiText.m_35987140be09}</Text>
            <TextInput value={note} onChangeText={setNote} placeholder={localizedUiText.m_6a9a60235204} placeholderTextColor={Colors.textMuted} multiline numberOfLines={3} style={styles.notesInput}/>
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(200).duration(450)}>
          <AppButton title={isSubmitting ? localizedUiText.m_41e06c5a0460 : localizedUiText.m_5c33df08efeb} onPress={handleConfirmEntry} variant="primary" fullWidth disabled={isSubmitting} style={styles.confirmBtn}/>
        </Animated.View>

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </SafeAreaView>);
}
