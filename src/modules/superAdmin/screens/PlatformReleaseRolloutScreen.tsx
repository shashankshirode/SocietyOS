import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { usePlatformReleases } from "../hooks/usePlatformReleases";
import { styles } from "../styles/screens/PlatformReleaseRolloutScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function PlatformReleaseRolloutScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = usePlatformReleases();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_566f94ea987b} subtitle={localizedUiText.m_2437b66eaf6d}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          {data.map((item) => (<View key={item.id} style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.version}>{item.version}</Text>
                <Text style={styles.status}>{item.status}</Text>
              </View>
              <Text style={styles.date}>{localizedUiText.m_6ae5d70af850 + " "}{item.releaseDate}</Text>
              <Text style={styles.notes}>{item.releaseNotes}</Text>
            </View>))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

