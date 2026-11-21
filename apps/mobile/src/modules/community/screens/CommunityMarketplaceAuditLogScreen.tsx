import { Text, View, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useCommunityAuditLogs } from "../data/communityHooks";
import { styles } from "../styles/screens/CommunityMarketplaceAuditLogScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function CommunityMarketplaceAuditLogScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: logs, isLoading, refetch } = useCommunityAuditLogs();
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_5428d7fe5929} onBack={() => navigation.goBack()}/>

      <FlatList data={logs} keyExtractor={(item) => item.id} renderItem={({ item }) => (<View style={styles.logCard}>
            <View style={styles.logHeader}>
              <View style={styles.actionRow}>
                <Ionicons name={item.module === 'MARKETPLACE' ? 'cart' : item.module === 'SKILL_DIRECTORY' ? 'school' : 'hammer'} size={16} color={Colors.primary}/>
                <Text style={styles.logAction}>{item.action}</Text>
              </View>
              <Text style={styles.logTime}>
                {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            
            <Text style={styles.logDetails}>{item.details}</Text>

            <View style={styles.logFooter}>
              <Text style={styles.logUser}>{localizedUiText.m_5704b7c3727f + " "}{item.performedBy} ({item.unitNumber})</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{item.performedByRole}</Text>
              </View>
            </View>
          </View>)} contentContainerStyle={styles.listContent} refreshing={isLoading} onRefresh={refetch} showsVerticalScrollIndicator={false}/>
    </ScreenContainer>);
}

