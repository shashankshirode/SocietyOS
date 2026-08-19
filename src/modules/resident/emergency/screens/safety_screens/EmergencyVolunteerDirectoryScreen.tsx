import { Text, View, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useEmergencyVolunteers } from "../../data/useEmergencyVolunteers";
import { LoadingState } from "../../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../../shared/theme";
import { VolunteerCard } from "../../components/VolunteerCard";
import { styles } from "../../styles/screens/safety_screens/EmergencyVolunteerDirectoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'EmergencyVolunteerDirectory'>;
export function EmergencyVolunteerDirectoryScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useEmergencyVolunteers();
    if (isLoading)
        return <LoadingState message={localizedUiText.m_a9737b453208}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ScreenContainer style={styles.container}>
      <FlatList data={data} keyExtractor={item => item.id} contentContainerStyle={styles.scroll} renderItem={({ item }) => <VolunteerCard volunteer={item}/>} ListHeaderComponent={<View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{localizedUiText.m_3c0d61de5f5d}</Text>
              <Pressable style={styles.regBtn} onPress={() => navigation.navigate('EmergencyVolunteerRegistration')}>
                <Ionicons name="add" size={16} color={Colors.white}/>
                <Text style={styles.regBtnText}>{localizedUiText.m_bb7234ec1245}</Text>
              </Pressable>
            </View>
            <Text style={styles.subtitle}>{localizedUiText.m_1935ae2380eb}</Text>
          </View>} ListEmptyComponent={<View style={styles.empty}>
            <Text style={styles.emptyText}>{localizedUiText.m_2887bc5d6908}</Text>
          </View>}/>
    </ScreenContainer>);
}

