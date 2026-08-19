import { View, Text, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useStaffDetail } from "../data/useStaffDetail";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { staffAttendanceRepository } from "../data/staffAttendance.repository";
import { mapStaffCategoryToChatRole } from "../../staffManagement/channelRoleMapper";
import { StaffChannelSummary } from "../../staffManagement/components/StaffChannelSummary";
import { styles } from "../styles/screens/StaffDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'StaffDetail'>;
export function StaffDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { staffId } = route.params;
    const { data, isLoading, error, refetch } = useStaffDetail(staffId);
    const handleDeactivate = () => {
        AppAlert.alert(String(localizedUiText.m_58a756ff40c2), formatUiLiteral(String(localizedUiText.m_3305f75537fb), [data?.name]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_fb1e6fa55327),
                style: 'destructive',
                onPress: async () => {
                    await staffAttendanceRepository.markStaffInactive(staffId);
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_666c7ec4e00f));
                    void refetch();
                },
            },
        ]);
    };
    if (isLoading)
        return <LoadingState message={localizedUiText.m_4a47f12d23c4}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_999930725d06}/>;
    const chatRole = mapStaffCategoryToChatRole(data.category);
    return (<ScreenContainer style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color={Colors.primary}/>
        </View>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.code}>{data.staffCode} · {data.category.replace('_', ' ')}</Text>
        <View style={styles.badges}>
          <StatusBadge status={data.employmentStatus} moduleType="parking"/>
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
            <Text style={styles.label}>{localizedUiText.m_aa2b42090af7}</Text>
            <Text style={styles.value}>{data.assignedLocation}</Text>
          </View>
          {data.vendorName && (<View style={styles.infoRow}>
              <Text style={styles.label}>{localizedUiText.m_602018531d84}</Text>
              <Text style={styles.value}>{data.vendorName}</Text>
            </View>)}
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_0510ce6327b8}</Text>
            <Text style={styles.value}>{new Date(data.joiningDate).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_e63f41f47290}</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_502c886294a5}</Text>
            <Text style={styles.value}>{data.biometricEmployeeCode || localizedUiText.m_433d71bed1ac}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_6e0a0b9d8c5e}</Text>
            <Text style={styles.value}>{data.biometricDeviceId || localizedUiText.m_e2f79e5b6033}</Text>
          </View>
        </View>
        {!data.biometricEmployeeCode && (<Pressable style={styles.mapButton} onPress={() => navigation.navigate('BiometricStaffMapping', { employeeCode: data.staffCode })}>
            <Ionicons name="hardware-chip-outline" size={16} color={Colors.primary}/>
            <Text style={styles.mapButtonText}>{localizedUiText.m_4445263f90a8}</Text>
          </Pressable>)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_3417084e23f0}</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_58bf90bed94c}</Text>
            <Text style={styles.value}>{data.idDocumentStatus}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_62bb9f2476a2}</Text>
            <Text style={styles.value}>{data.policeVerificationStatus}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        {chatRole ? (<StaffChannelSummary userId={data.id} onManage={() => navigation.navigate('ManageStaffChannels', { staffId: data.id, staffName: data.name, roleCode: chatRole })}/>) : null}
        <Pressable style={styles.actionButton} onPress={() => navigation.navigate('StaffAttendanceDetail', { staffId: data.id })}>
          <Ionicons name="calendar-outline" size={18} color={Colors.white}/>
          <Text style={styles.actionButtonText}>{localizedUiText.m_b53ba1bfbaa4}</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={() => navigation.navigate('StaffIdCard', { staffId: data.id })}>
          <Ionicons name="card-outline" size={18} color={Colors.white}/>
          <Text style={styles.actionButtonText}>{localizedUiText.m_c45731eca8e7}</Text>
        </Pressable>

        {data.employmentStatus === 'ACTIVE' && (<Pressable style={[styles.actionButton, styles.dangerButton]} onPress={handleDeactivate}>
            <Ionicons name="trash-outline" size={18} color={Colors.white}/>
            <Text style={styles.actionButtonText}>{localizedUiText.m_b879f1d30214}</Text>
          </Pressable>)}
      </View>
    </ScreenContainer>);
}

