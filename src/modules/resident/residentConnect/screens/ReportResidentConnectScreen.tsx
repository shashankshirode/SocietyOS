import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState } from "react";
import { View, ScrollView, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useReportResidentConnect } from "../data/useReportResidentConnect";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { FormField } from "../../../../shared/forms/FormField";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import type { ReportResidentConnectScreenProps } from "../../../../app/navigation/navigation.types";
import type { ReportCategory } from "../../../../shared/types/privacy.types";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBorderColorStyle, createViewPaddingBottomBorderTopColorStyle } from "../styles/screens/ReportResidentConnectScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
const CATEGORIES: {
    key: ReportCategory;
    label: string;
}[] = [
    { key: 'HARASSMENT', get label() {
            return getActiveUiLiteral("m_98a7655d026a");
        } },
    { key: 'SPAM', get label() {
            return getActiveUiLiteral("m_4630082d4d35");
        } },
    { key: 'ABUSIVE_LANGUAGE', get label() {
            return getActiveUiLiteral("m_7b6377dfaf59");
        } },
    { key: 'THREAT', get label() {
            return getActiveUiLiteral("m_c422428f906e");
        } },
    { key: 'PRIVACY_VIOLATION', get label() {
            return getActiveUiLiteral("m_19dd7312867a");
        } },
    { key: 'OTHER', get label() {
            return getActiveUiLiteral("m_d6bb41b1f7e4");
        } },
];
export function ReportResidentConnectScreen({ navigation, route }: ReportResidentConnectScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const { targetId, contextText } = route.params;
    const { submit: submitReport, isSubmitting } = useReportResidentConnect();
    const [category, setCategory] = useState<ReportCategory>('SPAM');
    const [description, setDescription] = useState('');
    const [consent, setConsent] = useState(false);
    const handleSubmit = async () => {
        if (!description.trim()) {
            AppAlert.alert(String(localizedUiText.m_8ebd61192bc6), String(localizedUiText.m_50ecc6e7af85));
            return;
        }
        if (!consent) {
            AppAlert.alert(String(localizedUiText.m_1e81a6fa6508), String(localizedUiText.m_ef8ec5dcb746));
            return;
        }
        const res = await submitReport({
            targetId,
            category,
            description,
            ...includeWhenPresent("contextText", contextText)
        });
        if (res.ok) {
            AppAlert.alert(String(localizedUiText.m_98633495953a), String(localizedUiText.m_8d4add20ef3f), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.goBack() },
            ]);
        }
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_1cf2a302f147}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PrivacyNoticePanel title={localizedUiText.m_89cc429d1989} description={localizedUiText.m_d99fc4934cea}/>

        
        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_3b8ab3447cbc}</SafeText>
          <WrapRow gap={8}>
            {CATEGORIES.map((cat) => {
            const isSelected = category === cat.key;
            return (<PressableScale key={cat.key} onPress={() => setCategory(cat.key)}>
                  <View style={[
                    styles.chip,
                    createViewBackgroundColorBorderColorStyle(isSelected ? theme.accent : theme.surface, isSelected ? 'transparent' : theme.border),
                ]}>
                    <SafeText variant="tiny" style={createSafeTextColorStyle2(isSelected ? '#FFFFFF' : theme.textPrimary)}>
                      {cat.label}
                    </SafeText>
                  </View>
                </PressableScale>);
        })}
          </WrapRow>
        </View>

        
        <View style={styles.section}>
          <FormField label={localizedUiText.m_b6a3168463a3} value={description} onChangeText={setDescription} placeholder={localizedUiText.m_42364250257c} multiline numberOfLines={4}/>
        </View>

        
        <View style={[styles.switchRow, createViewBorderColorStyle(theme.border)]}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>{localizedUiText.m_31d1a295cf43}</SafeText>
          <Switch value={consent} onValueChange={setConsent} trackColor={{ false: theme.border, true: theme.accent }}/>
        </View>
      </ScrollView>

      
      <View style={[styles.bottomBar, createViewPaddingBottomBorderTopColorStyle(insets.bottom + 12, theme.border)]}>
        <AppButton title={localizedUiText.m_e7e72948c5d5} onPress={handleSubmit} loading={isSubmitting} iconLeft={<Ionicons name="flag-outline" size={18} color="#FFFFFF"/>}/>
      </View>
    </View>);
}
export default ReportResidentConnectScreen;

