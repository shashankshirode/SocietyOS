import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { CorrectionRequest } from "../../../shared/types/attendance.types";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { styles } from "../styles/components/CorrectionRequestCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface CorrectionRequestCardProps {
    request: CorrectionRequest;
    onPress: () => void;
}
export function CorrectionRequestCard({ request, onPress }: CorrectionRequestCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const getCorrectionTypeLabel = (type: string) => {
        return type.replace(/_/g, ' ');
    };
    const formattedDate = new Date(request.attendanceDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
    return (<Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.header}>
        <View>
          <Text style={styles.number}>{request.requestNumber}</Text>
          <Text style={styles.staffName}>{request.staffName} ({request.staffCode})</Text>
        </View>
        <StatusBadge status={request.status} moduleType="parking"/>
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.label}>{localizedUiText.m_6cc5ad2e47e3 + " "}</Text>
          <Text style={styles.value}>{getCorrectionTypeLabel(request.correctionType)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{localizedUiText.m_b51489bde8d8 + " "}</Text>
          <Text style={styles.value}>{formattedDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{localizedUiText.m_65d7deb02f4b + " "}</Text>
          <Text style={[styles.value, styles.highlight]}>{request.requestedCorrection}</Text>
        </View>
        {request.existingValue && (<View style={styles.row}>
            <Text style={styles.label}>{localizedUiText.m_4dda67fa002d + " "}</Text>
            <Text style={styles.value}>{request.existingValue}</Text>
          </View>)}
        <Text style={styles.reason} numberOfLines={2}>{localizedUiText.m_3425d1086921}{request.reason}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.meta}>{localizedUiText.m_9199a054972b + " "}{request.requestedBy} ({request.requestedByRole.replace('_', ' ')})</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.neutral}/>
      </View>
    </Pressable>);
}

