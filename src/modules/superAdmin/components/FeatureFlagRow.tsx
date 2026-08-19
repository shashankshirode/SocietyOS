import { Text, View, Switch } from "react-native";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { PlatformFeatureFlag } from "../../../shared/types/platformSociety.types";
import { styles } from "../styles/components/FeatureFlagRow.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface FeatureFlagRowProps {
    flag: PlatformFeatureFlag;
    onValueChange: (value: boolean) => void;
}
export function FeatureFlagRow({ flag, onValueChange }: FeatureFlagRowProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const isHighRisk = flag.riskLevel === 'HIGH' || flag.riskLevel === 'CRITICAL';
    return (<View style={styles.row}>
      <View style={styles.infoCol}>
        <View style={styles.titleRow}>
          <Text style={styles.displayName}>{flag.displayName}</Text>
          <StatusBadge status={flag.riskLevel} moduleType="platform"/>
        </View>
        <Text style={styles.flagKey}>{flag.flagKey}</Text>
        <Text style={styles.meta}>{localizedUiText.m_f0038a9653e1 + " "}{flag.scope}{" " + localizedUiText.m_8f1abeacc5c1 + " "}{flag.moduleGroup}</Text>
      </View>
      <Switch value={flag.defaultValue} onValueChange={onValueChange} trackColor={{ false: Colors.border, true: isHighRisk ? Colors.dangerLight : Colors.primaryLight }} thumbColor={flag.defaultValue ? (isHighRisk ? Colors.danger : Colors.primary) : Colors.textMuted}/>
    </View>);
}

