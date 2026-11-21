import { useState } from "react";
import { View, Switch } from "react-native";
import { ResidentPageHeader } from "../../../ui/patterns/ResidentPageHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { SafeText } from "../../../shared/components/SafeText";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useMessages } from "../../../shared/constants/useMessages";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorStyle, createViewBorderBottomColorStyle } from "../styles/screens/PrivacySettingsScreen.styles";
export function PrivacySettingsScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const copy = messages.resident.settings;
    const [directoryVisible, setDirectoryVisible] = useState(true);
    const [allowContactRequests, setAllowContactRequests] = useState(true);
    return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}>
      <ResidentPageHeader title={copy.privacy?.title || localizedUiText.m_eefad6ba6a22} subtitle={copy.privacy?.description || localizedUiText.m_ccf9717882dc} showBackButton={true} onBackPress={() => navigation.goBack()}/>
      
      <View style={styles.content}>
        <AppCard style={styles.card}>
          <View style={[styles.row, createViewBorderBottomColorStyle(colors.border)]}>
            <View style={styles.textCol}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)}>{localizedUiText.m_58662bad92cc}</SafeText>
              <SafeText variant="caption" style={createSafeTextColorStyle2(colors.textSecondary)}>{localizedUiText.m_1a636b0d5bcd}</SafeText>
            </View>
            <Switch value={directoryVisible} onValueChange={setDirectoryVisible} trackColor={{ true: colors.primary, false: colors.border }}/>
          </View>

          <View style={styles.row}>
            <View style={styles.textCol}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(colors.textPrimary)}>{localizedUiText.m_09f4856a6bd0}</SafeText>
              <SafeText variant="caption" style={createSafeTextColorStyle4(colors.textSecondary)}>{localizedUiText.m_4f88af1cbd6e}</SafeText>
            </View>
            <Switch value={allowContactRequests} onValueChange={setAllowContactRequests} trackColor={{ true: colors.primary, false: colors.border }}/>
          </View>
        </AppCard>
      </View>
    </View>);
}
export default PrivacySettingsScreen;

