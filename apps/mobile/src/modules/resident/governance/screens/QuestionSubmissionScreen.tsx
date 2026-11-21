import { useMemo, useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { FormField } from "../../../../ui/forms/FormField";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useQuestionSubmission } from "../hooks/useQuestionSubmission";
import type { SubmitQuestionInput } from "../data/governance.dto";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorStyle, createTextInputColorBackgroundColorBorderColorStyle, createTextInputColorBackgroundColorBorderColorStyle2, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2 } from "../styles/screens/QuestionSubmissionScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type QuestionCategory = SubmitQuestionInput['category'];
type QuestionVisibility = SubmitQuestionInput['visibility'];
type QuestionSubmissionProps = {
    navigation: {
        goBack: () => void;
    };
    route?: {
        params?: {
            meetingId?: string;
            agendaItemId?: string;
        };
    };
};
const categories: QuestionCategory[] = ['FINANCIAL', 'MAINTENANCE', 'GOVERNANCE', 'COMPLIANCE', 'FACILITY', 'SECURITY', 'OTHER'];
const visibilityOptions: {
    id: QuestionVisibility;
    label: string;
}[] = [
    { id: 'VISIBLE_TO_COMMITTEE', get label() {
            return getActiveUiLiteral("m_4dec659e3620");
        } },
    { id: 'PUBLIC_IN_MEETING', get label() {
            return getActiveUiLiteral("m_b7561920534e");
        } },
    { id: 'ANONYMOUS_TO_RESIDENTS', get label() {
            return getActiveUiLiteral("m_6a59754971b6");
        } },
    { id: 'PRIVATE_RESPONSE_REQUESTED', get label() {
            return getActiveUiLiteral("m_56dbb5acf1e9");
        } },
];
export function QuestionSubmissionScreen({ navigation, route }: QuestionSubmissionProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const meetingId = route?.params?.meetingId ?? '';
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [category, setCategory] = useState<QuestionCategory>('GOVERNANCE');
    const [visibility, setVisibility] = useState<QuestionVisibility>('VISIBLE_TO_COMMITTEE');
    const { submit, isSubmitting } = useQuestionSubmission();
    const titleError = title.length > 0 && title.trim().length < 5 ? getActiveUiLiteral("m_dba5498cfd77") : undefined;
    const detailsError = details.length > 0 && details.trim().length < 15 ? getActiveUiLiteral("m_eb55117662fe") : undefined;
    const isValid = useMemo(() => Boolean(meetingId && title.trim().length >= 5 && title.trim().length <= 100 && details.trim().length >= 15 && details.trim().length <= 1000), [meetingId, title, details]);
    const handleSubmit = async () => {
        if (!isValid || isSubmitting)
            return;
        const result = await submit({
            meetingId,
            ...includeWhenPresent("agendaItemId", route?.params?.agendaItemId),
            title: title.trim(),
            details: details.trim(),
            category,
            visibility
        });
        if (!result.ok) {
            AppAlert.alert(String(localizedUiText.m_379142be23da), result.error.message);
            return;
        }
        AppAlert.alert(String(localizedUiText.m_c3d5ed3730b8), formatUiLiteral(String(localizedUiText.m_b65b27944265), [result.data.referenceNumber]), [
            { text: String(localizedUiText.m_11a6767d5674), onPress: navigation.goBack },
        ]);
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_17f945e6ee6e} showBackButton/>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!meetingId ? (<SafeText variant="body" style={createSafeTextColorStyle(theme.danger)}>{localizedUiText.m_12ebdefe7fd1}</SafeText>) : null}
        <FormField label={localizedUiText.m_f120abfc4363} required {...includeWhenPresent("errorText", titleError)} characterCountText={`${title.length}/100`}>
          <TextInput value={title} onChangeText={(value) => setTitle(value.slice(0, 100))} placeholder={localizedUiText.m_390c288cc475} placeholderTextColor={theme.textSecondary} style={[styles.input, createTextInputColorBackgroundColorBorderColorStyle(theme.textPrimary, theme.surface, titleError ? theme.danger : theme.border)]}/>
        </FormField>
        <FormField label={localizedUiText.m_45989de49fb7} required {...includeWhenPresent("errorText", detailsError)} characterCountText={`${details.length}/1000`}>
          <TextInput value={details} onChangeText={(value) => setDetails(value.slice(0, 1000))} placeholder={localizedUiText.m_dbdd93406b4a} placeholderTextColor={theme.textSecondary} multiline textAlignVertical="top" style={[styles.input, styles.multiline, createTextInputColorBackgroundColorBorderColorStyle2(theme.textPrimary, theme.surface, detailsError ? theme.danger : theme.border)]}/>
        </FormField>
        <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)}>{localizedUiText.m_292c06f0045a}</SafeText>
        <View style={styles.chips}>
          {categories.map((value) => (<Pressable key={value} onPress={() => setCategory(value)}>
              <View style={[styles.chip, createViewBackgroundColorBorderColorStyle(category === value ? theme.accent : theme.surface, category === value ? theme.accent : theme.border)]}>
                <SafeText variant="tiny" style={createSafeTextColorStyle3(category === value ? '#FFFFFF' : theme.textPrimary)}>{value.replaceAll('_', ' ')}</SafeText>
              </View>
            </Pressable>))}
        </View>
        <SafeText variant="bodyStrong" style={createSafeTextColorStyle4(theme.textPrimary)}>{localizedUiText.m_7448611d5f93}</SafeText>
        <View style={styles.chips}>
          {visibilityOptions.map((option) => (<Pressable key={option.id} onPress={() => setVisibility(option.id)}>
              <View style={[styles.chip, createViewBackgroundColorBorderColorStyle2(visibility === option.id ? theme.accent : theme.surface, visibility === option.id ? theme.accent : theme.border)]}>
                <SafeText variant="tiny" style={createSafeTextColorStyle5(visibility === option.id ? '#FFFFFF' : theme.textPrimary)}>{option.label}</SafeText>
              </View>
            </Pressable>))}
        </View>
        <AppButton title={localizedUiText.m_8f1d3e684e78} onPress={() => void handleSubmit()} disabled={!isValid || isSubmitting} loading={isSubmitting}/>
      </ScrollView>
    </View>);
}

