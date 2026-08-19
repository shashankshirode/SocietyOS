import { Text, Pressable } from "react-native";
import type { SafetyInstruction } from "../../../../shared/types/safety.types";
import { styles } from "../styles/components/SafetyInstructionCard.styles";
interface Props {
    instruction: SafetyInstruction;
    onPress: () => void;
}
export function SafetyInstructionCard({ instruction, onPress }: Props) {
    return (<Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.category}>{instruction.category}</Text>
      <Text style={styles.title}>{instruction.title}</Text>
      <Text style={styles.steps} numberOfLines={2}>
        {instruction.steps.map((s, i) => `${i + 1}. ${s}`).join(' ')}
      </Text>
    </Pressable>);
}

