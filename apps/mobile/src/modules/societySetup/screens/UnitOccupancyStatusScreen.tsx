import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppText } from "../../../shared/components/AppText";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useSocietySetup } from "../hooks/useSocietySetup";
import { styles, createSafeAreaViewBackgroundColorStyle, createAppTextColorStyle } from "../styles/screens/UnitOccupancyStatusScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
export function UnitOccupancyStatusScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { units, isLoading } = useSocietySetup();
    return (<SafeAreaView style={[styles.container, createSafeAreaViewBackgroundColorStyle(colors.background)]} edges={['top']}>
      <AppHeader title={localizedUiText.m_98510fff4fe1} showBack onBack={navigation.goBack}/>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant="h3" style={styles.title}>{localizedUiText.m_ebe1daa31e1f}</AppText>
        {isLoading ? (<AppText variant="body">{localizedUiText.m_ede5fc15b269}</AppText>) : (units.map(unit => (<AppCard key={unit.id} style={styles.card}>
              <View style={styles.row}>
                <AppText variant="body" weight="700">{unit.unitNumber}</AppText>
                <StatusBadge label={unit.occupancyStatus.replace('_', ' ')} type={unit.occupancyStatus === 'VACANT' ? 'neutral' : 'success'}/>
              </View>
              <AppText variant="body" style={[styles.desc, createAppTextColorStyle(colors.textSecondary)]}>
                {unit.ownerName ? formatUiLiteral(localizedUiText.m_74a5d118bc1a, [unit.ownerName]) : localizedUiText.m_cda5b08b15d2}
                {unit.tenantName ? formatUiLiteral(localizedUiText.m_74a9ac2578cb, [unit.tenantName]) : ''}
              </AppText>
            </AppCard>)))}
      </ScrollView>
    </SafeAreaView>);
}

