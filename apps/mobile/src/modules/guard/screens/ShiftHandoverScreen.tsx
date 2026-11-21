import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
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
import { useShiftSummary } from "../data/useShiftSummary";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList, ShiftHandoverScreenProps } from "../../../app/navigation/navigation.types";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/ShiftHandoverScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function ShiftHandoverScreen({ navigation }: ShiftHandoverScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [nextGuard, setNextGuard] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSuccess, setIsSuccess] = useState(false);
    const { data: shiftSummary, isLoading, error, refetch } = useShiftSummary();
    const hasIssues = (shiftSummary?.openIssues ?? 0) > 0 || (shiftSummary?.pendingOfflineSync ?? 0) > 0;
    const handleSubmit = () => {
        const nextErrors: Record<string, string> = {};
        if (!nextGuard.trim())
            nextErrors.nextGuard = getActiveUiLiteral("m_1505c84251d7");
        if (hasIssues && !notes.trim()) {
            nextErrors.notes = getActiveUiLiteral("m_427972446c8d");
        }
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }
        setErrors({});
        setIsSuccess(true);
    };
    const handleDone = () => {
        navigation
            .getParent<NativeStackNavigationProp<RootStackParamList>>()
            ?.navigate('AppModeSelector');
    };
    if (isSuccess) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.successContainer}>
          <Animated.View entering={ZoomIn.duration(400)} style={styles.successIconOuter}>
            <Ionicons name="checkbox" size={80} color={Colors.success}/>
          </Animated.View>
          <Text style={styles.successTitle}>{localizedUiText.m_7aa8757c0204}</Text>
          <Text style={styles.successSubtitle}>{localizedUiText.m_ce402651a5e8}{nextGuard}{localizedUiText.m_3147abc2936f}</Text>

          <AppButton title={localizedUiText.m_94e49e4903c3} onPress={handleDone} variant="primary" fullWidth style={styles.doneBtn}/>
        </View>
      </SafeAreaView>);
    }
    if (isLoading) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_da21785e3d38} showBack onBack={() => navigation.goBack()}/>
        <LoadingState message={localizedUiText.m_d68ad9795ff2} showCardPlaceholder/>
      </SafeAreaView>);
    }
    if (error) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_da21785e3d38} showBack onBack={() => navigation.goBack()}/>
        <ErrorState message={error.message} onRetry={refetch}/>
      </SafeAreaView>);
    }
    if (!shiftSummary) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_da21785e3d38} showBack onBack={() => navigation.goBack()}/>
        <ErrorState message={localizedUiText.m_9f3e697de17a} onRetry={refetch}/>
      </SafeAreaView>);
    }
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_da21785e3d38} showBack onBack={() => navigation.goBack()}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        {hasIssues && (<Animated.View entering={FadeInUp.duration(400)}>
            <WarningBanner message={localizedUiText.m_dd9dafe5b9c8} type="warning" style={styles.bannerMargin}/>
          </Animated.View>)}

        
        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <AppCard style={styles.card}>
            <Text style={styles.sectionTitle}>{localizedUiText.m_78b49f009a93}</Text>
            <InfoRow label={localizedUiText.m_b3948dbd2814} value={shiftSummary.shiftTime}/>
            <InfoRow label={localizedUiText.m_e1af1f1b3fc6} value={String(shiftSummary.totalVisitorEntries)}/>
            <InfoRow label={localizedUiText.m_38a0b5ca31af} value={String(shiftSummary.deliveries)}/>
            <InfoRow label={localizedUiText.m_072cf8b563c5} value={String(shiftSummary.cabs)}/>
            <InfoRow label={localizedUiText.m_b79f645cf67c} value={String(shiftSummary.vendors)}/>
            <InfoRow label={localizedUiText.m_6c22682ae55f} value={String(shiftSummary.staffCheckIns)}/>
            <InfoRow label={localizedUiText.m_f22532a1ab93} value={String(shiftSummary.rejectedEntries)}/>
            <InfoRow label={localizedUiText.m_9c09c35b2aff} value={String(shiftSummary.emergencyIncidents)}/>
            <InfoRow label={localizedUiText.m_d508ffd63bc7} value={String(shiftSummary.pendingOfflineSync)} {...includeWhenPresent("valueColor", shiftSummary.pendingOfflineSync > 0 ? Colors.danger : undefined)}/>
            <InfoRow label={localizedUiText.m_9a346ba6d312} value={String(shiftSummary.openIssues)} valueBold {...includeWhenPresent("valueColor", shiftSummary.openIssues > 0 ? Colors.warning : undefined)} isLast/>
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(150).duration(450)}>
          <AppCard style={styles.card}>
            <Text style={styles.sectionTitle}>{localizedUiText.m_0bf0dfb4120a}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_a9f7f34b61e9}</Text>
              <TextInput value={nextGuard} onChangeText={(text) => {
            setNextGuard(text);
            if (errors.nextGuard)
                setErrors({ ...errors, nextGuard: '' });
        }} placeholder={localizedUiText.m_5bca93245f79} style={[styles.textInput, errors.nextGuard ? styles.inputError : styles.textInput2]}/>
              {errors.nextGuard ? <Text style={styles.errorText}>{errors.nextGuard}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_2d837c038b28}{hasIssues ? '*' : localizedUiText.m_ab052003b0d0}
              </Text>
              <TextInput value={notes} onChangeText={(text) => {
            setNotes(text);
            if (errors.notes)
                setErrors({ ...errors, notes: '' });
        }} placeholder={localizedUiText.m_f605ad157c64} multiline numberOfLines={3} style={[styles.notesInput, errors.notes ? styles.inputError : styles.textInput3]}/>
              {errors.notes ? <Text style={styles.errorText}>{errors.notes}</Text> : null}
            </View>
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(200).duration(450)}>
          <AppButton title={localizedUiText.m_8b789da92437} onPress={handleSubmit} variant="primary" fullWidth style={styles.submitBtn}/>
        </Animated.View>

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </SafeAreaView>);
}

