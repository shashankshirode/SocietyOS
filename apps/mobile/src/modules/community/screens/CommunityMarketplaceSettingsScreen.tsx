import { useState, useEffect } from "react";
import { Text, View, ScrollView, Switch, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { useCommunitySettings, useUpdateCommunitySettings } from "../data/communityHooks";
import { useMessages } from "../../../messages";
import { AppAlert } from "../../../ui/modal";
import { styles } from "../styles/screens/CommunityMarketplaceSettingsScreen.styles";
export function CommunityMarketplaceSettingsScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useMessages().uiLiterals;
    const messages = useMessages();
    const { data: settings, isLoading } = useCommunitySettings();
    const { mutateAsync: updateSettings, isPending } = useUpdateCommunitySettings();
    const [allowMarketplace, setAllowMarketplace] = useState(true);
    const [requireMod, setRequireMod] = useState(false);
    const [maxListings, setMaxListings] = useState('10');
    const [allowBorrow, setAllowBorrow] = useState(true);
    useEffect(() => {
        if (settings) {
            setAllowMarketplace(settings.allowResidentMarketplace);
            setRequireMod(settings.requireModerationBeforePublishing);
            setMaxListings(settings.maxActiveListingsPerResident.toString());
            setAllowBorrow(settings.allowBorrowLend);
        }
    }, [settings]);
    const handleSave = async () => {
        try {
            await updateSettings({
                allowResidentMarketplace: allowMarketplace,
                requireModerationBeforePublishing: requireMod,
                maxActiveListingsPerResident: Number(maxListings),
                allowBorrowLend: allowBorrow,
            });
            navigation.goBack();
        }
        catch {
            AppAlert.alert(messages.errors.genericTitle, messages.errors.genericDescription, [{ text: messages.common.ok }]);
        }
    };
    if (isLoading || !settings) {
        return (<ScreenContainer>
        <ResponsivePageHeader title={localizedUiText.m_74a883a037bc} onBack={() => navigation.goBack()}/>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>{localizedUiText.m_157fd50d1133}</Text>
        </View>
      </ScreenContainer>);
    }
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_2d2fc7fe6758} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>{localizedUiText.m_e7e4249621e9}</Text>
        <Pressable style={styles.adminRow} onPress={() => navigation.navigate('MarketplaceModerationQueue')}>
          <View style={styles.adminRowLeft}>
            <Ionicons name="shield-checkmark-outline" size={22} color={Colors.primary}/>
            <View>
              <Text style={styles.adminRowTitle}>{localizedUiText.m_d75680379df4}</Text>
              <Text style={styles.adminRowDesc}>{localizedUiText.m_bfcf64befad8}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.border}/>
        </Pressable>

        <Pressable style={styles.adminRow} onPress={() => navigation.navigate('CommunitySafetyGuidelines')}>
          <View style={styles.adminRowLeft}>
            <Ionicons name="document-text-outline" size={22} color={Colors.info}/>
            <View>
              <Text style={styles.adminRowTitle}>{localizedUiText.m_4a3a88c90ba1}</Text>
              <Text style={styles.adminRowDesc}>{localizedUiText.m_18da87b6c7ac}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.border}/>
        </Pressable>

        <View style={styles.divider}/>

        
        <Text style={styles.sectionTitle}>{localizedUiText.m_e4943db6b060}</Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleLabel}>{localizedUiText.m_982540010088}</Text>
            <Text style={styles.toggleDesc}>{localizedUiText.m_256ccf623150}</Text>
          </View>
          <Switch value={allowMarketplace} onValueChange={setAllowMarketplace} trackColor={{ false: Colors.border, true: Colors.primary }}/>
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleLabel}>{localizedUiText.m_3880f93b0cfe}</Text>
            <Text style={styles.toggleDesc}>{localizedUiText.m_7d47a6cf996a}</Text>
          </View>
          <Switch value={requireMod} onValueChange={setRequireMod} trackColor={{ false: Colors.border, true: Colors.primary }}/>
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleLabel}>{localizedUiText.m_ac951ecc9541}</Text>
            <Text style={styles.toggleDesc}>{localizedUiText.m_6ba72c5ecb0a}</Text>
          </View>
          <Switch value={allowBorrow} onValueChange={setAllowBorrow} trackColor={{ false: Colors.border, true: Colors.primary }}/>
        </View>

        <FormField label={localizedUiText.m_a112a95816d3} placeholder="10" value={maxListings} onChangeText={setMaxListings} keyboardType="numeric"/>

        <View style={styles.buttonContainer}>
          <AppButton title={localizedUiText.m_b227a038322a} onPress={handleSave} variant="primary" loading={isPending}/>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

