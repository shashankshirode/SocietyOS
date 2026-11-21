import { useState } from "react";
import { Text, View, FlatList, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useMyMarketplaceListings, useUpdateMarketplaceListing } from "../data/communityHooks";
import type { MarketplaceListing } from "../../../shared/types/marketplace.types";
import { formatResidentCurrency, formatResidentDate } from "../../../core/localization/dateTimeFormatters";
import { styles } from "../styles/screens/MyMarketplaceListingsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function MyMarketplaceListingsScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: listings, isLoading, refetch } = useMyMarketplaceListings();
    const { mutateAsync: updateListing } = useUpdateMarketplaceListing();
    const [errorMessage, setErrorMessage] = useState('');
    const handleToggleStatus = async (listingId: string, currentStatus: MarketplaceListing['status']) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        try {
            setErrorMessage('');
            await updateListing({ id: listingId, dto: { status: newStatus } });
            refetch();
        }
        catch {
            setErrorMessage(getActiveUiLiteral("m_500168b90643"));
        }
    };
    const handleMarkSold = async (listingId: string) => {
        try {
            setErrorMessage('');
            await updateListing({ id: listingId, dto: { status: 'SOLD' } });
            refetch();
        }
        catch {
            setErrorMessage(getActiveUiLiteral("m_2837fccdec90"));
        }
    };
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_70d520a65f2e} onBack={() => navigation.goBack()}/>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <FlatList data={listings} keyExtractor={(item) => item.id} renderItem={({ item }) => (<View style={styles.myListingCard}>
            <View style={styles.itemHeader}>
              <View style={styles.titleSection}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.itemPrice}>
                  {item.isGiveaway ? localizedUiText.m_f411a1fb6275 : formatResidentCurrency(item.price ?? 0)}
                </Text>
              </View>
              <StatusBadge status={item.status} moduleType="marketplace"/>
            </View>

            <Text style={styles.itemMeta}>{localizedUiText.m_b6e45f9e9005}{item.viewsCount}{" " + localizedUiText.m_9ab2f327b98f + " "}{formatResidentDate(item.createdAt)}
            </Text>

            <View style={styles.actionRow}>
              {item.status !== 'SOLD' ? (<>
                  <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={() => handleToggleStatus(item.id, item.status)}>
                    <Ionicons name={item.status === 'ACTIVE' ? 'pause-outline' : 'play-outline'} size={16} color={Colors.primary}/>
                    <Text style={styles.secondaryButtonText}>
                      {item.status === 'ACTIVE' ? localizedUiText.m_858e4ba7a29f : localizedUiText.m_24433c70eba5}
                    </Text>
                  </Pressable>

                  <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={() => handleMarkSold(item.id)}>
                    <Ionicons name="checkmark-circle-outline" size={16} color="#FFF"/>
                    <Text style={styles.primaryButtonText}>{localizedUiText.m_8aada1f016a2}</Text>
                  </Pressable>
                </>) : (<Text style={styles.soldText}>{localizedUiText.m_9b50f1e91587}</Text>)}

              <Pressable style={styles.editIcon} onPress={() => navigation.navigate('EditMarketplaceListing', { listingId: item.id })}>
                <Ionicons name="create-outline" size={20} color={Colors.neutral}/>
              </Pressable>
            </View>
          </View>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color={Colors.border}/>
            <Text style={styles.emptyTitle}>{localizedUiText.m_0febeaa825ff}</Text>
            <Text style={styles.emptySubtitle}>{localizedUiText.m_55b8e675f6af}</Text>
          </View>} refreshing={isLoading} onRefresh={refetch} showsVerticalScrollIndicator={false}/>
    </ScreenContainer>);
}

