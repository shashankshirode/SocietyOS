import { FlatList, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useRfidReadiness } from "../hooks/useRfidReadiness";
import { styles } from "../styles/screens/RfidReadinessScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function RfidReadinessScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: events, isLoading } = useRfidReadiness();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_debed07668e0}</Text>
          <Pressable onPress={() => navigation.navigate('RfidTagMapping', {})} style={styles.addButton}>
            <Ionicons name="add" size={24} color={Colors.primary}/>
          </Pressable>
        </View>

        {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_2b40cd78d6fe}</Text>) : (<FlatList data={events} keyExtractor={item => item.id} renderItem={({ item }) => (<View style={styles.row}>
                <View style={styles.left}>
                  <Text style={styles.tagCode}>{localizedUiText.m_6e93602eadff + " "}{item.tagCodeMasked}</Text>
                  <Text style={styles.vehicle}>{localizedUiText.m_b2dc3b5dae96 + " "}{item.matchedVehicleNumber || localizedUiText.m_13d617126464}</Text>
                  <Text style={styles.time}>{new Date(item.timestamp).toLocaleString()}</Text>
                </View>
                <View style={styles.right}>
                  <StatusBadge moduleType="gatehardware" status={item.accessResult}/>
                </View>
              </View>)} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.empty}>{localizedUiText.m_e0d25bec31a7}</Text>}/>)}
      </SafeAreaView>
    </ScreenContainer>);
}

