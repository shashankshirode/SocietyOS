import { useState } from "react";
import { ScrollView, Text, TextInput, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { AppHeader } from "../../../shared/components/AppHeader";
import { InfoRow } from "../../../shared/components/InfoRow";
import { WarningBanner } from "../../../shared/feedback/WarningBanner";
import type { ManualEntryScreenProps } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/ManualEntryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type VisitorType = 'GUEST' | 'DELIVERY' | 'CAB' | 'VENDOR' | 'MATERIAL';
export function ManualEntryScreen({ navigation }: ManualEntryScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [type, setType] = useState<VisitorType>('GUEST');
    const [flat, setFlat] = useState('');
    const [purpose, setPurpose] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [peopleCount, setPeopleCount] = useState('1');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSuccess, setIsSuccess] = useState(false);
    const entryTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    const handleSubmit = () => {
        const nextErrors: Record<string, string> = {};
        if (!name.trim())
            nextErrors.name = getActiveUiLiteral("m_31d5ed5abfa4");
        if (!mobile.trim()) {
            nextErrors.mobile = getActiveUiLiteral("m_9a11522b4348");
        }
        else if (mobile.trim().length !== 10 || !/^\d+$/.test(mobile.trim())) {
            nextErrors.mobile = getActiveUiLiteral("m_8753ca418dda");
        }
        if (!flat.trim())
            nextErrors.flat = getActiveUiLiteral("m_bea2854b6aa8");
        if (!purpose.trim())
            nextErrors.purpose = getActiveUiLiteral("m_b7703a8d2c0e");
        const count = parseInt(peopleCount, 10);
        if (!peopleCount.trim() || isNaN(count) || count < 1) {
            nextErrors.peopleCount = getActiveUiLiteral("m_68fa03bc62fa");
        }
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }
        setErrors({});
        setIsSuccess(true);
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
          <Text style={styles.successTitle}>{localizedUiText.m_c5eaf277e218}</Text>
          <Text style={styles.successSubtitle}>{localizedUiText.m_819bebea1109}{name}{" " + localizedUiText.m_93963b1095ab + " "}{flat}{" " + localizedUiText.m_b1d6b91b67c2 + " "}{entryTime}.
          </Text>

          <AppCard style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{localizedUiText.m_2f53447ff960}</Text>
            <InfoRow label={localizedUiText.m_e319edcedc59} value={name}/>
            <InfoRow label={localizedUiText.m_34975ecb9b9a} value={mobile.substring(0, 5) + '*****'}/>
            <InfoRow label={localizedUiText.m_a97ab90aadfd} value={type}/>
            <InfoRow label={localizedUiText.m_7ebc765e1de9} value={flat}/>
            <InfoRow label={localizedUiText.m_d4e8830a71c7} value={purpose}/>
            <InfoRow label={localizedUiText.m_41848325be58} value={peopleCount}/>
            {vehicle.trim() ? <InfoRow label={localizedUiText.m_2861a6989dc2} value={vehicle}/> : null}
            <InfoRow label={localizedUiText.m_294ef7803b6f} value={entryTime} isLast/>
          </AppCard>

          <AppButton title={localizedUiText.m_6ac30e7d74f4} onPress={handleDone} variant="primary" fullWidth style={styles.doneBtn}/>
        </View>
      </SafeAreaView>);
    }
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_b05c83f1085d} showBack onBack={() => navigation.goBack()}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <Animated.View entering={FadeInUp.duration(400)}>
          <WarningBanner message={localizedUiText.m_bb584d4100b1} type="warning" style={styles.bannerMargin}/>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(100).duration(450)}>
          <AppCard style={styles.formCard}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_9e53b0d60dbf}</Text>
              <TextInput value={name} onChangeText={(text) => {
            setName(text);
            if (errors.name)
                setErrors({ ...errors, name: '' });
        }} placeholder={localizedUiText.m_49d3de603d51} style={[styles.textInput, errors.name ? styles.inputError : styles.textInput2]}/>
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_90da80bbab87}</Text>
              <TextInput value={mobile} onChangeText={(text) => {
            setMobile(text);
            if (errors.mobile)
                setErrors({ ...errors, mobile: '' });
        }} placeholder={localizedUiText.m_f3cfde3cf782} keyboardType="number-pad" maxLength={10} style={[styles.textInput, errors.mobile ? styles.inputError : styles.textInput3]}/>
              {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}
            </View>

            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_dda9874570d0}</Text>
              <View style={styles.classificationRow}>
                {(['GUEST', 'DELIVERY', 'CAB', 'VENDOR'] as VisitorType[]).map((vType) => {
            const isSelected = type === vType;
            return (<Pressable key={vType} style={[styles.typeBtn, isSelected && styles.typeBtnActive]} onPress={() => setType(vType)}>
                      <Text style={[styles.typeBtnText, isSelected && styles.typeBtnTextActive]}>
                        {vType}
                      </Text>
                    </Pressable>);
        })}
              </View>
            </View>

            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_7c9bdb179535}</Text>
              <TextInput value={flat} onChangeText={(text) => {
            setFlat(text);
            if (errors.flat)
                setErrors({ ...errors, flat: '' });
        }} placeholder={localizedUiText.m_ee30e7b261bc} style={[styles.textInput, errors.flat ? styles.inputError : styles.textInput4]}/>
              {errors.flat ? <Text style={styles.errorText}>{errors.flat}</Text> : null}
            </View>

            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{localizedUiText.m_58910e456949}</Text>
              <TextInput value={purpose} onChangeText={(text) => {
            setPurpose(text);
            if (errors.purpose)
                setErrors({ ...errors, purpose: '' });
        }} placeholder={localizedUiText.m_5fe102820827} style={[styles.textInput, errors.purpose ? styles.inputError : styles.textInput5]}/>
              {errors.purpose ? <Text style={styles.errorText}>{errors.purpose}</Text> : null}
            </View>

            
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.viewFlex]}>
                <Text style={styles.label}>{localizedUiText.m_09526053c8b9}</Text>
                <TextInput value={peopleCount} onChangeText={(text) => {
            setPeopleCount(text);
            if (errors.peopleCount)
                setErrors({ ...errors, peopleCount: '' });
        }} placeholder="1" keyboardType="number-pad" style={[styles.textInput, errors.peopleCount ? styles.inputError : styles.textInput6]}/>
                {errors.peopleCount ? <Text style={styles.errorText}>{errors.peopleCount}</Text> : null}
              </View>

              <View style={[styles.inputGroup, styles.viewFlexMarginLeft]}>
                <Text style={styles.label}>{localizedUiText.m_57c8177ac1f3}</Text>
                <TextInput value={vehicle} onChangeText={setVehicle} placeholder={localizedUiText.m_3e8b69fe0f5a} autoCapitalize="characters" style={styles.textInput}/>
              </View>
            </View>
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(200).duration(450)}>
          <AppButton title={localizedUiText.m_089da119f4de} onPress={handleSubmit} variant="primary" fullWidth style={styles.submitBtn}/>
        </Animated.View>

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </SafeAreaView>);
}

