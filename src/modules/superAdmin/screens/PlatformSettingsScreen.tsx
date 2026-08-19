import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { usePlatformSettings } from "../hooks/usePlatformSettings";
import { styles } from "../styles/screens/PlatformSettingsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function PlatformSettingsScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = usePlatformSettings();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_b18b122ea1b3} subtitle={localizedUiText.m_1ace7c079323}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          {data.map((group) => (<View key={group.id} style={styles.card}>
              <Text style={styles.groupTitle}>{group.groupName}</Text>
              <Text style={styles.groupDesc}>{group.description}</Text>
              <View style={styles.settingsList}>
                {group.settings.map((setting) => (<View key={setting.key} style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingLabel}>{setting.label}</Text>
                      <Text style={styles.settingDesc}>{setting.description}</Text>
                    </View>
                    <Text style={styles.settingVal}>{setting.value}</Text>
                  </View>))}
              </View>
            </View>))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

