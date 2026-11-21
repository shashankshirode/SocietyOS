import { FlatList, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useAnprReadiness } from "../hooks/useAnprReadiness";
import { styles } from "../styles/screens/AnprReadinessScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function AnprReadinessScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: events, isLoading } = useAnprReadiness();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_9b2c3dd9d519}</Text>
          <View style={styles.viewWidth}/>
        </View>

        {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_fdecedffc13c}</Text>) : (<FlatList data={events} keyExtractor={item => item.id} renderItem={({ item }) => (<Pressable style={styles.row} onPress={() => navigation.navigate('AnprVehicleMatchReview', { eventId: item.id })}>
                <View style={styles.left}>
                  <Text style={styles.plate}>{localizedUiText.m_70296d84f7b7 + " "}{item.plateNumberMasked}</Text>
                  <Text style={styles.confidence}>{localizedUiText.m_170d7271521a + " "}{item.matchConfidence}%</Text>
                  <Text style={styles.time}>{new Date(item.timestamp).toLocaleString()}</Text>
                </View>
                <View style={styles.right}>
                  <StatusBadge moduleType="hardware" status={item.status}/>
                  <Text style={styles.actionLink}>{localizedUiText.m_1c8954f3ce9c}</Text>
                </View>
              </Pressable>)} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.empty}>{localizedUiText.m_cfe4410e195a}</Text>}/>)}
      </SafeAreaView>
    </ScreenContainer>);
}

