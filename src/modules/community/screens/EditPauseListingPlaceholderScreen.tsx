import { useState, useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { useMarketplaceListingDetail, useUpdateMarketplaceListing } from "../data/communityHooks";
import type { EditMarketplaceListingScreenProps } from "../../../app/navigation/navigation.types";
import { getErrorMessage } from "../../../core/errors/getErrorMessage";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/EditPauseListingPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function EditMarketplaceListingScreen({ route, navigation }: EditMarketplaceListingScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { listingId } = route.params;
    const { data: listing, isLoading } = useMarketplaceListingDetail(listingId);
    const { mutateAsync: updateListing, isPending } = useUpdateMarketplaceListing();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        if (listing) {
            setTitle(listing.title);
            setDescription(listing.description);
            setPrice(listing.price ? listing.price.toString() : '');
        }
    }, [listing]);
    const handleSave = async () => {
        if (!title || !description) {
            setError(getActiveUiLiteral("m_72ab96ee98a1"));
            return;
        }
        try {
            await updateListing({
                id: listingId,
                dto: {
                    title,
                    description,
                    ...includeWhenPresent("price", price ? Number(price) : undefined)
                }
            });
            navigation.goBack();
        }
        catch (err) {
            setError(getErrorMessage(err, getActiveUiLiteral("m_750d6ea60f17")));
        }
    };
    if (isLoading || !listing) {
        return (<ScreenContainer>
        <ResponsivePageHeader title={localizedUiText.m_fc1d34745a85} onBack={() => navigation.goBack()}/>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>{localizedUiText.m_47d2a515ef2f}</Text>
        </View>
      </ScreenContainer>);
    }
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_fc1d34745a85} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {error ? (<View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>) : null}

        <FormField label={localizedUiText.m_8b664cebf0a5} placeholder={localizedUiText.m_ac651397888b} value={title} onChangeText={setTitle}/>

        {!listing.isGiveaway && (<FormField label={localizedUiText.m_2b20ca63a623} placeholder={localizedUiText.m_d3edec8b22d6} value={price} onChangeText={setPrice} keyboardType="numeric"/>)}

        <FormField label={localizedUiText.m_056722e9d5c7} placeholder={localizedUiText.m_4595b7764ad3} value={description} onChangeText={setDescription} multiline numberOfLines={4} style={styles.textArea}/>

        <View style={styles.buttonContainer}>
          <AppButton title={localizedUiText.m_35322b5bb5a2} onPress={handleSave} variant="primary" loading={isPending}/>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

