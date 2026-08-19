import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { useHierarchyTemplates } from "../hooks/useHierarchyTemplates";
import { styles } from "../styles/screens/SocietyHierarchyTemplateScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function SocietyHierarchyTemplateScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useHierarchyTemplates();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_1e01084d0d5a} subtitle={localizedUiText.m_32ec5f358bb0}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          {data.map((item) => (<View key={item.id} style={styles.card}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.levels}>{localizedUiText.m_e1a8f0432182 + " "}{item.hierarchyLevels.join(' → ')}</Text>
              <Text style={styles.example}>{localizedUiText.m_872887e563e7 + " "}{item.exampleUnits}</Text>
              <Text style={styles.notes}>{item.configurationNotes}</Text>
            </View>))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

