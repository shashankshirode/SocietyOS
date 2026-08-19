import { Text, View, FlatList } from "react-native";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { MarketplaceListingCard } from "../components/CommunityComponents";
import { useMarketplaceListings } from "../data/communityHooks";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/ListingCategoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<CommunityStackParamList, 'ListingCategory'>;
export function ListingCategoryScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { categorySlug } = route.params;
    const categoryName = categorySlug.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
    const { data: listings, isLoading, refetch } = useMarketplaceListings(categorySlug);
    return (<ScreenContainer>
      <ResponsivePageHeader title={categoryName} onBack={() => navigation.goBack()}/>

      <FlatList data={listings} keyExtractor={(item) => item.id} renderItem={({ item }) => (<MarketplaceListingCard listing={item} onPress={() => navigation.navigate('MarketplaceListingDetail', { listingId: item.id })}/>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>{localizedUiText.m_b11839373655}</Text>
            <Text style={styles.emptySubtitle}>{localizedUiText.m_dadc7e054ddb + " "}{categoryName}!</Text>
          </View>} refreshing={isLoading} onRefresh={refetch} showsVerticalScrollIndicator={false}/>
    </ScreenContainer>);
}

