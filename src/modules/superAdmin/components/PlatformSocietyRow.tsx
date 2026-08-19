import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { PlatformSociety } from "../../../shared/types/platformSociety.types";
import { styles } from "../styles/components/PlatformSocietyRow.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface PlatformSocietyRowProps {
    society: PlatformSociety;
    onPress: () => void;
}
export function PlatformSocietyRow({ society, onPress }: PlatformSocietyRowProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<Pressable style={styles.row} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.name}>{society.name}</Text>
          <Text style={styles.location}>{society.city} • {society.totalUnits}{" " + localizedUiText.m_9fb6669a77ea}</Text>
        </View>
        <View style={styles.rightCol}>
          <StatusBadge status={society.status} moduleType="platform" style={styles.status}/>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted}/>
        </View>
      </View>
    </Pressable>);
}

