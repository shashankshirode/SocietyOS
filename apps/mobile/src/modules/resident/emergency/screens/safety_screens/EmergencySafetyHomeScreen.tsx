import { Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useEmergencyHome } from "../../data/useEmergencyHome";
import { LoadingState } from "../../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../../shared/theme";
import { EmergencyActionCard } from "../../components/EmergencyActionCard";
import { EmergencyIncidentCard } from "../../components/EmergencyIncidentCard";
import { EmergencyPrivacyNotice } from "../../components/EmergencyPrivacyNotice";
import { styles } from "../../styles/screens/safety_screens/EmergencySafetyHomeScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'EmergencySafetyHome'>;
export function EmergencySafetyHomeScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useEmergencyHome();
    if (isLoading)
        return <LoadingState message={localizedUiText.m_5e411984f419} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_3b41ba9c7cb8}/>;
    const homeData = data;
    return (<ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>{localizedUiText.m_a53398a3ea45}</Text>
          <Text style={styles.subtitle}>{homeData.societyName}{" " + localizedUiText.m_49454fbf4609}</Text>
        </View>

        <EmergencyPrivacyNotice style={styles.notice}/>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_58d7301c40ce}</Text>
          <View style={styles.sosRow}>
            <Pressable style={styles.sosBtn} onPress={() => navigation.navigate('SosQuickAction')}>
              <Ionicons name="notifications-circle" size={40} color={Colors.white}/>
              <Text style={styles.sosBtnText}>{localizedUiText.m_8d175fb1c0d1}</Text>
            </Pressable>
          </View>

          <View style={styles.actionGrid}>
            <EmergencyActionCard title={localizedUiText.m_fec80bef0d8a} icon="medical" color={Colors.danger} onPress={() => navigation.navigate('MedicalEmergency')}/>
            <EmergencyActionCard title={localizedUiText.m_db70deae6481} icon="flame" color={Colors.danger} onPress={() => navigation.navigate('FireAlert')}/>
            <EmergencyActionCard title={localizedUiText.m_5c21f060b33b} icon="exit" color={Colors.warning} onPress={() => navigation.navigate('LiftStuckAlert')}/>
            <EmergencyActionCard title={localizedUiText.m_c422428f906e} icon="shield" color={Colors.warning} onPress={() => navigation.navigate('SecurityThreatAlert')}/>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{localizedUiText.m_a1519aac8ef1}{homeData.activeCount})</Text>
            <Pressable onPress={() => navigation.navigate('MyEmergencyHistory')}>
              <Text style={styles.linkText}>{localizedUiText.m_2801b9209218}</Text>
            </Pressable>
          </View>
          {homeData.recentIncidents.map((incident) => (<EmergencyIncidentCard key={incident.id} incident={incident} onPress={() => navigation.navigate('ActiveEmergencyDetail', { incidentId: incident.id })}/>))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_0a978934277a}</Text>
          <View style={styles.rowGrid}>
            <Pressable style={styles.careCard} onPress={() => navigation.navigate('SeniorCitizenProfile', {})}>
              <Ionicons name="person" size={24} color={Colors.primary}/>
              <Text style={styles.careLabel}>{localizedUiText.m_2db0d128ffc4}</Text>
            </Pressable>
            <Pressable style={styles.careCard} onPress={() => navigation.navigate('SeniorSimpleMode')}>
              <Ionicons name="grid" size={24} color={Colors.primary}/>
              <Text style={styles.careLabel}>{localizedUiText.m_9d988fd81c28}</Text>
            </Pressable>
            <Pressable style={styles.careCard} onPress={() => navigation.navigate('EmergencyVolunteerDirectory')}>
              <Ionicons name="people" size={24} color={Colors.primary}/>
              <Text style={styles.careLabel}>{localizedUiText.m_6781473b72a1}</Text>
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </ScreenContainer>);
}

