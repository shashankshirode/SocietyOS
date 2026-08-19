import { Text, View } from "react-native";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { EvCharger } from "../../../shared/types/evCharging.types";
import { styles } from "../styles/components/EvChargerCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface Props {
    charger: EvCharger;
    onPress: () => void;
}
export function EvChargerCard({ charger, onPress }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{charger.name}</Text>
        <StatusBadge moduleType="evcharging" status={charger.status}/>
      </View>
      <Text style={styles.text}>{localizedUiText.m_bbdffe25dc7d + " "}{charger.location} ({charger.connectorType})</Text>
      <Text style={styles.text}>{localizedUiText.m_af3ed24ebb4c + " "}{charger.totalEnergyDeliveredKwh}{" " + localizedUiText.m_58520857f198}</Text>
    </AppCard>);
}

