import { Text, View } from "react-native";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { PlatformSociety } from "../../../shared/types/platformSociety.types";
import { styles } from "../styles/components/PlatformSocietyCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface PlatformSocietyCardProps {
    society: PlatformSociety;
    onPress: () => void;
}
export function PlatformSocietyCard({ society, onPress }: PlatformSocietyCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text style={styles.name}>{society.name}</Text>
          <Text style={styles.location}>{society.city}, {society.state}</Text>
        </View>
        <StatusBadge status={society.status} moduleType="platform"/>
      </View>

      <View style={styles.grid}>
        <View style={styles.col}>
          <Text style={styles.label}>{localizedUiText.m_9fb6669a77ea}</Text>
          <Text style={styles.value}>{society.totalUnits}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>{localizedUiText.m_5639b9f1265e}</Text>
          <Text style={styles.value}>{society.activeUsers}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>{localizedUiText.m_fa8ed0bdabdd}</Text>
          <StatusBadge status={society.planCode} moduleType="platform" style={styles.badge}/>
        </View>
      </View>
    </AppCard>);
}

