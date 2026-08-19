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
import { useCreatePoll } from "../hooks/useCreatePoll";
import { styles, createTextColorStyle, createTextColorStyle2, createTextColorStyle3, createTextColorStyle4, createTextColorStyle5, createTextColorStyle6 } from "../styles/screens/CreatePollScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function CreatePollScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { submit, isSubmitting } = useCreatePoll();
    const [success, setSuccess] = useState(false);
    const handleAction = async () => {
        await submit({
            title: String(localizedUiText.m_7f2ad6c07c78),
            description: String(localizedUiText.m_03610c9ac782),
            pollType: 'OPINION_POLL',
            questionType: 'SINGLE_CHOICE',
            eligibility: 'ALL_MEMBERS',
            options: [{ label: String(localizedUiText.m_ae1aceae2bd2) }, { label: String(localizedUiText.m_108ce05ea99b) }],
            allowAnonymous: false,
            showResultsBeforeClose: true,
            durationDays: 7,
        });
        setSuccess(true);
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ResponsivePageHeader title={localizedUiText.m_86cb7877267d} onBack={() => navigation.goBack()}/>
        <ScrollView contentContainerStyle={styles.content}>
          <AppCard style={styles.appCardMarginBottom}>
            <Text style={[styles.title, createTextColorStyle2(colors.textPrimary)]}>{localizedUiText.m_25f36163b95a}</Text>
            <Text style={[styles.desc, createTextColorStyle3(colors.textSecondary)]}>{localizedUiText.m_fcbd0704a624}</Text>
            <StatusBadge status="COMPLIANT" label={localizedUiText.m_f4c3461edb4b}/>
          </AppCard>

          <AppCard style={styles.appCardMarginBottom2}>
            <Text style={[styles.sectionTitle, createTextColorStyle4(colors.textPrimary)]}>{localizedUiText.m_1a3171e93781}</Text>
            <DataRow label={localizedUiText.m_29894a6ccc25} value="CREATE_POLL"/>
            <DataRow label={localizedUiText.m_6d5c369331cb} value="useCreatePoll"/>
            <DataRow label={localizedUiText.m_150f3e5e3c03} value="Create poll with options"/>
          </AppCard>

          <AppCard style={styles.appCardMarginBottom3}>
            <Text style={[styles.sectionTitle, createTextColorStyle5(colors.textPrimary)]}>{localizedUiText.m_91140c8d1cad}</Text>
            {success ? (<View style={styles.successBox}>
                <Text style={createTextColorStyle(colors.success)}>{localizedUiText.m_16df3cae6505}</Text>
                <AppButton title={localizedUiText.m_daee7606b339} onPress={() => setSuccess(false)}/>
              </View>) : (<View>
                <Text style={[styles.actionText, createTextColorStyle6(colors.textPrimary)]}>{localizedUiText.m_54e5e06d08a5}</Text>
                <AppButton title={localizedUiText.m_bb791fe68da8} onPress={handleAction} loading={isSubmitting}/>
              </View>)}
          </AppCard>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

