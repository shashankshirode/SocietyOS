import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { AppHeader } from "../../../shared/components/AppHeader";
import { InfoRow } from "../../../shared/components/InfoRow";
import { WarningBanner } from "../../../shared/feedback/WarningBanner";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { useEmergencyAlert, useEmergencyTypes } from "../data/useEmergencyAlert";
import type { EmergencyAlertScreenProps } from "../../../app/navigation/navigation.types";
import type { EmergencySeverity } from "../../../shared/types/gate.types";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/EmergencyAlertScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function EmergencyAlertScreen({ navigation }: EmergencyAlertScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [severity, setSeverity] = useState<EmergencySeverity>('HIGH');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSuccess, setIsSuccess] = useState(false);
    const { data: emergencyTypes, isLoading, error, refetch } = useEmergencyTypes();
    const { submit: submitEmergencyAlert } = useEmergencyAlert();
    const incidentRef = `INC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    const handleSubmit = async () => {
        const nextErrors: Record<string, string> = {};
        if (!selectedType)
            nextErrors.type = getActiveUiLiteral("m_dcb60ad2c68f");
        if (!location.trim())
            nextErrors.location = getActiveUiLiteral("m_c6a77820c25c");
        if ((severity === 'HIGH' || severity === 'CRITICAL') && !notes.trim()) {
            nextErrors.notes = getActiveUiLiteral("m_6dee3302aebf");
        }
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }
        const selectedEmergencyType = selectedType;
        if (!selectedEmergencyType) {
            return;
        }
        setErrors({});
        await submitEmergencyAlert({
            type: selectedEmergencyType,
            location: location.trim(),
            ...includeWhenPresent("description", notes.trim() || undefined)
        });
        setIsSuccess(true);
    };
    const handleDone = () => {
        navigation.popToTop();
    };
    if (isSuccess) {
        const matchedType = (emergencyTypes ?? []).find((t) => t.key === selectedType);
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.successContainer}>
          <Animated.View entering={ZoomIn.duration(400)} style={styles.successIconOuter}>
            <Ionicons name="alert-circle" size={80} color={Colors.danger}/>
          </Animated.View>
          <Text style={styles.successTitle}>{localizedUiText.m_f9aca70dfa1f}</Text>
          <Text style={styles.successSubtitle}>{localizedUiText.m_870572fa54cb}</Text>

          <AppCard style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{localizedUiText.m_61eba9cd2612}</Text>
            <InfoRow label={localizedUiText.m_f1402c7cc900} value={incidentRef} valueBold/>
            <InfoRow label={localizedUiText.m_b4ee38d688d3} value={matchedType?.label || ''}/>
            <InfoRow label={localizedUiText.m_f513aabb43b8} value={location}/>
            <InfoRow label={localizedUiText.m_4475d8fd890f} value={severity} valueColor={Colors.danger}/>
            <InfoRow label={localizedUiText.m_aa409e9b8fbe} value={timestamp}/>
            <InfoRow label={localizedUiText.m_2c917dbdac22} value="Supervisor, Committee, Medical Desk" isLast/>
          </AppCard>

          <AppButton title={localizedUiText.m_6ac30e7d74f4} onPress={handleDone} variant="primary" fullWidth style={styles.doneBtn}/>
        </View>
      </SafeAreaView>);
    }
    if (isLoading) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_f6bbc91fab3a} showBack onBack={() => navigation.goBack()}/>
        <LoadingState message={localizedUiText.m_751307b3e353} showCardPlaceholder/>
      </SafeAreaView>);
    }
    if (error) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_f6bbc91fab3a} showBack onBack={() => navigation.goBack()}/>
        <ErrorState message={error.message} onRetry={refetch}/>
      </SafeAreaView>);
    }
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_f6bbc91fab3a} showBack onBack={() => navigation.goBack()}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <Animated.View entering={FadeInUp.duration(400)}>
          <WarningBanner message={localizedUiText.m_33d198902a96} type="danger" style={styles.bannerMargin}/>
        </Animated.View>

        
        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_9c8359464239}</Text>
          {errors.type ? <Text style={styles.errorText}>{errors.type}</Text> : null}
          <View style={styles.grid}>
            {(emergencyTypes ?? []).map((item) => {
            const active = selectedType === item.key;
            return (<Pressable key={item.key} style={[styles.gridBtn, active && styles.gridBtnActive]} onPress={() => {
                    setSelectedType(item.key);
                    if (errors.type)
                        setErrors({ ...errors, type: '' });
                }}>
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={24} color={active ? Colors.surface : Colors.danger}/>
                  <Text style={[styles.gridText, active && styles.gridTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>);
        })}
          </View>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(150).duration(450)} style={styles.formSection}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_44b576ee78fe}</Text>
          <View style={styles.severityRow}>
            {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as EmergencySeverity[]).map((level) => {
            const active = severity === level;
            return (<Pressable key={level} style={[
                    styles.severityBtn,
                    active ? (level === 'CRITICAL' || level === 'HIGH' ? styles.sevDanger : styles.sevWarn) : styles.pressable,
                ]} onPress={() => setSeverity(level)}>
                  <Text style={[styles.severityBtnText, active && styles.severityBtnTextActive]}>
                    {level}
                  </Text>
                </Pressable>);
        })}
          </View>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(200).duration(450)}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_c6f5bee988fc}</Text>
          
          <AppCard style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_0608ffe743da}</Text>
              <TextInput value={location} onChangeText={(text) => {
            setLocation(text);
            if (errors.location)
                setErrors({ ...errors, location: '' });
        }} placeholder={localizedUiText.m_d6c8c001b9f2} style={[styles.textInput, errors.location ? styles.inputError : styles.textInput2]}/>
              {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_59fa7d7a14d3}</Text>
              <TextInput value={notes} onChangeText={(text) => {
            setNotes(text);
            if (errors.notes)
                setErrors({ ...errors, notes: '' });
        }} placeholder={localizedUiText.m_7f03fbfcebb3} multiline numberOfLines={3} style={[styles.notesInput, errors.notes ? styles.inputError : styles.textInput3]}/>
              {errors.notes ? <Text style={styles.errorText}>{errors.notes}</Text> : null}
            </View>
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(250).duration(450)}>
          <AppButton title={localizedUiText.m_f9f9becd77aa} onPress={handleSubmit} variant="primary" fullWidth style={styles.submitBtn}/>
        </Animated.View>

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </SafeAreaView>);
}

