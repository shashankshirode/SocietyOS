import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useClosureProof } from "../../data/useClosureProof";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { styles } from "../../styles/screens/interFlat_screens/ClosureProofScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function ClosureProofScreen({ route, navigation }: InterFlatScreenProps<'ClosureProof'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { proposalId } = route.params;
    const { submitClosure, isSubmitting } = useClosureProof(proposalId);
    const [closureNote, setClosureNote] = useState('');
    const handleSubmit = async () => {
        if (!closureNote) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_a86bb13dda69));
            return;
        }
        await submitClosure(closureNote);
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_856535c4a3cb), [
            { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('InterFlatHome') }
        ]);
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_682cbbccae90}</Text>
      <Text style={styles.subtitle}>{localizedUiText.m_1f477ba5be00}</Text>

      <Text style={styles.label}>{localizedUiText.m_7d44ce955589}</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_1b86f71e776e} multiline value={closureNote} onChangeText={setClosureNote}/>

      <View style={styles.uploadPlaceholder}>
        <Text style={styles.uploadText}>{localizedUiText.m_4ee59656f3de}</Text>
        <Text style={styles.uploadSub}>{localizedUiText.m_6a3be1472532}</Text>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.submitBtnText}>{isSubmitting ? localizedUiText.m_f6b27b589467 : localizedUiText.m_4bdaf0e74e46}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

