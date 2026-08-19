import { Text, View, ScrollView, Pressable, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { InfoRow } from "../../../shared/components/InfoRow";
import { AppButton } from "../../../shared/components/AppButton";
import { CommunityPrivacyNotice, CommunitySafetyNotice } from "../components/CommunityComponents";
import { useMarketplaceListingDetail } from "../data/communityHooks";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../../../app/navigation/navigation.types";
import { formatResidentCurrency, formatResidentDate } from "../../../core/localization/dateTimeFormatters";
import { styles } from "../styles/screens/MarketplaceListingDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<CommunityStackParamList, 'MarketplaceListingDetail'>;
export function MarketplaceListingDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { listingId } = route.params;
    const { data: listing, isLoading } = useMarketplaceListingDetail(listingId);
    const handleContactSeller = () => {
        if (!listing)
            return;
        navigation.navigate('CommunityContactRequest', {
            type: 'MARKETPLACE',
            targetId: listing.id,
            targetTitle: listing.title,
            receiverId: listing.sellerId,
            receiverName: listing.sellerName,
            receiverUnit: listing.sellerUnit,
        });
    };
    const handleReport = () => {
        if (!listing)
            return;
        navigation.navigate('ReportListing', { listingId: listing.id });
    };
    if (isLoading || !listing) {
        return (<ScreenContainer>
        <ResponsivePageHeader title={localizedUiText.m_47d2a515ef2f} onBack={() => navigation.goBack()}/>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>{localizedUiText.m_269f48a505b6}</Text>
        </View>
      </ScreenContainer>);
    }
    const isFree = listing.isGiveaway;
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_3877be691f15} onBack={() => navigation.goBack()} rightActions={<Pressable onPress={handleReport}>
            <Ionicons name="flag-outline" size={20} color={Colors.danger}/>
          </Pressable>}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {listing.imageUrl ? (<Image source={{ uri: listing.imageUrl }} style={styles.image}/>) : (<View style={styles.imagePlaceholder}>
              <Ionicons name="cart-outline" size={64} color={Colors.info}/>
              <Text style={styles.placeholderText}>{localizedUiText.m_a6842712f7a0}</Text>
            </View>)}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{listing.title}</Text>
            <StatusBadge status={listing.status} moduleType="marketplace"/>
          </View>

          <Text style={styles.price}>
            {isFree ? localizedUiText.m_5fb6fce09366 : formatResidentCurrency(listing.price ?? 0)}
          </Text>

          <View style={styles.divider}/>

          <View style={styles.infoGrid}>
            <InfoRow label={localizedUiText.m_39b36d38d6eb} value={listing.condition}/>
            <InfoRow label={localizedUiText.m_292c06f0045a} value={listing.categorySlug.toUpperCase()}/>
            <InfoRow label={localizedUiText.m_c1729016a32b} value={formatResidentDate(listing.createdAt)}/>
            <InfoRow label={localizedUiText.m_69c404591e99} value={listing.viewsCount.toString()}/>
          </View>

          <View style={styles.divider}/>

          <Text style={styles.sectionTitle}>{localizedUiText.m_526e0087cc3f}</Text>
          <Text style={styles.descriptionText}>{listing.description}</Text>

          <View style={styles.divider}/>

          <Text style={styles.sectionTitle}>{localizedUiText.m_a09b1de03ebe}</Text>
          <View style={styles.sellerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{listing.sellerName.charAt(0)}</Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{listing.sellerName}</Text>
              <Text style={styles.sellerUnit}>{localizedUiText.m_7c0e8fa6eb25 + " "}{listing.sellerUnit}</Text>
            </View>
          </View>

          <CommunityPrivacyNotice />
          <CommunitySafetyNotice />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title={isFree ? localizedUiText.m_5ae41ad5ece2 : localizedUiText.m_773d1600df82} onPress={handleContactSeller} variant="primary" iconLeft={<Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF"/>}/>
      </View>
    </ScreenContainer>);
}

