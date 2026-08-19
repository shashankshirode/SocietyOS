import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { AppText } from "../../../../shared/components/AppText";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppButton } from "../../../../shared/components/AppButton";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { ResidentsRepository } from "../data/residents.repository";
import { styles, createSafeAreaViewBackgroundColorStyle } from "../styles/screens/ResidentAccessStatusScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
export function ResidentAccessStatusScreen({ route, navigation }: LegacyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { residentId } = route.params || {};
    const [access, setAccess] = useState<'ACTIVE' | 'SUSPENDED'>('ACTIVE');
    useEffect(() => {
        async function loadData() {
            if (residentId) {
                const res = await ResidentsRepository.getResidentDetail(residentId);
                if (res)
                    setAccess(res.accessStatus);
            }
        }
        loadData();
    }, [residentId]);
    const toggleAccess = async () => {
        const targetStatus = access === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        if (residentId) {
            await ResidentsRepository.updateAccessStatus(residentId, targetStatus);
            setAccess(targetStatus);
            AppAlert.alert(String(localizedUiText.m_8b2d0675b4b0), formatUiLiteral(String(localizedUiText.m_9e62951ef05f), [targetStatus]));
            navigation.goBack();
        }
    };
    return (<SafeAreaView style={[styles.container, createSafeAreaViewBackgroundColorStyle(colors.background)]} edges={[]}>
      <AppHeader title={localizedUiText.m_d18bb3da3148} showBack onBack={navigation.goBack}/>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppCard style={styles.card}>
          <AppText variant="h3" style={styles.title}>{localizedUiText.m_835a33485e5b}</AppText>
          <AppText variant="body" style={styles.desc}>{localizedUiText.m_68c0059d2433}</AppText>

          <View style={styles.statusBox}>
            <AppText variant="body" weight="700">{localizedUiText.m_90cdddb9ee18 + " "}{access}</AppText>
          </View>

          <AppButton title={access === 'ACTIVE' ? localizedUiText.m_c0ec4763b9fe : localizedUiText.m_16aed40fcbff} onPress={toggleAccess} style={styles.btn}/>
        </AppCard>
      </ScrollView>
    </SafeAreaView>);
}

