import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { DataRow } from "../../../shared/dataDisplay/DataRow";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useStaffVerification } from "../data/useStaffVerification";
import { styles, createTextColorStyle, createTextColorStyle2 } from "../styles/screens/StaffVerificationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function StaffVerificationScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { data, approve } = useStaffVerification();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ResponsivePageHeader title={localizedUiText.m_5ee0350276b7} subtitle={localizedUiText.m_2b0b7efa618a} onBack={() => navigation.goBack()}/>
        <ScrollView contentContainerStyle={styles.content}>
          <AppCard style={styles.card}>
            <DataRow label={localizedUiText.m_29894a6ccc25} value="STAFF_VERIFICATION"/>
            <DataRow label={localizedUiText.m_6d5c369331cb} value="useStaffVerification"/>
          </AppCard>

          {data.map((staff) => (<AppCard key={staff.id} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.textBlock}>
                  <Text style={[styles.title, createTextColorStyle(colors.textPrimary)]}>{staff.name}</Text>
                  <Text style={[styles.copy, createTextColorStyle2(colors.textSecondary)]}>{staff.role}</Text>
                </View>
                <StatusBadge status={staff.status} moduleType="facility"/>
              </View>
              <AppButton title={localizedUiText.m_f07368a0b391} onPress={() => approve(staff.id)} fullWidth/>
            </AppCard>))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

