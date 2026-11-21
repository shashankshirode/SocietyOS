import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useVendorAssets } from "../hooks/useVendorAssets";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { AppButton } from "../../../shared/components/AppButton";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2, createTextColorStyle3 } from "../styles/screens/VendorListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function VendorListScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { data, isLoading, error, refetch } = useVendorAssets();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={localizedUiText.m_727c77571d34} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_16b1a90e925a} subtitle={localizedUiText.m_56eb9c6b2f2a} onBack={() => navigation.goBack()}/>
        <FlatList data={data} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
              <View style={styles.header}>
                <Text style={[styles.title, createTextColorStyle(colors.textPrimary)]}>{item.name}</Text>
                <Text style={[styles.rating, createTextColorStyle2(colors.warning)]}>★ {item.rating}</Text>
              </View>
              <Text style={[styles.desc, createTextColorStyle3(colors.textSecondary)]}>{localizedUiText.m_65d157da69bf + " "}{item.serviceType}{" " + localizedUiText.m_c0768fc62c3a + " "}{item.contactPerson} ({item.phone})</Text>
              <AppButton title={localizedUiText.m_837c74b71bb8} onPress={() => navigation.navigate('AssetDetail', { vendorId: item.id })} variant="outline" style={styles.btn}/>
            </View>)}/>
      </SafeAreaView>
    </ScreenContainer>);
}

