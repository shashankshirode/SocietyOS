import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { StaffProfile } from "../../../shared/types/staff.types";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { styles } from "../styles/components/StaffCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface StaffCardProps {
    staff: StaffProfile;
    onPress: () => void;
}
export function StaffCard({ staff, onPress }: StaffCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const getCategoryLabel = (cat: string) => {
        return cat.replace('_', ' ');
    };
    return (<Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.left}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={Colors.primary}/>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{staff.name}</Text>
            <Text style={styles.code}>{staff.staffCode} · {getCategoryLabel(staff.category)}</Text>
          </View>
        </View>
        <StatusBadge status={staff.employmentStatus} moduleType="parking"/>
      </View>

      <View style={styles.details}>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={14} color={Colors.neutral}/>
          <Text style={styles.detailText}>{staff.assignedLocation}</Text>
        </View>
        {staff.vendorName && (<View style={styles.row}>
            <Ionicons name="business-outline" size={14} color={Colors.neutral}/>
            <Text style={styles.detailText}>{staff.vendorName}</Text>
          </View>)}
        <View style={styles.row}>
          <Ionicons name="call-outline" size={14} color={Colors.neutral}/>
          <Text style={styles.detailText}>{staff.mobileMasked}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.attendanceState}>
          <Text style={styles.attendanceLabel}>{localizedUiText.m_0a0e3e74b3cc + " "}</Text>
          <Text style={[
            styles.attendanceValue,
            staff.todayStatus === 'PRESENT' && styles.present,
            staff.todayStatus === 'LATE' && styles.late,
            staff.todayStatus === 'ABSENT' && styles.absent,
            staff.todayStatus === 'MISSING_CHECKOUT' && styles.warning,
        ]}>
            {staff.todayStatus || localizedUiText.m_44743d19c1c1}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.neutral}/>
      </View>
    </Pressable>);
}

