import { Text, View, FlatList, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useResidentServiceRequests } from "../data/communityHooks";
import { styles } from "../styles/screens/ResidentServiceListingScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function ResidentServiceListingScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: requests, isLoading, refetch } = useResidentServiceRequests();
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_6484a7758ad7} onBack={() => navigation.goBack()} rightActions={<Pressable onPress={() => navigation.navigate('CreateServiceRequest')}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.primary}/>
          </Pressable>}/>

      <FlatList data={requests} keyExtractor={(item) => item.id} renderItem={({ item }) => (<Pressable style={styles.reqCard} onPress={() => navigation.navigate('ServiceRequestDetail', { requestId: item.id })}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.categorySlug.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.cardUnit}>{localizedUiText.m_4510f71bffc4 + " "}{item.postedByUnit}</Text>
              {item.budget ? (<Text style={styles.cardBudget}>{localizedUiText.m_27338ce52447 + " "}{item.budget}</Text>) : null}
            </View>
          </Pressable>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={64} color={Colors.border}/>
            <Text style={styles.emptyTitle}>{localizedUiText.m_91cbdd353f1f}</Text>
            <Text style={styles.emptySubtitle}>{localizedUiText.m_f8fb6ea41d0f}</Text>
          </View>} refreshing={isLoading} onRefresh={refetch} showsVerticalScrollIndicator={false}/>
    </ScreenContainer>);
}

