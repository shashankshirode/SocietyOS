import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AutomationPreviewPanel } from "../components/AutomationPreviewPanel";
import type { AutomationPreview } from "../data/automation.types";
import { useSmartDocumentSearchPreview } from "../hooks/useSmartDocumentSearchPreview";
import { validateAutomationPreviewInput } from "../validators/automation.validators";
import { styles } from "../styles/screens/SmartDocumentSearchPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SMART_DOCUMENT_SEARCH'>;
export function SmartDocumentSearchPlaceholderScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { submit, isSubmitting } = useSmartDocumentSearchPreview();
    const [input, setInput] = React.useState(getActiveUiLiteral("m_36111404a754"));
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
        <ResponsivePageHeader title={localizedUiText.m_b31f4a0b756f} subtitle={localizedUiText.m_6e501fc642fc} onBack={() => navigation.goBack()}/>
        <AutomationPreviewPanel input={input} onInputChange={setInput} onSubmit={handleSubmit} isSubmitting={isSubmitting} preview={preview} error={validationError}/>
      </SafeAreaView>
    </ScreenContainer>);
}

