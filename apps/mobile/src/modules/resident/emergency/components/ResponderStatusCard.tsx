import { Text, View } from "react-native";
import type { EmergencyResponder } from "../../../../shared/types/emergency.types";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { styles } from "../styles/components/ResponderStatusCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface Props {
    responder: EmergencyResponder;
}
export function ResponderStatusCard({ responder }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{responder.name}</Text>
          <Text style={styles.role}>{responder.role}{" " + localizedUiText.m_8451b08ad44f + " "}{responder.etaMinutes || localizedUiText.m_e2f79e5b6033}{localizedUiText.m_62c66a7a5dd7}</Text>
        </View>
        <StatusBadge status={responder.status} moduleType="parking"/>
      </View>
    </View>);
}

