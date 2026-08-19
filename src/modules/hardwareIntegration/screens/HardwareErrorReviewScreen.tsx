import { FlatList, Text, View, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { HardwareErrorCard } from "../components/HardwareErrorCard";
import { useHardwareErrors } from "../hooks/useHardwareErrors";
import { styles } from "../styles/screens/HardwareErrorReviewScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function HardwareErrorReviewScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: errors, isLoading } = useHardwareErrors();
    const handleResolve = (id: string) => {
        AppAlert.alert(String(localizedUiText.m_b095e7aba47c), String(localizedUiText.m_ff1f043957c0), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            { text: String(localizedUiText.m_1517b70c2633), onPress: () => AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_064771f64c71)) },
            { text: String(localizedUiText.m_bf071ba60234), onPress: () => AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_a9c5c0275ddd)) },
        ]);
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_568a9a6e8125}</Text>
          <View style={styles.viewWidth}/>
        </View>

        {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_d36b39cceae1}</Text>) : (<FlatList data={errors} keyExtractor={item => item.id} renderItem={({ item }) => (<Pressable onPress={() => handleResolve(item.id)}>
                <HardwareErrorCard error={item}/>
              </Pressable>)} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.empty}>{localizedUiText.m_6719afc81836}</Text>}/>)}
      </SafeAreaView>
    </ScreenContainer>);
}

