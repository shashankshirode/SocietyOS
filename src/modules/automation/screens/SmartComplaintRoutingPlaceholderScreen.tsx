import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AutomationPreviewPanel } from "../components/AutomationPreviewPanel";
import type { AutomationPreview } from "../data/automation.types";
import { useSmartComplaintRoutingPreview } from "../hooks/useSmartComplaintRoutingPreview";
import { validateAutomationPreviewInput } from "../validators/automation.validators";
import { styles } from "../styles/screens/SmartComplaintRoutingPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SMART_COMPLAINT_ROUTING'>;
export function SmartComplaintRoutingPlaceholderScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { submit, isSubmitting } = useSmartComplaintRoutingPreview();
    const [input, setInput] = React.useState(getActiveUiLiteral("m_78dda4a7bf64"));
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
        <ResponsivePageHeader title={localizedUiText.m_6283e82e0afd} subtitle={localizedUiText.m_fb86f07f69b1} onBack={() => navigation.goBack()}/>
        <AutomationPreviewPanel input={input} onInputChange={setInput} onSubmit={handleSubmit} isSubmitting={isSubmitting} preview={preview} error={validationError}/>
      </SafeAreaView>
    </ScreenContainer>);
}

