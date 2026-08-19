import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ChatStackParamList } from "../../../../app/navigation/navigation.types";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { FormField } from "../../../../shared/forms/FormField";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { AppBottomSheet } from "../../../../ui/bottomSheet/AppBottomSheet";
import { ListSkeleton } from "../../../../ui/loading/ListSkeleton";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ScreenEmptyState } from "../../../../ui/states/ScreenEmptyState";
import { ScreenErrorState } from "../../../../ui/states/ScreenErrorState";
import { StatusPill, type StatusTone } from "../../../../ui/components/StatusPill";
import type { ResidentContactRequest } from "../domain/residentContact.types";
import { useResidentContactDecision, useResidentContactRequests } from "../hooks/useResidentContactData";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle2, createPressableBackgroundColorBorderColorStyle } from "../styles/screens/ResidentContactRequestsScreen.styles";
type Props = NativeStackScreenProps<ChatStackParamList, 'ResidentContactRequests'>;
type Decision = 'accept' | 'reject' | 'block' | 'report' | 'cancel';
type ReportCategory = 'harassment' | 'spam' | 'privacyConcern' | 'other';
function unitLabel(unitId: string): string {
    const parts = unitId.split('-');
    return parts.slice(-2).join('-').toLocaleUpperCase();
}
function statusTone(status: ResidentContactRequest['status']): StatusTone {
    if (status === 'accepted')
        return 'success';
    if (status === 'rejected' || status === 'blocked')
        return 'danger';
    if (status === 'reported' || status === 'expired')
        return 'warning';
    if (status === 'cancelled')
        return 'muted';
    return 'info';
}
export function ResidentContactRequestsScreen({ navigation, route }: Props) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const copy = messages.resident.residentConnect.requestList;
    const { mode } = route.params;
    const { scope, incoming, outgoing } = useResidentContactRequests();
    const source = mode === 'incoming' ? incoming : outgoing;
    const decisions = useResidentContactDecision();
    const [selectedRequest, setSelectedRequest] = useState<ResidentContactRequest | null>(null);
    const [decision, setDecision] = useState<Decision | null>(null);
    const [reportCategory, setReportCategory] = useState<ReportCategory>('other');
    const [reportExplanation, setReportExplanation] = useState('');
    const isSubmitting = decisions.accept.isSubmitting
        || decisions.reject.isSubmitting
        || decisions.block.isSubmitting
        || decisions.report.isSubmitting
        || decisions.cancel.isSubmitting;
    const sortedRequests = useMemo(() => [...(source.data ?? [])].sort((left, right) => right.createdAtIso.localeCompare(left.createdAtIso)), [source.data]);
    const openDecision = (request: ResidentContactRequest, nextDecision: Decision) => {
        setSelectedRequest(request);
        setDecision(nextDecision);
    };
    const closeDecision = () => {
        if (isSubmitting)
            return;
        setSelectedRequest(null);
        setDecision(null);
        setReportExplanation('');
        setReportCategory('other');
    };
    const confirmDecision = async () => {
        if (!selectedRequest || !decision)
            return;
        const input = { ...scope, requestId: selectedRequest.requestId };
        const result = decision === 'accept'
            ? await decisions.accept.submit(input)
            : decision === 'reject'
                ? await decisions.reject.submit(input)
                : decision === 'block'
                    ? await decisions.block.submit(input)
                    : decision === 'cancel'
                        ? await decisions.cancel.submit(input)
                        : await decisions.report.submit({ ...input, reportCategory, ...includeWhenPresent("explanation", reportExplanation.trim() || undefined) });
        if (result.ok) {
            closeDecision();
            await Promise.all([incoming.refetch(), outgoing.refetch()]);
        }
    };
    const openAcceptedChat = (request: ResidentContactRequest) => {
        if (request.conversationId)
            navigation.navigate('ResidentDirectConversation', { conversationId: request.conversationId });
    };
    const decisionTitle = decision === 'report'
        ? copy.reportTitle
        : decision === 'accept'
            ? copy.accept
            : decision === 'reject'
                ? copy.reject
                : decision === 'block'
                    ? copy.block
                    : copy.cancel;
    const decisionDescription = decision === 'accept'
        ? copy.acceptDescription
        : decision === 'reject'
            ? copy.rejectDescription
            : decision === 'block'
                ? copy.blockDescription
                : decision === 'report'
                    ? copy.reportDescription
                    : copy.awaitingResponse;
    return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}>
      <ResidentPageHeader title={mode === 'incoming' ? copy.incomingTitle : copy.outgoingTitle} subtitle={mode === 'incoming' ? copy.incomingSubtitle : copy.outgoingSubtitle} showBackButton/>
      {source.isLoading ? (<View style={styles.loading}><ListSkeleton count={5}/></View>) : source.error ? (<ScreenErrorState title={copy.errorTitle} message={copy.errorDescription} onRetry={source.refetch}/>) : sortedRequests.length === 0 ? (<ScreenEmptyState title={mode === 'incoming' ? copy.noIncomingTitle : copy.noOutgoingTitle} description={mode === 'incoming' ? copy.noIncomingDescription : copy.noOutgoingDescription} iconName="mail-outline"/>) : (<ScrollView contentContainerStyle={styles.list}>
          {sortedRequests.map((request) => {
                const counterpartUnitId = mode === 'incoming' ? request.requesterUnitId : request.recipientUnitId;
                return (<View key={request.requestId} style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.avatar, createViewBackgroundColorStyle2(colors.primarySoft)]}>
                    <Ionicons name="person-outline" size={20} color={colors.primary}/>
                  </View>
                  <View style={styles.flex}>
                    <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)}>
                      {mode === 'incoming' ? copy.contactFrom(unitLabel(counterpartUnitId)) : copy.contactTo(unitLabel(counterpartUnitId))}
                    </SafeText>
                    <SafeText variant="tiny" style={createSafeTextColorStyle2(colors.textMuted)}>{formatResidentDate(request.createdAtIso)}</SafeText>
                  </View>
                  <StatusPill label={copy.statuses[request.status]} tone={statusTone(request.status)} small/>
                </View>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(colors.textPrimary)}>{request.subject}</SafeText>
                <SafeText variant="body" style={createSafeTextColorStyle4(colors.textSecondary)}>{request.introductoryMessage}</SafeText>
                <View style={styles.actions}>
                  {mode === 'incoming' && request.status === 'pending' ? (<>
                      <AppButton title={copy.accept} onPress={() => openDecision(request, 'accept')} size="sm"/>
                      <AppButton title={copy.reject} onPress={() => openDecision(request, 'reject')} size="sm" variant="outline"/>
                      <AppButton title={copy.block} onPress={() => openDecision(request, 'block')} size="sm" variant="danger"/>
                      <AppButton title={copy.report} onPress={() => openDecision(request, 'report')} size="sm" variant="ghost"/>
                    </>) : null}
                  {mode === 'outgoing' && request.status === 'pending' ? (<AppButton title={copy.cancel} onPress={() => openDecision(request, 'cancel')} size="sm" variant="outline"/>) : null}
                  {request.status === 'accepted' && request.conversationId ? (<AppButton title={copy.openChat} onPress={() => openAcceptedChat(request)} size="sm"/>) : null}
                </View>
              </View>);
            })}
        </ScrollView>)}

      <AppBottomSheet visible={selectedRequest !== null} onClose={closeDecision} preventDismiss={isSubmitting} testID="contact-request-decision-sheet">
        <View style={styles.sheetContent}>
          <SafeText variant="title" style={createSafeTextColorStyle5(colors.textPrimary)}>{decisionTitle}</SafeText>
          <SafeText variant="body" style={createSafeTextColorStyle6(colors.textSecondary)}>{decisionDescription}</SafeText>
          {decision === 'report' ? (<>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle7(colors.textPrimary)}>{copy.reportCategoryLabel}</SafeText>
              <View style={styles.reportCategories}>
                {(['harassment', 'spam', 'privacyConcern', 'other'] as const).map((category) => {
                const selected = reportCategory === category;
                return (<Pressable key={category} onPress={() => setReportCategory(category)} style={[styles.reportCategory, createPressableBackgroundColorBorderColorStyle(selected ? colors.primarySoft : colors.surface, selected ? colors.primary : colors.border)]} accessibilityRole="radio" accessibilityState={{ selected }}>
                      <SafeText variant="caption" style={createSafeTextColorStyle8(selected ? colors.primary : colors.textSecondary)}>{copy.reportCategories[category]}</SafeText>
                    </Pressable>);
            })}
              </View>
              <FormField label={copy.reportExplanationLabel} placeholder={copy.reportExplanationPlaceholder} value={reportExplanation} onChangeText={setReportExplanation} multiline numberOfLines={3} maxLength={300}/>
            </>) : null}
          <View style={styles.sheetActions}>
            <AppButton title={copy.dismiss} onPress={closeDecision} variant="ghost" style={styles.flex}/>
            <AppButton title={copy.confirm} onPress={() => void confirmDecision()} loading={isSubmitting} variant={decision === 'block' || decision === 'report' ? 'danger' : 'primary'} style={styles.flex}/>
          </View>
        </View>
      </AppBottomSheet>
    </View>);
}
export default ResidentContactRequestsScreen;

