import { Text, View } from "react-native";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { SmartMeterReading } from "../../../shared/types/smartMeter.types";
import { styles } from "../styles/components/SmartMeterReadingCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function SmartMeterReadingCard({ reading }: {
    reading: SmartMeterReading;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.unit}>{localizedUiText.m_9311e5cc88d5 + " "}{reading.unitNumber} ({reading.type})</Text>
        <StatusBadge moduleType="smartmeter" status={reading.status}/>
      </View>
      <View style={styles.details}>
        <Text style={styles.text}>{localizedUiText.m_39e6a3d9398c + " "}{reading.previousReadingValue}</Text>
        <Text style={styles.text}>{localizedUiText.m_c09f632874c2 + " "}{reading.currentReadingValue}</Text>
        <Text style={styles.consumption}>{localizedUiText.m_37b2f42341ee + " "}{reading.consumptionValue}</Text>
      </View>
      <Text style={styles.time}>{localizedUiText.m_b51489bde8d8 + " "}{new Date(reading.readingDate).toLocaleDateString()}</Text>
    </AppCard>);
}

