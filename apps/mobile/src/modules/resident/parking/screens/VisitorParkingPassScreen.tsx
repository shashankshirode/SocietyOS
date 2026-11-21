import { useState } from "react";
import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { AppButton } from "../../../../shared/components/AppButton";
import { AppCard } from "../../../../shared/cards/AppCard";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { DataRow } from "../../../../shared/dataDisplay/DataRow";
import { useVisitorParkingPass } from "../hooks/useVisitorParkingPass";
import { styles, createTextColorStyle, createTextColorStyle2, createTextColorStyle3, createTextColorStyle4, createTextColorStyle5, createTextColorStyle6 } from "../styles/screens/VisitorParkingPassScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function VisitorParkingPassScreen({ navigation, }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { submit, isSubmitting } = useVisitorParkingPass();
    const [success, setSuccess] = useState(false);
    const handleAction = async () => {
        await submit({
            societyId: "society-gvh",
            unitId: "unit-gvh-a-1204",
            visitorName: "Rahul Mehta",
            mobileNumber: "7276834907",
            vehicleNumber: "MH15AB1234",
            vehicleType: "CAR",
            visitPurpose: String(localizedUiText.m_a5a684d86908),
            expectedDate: new Date().toISOString().slice(0, 10),
            expectedTime: "18:00",
            duration: "2 hours",
            visitingFlat: "A-1204",
        });
        setSuccess(true);
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={["left", "right"]}>
        <ResponsivePageHeader title={localizedUiText.m_f37979bced16} onBack={() => navigation.goBack()}/>
        <ScrollView contentContainerStyle={styles.content}>
          <AppCard style={styles.appCardMarginBottom}>
            <Text style={[styles.title, createTextColorStyle2(colors.textPrimary)]}>{localizedUiText.m_25f36163b95a}</Text>
            <Text style={[styles.desc, createTextColorStyle3(colors.textSecondary)]}>{localizedUiText.m_f25804a9d8ae}</Text>
            <StatusBadge status="COMPLIANT" label={localizedUiText.m_f4c3461edb4b}/>
          </AppCard>

          <AppCard style={styles.appCardMarginBottom2}>
            <Text style={[styles.sectionTitle, createTextColorStyle4(colors.textPrimary)]}>{localizedUiText.m_1a3171e93781}</Text>
            <DataRow label={localizedUiText.m_29894a6ccc25} value="VISITOR_PARKING_PASS"/>
            <DataRow label={localizedUiText.m_6d5c369331cb} value="useVisitorParkingPass"/>
            <DataRow label={localizedUiText.m_150f3e5e3c03} value="Create visitor parking pass with expiry"/>
          </AppCard>

          <AppCard style={styles.appCardMarginBottom3}>
            <Text style={[styles.sectionTitle, createTextColorStyle5(colors.textPrimary)]}>{localizedUiText.m_91140c8d1cad}</Text>
            {success ? (<View style={styles.successBox}>
                <Text style={createTextColorStyle(colors.success)}>{localizedUiText.m_16df3cae6505}</Text>
                <AppButton title={localizedUiText.m_daee7606b339} onPress={() => setSuccess(false)}/>
              </View>) : (<View>
                <Text style={[styles.actionText, createTextColorStyle6(colors.textPrimary)]}>{localizedUiText.m_2939c573a580}</Text>
                <AppButton title={localizedUiText.m_bb791fe68da8} onPress={handleAction} loading={isSubmitting}/>
              </View>)}
          </AppCard>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

