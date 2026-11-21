import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { EmergencyContact } from "../../../../shared/types/emergency.types";
import { Colors } from "../../../../shared/theme";
import { styles } from "../styles/components/EmergencyContactCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface Props {
    contact: EmergencyContact;
    onPress?: () => void;
}
export function EmergencyContactCard({ contact, onPress }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<Pressable style={styles.card} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.rel}>{contact.relationship}{" " + localizedUiText.m_3a305c66f175 + " "}{contact.mobileMasked}</Text>
        <Text style={styles.priority}>{localizedUiText.m_d60dbba07922 + " "}{contact.priority}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textMuted}/>
    </Pressable>);
}

