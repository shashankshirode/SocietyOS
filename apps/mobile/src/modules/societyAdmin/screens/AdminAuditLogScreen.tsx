import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useAdminAuditLogs } from "../data/useAdminAuditLogs";
import type { AdminAuditLog } from "../../../shared/types/admin.types";
import { styles } from "../styles/screens/AdminAuditLogScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function AdminAuditLogScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: auditLogs = [], isLoading, error } = useAdminAuditLogs();
    const renderAuditItem = ({ item, index }: {
        item: AdminAuditLog;
        index: number;
    }) => (<Animated.View entering={FadeInLeft.delay(index * 20).duration(300)}>
      <AppCard style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.actor}>{item.actorName} ({item.actorRole})</Text>
          <Text style={styles.date}>{new Date(item.timestamp).toLocaleDateString()}</Text>
        </View>
        <Text style={styles.eventType}>{item.eventType.replace(/_/g, ' ')}</Text>
        <Text style={styles.summary}>{item.summary}</Text>
        {item.ipAddress ? (<Text style={styles.ip}>{localizedUiText.m_d0a574b3dc58 + " "}{item.ipAddress}</Text>) : null}
      </AppCard>
    </Animated.View>);
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_68e802e41f63} showBack onBack={navigation.goBack}/>

      {isLoading ? (<View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary}/>
        </View>) : error ? (<EmptyState title={localizedUiText.m_878770d1abd7} description={error.message} iconName="alert-circle-outline"/>) : auditLogs.length === 0 ? (<EmptyState title={localizedUiText.m_cd07a86c9306} description={localizedUiText.m_dad0160d29fc} iconName="journal-outline"/>) : (<FlatList data={auditLogs} renderItem={renderAuditItem} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/>)}
    </SafeAreaView>);
}

