import { Text, View } from "react-native";
import type { EmergencyVolunteer } from "../../../../shared/types/volunteer.types";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { styles } from "../styles/components/VolunteerCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface Props {
    volunteer: EmergencyVolunteer;
}
export function VolunteerCard({ volunteer }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{volunteer.name}</Text>
          <Text style={styles.type}>{volunteer.volunteerType.replace('_', ' ')} · {volunteer.tower}</Text>
        </View>
        <StatusBadge status={volunteer.availability} moduleType="parking"/>
      </View>
      {volunteer.skillsNote && (<Text style={styles.skills}>{volunteer.skillsNote}</Text>)}
      <View style={styles.footer}>
        <Text style={styles.mobile}>{localizedUiText.m_3305eb58093d + " "}{volunteer.mobileMasked}</Text>
        <StatusBadge status={volunteer.verificationStatus} moduleType="parking"/>
      </View>
    </View>);
}

