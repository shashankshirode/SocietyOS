import { useState } from "react";
import { ScrollView, View, Pressable, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { VisitorPassPanel } from "../../../../ui/patterns/VisitorPassPanel";
import { ResidentTimeline } from "../../../../ui/patterns/ResidentTimeline";
import { SafeText } from "../../../../shared/components/SafeText";
import type { Visitor } from "../../../../shared/types/visitor.types";
import { VisitorPassCancellationReason } from "../../../../shared/types/visitor.types";
import { useMessages } from "../../../../shared/constants/useMessages";
import { VisitorStatus } from "../data/visitors.enums";
import { useMockStore } from "../../../../core/mockStore/useMockStore";
import { StatusModal } from "../../../../ui/modal/StatusModal";
import { AppModal } from "../../../../ui/modal/AppModal";
import { ModalHeader } from "../../../../ui/modal/ModalHeader";
import { ModalFooter } from "../../../../ui/modal/ModalFooter";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import { VisitorExitTrackingPanel } from "../components/VisitorExitTrackingPanel";
import { VisitorOverstayAlertCard } from "../components/VisitorOverstayAlertCard";
import { VisitorExitConfirmationSheet } from "../components/VisitorExitConfirmationSheet";
import { VisitorExitExtensionModal } from "../components/VisitorExitExtensionModal";
import { deriveVisitorExitAlert } from "../utils/contextualVisitorExitStatus";
import { visitorsRepository } from "../data/visitors.repository";
import { t } from "../../household/components/householdComponentUtils";
import { ensureVisitorExitTracking } from "../utils/visitorExitPolicyResolver";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle2, createPressableBorderColorBackgroundColorStyle, createTextInputBorderColorColorBackgroundColorStyle } from "../styles/screens/VisitorDetailScreen.styles";
type Props = {
    navigation: {
        navigate: (screen: string, params?: JsonObject) => void;
        goBack: () => void;
    };
    route: {
        params: {
            visitor: Visitor;
        };
    };
};
function getVisitor(route: Props['route']): Visitor {
    return route.params.visitor;
}
export function VisitorDetailScreen({ navigation, route }: Props) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const { state, updateVisitor } = useMockStore();
    const routeVisitor = getVisitor(route);
    const visitor = state.visitors.find((item) => item.id === routeVisitor.id) || routeVisitor;
    const visitorExitTracking = ensureVisitorExitTracking(visitor);
    const exitAlert = deriveVisitorExitAlert(visitor);
    const { activeContext } = useActiveResidentHome();
    const [cancelConfirmVisible, setCancelConfirmVisible] = useState(false);
    const [cancelSuccessVisible, setCancelSuccessVisible] = useState(false);
    const [selectedReason, setSelectedReason] = useState<VisitorPassCancellationReason>(VisitorPassCancellationReason.PlansChanged);
    const [customNotes, setCustomNotes] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);
    const [regenOtpVisible, setRegenOtpVisible] = useState(false);
    const [exitSheetVisible, setExitSheetVisible] = useState(false);
    const [extensionVisible, setExtensionVisible] = useState(false);
    const [exitStatusVisible, setExitStatusVisible] = useState(false);
    const [exitStatusMessage, setExitStatusMessage] = useState('');
    const showExitStatus = (message: string) => {
        setExitStatusMessage(message);
        setExitStatusVisible(true);
    };
    const confirmCancel = async () => {
        if (isCancelling)
            return;
        setIsCancelling(true);
        const result = await visitorsRepository.cancelVisitorPass({
            residenceId: activeContext.unitId,
            visitorPassId: visitor.id,
            reason: selectedReason,
            notes: selectedReason === VisitorPassCancellationReason.Other ? customNotes : null,
            requestedAt: new Date().toISOString(),
        });
        setIsCancelling(false);
        if (result.ok) {
            setCancelConfirmVisible(false);
            setCancelSuccessVisible(true);
        }
    };
    const handleRegenOtp = () => {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        updateVisitor(visitor.id, { otp: newOtp });
        setRegenOtpVisible(true);
    };
    const handleConfirmLeft = async () => {
        const result = await visitorsRepository.confirmVisitorLeft({ visitorPassId: visitor.id });
        if (result.ok) {
            setExitSheetVisible(false);
            showExitStatus(t(messages, 'visitor.exitAssurance.confirmLeftSaved'));
        }
    };
    const handleStillInside = async () => {
        const result = await visitorsRepository.confirmVisitorStillInside({ visitorPassId: visitor.id });
        if (result.ok) {
            setExitSheetVisible(false);
            showExitStatus(t(messages, 'visitor.exitAssurance.stillInsideSaved'));
        }
    };
    const handleExtend = async (expectedExitAtIso: string, reason: string) => {
        const result = await visitorsRepository.extendVisitorExpectedExit({
            visitorPassId: visitor.id,
            expectedExitAtIso,
            reason,
        });
        if (result.ok) {
            setExtensionVisible(false);
            setExitSheetVisible(false);
            showExitStatus(t(messages, 'visitor.exitAssurance.extensionSaved'));
        }
    };
    const handleContactSecurity = async () => {
        const result = await visitorsRepository.contactSecurityForVisitorExit({ visitorPassId: visitor.id });
        if (result.ok) {
            setExitSheetVisible(false);
            showExitStatus(t(messages, 'visitor.exitAssurance.securityContacted'));
        }
    };
    const timelineEvents = [
        {
            id: 'evt-1',
            title: messages.visitors.passCreatedTimeline,
            description: messages.visitors.passCreatedTimelineDesc(visitor.name),
            timestamp: visitor.expectedTime,
            iconName: 'document-text-outline',
            status: 'ISSUED',
            statusTone: 'success' as const,
        },
        ...(visitor.actualEntryTime
            ? [
                {
                    id: 'evt-2',
                    title: messages.visitors.checkedInTimeline,
                    description: messages.visitors.checkedInTimelineDesc(visitor.societyName),
                    timestamp: visitor.actualEntryTime,
                    iconName: 'log-in-outline',
                    status: VisitorStatus.APPROVED,
                    statusTone: 'info' as const,
                },
            ]
            : []),
        ...(visitor.actualExitTime
            ? [
                {
                    id: 'evt-3',
                    title: messages.visitors.checkedOutTimeline,
                    description: messages.visitors.checkedOutTimelineDesc,
                    timestamp: visitor.actualExitTime,
                    iconName: 'log-out-outline',
                    status: VisitorStatus.COMPLETED,
                    statusTone: 'neutral' as const,
                },
            ]
            : []),
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader titleKey="visitors.passDetailTitle" title={messages.visitors.passDetailTitle}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {visitor.status === 'CANCELLED' && (<View style={createViewBackgroundColorBorderColorStyle(theme.dangerSoft, theme.danger)}>
            <Ionicons name="ban-outline" size={24} color={theme.danger}/>
            <View style={styles.viewFlex}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.danger)}>
                {messages.visitors.passCancelledTitle}
              </SafeText>
              <SafeText variant="caption" color="secondary">
                {messages.visitors.cancelledReasonLabel}: {visitor.cancellationReason === 'PLANS_CHANGED' ? messages.visitors.cancelReasonPlansChanged :
                visitor.cancellationReason === 'VISITOR_NOT_COMING' ? messages.visitors.cancelReasonNotComing :
                    visitor.cancellationReason === 'INCORRECT_DETAILS' ? messages.visitors.cancelReasonIncorrectDetails :
                        visitor.cancellationReason === 'DUPLICATE_PASS' ? messages.visitors.cancelReasonDuplicatePass :
                            visitor.cancellationReason === 'SECURITY_CONCERN' ? messages.visitors.cancelReasonSecurityConcern :
                                visitor.cancellationReason === 'OTHER' ? messages.visitors.cancelReasonOther :
                                    visitor.cancellationReason || messages.common.none}
              </SafeText>
              {visitor.cancellationNotes ? (<SafeText variant="caption" color="secondary" style={styles.safeTextMarginTop}>
                  {visitor.cancellationNotes}
                </SafeText>) : null}
            </View>
          </View>)}

        {visitor.status === 'CANCELLED' ? (<VisitorPassPanel visitorName={visitor.name} visitorType={visitor.type} purpose={visitor.purpose} validFrom={visitor.expectedDate} validTill={visitor.expectedTime} gateName={visitor.societyName} otpCode="------"/>) : (<VisitorPassPanel visitorName={visitor.name} visitorType={visitor.type} purpose={visitor.purpose} validFrom={visitor.expectedDate} validTill={visitor.expectedTime} gateName={visitor.societyName} otpCode={visitor.otp} onCancelPress={() => setCancelConfirmVisible(true)} onSharePress={() => setShareVisible(true)} onRegenerateOtp={handleRegenOtp}/>)}

        {exitAlert ? (<VisitorOverstayAlertCard alert={exitAlert} onConfirmLeft={handleConfirmLeft} onStillInside={handleStillInside} onExtendTime={() => setExtensionVisible(true)} onContactSecurity={handleContactSecurity}/>) : null}

        <VisitorExitTrackingPanel visitor={visitor}/>

        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle(theme.textPrimary)]}>
            {messages.visitors.gateActivityLogHeader}
          </SafeText>
          <ResidentTimeline items={timelineEvents}/>
        </View>
      </ScrollView>

      <AppModal visible={cancelConfirmVisible} onClose={() => setCancelConfirmVisible(false)} centered>
        <ModalHeader title={messages.visitors.cancelPassConfirmTitle} onClose={() => setCancelConfirmVisible(false)}/>
        <ScrollView style={styles.scrollViewMaxHeightPaddingHorizontal} showsVerticalScrollIndicator={false}>
          <SafeText variant="body" color="secondary" style={styles.safeTextMarginBottom}>
            {messages.visitors.cancelPassConfirmMessage(visitor.name)}
          </SafeText>
          <SafeText variant="bodyStrong" color="primary" style={styles.safeTextMarginBottom2}>
            {messages.visitors.cancelReasonLabel}
          </SafeText>
          
          <View style={styles.viewGapMarginBottom}>
            {[
            { key: VisitorPassCancellationReason.PlansChanged, label: messages.visitors.cancelReasonPlansChanged },
            { key: VisitorPassCancellationReason.VisitorNotComing, label: messages.visitors.cancelReasonNotComing },
            { key: VisitorPassCancellationReason.IncorrectDetails, label: messages.visitors.cancelReasonIncorrectDetails },
            { key: VisitorPassCancellationReason.DuplicatePass, label: messages.visitors.cancelReasonDuplicatePass },
            { key: VisitorPassCancellationReason.SecurityConcern, label: messages.visitors.cancelReasonSecurityConcern },
            { key: VisitorPassCancellationReason.Other, label: messages.visitors.cancelReasonOther },
        ].map((reason) => {
            const isSelected = selectedReason === reason.key;
            return (<Pressable key={reason.key} onPress={() => setSelectedReason(reason.key)} style={createPressableBorderColorBackgroundColorStyle(isSelected ? theme.accent : theme.border, isSelected ? theme.accentSoft : theme.surface)}>
                  <Ionicons name={isSelected ? "radio-button-on" : "radio-button-off"} size={18} color={isSelected ? theme.accent : theme.textSecondary} style={styles.ioniconsMarginRight}/>
                  <SafeText variant="body" color={isSelected ? "primary" : "secondary"}>
                    {reason.label}
                  </SafeText>
                </Pressable>);
        })}
          </View>

          {selectedReason === VisitorPassCancellationReason.Other && (<View style={styles.viewMarginBottom}>
              <SafeText variant="caption" color="secondary" style={styles.safeTextMarginBottom3}>
                {messages.visitors.cancelNotesLabel}
              </SafeText>
              <TextInput style={createTextInputBorderColorColorBackgroundColorStyle(theme.border, theme.textPrimary, theme.background)} multiline maxLength={150} placeholder={messages.visitors.cancelNotesPlaceholder} placeholderTextColor={theme.textMuted} value={customNotes} onChangeText={setCustomNotes}/>
            </View>)}
        </ScrollView>
        <ModalFooter secondaryAction={{
            label: messages.visitors.keepButton,
            onPress: () => setCancelConfirmVisible(false),
            disabled: isCancelling,
        }} dangerAction={{
            label: messages.visitors.cancelButton,
            onPress: confirmCancel,
            loading: isCancelling,
            disabled: isCancelling,
            variant: 'danger',
        }}/>
      </AppModal>

      <StatusModal visible={cancelSuccessVisible} type="success" title={messages.visitors.cancelPassSuccessTitle} message={messages.visitors.cancelPassSuccessMessage} actionLabel={messages.common.ok} onClose={() => {
            setCancelSuccessVisible(false);
            navigation.goBack();
        }}/>

      <StatusModal visible={shareVisible} type="info" title={messages.visitors.sharePassTitle} message={messages.visitors.sharePassMessage} actionLabel={messages.common.ok} onClose={() => setShareVisible(false)}/>

      <StatusModal visible={regenOtpVisible} type="success" title={messages.visitors.regenOtpTitle} message={messages.visitors.regenOtpMessage} actionLabel={messages.common.ok} onClose={() => setRegenOtpVisible(false)}/>

      <VisitorExitConfirmationSheet visible={exitSheetVisible} onConfirmLeft={handleConfirmLeft} onStillInside={handleStillInside} onExtendTime={() => setExtensionVisible(true)} onContactSecurity={handleContactSecurity} onClose={() => setExitSheetVisible(false)}/>

      <VisitorExitExtensionModal visible={extensionVisible} currentExpectedExitAtIso={visitorExitTracking.expectedExitAtIso} onSubmit={handleExtend} onClose={() => setExtensionVisible(false)}/>

      <StatusModal visible={exitStatusVisible} type="success" title={t(messages, 'visitor.exitAssurance.title')} message={exitStatusMessage} actionLabel={messages.common.ok} onClose={() => setExitStatusVisible(false)}/>
    </View>);
}
export default VisitorDetailScreen;

