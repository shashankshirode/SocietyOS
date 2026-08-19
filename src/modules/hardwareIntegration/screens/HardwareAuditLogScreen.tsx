import { FlatList, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { useHardwareAuditLogs } from "../hooks/useHardwareAuditLogs";
import { styles } from "../styles/screens/HardwareAuditLogScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function HardwareAuditLogScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: logs, isLoading } = useHardwareAuditLogs();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_9ac42d86c6e4}</Text>
          <View style={styles.viewWidth}/>
        </View>

        {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_dc3b2f43cfc9}</Text>) : (<FlatList data={logs} keyExtractor={item => item.id} renderItem={({ item }) => (<View style={styles.row}>
                <View style={styles.left}>
                  <Text style={styles.event}>{item.event.replace(/_/g, ' ')}</Text>
                  <Text style={styles.actor}>{localizedUiText.m_5704b7c3727f + " "}{item.actorName} ({item.actorRole})</Text>
                  <Text style={styles.text}>{localizedUiText.m_9f8d3539c6f3 + " "}{item.deviceName || localizedUiText.m_e2f79e5b6033}</Text>
                </View>
                <View style={styles.right}>
                  <Text style={styles.time}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
                  <Text style={styles.date}>{new Date(item.timestamp).toLocaleDateString()}</Text>
                </View>
              </View>)} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.empty}>{localizedUiText.m_cabc36e11705}</Text>}/>)}
      </SafeAreaView>
    </ScreenContainer>);
}

