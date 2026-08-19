import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ShiftDefinition } from "../../../shared/types/staff.types";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { styles } from "../styles/components/ShiftCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface ShiftCardProps {
    shift: ShiftDefinition;
    onAssignPress?: () => void;
}
export function ShiftCard({ shift, onAssignPress }: ShiftCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{shift.shiftName}</Text>
          <Text style={styles.location}>{shift.location}</Text>
        </View>
        <StatusBadge status={shift.status} moduleType="parking"/>
      </View>

      <View style={styles.timeSection}>
        <View style={styles.timeBox}>
          <Ionicons name="time-outline" size={16} color={Colors.primary}/>
          <Text style={styles.timeText}>{shift.startTime} - {shift.endTime}</Text>
        </View>
        <Text style={styles.graceText}>{localizedUiText.m_d6f05a4d9860 + " "}{shift.gracePeriodMinutes}{" " + localizedUiText.m_0c843ea50d04}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>{localizedUiText.m_6dcd90927950 + " "}{shift.weeklyOffDays.join(', ')}</Text>
        <Text style={styles.staffCount}>{localizedUiText.m_b686a9e29be9 + " "}{shift.assignedStaffCount}</Text>
      </View>

      {onAssignPress && (<Pressable style={({ pressed }) => [styles.assignButton, pressed && styles.buttonPressed]} onPress={onAssignPress}>
          <Ionicons name="person-add-outline" size={14} color={Colors.primary}/>
          <Text style={styles.assignText}>{localizedUiText.m_5c658e541f64}</Text>
        </Pressable>)}
    </View>);
}

