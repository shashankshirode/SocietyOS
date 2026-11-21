import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useDailyAttendanceDashboard } from "../data/useDailyAttendanceDashboard";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { AttendanceMetricCard } from "../components/AttendanceMetricCard";
import { styles } from "../styles/screens/DailyAttendanceDashboardScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'DailyAttendanceDashboard'>;
export function DailyAttendanceDashboardScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useDailyAttendanceDashboard();
    if (isLoading)
        return <LoadingState message={localizedUiText.m_614edc8a7548}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_e4e60d2e5ef9}/>;
    const { summary, byCategory, byVendor, lateArrivals, missingCheckouts } = data;
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.title}>{localizedUiText.m_d475e38d3e09}</Text>
          <Pressable style={styles.historyBtn} onPress={() => navigation.navigate('AttendancePunchList')}>
            <Ionicons name="list-outline" size={16} color={Colors.primary}/>
            <Text style={styles.historyBtnText}>{localizedUiText.m_e3689bda97e0}</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>{formatUiLiteral(localizedUiText.m_b854690522ba, [summary.date])}</Text>
      </View>

      <View style={styles.metricsGrid}>
        <AttendanceMetricCard label={localizedUiText.m_ca99b7f1b14e} value={summary.totalExpected}/>
        <AttendanceMetricCard label={localizedUiText.m_43f9b89c0b9d} value={summary.present} type="success"/>
        <AttendanceMetricCard label={localizedUiText.m_84fd36f7cbff} value={summary.absent} type="danger"/>
        <AttendanceMetricCard label={localizedUiText.m_1f8025901e9e} value={`${summary.attendancePercentage}%`} type="info"/>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_2a87c816da71}{summary.late})</Text>
        <View style={styles.card}>
          {lateArrivals.length === 0 ? (<Text style={styles.emptyText}>{localizedUiText.m_9090790e147f}</Text>) : (lateArrivals.map((item, idx) => (<View key={idx} style={styles.listRow}>
                <View>
                  <Text style={styles.rowTitle}>{item.staffName}</Text>
                  <Text style={styles.rowSubtitle}>{item.staffCode}{" " + localizedUiText.m_e3325b5cf9f8 + " "}{item.punchTime}</Text>
                </View>
                <Text style={styles.lateMinutes}>{item.minutesLate}{localizedUiText.m_3063caffbffd}</Text>
              </View>)))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_2fd480a1e721}{summary.missingCheckout})</Text>
          {summary.missingCheckout > 0 && (<Pressable onPress={() => navigation.navigate('MissingCheckoutReview')}>
              <Text style={styles.link}>{localizedUiText.m_aff0766a5290}</Text>
            </Pressable>)}
        </View>
        <View style={styles.card}>
          {missingCheckouts.length === 0 ? (<Text style={styles.emptyText}>{localizedUiText.m_cbd3e5d09b62}</Text>) : (missingCheckouts.map((item, idx) => (<View key={idx} style={styles.listRow}>
                <View>
                  <Text style={styles.rowTitle}>{item.staffName}</Text>
                  <Text style={styles.rowSubtitle}>{item.staffCode}{" " + localizedUiText.m_69646ccf58ee + " "}{item.lastPunchTime}</Text>
                </View>
                <Text style={styles.shiftEnd}>{localizedUiText.m_4c907c46f042 + " "}{item.shiftEndTime}</Text>
              </View>)))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_e9d1790c244b}</Text>
        <View style={styles.card}>
          {byCategory.map((cat, idx) => (<View key={idx} style={styles.statRow}>
              <Text style={styles.statLabel}>{cat.category.replace('_', ' ')}</Text>
              <Text style={styles.statValue}>
                {cat.present} / {cat.total}{localizedUiText.m_4d4c7eee2e28}</Text>
            </View>))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_d33d4b8387b1}</Text>
        <View style={styles.card}>
          {byVendor.map((v, idx) => (<View key={idx} style={styles.statRow}>
              <Text style={styles.statLabel}>{v.vendorName}</Text>
              <Text style={styles.statValue}>
                {v.present} / {v.total}{localizedUiText.m_4d4c7eee2e28}</Text>
            </View>))}
        </View>
      </View>
    </ScreenContainer>);
}

