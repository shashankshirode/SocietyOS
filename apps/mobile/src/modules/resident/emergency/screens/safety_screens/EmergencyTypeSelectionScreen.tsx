import { Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useEmergencyTypeSelection } from "../../data/useEmergencyTypeSelection";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../../shared/theme";
import { styles } from "../../styles/screens/safety_screens/EmergencyTypeSelectionScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'EmergencyTypeSelection'>;
export function EmergencyTypeSelectionScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { emergencyTypes } = useEmergencyTypeSelection();
    return (<ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{localizedUiText.m_7b5e5a1cb361}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_2e016dea63d0}</Text>

        {emergencyTypes.map(item => (<Pressable key={item.type} style={styles.card} onPress={() => {
                if (item.type === 'MEDICAL')
                    navigation.navigate('MedicalEmergency');
                else if (item.type === 'FIRE')
                    navigation.navigate('FireAlert');
                else if (item.type === 'LIFT_STUCK')
                    navigation.navigate('LiftStuckAlert');
                else if (item.type === 'SECURITY_THREAT')
                    navigation.navigate('SecurityThreatAlert');
                else
                    navigation.navigate('EmergencyConfirmation', { emergencyType: item.type });
            }}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted}/>
          </Pressable>))}
      </ScrollView>
    </ScreenContainer>);
}

