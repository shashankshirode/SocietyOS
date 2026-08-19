import { FlatList, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { SmartMeterReadingCard } from "../components/SmartMeterReadingCard";
import { useSmartMeterReadingDetail } from "../hooks/useSmartMeterReadingDetail";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HardwareIntegrationStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/SmartMeterReadingDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function SmartMeterReadingDetailScreen({ route, navigation }: NativeStackScreenProps<HardwareIntegrationStackParamList, 'SmartMeterReadingDetail'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { meterId } = route.params;
    const { data: readings, isLoading } = useSmartMeterReadingDetail(meterId);
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_768c7265d266}</Text>
          <View style={styles.viewWidth}/>
        </View>

        {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_9fce234d3ba2}</Text>) : (<FlatList data={readings} keyExtractor={item => item.id} renderItem={({ item }) => <SmartMeterReadingCard reading={item}/>} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.empty}>{localizedUiText.m_0ca96098ce7b}</Text>}/>)}
      </SafeAreaView>
    </ScreenContainer>);
}

