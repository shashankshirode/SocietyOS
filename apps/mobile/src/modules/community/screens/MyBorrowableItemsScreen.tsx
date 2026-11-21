import { Text, View, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useMyBorrowableItems } from "../data/communityHooks";
import { styles } from "../styles/screens/MyBorrowableItemsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function MyBorrowableItemsScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: items, isLoading, refetch } = useMyBorrowableItems();
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_2f112add9d1d} onBack={() => navigation.goBack()}/>

      <FlatList data={items} keyExtractor={(item) => item.id} renderItem={({ item }) => (<View style={styles.itemCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.itemCategory}>{localizedUiText.m_b330d6701b55 + " "}{item.category}</Text>
              </View>
              <StatusBadge status={item.status} moduleType="borrow"/>
            </View>

            <Text style={styles.itemMeta}>{localizedUiText.m_fc3375ec9c50}{item.maxDurationDays}{" " + localizedUiText.m_2994590f99ca + " "}{item.depositRequired ? localizedUiText.m_abd979bec333 : localizedUiText.m_e869fcd6df45}
            </Text>

            <View style={styles.actionRow}>
              <Text style={styles.actionPromptText}>{localizedUiText.m_27c230d4ba6b}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.primary}/>
            </View>
          </View>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color={Colors.border}/>
            <Text style={styles.emptyTitle}>{localizedUiText.m_d1f63391d5ed}</Text>
            <Text style={styles.emptySubtitle}>{localizedUiText.m_77f93d4896be}</Text>
          </View>} refreshing={isLoading} onRefresh={refetch} showsVerticalScrollIndicator={false}/>
    </ScreenContainer>);
}

