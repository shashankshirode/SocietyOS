import { Text, View } from "react-native";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { HardwareSyncJob } from "../../../shared/types/hardware.types";
import { styles } from "../styles/components/HardwareSyncJobCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function HardwareSyncJobCard({ job }: {
    job: HardwareSyncJob;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_34b0e24b358e + " "}{job.id}</Text>
        <StatusBadge moduleType="hardware" status={job.status}/>
      </View>
      <Text style={styles.text}>{localizedUiText.m_9f8d3539c6f3 + " "}{job.deviceName} ({job.deviceType})</Text>
      <Text style={styles.text}>{localizedUiText.m_36a55294b7dc + " "}{job.totalRecords}{" " + localizedUiText.m_3954d9cb96cb + " "}{job.failedRecords})</Text>
      <Text style={styles.time}>{localizedUiText.m_8301e51f74b1 + " "}{new Date(job.startedAt).toLocaleString()}</Text>
    </AppCard>);
}

