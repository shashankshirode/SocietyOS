import { FlatList, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { IntegrationHealthCard } from "../components/IntegrationHealthCard";
import { useIntegrationHealth } from "../hooks/useIntegrationHealth";
import { styles } from "../styles/screens/IntegrationHealthDashboardScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function IntegrationHealthDashboardScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: health, isLoading } = useIntegrationHealth();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_980d79322ef2}</Text>
          <View style={styles.viewWidth}/>
        </View>

        {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_30c561deb4d5}</Text>) : (<FlatList data={health} keyExtractor={item => item.category} renderItem={({ item }) => <IntegrationHealthCard row={item}/>} contentContainerStyle={styles.list}/>)}
      </SafeAreaView>
    </ScreenContainer>);
}

