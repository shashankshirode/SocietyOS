import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { AttendancePunch } from "../../../shared/types/attendance.types";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { styles } from "../styles/components/AttendancePunchRow.styles";
interface AttendancePunchRowProps {
    punch: AttendancePunch;
}
export function AttendancePunchRow({ punch }: AttendancePunchRowProps) {
    const getPunchTypeIcon = () => {
        switch (punch.punchType) {
            case 'IN':
                return <Ionicons name="log-in" size={16} color={Colors.success}/>;
            case 'OUT':
                return <Ionicons name="log-out" size={16} color={Colors.neutral}/>;
            case 'BREAK_IN':
                return <Ionicons name="cafe-outline" size={16} color={Colors.info}/>;
            case 'BREAK_OUT':
                return <Ionicons name="play" size={16} color={Colors.info}/>;
            default:
                return <Ionicons name="help-circle" size={16} color={Colors.neutral}/>;
        }
    };
    const formattedTime = new Date(punch.punchTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = new Date(punch.punchTime).toLocaleDateString([], { day: '2-digit', month: 'short' });
    return (<View style={styles.container}>
      <View style={styles.left}>
        <View style={[
            styles.iconBg,
            punch.punchType === 'IN' && styles.inBg,
            punch.punchType === 'OUT' && styles.outBg,
        ]}>
          {getPunchTypeIcon()}
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{punch.staffName}</Text>
          <Text style={styles.meta}>{punch.staffCode} · {punch.location}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.time}>{formattedTime}</Text>
        <Text style={styles.date}>{formattedDate} · {punch.source.replace('_', ' ')}</Text>
        {punch.isDuplicate && (<StatusBadge status="DUPLICATE_PUNCH" moduleType="parking" style={styles.dupBadge}/>)}
      </View>
    </View>);
}

