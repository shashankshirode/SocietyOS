import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { DataRow } from "../../../shared/dataDisplay/DataRow";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useShiftRoster } from "../data/useShiftRoster";
import { styles, createTextColorStyle, createTextColorStyle2, createTextColorStyle3, createTextColorStyle4, createTextColorStyle5, createTextColorStyle6 } from "../styles/screens/ShiftRosterScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function ShiftRosterScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { data, rosterSummary, isLoading, error, refetch } = useShiftRoster();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ResponsivePageHeader title={localizedUiText.m_0a60d5a8fef7} subtitle={localizedUiText.m_09102fb8a18f} onBack={() => navigation.goBack()}/>
        <ScrollView contentContainerStyle={styles.content}>
          <AppCard style={styles.card}>
            <DataRow label={localizedUiText.m_29894a6ccc25} value="SHIFT_ROSTER"/>
            <DataRow label={localizedUiText.m_6d5c369331cb} value="useShiftRoster"/>
          </AppCard>

          <View style={styles.metrics}>
            {Object.entries(rosterSummary).map(([label, value]) => (<AppCard key={label} style={styles.metricCard}>
                <Text style={[styles.metric, createTextColorStyle(colors.primary)]}>{value}</Text>
                <Text style={[styles.copy, createTextColorStyle2(colors.textSecondary)]}>{label}</Text>
              </AppCard>))}
          </View>

          {isLoading ? (<Text style={[styles.copy, createTextColorStyle3(colors.textSecondary)]}>{localizedUiText.m_64888d823b53}</Text>) : error ? (<AppButton title={localizedUiText.m_e6daa9dd14c6} onPress={refetch}/>) : data.length === 0 ? (<Text style={[styles.copy, createTextColorStyle4(colors.textSecondary)]}>{localizedUiText.m_19cd64b0e030}</Text>) : (data.map((shift) => (<AppCard key={shift.id} style={styles.card}>
                <View style={styles.row}>
                  <Text style={[styles.title, createTextColorStyle5(colors.textPrimary)]}>{shift.shiftName}</Text>
                  <StatusBadge status={shift.status} moduleType="facility"/>
                </View>
                <Text style={[styles.copy, createTextColorStyle6(colors.textSecondary)]}>{shift.startTime} - {shift.endTime}</Text>
              </AppCard>)))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

