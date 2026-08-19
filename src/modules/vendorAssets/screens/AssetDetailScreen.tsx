import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useLogAssetMaintenance } from "../hooks/useVendorAssets";
import { AppButton } from "../../../shared/components/AppButton";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2, createTextColorStyle3, createTextColorStyle4, createTextColorStyle5, createTextColorStyle6 } from "../styles/screens/AssetDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function AssetDetailScreen({ route, navigation }: {
    route: {
        params: {
            assetId: string;
        };
    };
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { submit: logMaintenance } = useLogAssetMaintenance();
    const handleLog = () => {
        logMaintenance({ id: 'ast-1' });
        navigation.goBack();
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_f6374332da72} subtitle={localizedUiText.m_ada5b24837a5} onBack={() => navigation.goBack()}/>
        <View style={styles.content}>
          <View style={[styles.box, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
            <Text style={[styles.label, createTextColorStyle(colors.textSecondary)]}>{localizedUiText.m_4caf97b6d5bd}</Text>
            <Text style={[styles.val, createTextColorStyle2(colors.textPrimary)]}>{localizedUiText.m_5b630c2a9b10}</Text>

            <Text style={[styles.label, createTextColorStyle3(colors.textSecondary)]}>{localizedUiText.m_15b61974b270}</Text>
            <Text style={[styles.val, createTextColorStyle4(colors.textPrimary)]}>{localizedUiText.m_971775b466f6}</Text>

            <Text style={[styles.label, createTextColorStyle5(colors.textSecondary)]}>{localizedUiText.m_84d2205294a1}</Text>
            <Text style={[styles.val, createTextColorStyle6(colors.textPrimary)]}>2026-09-01</Text>
          </View>

          <View style={styles.actions}>
            <AppButton title={localizedUiText.m_a4639b250c58} onPress={handleLog} variant="primary"/>
          </View>
        </View>
      </SafeAreaView>
    </ScreenContainer>);
}

