import { Text, View, FlatList, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useMarketplaceModerationQueue, useModerateMarketplaceListing } from "../data/communityHooks";
import { useMessages } from "../../../messages";
import { AppAlert } from "../../../ui/modal";
import { styles } from "../styles/screens/MarketplaceModerationQueueScreen.styles";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
export function MarketplaceModerationQueueScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useMessages().uiLiterals;
    const messages = useMessages();
    const { data: queue, isLoading, refetch } = useMarketplaceModerationQueue();
    const { mutateAsync: moderateListing } = useModerateMarketplaceListing();
    const handleModerate = async (id: string, action: 'APPROVE' | 'REMOVE') => {
        try {
            await moderateListing({ id, action });
            refetch();
        }
        catch {
            AppAlert.alert(messages.errors.genericTitle, messages.errors.genericDescription, [{ text: messages.common.ok }]);
        }
    };
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_f04c9f4d0d2e} onBack={() => navigation.goBack()}/>

      <FlatList data={queue} keyExtractor={(item) => item.id} renderItem={({ item }) => (<View style={styles.modCard}>
            <View style={styles.cardHeader}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.sellerInfo}>{localizedUiText.m_1666298837b9 + " "}{item.sellerName} ({item.sellerUnit})</Text>
              </View>
              <View style={styles.reportBadge}>
                <Text style={styles.reportBadgeText}>{item.reportedCount}{" " + localizedUiText.m_dacca3cba3f3}</Text>
              </View>
            </View>

            <Text style={styles.reasonText}>{formatUiLiteral(localizedUiText.m_ad7aad58ea19, [item.reportedReason || localizedUiText.m_d591f0161539])}</Text>

            <View style={styles.actionRow}>
              <Pressable style={[styles.actionButton, styles.removeButton]} onPress={() => handleModerate(item.id, 'REMOVE')}>
                <Ionicons name="trash-outline" size={16} color={Colors.danger}/>
                <Text style={styles.removeButtonText}>{localizedUiText.m_9e1a8ad2243f}</Text>
              </Pressable>

              <Pressable style={[styles.actionButton, styles.approveButton]} onPress={() => handleModerate(item.id, 'APPROVE')}>
                <Ionicons name="checkmark-circle-outline" size={16} color={Colors.success}/>
                <Text style={styles.approveButtonText}>{localizedUiText.m_ed927c65d0cb}</Text>
              </Pressable>
            </View>
          </View>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.emptyContainer}>
            <Ionicons name="shield-checkmark-outline" size={64} color={Colors.border}/>
            <Text style={styles.emptyTitle}>{localizedUiText.m_b4a1126995bc}</Text>
            <Text style={styles.emptySubtitle}>{localizedUiText.m_a6b5a3c1fbf0}</Text>
          </View>} refreshing={isLoading} onRefresh={refetch} showsVerticalScrollIndicator={false}/>
    </ScreenContainer>);
}

