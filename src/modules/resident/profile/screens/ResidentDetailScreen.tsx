import { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { AppText } from "../../../../shared/components/AppText";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppButton } from "../../../../shared/components/AppButton";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { ResidentsRepository } from "../data/residents.repository";
import type { ResidentProfileInfo } from "../data/residents.types";
import { styles, createAppTextColorStyle, createAppTextColorStyle2, createAppTextColorStyle3, createAppTextColorStyle4, createSafeAreaViewBackgroundColorStyle } from "../styles/screens/ResidentDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type ResidentDetailProps = {
    navigation: Pick<LegacyNavigation, 'goBack' | 'navigate'>;
    route: {
        params?: {
            residentId?: string;
        };
    };
};
export function ResidentDetailScreen({ route, navigation }: ResidentDetailProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { residentId } = route.params || {};
    const [resident, setResident] = useState<ResidentProfileInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function loadData() {
            if (residentId) {
                const data = await ResidentsRepository.getResidentDetail(residentId);
                if (data)
                    setResident(data);
            }
            setIsLoading(false);
        }
        loadData();
    }, [residentId]);
    return (<SafeAreaView style={[styles.container, createSafeAreaViewBackgroundColorStyle(colors.background)]} edges={[]}>
      <AppHeader title={localizedUiText.m_d6a81d114d5c} showBack onBack={navigation.goBack}/>
      <ScrollView contentContainerStyle={styles.scroll}>
        {isLoading ? (<ActivityIndicator size="large" color={colors.primary}/>) : resident ? (<AppCard style={styles.card}>
            <View style={styles.headerRow}>
              <AppText variant="h2">{resident.name}</AppText>
              <StatusBadge label={resident.role} type={resident.role === 'OWNER' ? 'success' : 'info'}/>
            </View>

            <View style={styles.row}>
              <AppText variant="body" style={createAppTextColorStyle(colors.textSecondary)}>{localizedUiText.m_a06b60be5296}</AppText>
              <StatusBadge label={resident.accessStatus} type={resident.accessStatus === 'ACTIVE' ? 'success' : 'danger'}/>
            </View>
            <View style={styles.row}>
              <AppText variant="body" style={createAppTextColorStyle2(colors.textSecondary)}>{localizedUiText.m_a7a0e61627df}</AppText>
              <StatusBadge label={resident.kycStatus} type={resident.kycStatus === 'APPROVED' ? 'success' : 'neutral'}/>
            </View>
            <View style={styles.row}>
              <AppText variant="body" style={createAppTextColorStyle3(colors.textSecondary)}>{localizedUiText.m_62bb9f2476a2}</AppText>
              <AppText variant="body" weight="700">{resident.policeVerified ? localizedUiText.m_4f7838402f37 : localizedUiText.m_77e07795f9c2}</AppText>
            </View>
            <View style={styles.row}>
              <AppText variant="body" style={createAppTextColorStyle4(colors.textSecondary)}>{localizedUiText.m_9113796a52c0}</AppText>
              <AppText variant="body" weight="700">{resident.vehiclesCount.toString()}</AppText>
            </View>

            <AppButton title={localizedUiText.m_f16cb452c894} onPress={() => navigation.navigate('ResidentKyc', { residentId: resident.id })} style={styles.btn}/>
            <AppButton title={localizedUiText.m_d9dcc829d680} onPress={() => navigation.navigate('ResidentAccessStatus', { residentId: resident.id })} style={styles.btn}/>
          </AppCard>) : (<AppText variant="body">{localizedUiText.m_fac42e573f92}</AppText>)}
      </ScrollView>
    </SafeAreaView>);
}

