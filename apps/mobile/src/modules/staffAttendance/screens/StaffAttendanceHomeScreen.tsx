import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useStaffAttendanceHome } from "../data/useStaffAttendanceHome";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { AttendanceMetricCard } from "../components/AttendanceMetricCard";
import { styles } from "../styles/screens/StaffAttendanceHomeScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'StaffAttendanceHome'>;
export function StaffAttendanceHomeScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useStaffAttendanceHome();
    if (isLoading)
        return <LoadingState message={localizedUiText.m_bbb8bf3e61ff} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_a05947e0fd14} onRetry={refetch}/>;
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_8e89cbc46620}</Text>
        <Text style={styles.subtitle}>{data.societyName}{" " + localizedUiText.m_075f02912cd7}</Text>
      </View>

      <View style={styles.metricsGrid}>
        <AttendanceMetricCard label={localizedUiText.m_843f9335e23f} value={data.present} type="success"/>
        <AttendanceMetricCard label={localizedUiText.m_84fd36f7cbff} value={data.absent} type="danger"/>
        <AttendanceMetricCard label={localizedUiText.m_0f950da185fc} value={data.late} type="warning"/>
        <AttendanceMetricCard label={localizedUiText.m_7a7f1d343d65} value={data.missingCheckout} type="warning"/>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_6d9feeb645f1}</Text>
        <View style={styles.actionsGrid}>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('StaffDirectory')}>
            <Ionicons name="people" size={24} color={Colors.primary}/>
            <Text style={styles.actionLabel}>{localizedUiText.m_8cbe5978e821}</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('DomesticHelpDirectory')}>
            <Ionicons name="people-outline" size={24} color={Colors.primary}/>
            <Text style={styles.actionLabel}>{localizedUiText.m_184da1b758c5}</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('DailyAttendanceDashboard')}>
            <Ionicons name="today" size={24} color={Colors.primary}/>
            <Text style={styles.actionLabel}>{localizedUiText.m_55ad26d9d89f}</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('ShiftManagement')}>
            <Ionicons name="calendar" size={24} color={Colors.primary}/>
            <Text style={styles.actionLabel}>{localizedUiText.m_0a60d5a8fef7}</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('ManualAttendanceEntry')}>
            <Ionicons name="create" size={24} color={Colors.primary}/>
            <Text style={styles.actionLabel}>{localizedUiText.m_7e70b6a4f555}</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('AttendanceCorrectionApproval')}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.primary}/>
            <Text style={styles.actionLabel}>{localizedUiText.m_443b744e50f5}</Text>
            {data.pendingCorrections > 0 && (<View style={styles.badge}><Text style={styles.badgeText}>{data.pendingCorrections}</Text></View>)}
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_54b8021d9e3e}</Text>
        <View style={styles.actionsGrid}>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('BiometricDeviceList')}>
            <Ionicons name="hardware-chip" size={24} color={Colors.primary}/>
            <Text style={styles.actionLabel}>{localizedUiText.m_9e09ed53743e}</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('BiometricSyncJobLogs')}>
            <Ionicons name="list" size={24} color={Colors.primary}/>
            <Text style={styles.actionLabel}>{localizedUiText.m_272b456da985}</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('MonthlyAttendanceReport')}>
            <Ionicons name="stats-chart" size={24} color={Colors.primary}/>
            <Text style={styles.actionLabel}>{localizedUiText.m_fe5c7ff3ab00}</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('VendorAttendanceReport')}>
            <Ionicons name="business" size={24} color={Colors.primary}/>
            <Text style={styles.actionLabel}>{localizedUiText.m_73ae6a7a3923}</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('AttendanceSettings')}>
            <Ionicons name="settings" size={24} color={Colors.primary}/>
            <Text style={styles.actionLabel}>{localizedUiText.m_74a883a037bc}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_6813cb81e9ef}</Text>
        {data.recentPunches.map((punch, idx) => (<View key={idx} style={styles.punchRow}>
            <View style={styles.punchInfo}>
              <Text style={styles.punchName}>{punch.staffName}</Text>
              <Text style={styles.punchMeta}>{punch.staffCode} · {punch.location}</Text>
            </View>
            <View style={styles.punchTimeBox}>
              <Text style={styles.punchTime}>{new Date(punch.punchTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              <Text style={styles.punchType}>{punch.punchType}</Text>
            </View>
          </View>))}
      </View>
    </ScreenContainer>);
}

