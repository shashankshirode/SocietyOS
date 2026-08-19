import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AutomationPreviewPanel } from "../components/AutomationPreviewPanel";
import type { AutomationPreview } from "../data/automation.types";
import { useBillExplanationPreview } from "../hooks/useBillExplanationPreview";
import { validateAutomationPreviewInput } from "../validators/automation.validators";
import { styles } from "../styles/screens/BillExplanationAssistantPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'BILL_EXPLANATION_ASSISTANT'>;
export function BillExplanationAssistantPlaceholderScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { submit, isSubmitting } = useBillExplanationPreview();
    const [input, setInput] = React.useState(getActiveUiLiteral("m_43ebf00f609d"));
    const [validationError, setValidationError] = React.useState<string | null>(null);
    const [preview, setPreview] = React.useState<AutomationPreview | null>(null);
    async function handleSubmit() {
        const error = validateAutomationPreviewInput(input);
        setValidationError(error);
        if (error)
            return;
        const result = await submit({ input });
        if (result.ok)
            setPreview(result.data);
    }
    return (<ScreenContainer>
      <SafeAreaView style={styles.safeAreaViewFlex} edges={['bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_3289069a62d7} subtitle={localizedUiText.m_d548d9f0a732} onBack={() => navigation.goBack()}/>
        <AutomationPreviewPanel input={input} onInputChange={setInput} onSubmit={handleSubmit} isSubmitting={isSubmitting} preview={preview} error={validationError}/>
      </SafeAreaView>
    </ScreenContainer>);
}

