import { useState } from "react";
import { ScrollView, Text, View, Switch } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../shared/constants/colors";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { useFeatureFlags } from "../../../core/featureFlags/featureFlags";
import { styles } from "../styles/screens/FeatureConfigurationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function FeatureConfigurationScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { flags } = useFeatureFlags();
    const [localFlags, setLocalFlags] = useState({ ...flags });
    const handleToggle = (key: keyof typeof flags) => {
        setLocalFlags(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };
    const handleSave = () => {
        AppAlert.alert(String(localizedUiText.m_dce7c9f39406), String(localizedUiText.m_dd79225ab193), [{ text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.goBack() }]);
    };
    const renderFlagItem = (key: keyof typeof flags, label: string, desc: string) => (<AppCard style={styles.card} key={key}>
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.flagLabel}>{label}</Text>
          <Text style={styles.flagDesc}>{desc}</Text>
        </View>
        <Switch value={localFlags[key]} onValueChange={() => handleToggle(key)} trackColor={{ false: Colors.border, true: Colors.primaryLight }} thumbColor={localFlags[key] ? Colors.primary : '#F4F3F0'}/>
      </View>
    </AppCard>);
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_20468d9bf06c} showBack onBack={navigation.goBack}/>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>{localizedUiText.m_247cae295e3b}</Text>
        {renderFlagItem('visitorManagement', String(localizedUiText.m_3cd6c061eb92), getActiveUiLiteral("m_ae2881b9e572"))}
        {renderFlagItem('maintenanceBilling', String(localizedUiText.m_b3c8ed88e0b5), getActiveUiLiteral("m_f02586ba3c6f"))}
        {renderFlagItem('complaints', String(localizedUiText.m_f7f8a15e65f1), getActiveUiLiteral("m_57cba712cd93"))}
        {renderFlagItem('notices', String(localizedUiText.m_ab32817bf031), getActiveUiLiteral("m_2d201f5138b1"))}
        {renderFlagItem('documentVault', String(localizedUiText.m_0394ca262c99), getActiveUiLiteral("m_97259304f053"))}
        {renderFlagItem('nocRequests', String(localizedUiText.m_23de52daae72), getActiveUiLiteral("m_8779fca6f95c"))}

        <Text style={[styles.sectionHeader, styles.textMarginTop]}>{localizedUiText.m_334b5111ce39}</Text>
        {renderFlagItem('communityMarketplace', String(localizedUiText.m_3f01b5dedf34), getActiveUiLiteral("m_4e8038318ff2"))}
        {renderFlagItem('hardwareIntegrationReadiness', String(localizedUiText.m_0b51182fa784), getActiveUiLiteral("m_322162705714"))}

        <AppButton title={localizedUiText.m_dce7c9f39406} variant="primary" onPress={handleSave} style={styles.saveBtn}/>
      </ScrollView>
    </SafeAreaView>);
}

