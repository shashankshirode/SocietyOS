import { Text, View, ScrollView } from "react-native";
import { useAdminRuleAcknowledgementReport } from "../../data/useAdminRuleAcknowledgementReport";
import { styles } from "../../styles/screens/interFlat_screens/AdminRuleAcknowledgementReportScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
export function AdminRuleAcknowledgementReportScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useAdminRuleAcknowledgementReport('rule-001');
    const report = (data) || {
        ruleTitle: getActiveUiLiteral("m_d9e92097067e"),
        ruleVersion: '2.1',
        totalRequired: 150,
        acknowledgedCount: 112,
        pendingCount: 38,
        completionPercentage: 75,
        acknowledgements: []
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_149d59c78d21}</Text>
      <Text style={styles.ruleTitle}>{report.ruleTitle}{" " + localizedUiText.m_e01f7632e56c}{report.ruleVersion})</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{report.totalRequired}</Text>
          <Text style={styles.statLabel}>{localizedUiText.m_27b984f4744b}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{report.acknowledgedCount}</Text>
          <Text style={styles.statLabel}>{localizedUiText.m_d87cdf8aa304}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{report.completionPercentage}%</Text>
          <Text style={styles.statLabel}>{localizedUiText.m_557fe004f344}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{localizedUiText.m_a72d24c15536}</Text>
      {report.acknowledgements && report.acknowledgements.map((item, idx: number) => (<View key={idx} style={styles.userRow}>
          <View>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.userFlat}>{localizedUiText.m_d10a8728e8a8 + " "}{item.flatNumber}</Text>
          </View>
          <Text style={[styles.statusText, item.status === 'ACKNOWLEDGED' ? styles.statusAck : styles.statusPen]}>
            {item.status}
          </Text>
        </View>))}
    </ScrollView>);
}

