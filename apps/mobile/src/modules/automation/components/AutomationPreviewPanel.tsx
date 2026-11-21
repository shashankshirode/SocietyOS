import { Text, TextInput, View } from "react-native";
import { AppButton } from "../../../shared/components/AppButton";
import type { AutomationPreview } from "../data/automation.types";
import { styles } from "../styles/components/AutomationPreviewPanel.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = {
    input: string;
    onInputChange: (value: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    preview: AutomationPreview | null;
    error: string | null;
};
export function AutomationPreviewPanel({ input, onInputChange, onSubmit, isSubmitting, preview, error }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={styles.container}>
      <TextInput style={styles.input} value={input} onChangeText={onInputChange} multiline placeholder={localizedUiText.m_cabec3be32d9}/>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton title={isSubmitting ? localizedUiText.m_49286f33b674 : localizedUiText.m_81ad8ceeb55d} onPress={onSubmit} fullWidth/>
      {preview ? (<View style={styles.card}>
          <Text style={styles.title}>{preview.title}</Text>
          <Text style={styles.body}>{preview.output}</Text>
          <Text style={styles.meta}>{localizedUiText.m_170d7271521a + " "}{Math.round(preview.confidence * 100)}%</Text>
          <Text style={styles.note}>{preview.safetyNote}</Text>
        </View>) : null}
    </View>);
}

