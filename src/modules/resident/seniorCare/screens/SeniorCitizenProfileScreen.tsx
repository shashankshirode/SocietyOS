import { AppAlert } from "../../../../ui/modal/AppAlert";
import { Text, View, Pressable, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../app/navigation/navigation.types";
import { useSeniorCareProfile } from "../../emergency/data/useSeniorCareProfile";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../shared/theme";
import { EmergencyPrivacyNotice } from "../../emergency/components/EmergencyPrivacyNotice";
import { styles } from "../styles/screens/SeniorCitizenProfileScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'SeniorCitizenProfile'>;
export function SeniorCitizenProfileScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, updateProfile, refetch } = useSeniorCareProfile();
    const handleToggleSeniorCare = async (value: boolean) => {
        try {
            await updateProfile({ seniorCareStatus: value ? 'ENABLED' : 'NOT_ENABLED', consentConfirmed: value });
            AppAlert.alert(String(localizedUiText.m_f10137b6115a), formatUiLiteral(String(localizedUiText.m_9de64b4e2d25), [value ? String(localizedUiText.m_fb9cf75606b4) : String(localizedUiText.m_17eb3c0168d0)]));
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_63f6bf5375c1));
        }
    };
    const handleToggleDailyCheckIn = async (value: boolean) => {
        try {
            await updateProfile({ dailyCheckInEnabled: value });
            AppAlert.alert(String(localizedUiText.m_f10137b6115a), formatUiLiteral(String(localizedUiText.m_3678d80b9d2e), [value ? String(localizedUiText.m_fb9cf75606b4) : String(localizedUiText.m_17eb3c0168d0)]));
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_63f6bf5375c1));
        }
    };
    if (isLoading)
        return <LoadingState message={localizedUiText.m_d5ae4eb92406}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_3b41ba9c7cb8}/>;
    const profileData = data;
    return (<ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>{localizedUiText.m_c528567781ea}</Text>
          <Text style={styles.subtitle}>{localizedUiText.m_8b02f755a42d}</Text>
        </View>

        <EmergencyPrivacyNotice style={styles.notice}/>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>{localizedUiText.m_a12957be53c2}</Text>
              <Text style={styles.rowDesc}>{localizedUiText.m_dad0d302b555}</Text>
            </View>
            <Switch value={profileData.seniorCareStatus === 'ENABLED'} onValueChange={handleToggleSeniorCare}/>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>{localizedUiText.m_a7ecaa91f286}</Text>
              <Text style={styles.rowDesc}>{localizedUiText.m_eb2dfd1581eb}</Text>
            </View>
            <Switch value={profileData.dailyCheckInEnabled} onValueChange={handleToggleDailyCheckIn}/>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_65f1ee42981d}</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{localizedUiText.m_dcd1d5223f73}</Text>
              <Text style={styles.val}>{profileData.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{localizedUiText.m_15b61974b270}</Text>
              <Text style={styles.val}>{profileData.tower} {profileData.flatNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{localizedUiText.m_a155fd8553af}</Text>
              <Text style={styles.val}>{profileData.preferredHelpType || localizedUiText.m_0d25481ea4f3}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{localizedUiText.m_62ca555a5d78}</Text>
              <Text style={styles.val}>{profileData.securityCheckCallPreference || localizedUiText.m_dc937b598926}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.btn} onPress={() => navigation.navigate('SeniorSimpleMode')}>
            <Ionicons name="grid-outline" size={18} color={Colors.white}/>
            <Text style={styles.btnText}>{localizedUiText.m_434934a5b20a}</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnSec]} onPress={() => navigation.navigate('SeniorDailyCheckIn')}>
            <Ionicons name="checkmark-done-circle-outline" size={18} color={Colors.primary}/>
            <Text style={styles.btnTextSec}>{localizedUiText.m_cea19f5f577e}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

