import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BiometricSyncError } from "../../../shared/types/biometric.types";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { styles } from "../styles/components/SyncErrorCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface SyncErrorCardProps {
    error: BiometricSyncError;
    onResolvePress?: () => void;
    onIgnorePress?: () => void;
}
export function SyncErrorCard({ error, onResolvePress, onIgnorePress }: SyncErrorCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const getErrorTypeLabel = (type: string) => {
        return type.replace(/_/g, ' ');
    };
    return (<View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="warning" size={16} color={Colors.danger} style={styles.errorIcon}/>
          <View>
            <Text style={styles.type}>{getErrorTypeLabel(error.errorType)}</Text>
            <Text style={styles.device}>{localizedUiText.m_9f8d3539c6f3 + " "}{error.deviceCode}</Text>
          </View>
        </View>
        <StatusBadge status={error.status} moduleType="parking"/>
      </View>

      <View style={styles.body}>
        <Text style={styles.message}>{error.errorMessage}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>{localizedUiText.m_6d12c18f06b1 + " "}</Text>
          <Text style={styles.value}>{error.biometricEmployeeCode || localizedUiText.m_e2f79e5b6033}</Text>
        </View>
        {error.punchTime && (<View style={styles.detailRow}>
            <Text style={styles.label}>{localizedUiText.m_663ad582a47e + " "}</Text>
            <Text style={styles.value}>{new Date(error.punchTime).toLocaleString()}</Text>
          </View>)}
        <Text style={styles.suggestion}>{localizedUiText.m_45a4e3469617 + " "}{error.suggestedAction}</Text>
      </View>

      {error.status === 'OPEN' && (onResolvePress || onIgnorePress) && (<View style={styles.actions}>
          {onIgnorePress && (<Pressable style={({ pressed }) => [styles.btn, styles.btnSec, pressed && styles.pressed]} onPress={onIgnorePress}>
              <Text style={styles.btnTextSec}>{localizedUiText.m_fce77c34d3fe}</Text>
            </Pressable>)}
          {onResolvePress && (<Pressable style={({ pressed }) => [styles.btn, styles.btnPri, pressed && styles.pressed]} onPress={onResolvePress}>
              <Text style={styles.btnTextPri}>{localizedUiText.m_c8f193b315c8}</Text>
            </Pressable>)}
        </View>)}

      {error.status !== 'OPEN' && error.resolutionNote && (<View style={styles.resolutionBox}>
          <Text style={styles.resolutionTitle}>{localizedUiText.m_e8e879c98cfb}</Text>
          <Text style={styles.resolutionText}>{error.resolutionNote}</Text>
          <Text style={styles.resolutionMeta}>{localizedUiText.m_5704b7c3727f + " "}{error.resolvedBy}{" " + localizedUiText.m_b8d31e852725 + " "}{error.resolvedAt ? new Date(error.resolvedAt).toLocaleDateString() : ''}</Text>
        </View>)}
    </View>);
}

