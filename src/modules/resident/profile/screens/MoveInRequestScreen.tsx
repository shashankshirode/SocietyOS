import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState } from "react";
import { ScrollView, Text, TextInput, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppButton } from "../../../../shared/components/AppButton";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { WarningBanner } from "../../../../shared/feedback/WarningBanner";
import { useCreateMoveInRequest } from "../hooks/useMoveInRequest";
import type { MoveInRequestScreenProps } from "../../../../app/navigation/navigation.types";
import type { MoveInRequest } from "../../../../shared/types/ownerTenant.types";
import { VisualDateTimePicker } from "../../../../ui/patterns/VisualDateTimePicker";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/MoveInRequestScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
export function MoveInRequestScreen({ navigation }: MoveInRequestScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [residentType, setResidentType] = useState<'OWNER' | 'TENANT' | 'FAMILY_MEMBER'>('TENANT');
    const [moveInDate, setMoveInDate] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [vehicleCount, setVehicleCount] = useState('1');
    const [familyCount, setFamilyCount] = useState('2');
    const [liftRequired, setLiftRequired] = useState(true);
    const [truckEntry, setTruckEntry] = useState(true);
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [submittedRequest, setSubmittedRequest] = useState<MoveInRequest | null>(null);
    const { submit: createRequest, isSubmitting } = useCreateMoveInRequest();
    const handleSubmit = async () => {
        const nextErrors: Record<string, string> = {};
        if (!name.trim())
            nextErrors.name = getActiveUiLiteral("m_67f1479e488b");
        if (!moveInDate.trim()) {
            nextErrors.moveInDate = getActiveUiLiteral("m_4b624ee8d8ff");
        }
        else if (!/^\d{4}-\d{2}-\d{2}$/.test(moveInDate.trim())) {
            nextErrors.moveInDate = getActiveUiLiteral("m_952e5811c651");
        }
        if (!mobile.trim()) {
            nextErrors.mobile = getActiveUiLiteral("m_b66a2b7a1169");
        }
        else if (mobile.trim().length !== 10 || !/^\d+$/.test(mobile.trim())) {
            nextErrors.mobile = getActiveUiLiteral("m_8753ca418dda");
        }
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }
        setErrors({});
        const result = await createRequest({
            residentType,
            unitId: 'unit-a-1204',
            moveInDate,
            residentName: name,
            mobile,
            ...includeWhenPresent("email", email || undefined),
            vehicleCount: parseInt(vehicleCount) || 0,
            familyMemberCount: parseInt(familyCount) || 0,
            liftSlotRequired: liftRequired,
            truckEntryRequired: truckEntry,
            ...includeWhenPresent("notes", notes || undefined)
        });
        if (result.ok && result.data) {
            setSubmittedRequest(result.data);
            setIsSuccess(true);
        }
        else {
            AppAlert.alert(String(localizedUiText.m_708e000ae121), String(localizedUiText.m_2790c1cdd340));
        }
    };
    const handleDone = () => {
        navigation.goBack();
    };
    if (isSuccess && submittedRequest) {
        return (<SafeAreaView style={styles.safeArea} edges={[]}>
        <View style={styles.successContainer}>
          <Animated.View entering={ZoomIn.duration(400)} style={styles.successIconOuter}>
            <Ionicons name="home" size={80} color={Colors.primary}/>
          </Animated.View>
          <Text style={styles.successTitle}>{localizedUiText.m_6ff768b8fee3}</Text>
          <Text style={styles.successSubtitle}>{localizedUiText.m_66417c41d363}</Text>

          <AppCard style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{localizedUiText.m_05ec83127e4a}</Text>
            <View style={styles.rowItem}>
              <Text style={styles.rowLabel}>{localizedUiText.m_8066552de505}</Text>
              <Text style={styles.rowVal}>{submittedRequest.residentType}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.rowLabel}>{localizedUiText.m_987aead6d4fd}</Text>
              <Text style={styles.rowVal}>{submittedRequest.residentName}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.rowLabel}>{localizedUiText.m_14f63f390f4e}</Text>
              <Text style={styles.rowVal}>{formatResidentDate(submittedRequest.moveInDate)}</Text>
            </View>
            <View style={[styles.rowItem, styles.noBorder]}>
              <Text style={styles.rowLabel}>{localizedUiText.m_03b4e6db79fd}</Text>
              <Text style={styles.rowVal}>{submittedRequest.id}</Text>
            </View>
          </AppCard>

          <AppCard style={styles.summaryCard}>
            <Text style={styles.stepsTitle}>{localizedUiText.m_75356eb43a00}</Text>
            {submittedRequest.approvalSteps.map((step, idx: number) => (<View key={idx} style={styles.stepItemRow}>
                <Ionicons name={step.status === 'APPROVED' ? 'checkmark-circle' : 'time-outline'} size={18} color={step.status === 'APPROVED' ? Colors.success : Colors.textMuted}/>
                <Text style={[styles.stepText, step.status === 'APPROVED' && styles.stepTextApproved]}>
                  {step.stepName} ({step.status})
                </Text>
              </View>))}
          </AppCard>

          <AppButton title={localizedUiText.m_4a6d9dd866ed} onPress={handleDone} variant="primary" fullWidth/>
        </View>
      </SafeAreaView>);
    }
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_ff73642ceecb} showBack onBack={() => navigation.goBack()}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <Animated.View entering={FadeInUp.duration(400)}>
          <WarningBanner message={localizedUiText.m_b207bdd94d40} type="warning" style={styles.bannerMargin}/>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(100).duration(450)}>
          <AppCard style={styles.formCard}>
            
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_2492ba8d456f}</Text>
              <View style={styles.btnToggleRow}>
                {(['OWNER', 'TENANT', 'FAMILY_MEMBER'] as const).map((type) => (<Pressable key={type} style={[styles.toggleBtn, residentType === type && styles.toggleBtnActive]} onPress={() => setResidentType(type)}>
                    <Text style={[styles.toggleText, residentType === type && styles.toggleTextActive]}>
                      {type.replace('_', ' ')}
                    </Text>
                  </Pressable>))}
              </View>
            </View>

            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_8ca35508e0cd}</Text>
              <TextInput value={name} onChangeText={(text) => {
            setName(text);
            if (errors.name)
                setErrors((prev) => ({ ...prev, name: '' }));
        }} placeholder={localizedUiText.m_6e2507b655fc} style={[styles.textInput, errors.name ? styles.inputError : styles.textInput2]}/>
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            
            <View style={styles.inputGroup}>
              <VisualDateTimePicker label={localizedUiText.m_8117950ce597} value={moveInDate} onChange={(date) => {
            setMoveInDate(date);
            if (errors.moveInDate)
                setErrors((prev) => ({ ...prev, moveInDate: '' }));
        }} mode="date"/>
              {errors.moveInDate ? <Text style={styles.errorText}>{errors.moveInDate}</Text> : null}
            </View>

            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_f58f8bb66617}</Text>
              <TextInput value={mobile} onChangeText={(text) => {
            setMobile(text);
            if (errors.mobile)
                setErrors((prev) => ({ ...prev, mobile: '' }));
        }} placeholder={localizedUiText.m_f3cfde3cf782} keyboardType="number-pad" maxLength={10} style={[styles.textInput, errors.mobile ? styles.inputError : styles.textInput3]}/>
              {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}
            </View>

            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_7d6a2d278737}</Text>
              <TextInput value={email} onChangeText={setEmail} placeholder={localizedUiText.m_a138aff951f3} keyboardType="email-address" style={styles.textInput}/>
            </View>

            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_b4b32d8f01a5}</Text>
              <TextInput value={familyCount} onChangeText={setFamilyCount} keyboardType="number-pad" style={styles.textInput}/>
            </View>

            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_3ac8957f5c61}</Text>
              <TextInput value={vehicleCount} onChangeText={setVehicleCount} keyboardType="number-pad" style={styles.textInput}/>
            </View>

            <View style={styles.borderDivider}/>

            
            <View style={styles.toggleItemRow}>
              <View style={styles.toggleLabels}>
                <Text style={styles.toggleTitle}>{localizedUiText.m_dc26f4bb1505}</Text>
                <Text style={styles.toggleDesc}>{localizedUiText.m_6d70246f0368}</Text>
              </View>
              <Pressable style={[styles.switchCircle, truckEntry && styles.switchCircleActive]} onPress={() => setTruckEntry(!truckEntry)}>
                <View style={[styles.switchKnob, truckEntry && styles.switchKnobActive]}/>
              </Pressable>
            </View>

            <View style={[styles.toggleItemRow, styles.viewMarginTop]}>
              <View style={styles.toggleLabels}>
                <Text style={styles.toggleTitle}>{localizedUiText.m_7defeb912e8c}</Text>
                <Text style={styles.toggleDesc}>{localizedUiText.m_d6ffa1561428}</Text>
              </View>
              <Pressable style={[styles.switchCircle, liftRequired && styles.switchCircleActive]} onPress={() => setLiftRequired(!liftRequired)}>
                <View style={[styles.switchKnob, liftRequired && styles.switchKnobActive]}/>
              </Pressable>
            </View>

            
            <View style={[styles.inputGroup, styles.viewMarginTop2]}>
              <Text style={styles.label}>{localizedUiText.m_2a818cd4502e}</Text>
              <TextInput value={notes} onChangeText={setNotes} placeholder={localizedUiText.m_fe8844115840} multiline numberOfLines={2} style={styles.textInput}/>
            </View>

          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(150).duration(450)}>
          <AppButton title={isSubmitting ? localizedUiText.m_20eef59e4d34 : localizedUiText.m_9550a5e87ab9} onPress={handleSubmit} variant="primary" disabled={isSubmitting} fullWidth style={styles.submitBtn}/>
        </Animated.View>

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </SafeAreaView>);
}

