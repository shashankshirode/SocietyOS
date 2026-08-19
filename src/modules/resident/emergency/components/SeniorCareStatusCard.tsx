import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SeniorCareProfile } from "../../../../shared/types/seniorCare.types";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { Colors } from "../../../../shared/theme";
import { styles } from "../styles/components/SeniorCareStatusCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface Props {
    profile: SeniorCareProfile;
    onPress: () => void;
}
export function SeniorCareStatusCard({ profile, onPress }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person-circle" size={40} color={Colors.primary}/>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.flat}>{profile.tower} {profile.flatNumber}</Text>
        </View>
        <StatusBadge status={profile.seniorCareStatus} moduleType="parking"/>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>{localizedUiText.m_af4b9750f54b}</Text>
          <Text style={styles.val}>{profile.dailyCheckInEnabled ? localizedUiText.m_92c1cdfdf4cb : localizedUiText.m_75081b593d15}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>{localizedUiText.m_c19e21903a9a}</Text>
          <Text style={styles.val}>{profile.familyConnectEnabled ? localizedUiText.m_92c1cdfdf4cb : localizedUiText.m_75081b593d15}</Text>
        </View>
      </View>
    </Pressable>);
}

