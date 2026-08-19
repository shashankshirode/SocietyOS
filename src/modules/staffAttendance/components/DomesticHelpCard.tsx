import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { DomesticHelp } from "../../../shared/types/domesticHelp.types";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { styles } from "../styles/components/DomesticHelpCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface DomesticHelpCardProps {
    help: DomesticHelp;
    onPress: () => void;
}
export function DomesticHelpCard({ help, onPress }: DomesticHelpCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.left}>
          <View style={styles.avatar}>
            <Ionicons name="people-circle" size={26} color={Colors.primary}/>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{help.name}</Text>
            <Text style={styles.type}>{help.helpType} · {help.linkedFlatNumbers.join(', ')}</Text>
          </View>
        </View>
        <StatusBadge status={help.accessStatus} moduleType="parking"/>
      </View>

      <View style={styles.details}>
        <View style={styles.row}>
          <Ionicons name="call-outline" size={14} color={Colors.neutral}/>
          <Text style={styles.detailText}>{help.mobileMasked}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="shield-checkmark-outline" size={14} color={Colors.neutral}/>
          <Text style={styles.detailText}>{localizedUiText.m_b3fca9e3c47f + " "}{help.policeVerificationStatus}</Text>
        </View>
        {help.lastGateEntryTime && (<View style={styles.row}>
            <Ionicons name="log-in-outline" size={14} color={Colors.neutral}/>
            <Text style={styles.detailText}>{localizedUiText.m_73798464c193 + " "}{help.lastGateEntryDate}{" " + localizedUiText.m_b1d6b91b67c2 + " "}{help.lastGateEntryTime}</Text>
          </View>)}
      </View>

      <View style={styles.footer}>
        <Text style={styles.frequency}>{localizedUiText.m_b68d5fda9631 + " "}{help.entryFrequencyLast30Days ?? 0}{" " + localizedUiText.m_ab51004e9d71}</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.neutral}/>
      </View>
    </Pressable>);
}

