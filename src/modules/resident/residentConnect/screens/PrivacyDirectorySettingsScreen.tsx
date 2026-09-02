import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppCard } from "../../../../shared/cards/AppCard";
import { DataRow } from "../../../../shared/dataDisplay/DataRow";
import { ResponsivePageHeader } from "../../../../shared/layouts/ResponsivePageHeader";
import { ScreenContainer } from "../../../../shared/layouts/ScreenContainer";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { usePrivacyDirectorySettings } from "../hooks/usePrivacyDirectorySettings";
import { styles, createTextColorStyle, createTextColorStyle2 } from "../styles/screens/PrivacyDirectorySettingsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
import { SocietySwitch } from "../../../../ui/controls/SocietySwitch";
const settingLabels = {
    showName: getActiveUiLiteral("m_0c3888dd229b"),
    showFlat: getActiveUiLiteral("m_667f6f077984"),
    showPhone: getActiveUiLiteral("m_59dbfca02964"),
    allowFirstContactRequests: getActiveUiLiteral("m_e0bd3305eb25"),
} as const;
export function PrivacyDirectorySettingsScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { settings, toggle } = usePrivacyDirectorySettings();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ResponsivePageHeader title={localizedUiText.m_20c17862ee4c} subtitle={localizedUiText.m_7e6650e4bef9} onBack={() => navigation.goBack()}/>
        <ScrollView contentContainerStyle={styles.content}>
          <AppCard style={styles.card}>
            <DataRow label={localizedUiText.m_29894a6ccc25} value="PRIVACY_DIRECTORY_SETTINGS"/>
            <DataRow label={localizedUiText.m_6d5c369331cb} value="usePrivacyDirectorySettings"/>
          </AppCard>

          {(Object.keys(settings) as (keyof typeof settings)[]).map((key) => (<AppCard key={key} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.textBlock}>
                  <Text style={[styles.title, createTextColorStyle(colors.textPrimary)]}>{settingLabels[key]}</Text>
                  <Text style={[styles.copy, createTextColorStyle2(colors.textSecondary)]}>
                    {settings[key] ? localizedUiText.m_ce29a5499b47 : localizedUiText.m_04b27dbf4e23}
                  </Text>
                </View>
                <SocietySwitch value={settings[key]} onValueChange={() => toggle(key)}/>
              </View>
            </AppCard>))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}
