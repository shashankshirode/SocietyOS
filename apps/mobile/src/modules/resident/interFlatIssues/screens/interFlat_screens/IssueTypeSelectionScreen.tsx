import { Text, ScrollView, TouchableOpacity } from "react-native";
import { useIssueTypeSelection } from "../../data/useIssueTypeSelection";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { styles } from "../../styles/screens/interFlat_screens/IssueTypeSelectionScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function IssueTypeSelectionScreen({ navigation }: InterFlatScreenProps<'IssueTypeSelection'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useIssueTypeSelection();
    const types = (data) || [];
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_1e24aeb39693}</Text>
      <Text style={styles.subtitle}>{localizedUiText.m_64555fe6dd27}</Text>

      {types.map((t) => (<TouchableOpacity key={t.type} style={styles.card} onPress={() => {
                if (t.type === 'WATER_LEAKAGE') {
                    navigation.navigate('WaterLeakageIssue');
                }
                else if (t.type === 'NOISE_DISTURBANCE') {
                    navigation.navigate('NoiseComplaint');
                }
                else if (t.type === 'RENOVATION_DISTURBANCE') {
                    navigation.navigate('RenovationDisturbance');
                }
                else if (t.type === 'PET_NUISANCE') {
                    navigation.navigate('PetNuisanceIssue');
                }
                else if (t.type === 'COMMON_AREA_DAMAGE') {
                    navigation.navigate('CommonAreaDamageClaim');
                }
                else {
                    navigation.navigate('CreateInterFlatIssue', { issueType: t.type });
                }
            }}>
          <Text style={styles.cardTitle}>{t.title}</Text>
          <Text style={styles.cardDesc}>{t.description}</Text>
          <Text style={styles.evidenceText}>{localizedUiText.m_e77742c009ee + " "}{t.evidence}</Text>
        </TouchableOpacity>))}
    </ScrollView>);
}

