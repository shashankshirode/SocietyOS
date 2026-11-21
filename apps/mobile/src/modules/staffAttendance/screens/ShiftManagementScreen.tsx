import { Text, View, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useShifts } from "../data/useShifts";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { ShiftCard } from "../components/ShiftCard";
import { styles } from "../styles/screens/ShiftManagementScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'ShiftManagement'>;
export function ShiftManagementScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useShifts();
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{localizedUiText.m_c526a7eb4a83}</Text>
          <Pressable style={styles.addButton} onPress={() => navigation.navigate('ShiftAssignment', {})}>
            <Ionicons name="add" size={20} color={Colors.white}/>
            <Text style={styles.addText}>{localizedUiText.m_5c658e541f64}</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>{localizedUiText.m_e47e3b3099e9}</Text>
      </View>

      {isLoading ? (<LoadingState message={localizedUiText.m_897a71d5318d}/>) : error ? (<ErrorState message={error.message} onRetry={refetch}/>) : (<FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => (<ShiftCard shift={item} onAssignPress={() => navigation.navigate('ShiftAssignment', { shiftId: item.id })}/>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.empty}>
              <Ionicons name="calendar-outline" size={48} color={Colors.neutral}/>
              <Text style={styles.emptyText}>{localizedUiText.m_f559beb97a5e}</Text>
            </View>}/>)}
    </ScreenContainer>);
}

