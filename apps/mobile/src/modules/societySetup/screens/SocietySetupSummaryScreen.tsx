import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppButton } from "../../../shared/components/AppButton";
import { AppText } from "../../../shared/components/AppText";
import { AppCard } from "../../../shared/cards/AppCard";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useSocietySetup } from "../hooks/useSocietySetup";
import { styles, createAppTextColorStyle, createSafeAreaViewBackgroundColorStyle } from "../styles/screens/SocietySetupSummaryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function SocietySetupSummaryScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { units, isLoading } = useSocietySetup();
    return (<SafeAreaView style={[styles.container, createSafeAreaViewBackgroundColorStyle(colors.background)]} edges={['top']}>
      <AppHeader title={localizedUiText.m_dd1dfa9fd1c5} showBack onBack={navigation.goBack}/>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppCard style={styles.card}>
          <AppText variant="h2" style={styles.title}>{localizedUiText.m_df89658ce380}</AppText>
          <AppText variant="body" style={createAppTextColorStyle(colors.textSecondary)}>{localizedUiText.m_a0e08b9f58a7}</AppText>
        </AppCard>

        <View style={styles.statsRow}>
          <AppCard style={[styles.statBox, styles.appCardFlex]}>
            <AppText variant="h3">{localizedUiText.m_471b9b621a96}</AppText>
            <AppText variant="h1">1</AppText>
          </AppCard>
          <AppCard style={[styles.statBox, styles.appCardFlex2]}>
            <AppText variant="h3">{localizedUiText.m_9fb6669a77ea}</AppText>
            <AppText variant="h1">{isLoading ? '...' : units.length.toString()}</AppText>
          </AppCard>
        </View>

        <AppButton title={localizedUiText.m_8370280daca2} onPress={() => navigation.navigate('SocietyHierarchy')} style={styles.btn}/>
        <AppButton title={localizedUiText.m_9aaaececc9ee} onPress={() => navigation.navigate('TowerWingFloorSetup')} style={styles.btn}/>
        <AppButton title={localizedUiText.m_4715685631bc} onPress={() => navigation.navigate('UnitImportPlaceholder')} style={styles.btn}/>
        <AppButton title={localizedUiText.m_f73acea2ec3e} onPress={() => navigation.navigate('SocietyConfiguration')} style={styles.btn}/>
      </ScrollView>
    </SafeAreaView>);
}

