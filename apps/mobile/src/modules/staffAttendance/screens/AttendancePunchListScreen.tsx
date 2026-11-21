import { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useAttendancePunches } from "../data/useAttendancePunches";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { AttendancePunchRow } from "../components/AttendancePunchRow";
import type { PunchSource } from "../../../shared/types/attendance.types";
import { styles } from "../styles/screens/AttendancePunchListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'AttendancePunchList'>;
const sources: {
    label: string;
    value: PunchSource | 'ALL';
}[] = [
    { get label() {
            return getActiveUiLiteral("m_b877e9212b41");
        }, value: 'ALL' },
    { get label() {
            return getActiveUiLiteral("m_ab2ba7db16bd");
        }, value: 'BIOMETRIC_DEVICE' },
    { get label() {
            return getActiveUiLiteral("m_b0b9fe24ffa9");
        }, value: 'MANUAL' },
    { get label() {
            return getActiveUiLiteral("m_02ab0a462c44");
        }, value: 'GUARD_APP' },
];
export function AttendancePunchListScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [selectedSource, setSelectedSource] = useState<PunchSource | 'ALL'>('ALL');
    const filters = {
        ...(selectedSource !== 'ALL' && { source: selectedSource }),
    };
    const { data, isLoading, error, refetch } = useAttendancePunches(filters);
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{localizedUiText.m_632c390f1e2b}</Text>
          <Pressable style={styles.addBtn} onPress={() => navigation.navigate('ManualAttendanceEntry')}>
            <Ionicons name="add" size={20} color={Colors.white}/>
            <Text style={styles.addBtnText}>{localizedUiText.m_7085c0c80ca4}</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>{localizedUiText.m_7910310129e4}</Text>
      </View>

      <View style={styles.filtersContainer}>
        <FlatList horizontal showsHorizontalScrollIndicator={false} data={sources} keyExtractor={item => item.value} renderItem={({ item }) => {
            const active = selectedSource === item.value;
            return (<Pressable style={[styles.filterChip, active && styles.activeChip]} onPress={() => setSelectedSource(item.value)}>
                <Text style={[styles.chipText, active && styles.activeChipText]}>{item.label}</Text>
              </Pressable>);
        }} contentContainerStyle={styles.chipsContent} extraData={localizedUiText}/>
      </View>

      {isLoading ? (<LoadingState message={localizedUiText.m_88a8887cd91d}/>) : error ? (<ErrorState message={error.message} onRetry={refetch}/>) : (<FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => <AttendancePunchRow punch={item}/>} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.empty}>
              <Ionicons name="finger-print-outline" size={48} color={Colors.neutral}/>
              <Text style={styles.emptyText}>{localizedUiText.m_4e73b8241cf2}</Text>
            </View>} extraData={localizedUiText}/>)}
    </ScreenContainer>);
}

