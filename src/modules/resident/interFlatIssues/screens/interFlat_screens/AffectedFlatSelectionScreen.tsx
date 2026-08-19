import { useState } from "react";
import { Text, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { styles } from "../../styles/screens/interFlat_screens/AffectedFlatSelectionScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function AffectedFlatSelectionScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [tower, setTower] = useState('');
    const [flat, setFlat] = useState('');
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_fd625edd5d84}</Text>
      <Text style={styles.subtitle}>{localizedUiText.m_5aa5d0b69171}</Text>

      <Text style={styles.label}>{localizedUiText.m_ea0a79480481}</Text>
      <TextInput style={styles.input} placeholder={localizedUiText.m_4bf1d42d597b} value={tower} onChangeText={setTower}/>

      <Text style={styles.label}>{localizedUiText.m_92fccf78c843}</Text>
      <TextInput style={styles.input} placeholder={localizedUiText.m_ee30e7b261bc} value={flat} onChangeText={setFlat}/>

      <TouchableOpacity style={styles.submitBtn} onPress={() => {
            navigation.navigate('CreateInterFlatIssue', { affectedFlat: `${tower} - ${flat}` });
        }}>
        <Text style={styles.submitBtnText}>{localizedUiText.m_3b70ace10b43}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

