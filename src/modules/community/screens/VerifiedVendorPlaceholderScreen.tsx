import { Text, View, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useVerifiedVendors } from "../data/communityHooks";
import { styles } from "../styles/screens/VerifiedVendorPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function VerifiedVendorsScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: vendors, isLoading } = useVerifiedVendors();
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_7bc8d0563571} onBack={() => navigation.goBack()}/>

      <FlatList data={vendors} keyExtractor={(item) => item.id} renderItem={({ item }) => (<View style={styles.vendorCard}>
            <View style={styles.cardHeader}>
              <View style={styles.headerLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name="ribbon-outline" size={24} color={Colors.success}/>
                </View>
                <View>
                  <Text style={styles.vendorName}>{item.name}</Text>
                  <Text style={styles.vendorCategory}>{item.category}</Text>
                </View>
              </View>
              <StatusBadge status={item.status} moduleType="moderation"/>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FFD700"/>
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>
              <Text style={styles.verifiedText}>{localizedUiText.m_566f7513f3d3}</Text>
            </View>
          </View>)} contentContainerStyle={styles.listContent} ListHeaderComponent={<View style={styles.headerBanner}>
            <Ionicons name="shield-checkmark" size={24} color={Colors.success}/>
            <Text style={styles.bannerText}>{localizedUiText.m_a91a9836949e}</Text>
          </View>} refreshing={isLoading} showsVerticalScrollIndicator={false}/>
    </ScreenContainer>);
}

