import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useMediationCase } from "../../data/useMediationCase";
import { StatusBadge } from "../../../../../shared/components/StatusBadge";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { useActiveResidentHome } from "../../../homeContext/hooks/useActiveResidentHome";
import { styles } from "../../styles/screens/interFlat_screens/MediationCaseDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function MediationCaseDetailScreen({ route, navigation }: InterFlatScreenProps<'MediationCaseDetail'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { mediationId } = route.params;
    const { data, isLoading } = useMediationCase(mediationId);
    const { activeContext } = useActiveResidentHome();
    if (isLoading || !data) {
        return (<View style={styles.loading}>
        <Text style={styles.loadingText}>{localizedUiText.m_9205fb7cfdc6}</Text>
      </View>);
    }
    const mCase = data;
    const isReporter = mCase.reporterFlat === activeContext.flatNumber;
    const residentVisibleNotes = (mCase.notes ?? []).filter((note) => note.visibility === 'SHARE_WITH_INVOLVED_PARTIES' ||
        (isReporter && note.visibility === 'SHARE_WITH_REPORTER'));
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>{mCase.caseNumber}</Text>
        <StatusBadge status={mCase.status} moduleType="noc"/>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{localizedUiText.m_248782692bd0}</Text>
        <Text style={styles.value}>{mCase.issueNumber}</Text>

        <Text style={styles.label}>{localizedUiText.m_0a51f8471b97}</Text>
        <Text style={styles.value}>{mCase.mediatorName || localizedUiText.m_3996db4138ac}</Text>

        <Text style={styles.label}>{localizedUiText.m_819ca5b19b20}</Text>
        <Text style={styles.value}>{mCase.reporterFlat}</Text>

        <Text style={styles.label}>{localizedUiText.m_4fa489554ff1}</Text>
        <Text style={styles.value}>{mCase.involvedFlat}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_b7f4b1d5303b}</Text>
        {residentVisibleNotes.length > 0 ? (residentVisibleNotes.map((n) => (<View key={n.id} style={styles.noteCard}>
              <Text style={styles.noteAuthor}>{n.authorName}</Text>
              <Text style={styles.noteText}>{n.noteText}</Text>
              <Text style={styles.noteVis}>{localizedUiText.m_6c543713068a + " "}{n.visibility.replace(/_/g, ' ')}</Text>
            </View>))) : (<Text style={styles.emptyText}>{localizedUiText.m_f51b47070909}</Text>)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_4b52380c0ddf}</Text>
        {mCase.proposals.length > 0 ? mCase.proposals.map((proposal) => (<TouchableOpacity key={proposal.id} style={styles.noteCard} onPress={() => navigation.navigate('ResolutionAcceptance', { proposalId: proposal.id })}>
            <Text style={styles.noteText} numberOfLines={3}>{proposal.proposedResolution}</Text>
            <Text style={styles.noteVis}>{localizedUiText.m_8e81d99308c0}</Text>
          </TouchableOpacity>)) : <Text style={styles.emptyText}>{localizedUiText.m_3f20ecf1f8d9}</Text>}
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => navigation.navigate('ResolutionProposal', { mediationId })}>
          <Text style={styles.btnPrimaryText}>{localizedUiText.m_19dc0617ae36}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>);
}

