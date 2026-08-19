import { ScrollView, View } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatPageHeader } from "../../../chat/components/ChatPageHeader";
import { AppButton } from "../../../../shared/components/AppButton";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { AppCard } from "../../../../shared/cards/AppCard";
import { DataRow } from "../../../../shared/dataDisplay/DataRow";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ScreenContainer } from "../../../../shared/layouts/ScreenContainer";
import { SafeText } from "../../../../shared/components/SafeText";
import { formatResidentLocalDate } from "../../../../shared/utils/formatters";
import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useAcceptContactRequest, useBlockContactRequest, useContactRequestDetail, useRejectContactRequest } from "../data/useContactRequestDetail";
import { styles } from "../styles/screens/ContactRequestDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type Decision = 'accept' | 'reject' | 'block';
type ContactRequestDetailProps = {
    navigation: {
        goBack: () => void;
        dispatch: (action: ReturnType<typeof CommonActions.navigate>) => void;
    };
    route: {
        params: {
            requestId?: string;
            id?: string;
        };
    };
};
export function ContactRequestDetailScreen({ navigation, route }: ContactRequestDetailProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const requestId = route.params.requestId ?? route.params.id ?? '';
    const { data: request, isLoading, error, refetch } = useContactRequestDetail(requestId);
    const acceptRequest = useAcceptContactRequest();
    const rejectRequest = useRejectContactRequest();
    const blockRequest = useBlockContactRequest();
    const isSubmitting = acceptRequest.isSubmitting || rejectRequest.isSubmitting || blockRequest.isSubmitting;
    const submitDecision = async (decision: Decision) => {
        if (isSubmitting)
            return;
        const result = decision === 'accept'
            ? await acceptRequest.submit(requestId)
            : decision === 'reject'
                ? await rejectRequest.submit(requestId)
                : await blockRequest.submit(requestId);
        if (!result.ok) {
            AppAlert.alert(String(localizedUiText.m_6f22e207e2b1), result.error.message);
            return;
        }
        await refetch();
        const successMessage = decision === 'accept'
            ? getActiveUiLiteral("m_f4160d0ab535") : decision === 'reject'
            ? getActiveUiLiteral("m_eefcf280c42b") : getActiveUiLiteral("m_1fb96d937e2b");
        AppAlert.alert(String(localizedUiText.m_933d05a95a03), successMessage);
    };
    if (isLoading) {
        return <LoadingState message={localizedUiText.m_736a06e931af} showCardPlaceholder/>;
    }
    if (error) {
        return <ErrorState message={error.message} onRetry={refetch}/>;
    }
    if (!request) {
        return (<ScreenContainer>
        <SafeAreaView style={styles.safe} edges={['left', 'right']}>
          <ChatPageHeader title={localizedUiText.m_12b8c8d77974} showBackButton onBackPress={navigation.goBack}/>
          <EmptyState title={localizedUiText.m_6e39d7d8300f} description={localizedUiText.m_fb6f0f24a1ba} iconName="mail-open-outline" actionLabel={localizedUiText.m_6aadac2f2b7a} onAction={navigation.goBack}/>
        </SafeAreaView>
      </ScreenContainer>);
    }
    const isIncoming = request.toResidentId === 'resident-001';
    const canDecide = isIncoming && request.status === 'PENDING';
    const statusType = request.status === 'ACCEPTED'
        ? 'success'
        : request.status === 'PENDING'
            ? 'warning'
            : request.status === 'REPORTED' || request.status === 'BLOCKED'
                ? 'danger'
                : 'neutral';
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ChatPageHeader title={localizedUiText.m_12b8c8d77974} showBackButton onBackPress={navigation.goBack}/>
        <ScrollView contentContainerStyle={styles.content}>
          <AppCard style={styles.card}>
            <View style={styles.headingRow}>
              <View style={styles.headingText}>
                <SafeText variant="title" color="primary">{request.subject}</SafeText>
                <SafeText variant="caption" color="secondary">
                  {isIncoming ? formatUiLiteral(localizedUiText.m_0934af4bab73, [request.fromResidentName]) : formatUiLiteral(localizedUiText.m_1c2e9c724688, [request.toResidentName])}
                </SafeText>
              </View>
              <StatusBadge label={request.status.replaceAll('_', ' ')} type={statusType}/>
            </View>
            <SafeText variant="body" color="primary" style={styles.message}>{request.message}</SafeText>
          </AppCard>

          <AppCard style={styles.card}>
            <SafeText variant="bodyStrong" color="primary" style={styles.sectionTitle}>{localizedUiText.m_864974bec8ef}</SafeText>
            <DataRow label={localizedUiText.m_280eda6fb8fa} value={isIncoming ? request.fromResidentName : request.toResidentName}/>
            <DataRow label={localizedUiText.m_9285cedcf26a} value={isIncoming ? request.fromFlat : request.toFlat}/>
            <DataRow label={localizedUiText.m_7e61847d61d6} value={request.category.replaceAll('_', ' ')}/>
            <DataRow label={localizedUiText.m_03d37e9a5379} value={request.urgency}/>
            <DataRow label={localizedUiText.m_49f19beeecf4} value={formatResidentLocalDate(request.createdAt)} isLast/>
          </AppCard>

          {canDecide ? (<AppCard style={styles.card}>
              <SafeText variant="bodyStrong" color="primary" style={styles.sectionTitle}>{localizedUiText.m_0abf3bab17d6}</SafeText>
              <SafeText variant="caption" color="secondary" style={styles.helper}>{localizedUiText.m_c26486b75b4f}</SafeText>
              <View style={styles.actionStack}>
                <AppButton title={localizedUiText.m_038829409be4} onPress={() => void submitDecision('accept')} loading={acceptRequest.isSubmitting} disabled={isSubmitting}/>
                <AppButton title={localizedUiText.m_72740f4a78a7} variant="outline" onPress={() => void submitDecision('reject')} loading={rejectRequest.isSubmitting} disabled={isSubmitting}/>
                <AppButton title={localizedUiText.m_f0867944a875} variant="danger" onPress={() => void submitDecision('block')} loading={blockRequest.isSubmitting} disabled={isSubmitting}/>
                <AppButton title={localizedUiText.m_cb53f3731405} variant="ghost" disabled={isSubmitting} onPress={() => navigation.dispatch(CommonActions.navigate({
                name: 'ReportResidentConnect',
                params: {
                    targetType: 'CONTACT_REQUEST',
                    targetId: request.id,
                    contextText: `${request.subject}: ${request.message}`,
                },
            }))}/>
              </View>
            </AppCard>) : null}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

