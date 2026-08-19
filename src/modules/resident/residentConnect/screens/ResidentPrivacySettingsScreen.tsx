import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState, useEffect } from "react";
import { View, ScrollView, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentPrivacySettings, useUpdatePrivacySettings } from "../data/useResidentPrivacySettings";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createViewBackgroundColorStyle, createViewBorderColorStyle, createViewBorderColorStyle2, createViewBorderColorStyle3, createViewBorderColorStyle4, createViewPaddingBottomBorderTopColorStyle } from "../styles/screens/ResidentPrivacySettingsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ResidentPrivacySettingsScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const { data: settings, refetch } = useResidentPrivacySettings();
    const { submit: updateSettings, isSubmitting } = useUpdatePrivacySettings();
    const [showFlatNumber, setShowFlatNumber] = useState(true);
    const [showDisplayName, setShowDisplayName] = useState(true);
    const [allowFirstContact, setAllowFirstContact] = useState(true);
    const [sameTowerOnly, setSameTowerOnly] = useState(false);
    useEffect(() => {
        if (settings) {
            setShowFlatNumber(settings.showFlatNumber);
            setShowDisplayName(settings.showDisplayName);
            setAllowFirstContact(settings.allowFirstContact);
            setSameTowerOnly(settings.sameTowerOnly);
        }
    }, [settings]);
    const handleSave = async () => {
        const res = await updateSettings({
            showFlatNumber,
            showDisplayName,
            allowFirstContact,
            sameTowerOnly,
            allowCommitteeContact: true,
        });
        if (res.ok) {
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_bf1c41ce5b82));
            refetch();
        }
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_76f481c01d98}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PrivacyNoticePanel title={localizedUiText.m_d363bca7a138} description={localizedUiText.m_46fed04708f3}/>

        <View style={styles.form}>
          <View style={[styles.switchRow, createViewBorderColorStyle(theme.border)]}>
            <View style={styles.switchText}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_6a40732aec9e}</SafeText>
              <SafeText variant="tiny" style={createSafeTextColorStyle2(theme.textSecondary)}>{localizedUiText.m_7235fbb66c6e}</SafeText>
            </View>
            <Switch value={showFlatNumber} onValueChange={setShowFlatNumber} trackColor={{ false: theme.border, true: theme.accent }}/>
          </View>

          <View style={[styles.switchRow, createViewBorderColorStyle2(theme.border)]}>
            <View style={styles.switchText}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>{localizedUiText.m_af941da4051b}</SafeText>
              <SafeText variant="tiny" style={createSafeTextColorStyle4(theme.textSecondary)}>{localizedUiText.m_a239d9708083}</SafeText>
            </View>
            <Switch value={!showDisplayName} onValueChange={(val) => setShowDisplayName(!val)} trackColor={{ false: theme.border, true: theme.accent }}/>
          </View>

          <View style={[styles.switchRow, createViewBorderColorStyle3(theme.border)]}>
            <View style={styles.switchText}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle5(theme.textPrimary)}>{localizedUiText.m_796110e28da1}</SafeText>
              <SafeText variant="tiny" style={createSafeTextColorStyle6(theme.textSecondary)}>{localizedUiText.m_513a8f239595}</SafeText>
            </View>
            <Switch value={allowFirstContact} onValueChange={setAllowFirstContact} trackColor={{ false: theme.border, true: theme.accent }}/>
          </View>

          <View style={[styles.switchRow, createViewBorderColorStyle4(theme.border)]}>
            <View style={styles.switchText}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle7(theme.textPrimary)}>{localizedUiText.m_d51e8dbd09a9}</SafeText>
              <SafeText variant="tiny" style={createSafeTextColorStyle8(theme.textSecondary)}>{localizedUiText.m_399edcde80b3}</SafeText>
            </View>
            <Switch value={sameTowerOnly} onValueChange={setSameTowerOnly} trackColor={{ false: theme.border, true: theme.accent }}/>
          </View>
        </View>
      </ScrollView>

      
      <View style={[styles.bottomBar, createViewPaddingBottomBorderTopColorStyle(insets.bottom + 12, theme.border)]}>
        <AppButton title={localizedUiText.m_b74fe1560b3c} onPress={handleSave} loading={isSubmitting} iconLeft={<Ionicons name="shield-checkmark-outline" size={18} color="#FFFFFF"/>}/>
      </View>
    </View>);
}
export default ResidentPrivacySettingsScreen;

