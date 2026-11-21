import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useInterFlatIssueDetail } from "../../data/useInterFlatIssueDetail";
import { useEscalationToCommittee } from "../../data/useEscalationToCommittee";
import { StatusBadge } from "../../../../../shared/components/StatusBadge";
import { DisputePrivacyNotice } from "./DisputePrivacyNotice";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { styles } from "../../styles/screens/interFlat_screens/InterFlatIssueDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function InterFlatIssueDetailScreen({ route, navigation }: InterFlatScreenProps<'InterFlatIssueDetail'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { issueId } = route.params;
    const { data, isLoading } = useInterFlatIssueDetail(issueId);
    const { escalate } = useEscalationToCommittee(issueId);
    if (isLoading || !data) {
        return (<View style={styles.loading}>
        <Text style={styles.loadingText}>{localizedUiText.m_eefe44fd0c3e}</Text>
      </View>);
    }
    const issue = data;
    const inspectionId = issue.inspectionId;
    const handleEscalate = async () => {
        AppAlert.alert(String(localizedUiText.m_5acc0e553ba5), String(localizedUiText.m_0107be5906d4), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_d563aaf7079b),
                onPress: async () => {
                    await escalate({});
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_66744fe9cb9c));
                    navigation.navigate('InterFlatHome');
                }
            }
        ]);
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.issueNum}>{issue.issueNumber}</Text>
        <StatusBadge status={issue.status} moduleType="complaint"/>
      </View>

      <Text style={styles.typeText}>{issue.issueType.replace(/_/g, ' ')}</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>{localizedUiText.m_15b61974b270}</Text>
        <Text style={styles.value}>{issue.location}</Text>

        <Text style={styles.label}>{localizedUiText.m_526e0087cc3f}</Text>
        <Text style={styles.value}>{issue.description}</Text>

        <Text style={styles.label}>{localizedUiText.m_819ca5b19b20}</Text>
        <Text style={styles.value}>{issue.reporterFlat}</Text>

        <Text style={styles.label}>{localizedUiText.m_1438819d9df8}</Text>
        <Text style={styles.value}>{issue.involvedFlat} ({issue.involvedResidentName || localizedUiText.m_280eda6fb8fa})</Text>
      </View>

      {issue.responses && issue.responses.length > 0 && (<View style={styles.section}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_f13a9e4bd889}</Text>
          {issue.responses.map((r) => (<View key={r.id} style={styles.responseCard}>
              <Text style={styles.respHeader}>{r.responderName} ({r.responderFlat})</Text>
              <Text style={styles.respType}>{r.responseType.replace(/_/g, ' ')}</Text>
              <Text style={styles.respText}>{r.explanation}</Text>
            </View>))}
        </View>)}

      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => navigation.navigate('IssueTimeline', { issueId })}>
          <Text style={styles.btnOutlineText}>{localizedUiText.m_94cd0f19714a}</Text>
        </TouchableOpacity>

        {issue.status === 'SUBMITTED' && (<TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => navigation.navigate('NeighbourNotificationPreview', { issueId })}>
            <Text style={styles.btnText}>{localizedUiText.m_4fa0894ec5e0}</Text>
          </TouchableOpacity>)}

        {issue.status === 'NEIGHBOUR_NOTIFIED' && (<TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => navigation.navigate('RespondToInterFlatIssue', { issueId })}>
            <Text style={styles.btnText}>{localizedUiText.m_ff72d2f38ccd}</Text>
          </TouchableOpacity>)}

        {issue.issueType === 'WATER_LEAKAGE' && !issue.inspectionId && (<TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => navigation.navigate('FacilityInspectionRequest', { issueId })}>
            <Text style={styles.btnText}>{localizedUiText.m_7ad098f214d2}</Text>
          </TouchableOpacity>)}

        {inspectionId && (<TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => navigation.navigate('FacilityInspectionDetail', { inspectionId })}>
            <Text style={styles.btnOutlineText}>{localizedUiText.m_064d50ff3432}</Text>
          </TouchableOpacity>)}
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.escalateBtn} onPress={handleEscalate}>
          <Text style={styles.escalateBtnText}>{localizedUiText.m_2b8fe6959813}</Text>
        </TouchableOpacity>
      </View>

      <DisputePrivacyNotice />
    </ScrollView>);
}

