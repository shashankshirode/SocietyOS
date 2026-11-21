import { View, Text, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useDomesticHelpDetail } from "../data/useDomesticHelpDetail";
import { useDomesticHelpVerification } from "../data/useDomesticHelpVerification";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { styles } from "../styles/screens/DomesticHelpDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'DomesticHelpDetail'>;
export function DomesticHelpDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { domesticHelpId } = route.params;
    const { data, isLoading, error, refetch } = useDomesticHelpDetail(domesticHelpId);
    const { blockAccess } = useDomesticHelpVerification();
    const handleBlockAccess = () => {
        AppAlert.prompt(String(localizedUiText.m_4db088743b95), getActiveUiLiteral("m_4020753604bd"), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_211d0bb8cf4f),
                style: 'destructive',
                onPress: async (reason?: string) => {
                    if (!reason?.trim()) {
                        AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_5ade55a9ccdd));
                        return;
                    }
                    await blockAccess(domesticHelpId, reason);
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_9be8c518061f));
                    void refetch();
                },
            },
        ]);
    };
    if (isLoading)
        return <LoadingState message={localizedUiText.m_fe5fa5433f65}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_999930725d06}/>;
    return (<ScreenContainer style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="people-circle" size={56} color={Colors.primary}/>
        </View>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.type}>{data.helpType}{" " + localizedUiText.m_438b51572f43 + " "}{data.linkedFlatNumbers.join(', ')}</Text>
        <View style={styles.badges}>
          <StatusBadge status={data.accessStatus} moduleType="parking"/>
          <StatusBadge status={data.verificationStatus} moduleType="parking"/>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_1874fe129910}</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_34975ecb9b9a}</Text>
            <Text style={styles.value}>{data.mobileMasked}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_e6d3c0aa2771}</Text>
            <Text style={styles.value}>{data.emergencyContactMasked || localizedUiText.m_d83b9ff3c07a}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_70717dbbe537}</Text>
            <Text style={styles.value}>{data.addressSummary || localizedUiText.m_d83b9ff3c07a}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_a5975ff682c4}</Text>
            <Text style={styles.value}>{data.allowedEntryDays.join(', ')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_29dd8d54f3e2}</Text>
            <Text style={styles.value}>{data.allowedEntryTimeFrom || '00:00'} - {data.allowedEntryTimeTo || '23:59'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_3417084e23f0}</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_62bb9f2476a2}</Text>
            <Text style={styles.value}>{data.policeVerificationStatus}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_58bf90bed94c}</Text>
            <Text style={styles.value}>{data.idDocumentStatus}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_9ad60c08474c}</Text>
            <Text style={styles.value}>{data.approvedByResidents.join(', ')}</Text>
          </View>
        </View>
      </View>

      {data.lastGateEntryTime && (<View style={styles.section}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_9ef7d438ce5b}</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{localizedUiText.m_cd3e27d007f6}</Text>
              <Text style={styles.value}>{data.lastGateEntryDate}{" " + localizedUiText.m_b1d6b91b67c2 + " "}{data.lastGateEntryTime}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{localizedUiText.m_2a723292a03a}</Text>
              <Text style={styles.value}>{data.entryFrequencyLast30Days ?? 0}{" " + localizedUiText.m_ab51004e9d71}</Text>
            </View>
          </View>
        </View>)}

      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={() => navigation.navigate('DomesticHelpVerification', { domesticHelpId: data.id })}>
          <Ionicons name="shield-checkmark-outline" size={18} color={Colors.white}/>
          <Text style={styles.actionButtonText}>{localizedUiText.m_562d04c4f800}</Text>
        </Pressable>

        {data.accessStatus !== 'BLOCKED' && (<Pressable style={[styles.actionButton, styles.dangerButton]} onPress={handleBlockAccess}>
            <Ionicons name="ban-outline" size={18} color={Colors.white}/>
            <Text style={styles.actionButtonText}>{localizedUiText.m_679c64781b14}</Text>
          </Pressable>)}
      </View>
    </ScreenContainer>);
}

