import { Text, View } from "react-native";
import type { BiometricSyncJob } from "../../../shared/types/biometric.types";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { styles } from "../styles/components/SyncJobCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface SyncJobCardProps {
    job: BiometricSyncJob;
}
export function SyncJobCard({ job }: SyncJobCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const formattedStart = new Date(job.startedAt).toLocaleString();
    return (<View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.jobId}>{localizedUiText.m_34b0e24b358e + " "}{job.id}</Text>
          <Text style={styles.device}>{job.deviceName} ({job.deviceCode})</Text>
        </View>
        <StatusBadge status={job.status} moduleType="parking"/>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{localizedUiText.m_e3689bda97e0}</Text>
          <Text style={styles.statVal}>{job.totalPunchesFromDevice}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{localizedUiText.m_321f179c80ba}</Text>
          <Text style={[styles.statVal, styles.successText]}>{job.importedPunches}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{localizedUiText.m_93c28c39252a}</Text>
          <Text style={[styles.statVal, styles.warningText]}>{job.duplicatePunches}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{localizedUiText.m_031a8f0f659d}</Text>
          <Text style={[styles.statVal, styles.dangerText]}>{job.failedPunches}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.timeText}>{localizedUiText.m_8301e51f74b1 + " "}{formattedStart}</Text>
        <Text style={styles.triggerText}>{localizedUiText.m_5704b7c3727f + " "}{job.triggeredBy.replace('_', ' ')}</Text>
      </View>
    </View>);
}

