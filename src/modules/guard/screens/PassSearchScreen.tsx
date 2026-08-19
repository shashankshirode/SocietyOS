import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { WarningBanner } from "../../../shared/feedback/WarningBanner";
import { usePassSearch } from "../data/usePassSearch";
import type { PassSearchScreenProps } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/PassSearchScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function PassSearchScreen({ navigation }: PassSearchScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [passCode, setPassCode] = useState("");
    const [phoneOrFlat, setPhoneOrFlat] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { submit: searchPass, isSubmitting } = usePassSearch();
    const handleSimulateScan = () => {
        navigation.navigate("VisitorVerification", { passCode: "482910" });
    };
    const handleSearch = async () => {
        const nextErrors: Record<string, string> = {};
        if (!passCode.trim() && !phoneOrFlat.trim()) {
            nextErrors.general = getActiveUiLiteral("m_246cfe2e92a1");
            setErrors(nextErrors);
            return;
        }
        if (passCode.trim()) {
            const result = await searchPass(passCode.trim());
            if (result.ok && result.data) {
                setErrors({});
                navigation.navigate("VisitorVerification", {
                    passCode: result.data.otp,
                });
            }
            else {
                nextErrors.passCode = getActiveUiLiteral("m_2d194d5a4614");
                setErrors(nextErrors);
            }
        }
        else {
            const result = await searchPass(phoneOrFlat.trim());
            if (result.ok && result.data) {
                setErrors({});
                navigation.navigate("VisitorVerification", {
                    passCode: result.data.otp,
                });
            }
            else {
                nextErrors.phoneOrFlat = getActiveUiLiteral("m_7acb1dc77e53");
                setErrors(nextErrors);
            }
        }
    };
    const handleRecentPress = (code: string) => {
        navigation.navigate("VisitorVerification", { passCode: code });
    };
    return (<SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
          <Text style={styles.headerTitle}>{localizedUiText.m_fa46f31ef735}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <AppCard style={styles.scanBoxCard}>
            <View style={styles.scanFrame}>
              <View style={styles.cornerTL}/>
              <View style={styles.cornerTR}/>
              <View style={styles.cornerBL}/>
              <View style={styles.cornerBR}/>

              <Ionicons name="qr-code-outline" size={80} color={Colors.primary} style={styles.qrIcon}/>
              <Text style={styles.scanInstructions}>{localizedUiText.m_a4e0a2fea8a3}</Text>
            </View>

            <AppButton title={localizedUiText.m_52165df6c755} onPress={handleSimulateScan} variant="secondary" fullWidth style={styles.simulateBtn}/>
          </AppCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(450)} style={styles.searchSection}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_8ba6d97cdc5b}</Text>

          {errors.general ? (<WarningBanner message={errors.general} type="danger" style={styles.warningBannerMarginBottom}/>) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_d05c75bb47ae}</Text>
            <TextInput value={passCode} onChangeText={(text) => {
            setPassCode(text);
            if (errors.passCode || errors.general)
                setErrors({});
        }} placeholder={localizedUiText.m_956436e554d8} keyboardType="number-pad" maxLength={6} style={[
            styles.textInput,
            errors.passCode ? styles.inputError : styles.textInput2,
        ]}/>
            {errors.passCode ? (<Text style={styles.errorText}>{errors.passCode}</Text>) : null}
          </View>

          <Text style={styles.orDivider}>{localizedUiText.m_8a89a38b5f57}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_46ff27a71b66}</Text>
            <TextInput value={phoneOrFlat} onChangeText={(text) => {
            setPhoneOrFlat(text);
            if (errors.phoneOrFlat || errors.general)
                setErrors({});
        }} placeholder={localizedUiText.m_c0c989ced7f9} style={[
            styles.textInput,
            errors.phoneOrFlat ? styles.inputError : styles.textInput3,
        ]}/>
            {errors.phoneOrFlat ? (<Text style={styles.errorText}>{errors.phoneOrFlat}</Text>) : null}
          </View>

          <AppButton title={isSubmitting ? localizedUiText.m_78c9d9f6ace0 : localizedUiText.m_2e86ea65ba0e} onPress={handleSearch} variant="primary" fullWidth style={styles.searchBtn}/>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(450)}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_3687b4da55df}</Text>

          <AppCard style={styles.recentCard} noPadding>
            <Pressable style={styles.recentItem} onPress={() => handleRecentPress("482910")}>
              <Ionicons name="time-outline" size={16} color={Colors.textMuted}/>
              <View style={styles.recentItemDetails}>
                <Text style={styles.recentName}>{localizedUiText.m_e0defaf92fe1}</Text>
                <Text style={styles.recentMeta}>{localizedUiText.m_44eefb70ffb0}</Text>
              </View>
              <Text style={styles.recentCode}>482910</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted}/>
            </Pressable>

            <Pressable style={[styles.recentItem, styles.borderTop]} onPress={() => handleRecentPress("887722")}>
              <Ionicons name="time-outline" size={16} color={Colors.textMuted}/>
              <View style={styles.recentItemDetails}>
                <Text style={styles.recentName}>{localizedUiText.m_b7f5cd542a94}</Text>
                <Text style={styles.recentMeta}>{localizedUiText.m_a1525b900295}</Text>
              </View>
              <Text style={styles.recentCode}>887722</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted}/>
            </Pressable>
          </AppCard>
        </Animated.View>

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </SafeAreaView>);
}

