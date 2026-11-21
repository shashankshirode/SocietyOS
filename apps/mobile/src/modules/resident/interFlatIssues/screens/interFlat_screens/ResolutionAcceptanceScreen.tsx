import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useResolutionAcceptance } from "../../data/useResolutionAcceptance";
import { useResolutionProposalDetail } from "../../data/useResolutionProposalDetail";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { useActiveResidentHome } from "../../../homeContext/hooks/useActiveResidentHome";
import { LoadingState } from "../../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../../shared/feedback/ErrorState";
import { AccessRestrictedState } from "../../../../../shared/feedback/AccessRestrictedState";
import { formatResidentDate } from "../../../../../core/localization/dateTimeFormatters";
import { styles } from "../../styles/screens/interFlat_screens/ResolutionAcceptanceScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
type ResolutionPartyRole = 'REPORTER' | 'INVOLVED_FLAT';
export function ResolutionAcceptanceScreen({ route, navigation }: InterFlatScreenProps<'ResolutionAcceptance'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { proposalId } = route.params;
    const { accept, reject, isSubmitting } = useResolutionAcceptance(proposalId);
    const { data: detail, isLoading, error, refetch } = useResolutionProposalDetail(proposalId);
    const { activeContext } = useActiveResidentHome();
    const [feedback, setFeedback] = useState('');
    if (isLoading)
        return <LoadingState message={localizedUiText.m_22a5beca1941} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!detail)
        return <ErrorState message={localizedUiText.m_1e30aec7702a} onRetry={refetch}/>;
    const role: ResolutionPartyRole | null = activeContext.flatNumber === detail.reporterFlat
        ? 'REPORTER'
        : activeContext.flatNumber === detail.involvedFlat
            ? 'INVOLVED_FLAT'
            : null;
    const scopeAllowsRole = role === 'REPORTER'
        ? detail.proposal.acceptanceScope === 'REPORTER_ONLY' || detail.proposal.acceptanceScope === 'BOTH_PARTIES'
        : role === 'INVOLVED_FLAT'
            ? detail.proposal.acceptanceScope === 'INVOLVED_FLAT_ONLY' || detail.proposal.acceptanceScope === 'BOTH_PARTIES'
            : false;
    if (!role || !scopeAllowsRole) {
        return (<AccessRestrictedState title={localizedUiText.m_55b859b14d7a} description={localizedUiText.m_44c970f48606} requiredPermission="INTER_FLAT_RESOLUTION_PARTY" onBack={navigation.goBack}/>);
    }
    const proposal = detail.proposal;
    const existingDecision = role === 'REPORTER' ? proposal.reporterAccepted : proposal.involvedFlatAccepted;
    const handleAccept = async () => {
        await accept(feedback, role);
        await refetch();
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_42e798db8f02), [
            { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('InterFlatHome') }
        ]);
    };
    const handleReject = async () => {
        if (!feedback) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_de5d5d8a3636));
            return;
        }
        await reject(feedback, role);
        await refetch();
        AppAlert.alert(String(localizedUiText.m_e3e7d8848f8a), String(localizedUiText.m_0941e6a88c5d));
        navigation.navigate('InterFlatHome');
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_d276cb136d32}</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>{localizedUiText.m_4f0c5b4baf76}</Text>
        <Text style={styles.value}>{proposal.proposedResolution}</Text>

        <Text style={styles.label}>{localizedUiText.m_1ce75aac03f8}</Text>
        <Text style={styles.value}>{proposal.responsibleParty}</Text>

        <Text style={styles.label}>{localizedUiText.m_523f7843daff}</Text>
        <Text style={styles.value}>{formatResidentDate(proposal.targetDate)}</Text>
      </View>

      <Text style={styles.label}>{localizedUiText.m_46fa56cfd72a}</Text>
      <Text style={styles.value}>{role === 'REPORTER' ? localizedUiText.m_fc0efe181d6e : localizedUiText.m_2cc9cf3e7074} · {activeContext.flatNumber}</Text>

      {existingDecision !== undefined ? (<Text style={[styles.decisionText, existingDecision ? styles.acceptedText : styles.rejectedText]}>{localizedUiText.m_38ca40eaa3ab}{existingDecision ? localizedUiText.m_070c160a6299 : localizedUiText.m_20cd938a2ea6}{localizedUiText.m_33223abfd39b}</Text>) : null}

      <Text style={styles.label}>{localizedUiText.m_0b38fb7133a7}</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_d675e3028561} multiline value={feedback} onChangeText={setFeedback}/>

      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.btn, styles.btnReject]} onPress={handleReject} disabled={isSubmitting || existingDecision !== undefined}>
          <Text style={styles.btnRejectText}>{localizedUiText.m_df839c1a89e9}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnAccept]} onPress={handleAccept} disabled={isSubmitting || existingDecision !== undefined}>
          <Text style={styles.btnAcceptText}>{localizedUiText.m_487b9a8366b3}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>);
}

