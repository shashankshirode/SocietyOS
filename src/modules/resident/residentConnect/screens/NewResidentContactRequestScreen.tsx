import { useCallback, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, ScrollView, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ChatStackParamList } from "../../../../app/navigation/navigation.types";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { getAppPlatform, getPlatformKeyboardConfig } from "../../../../shared/platform";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { AppBottomSheet } from "../../../../ui/bottomSheet/AppBottomSheet";
import { AppTextArea } from "../../../../ui/forms/AppTextArea";
import { AppTextInput } from "../../../../ui/forms/AppTextInput";
import { FormField } from "../../../../ui/forms/FormField";
import { StickyActionFooter } from "../../../../ui/layout/StickyActionFooter";
import { useResponsiveLayout } from "../../../../ui/layout/useResponsiveLayout";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { ScreenErrorState } from "../../../../ui/states/ScreenErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ScreenEmptyState } from "../../../../ui/states/ScreenEmptyState";
import { resolveResidentTabBarObstruction } from "../../navigation/useResidentTabBarLayout";
import type { ResidentContactTopic } from "../domain/residentContact.types";
import { CONTACT_MESSAGE_MAX_LENGTH, CONTACT_MESSAGE_MIN_LENGTH, CONTACT_SUBJECT_MAX_LENGTH, CONTACT_SUBJECT_MIN_LENGTH, validateResidentContactRequest } from "../domain/residentContact.validation";
import { useCreateResidentContactRequest, useResidentDirectoryProfile } from "../hooks/useResidentContactData";
import { useResidentContactScope } from "../hooks/useResidentContactScope";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { CONTACT_REQUEST_FOOTER_GAP, styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createSafeTextColorStyle10, createSafeTextColorStyle11, createSafeTextColorStyle12, createSafeTextColorStyle13, createSafeTextColorStyle14, createSafeTextColorStyle15, createSafeTextColorStyle16, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createKeyboardAvoidingViewBackgroundColorStyle, createScrollViewPaddingHorizontalPaddingBottomStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle4, createSafeTextColorStyle17, createViewBackgroundColorStyle5, createViewBackgroundColorStyle6 } from '../styles/screens/NewResidentContactRequestScreen.styles';
export { CONTACT_REQUEST_CONTENT_MAX_WIDTH, CONTACT_REQUEST_FOOTER_GAP } from '../styles/screens/NewResidentContactRequestScreen.styles';
type Props = NativeStackScreenProps<ChatStackParamList, 'NewResidentContactRequest'>;
type SheetState = 'closed' | 'review' | 'sent';
export type ContactRequestFormValues = {
    subject: string;
    message: string;
    topic: ResidentContactTopic;
};
const topicKeys: ResidentContactTopic[] = [
    'neighbourCoordination',
    'parking',
    'maintenanceImpact',
    'communityActivity',
    'misdeliveredItem',
    'other',
];
export function NewResidentContactRequestScreen({ navigation, route }: Props) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const copy = messages.resident.contactRequest;
    const workflowCopy = messages.resident.residentConnect.request;
    const directoryCopy = messages.resident.residentConnect.directory;
    const insets = useSafeAreaInsets();
    const responsiveLayout = useResponsiveLayout();
    const keyboardConfig = getPlatformKeyboardConfig(insets.top);
    const scope = useResidentContactScope();
    const { data: resident, isLoading, error, refetch } = useResidentDirectoryProfile(route.params.residentProfileId);
    const { submit, isSubmitting, error: submissionError } = useCreateResidentContactRequest();
    const [formValues, setFormValues] = useState<ContactRequestFormValues>({
        subject: '',
        message: '',
        topic: 'neighbourCoordination'
    });
    const [subjectTouched, setSubjectTouched] = useState(false);
    const [messageTouched, setMessageTouched] = useState(false);
    const [showErrors, setShowErrors] = useState(false);
    const [sheetState, setSheetState] = useState<SheetState>('closed');
    const [footerHeight, setFooterHeight] = useState(0);
    const scrollRef = useRef<ScrollView>(null);
    const subjectInputRef = useRef<TextInput>(null);
    const messageInputRef = useRef<TextInput>(null);
    const validation = useMemo(() => validateResidentContactRequest(formValues.subject, formValues.message), [formValues.message, formValues.subject]);
    const subjectError = useMemo(() => {
        if (!subjectTouched && !showErrors)
            return undefined;
        const length = formValues.subject.trim().length;
        if (length === 0)
            return copy.subject.required;
        if (length < CONTACT_SUBJECT_MIN_LENGTH)
            return copy.subject.minimum;
        if (length > CONTACT_SUBJECT_MAX_LENGTH)
            return copy.subject.maximum;
        return undefined;
    }, [copy.subject, formValues.subject, showErrors, subjectTouched]);
    const messageError = useMemo(() => {
        if (!messageTouched && !showErrors)
            return undefined;
        const length = formValues.message.trim().length;
        if (length === 0)
            return copy.message.required;
        if (length < CONTACT_MESSAGE_MIN_LENGTH)
            return copy.message.minimum;
        if (length > CONTACT_MESSAGE_MAX_LENGTH)
            return copy.message.maximum;
        return undefined;
    }, [copy.message, formValues.message, messageTouched, showErrors]);
    const handleSubjectChange = (value: string): void => {
        setFormValues((current) => ({ ...current, subject: value }));
    };
    const handleMessageChange = (value: string): void => {
        setFormValues((current) => ({ ...current, message: value }));
    };
    const handleTopicChange = (topic: ResidentContactTopic): void => {
        setFormValues((current) => ({ ...current, topic }));
    };
    const scrollInputIntoView = useCallback((input: TextInput | null): void => {
        if (!input || !scrollRef.current)
            return;
        scrollRef.current.scrollResponderScrollNativeHandleToKeyboard(input, 24, true);
    }, []);
    const openReview = (): void => {
        setShowErrors(true);
        if (validation.formValid && resident)
            setSheetState('review');
    };
    const sendRequest = async (): Promise<void> => {
        if (!resident || !validation.formValid || isSubmitting)
            return;
        const result = await submit({
            ...scope,
            recipientResidentProfileId: resident.residentProfileId,
            subject: formValues.subject.trim(),
            introductoryMessage: formValues.message.trim(),
            topic: formValues.topic
        });
        if (result.ok)
            setSheetState('sent');
        else
            setSheetState('closed');
    };
    const backToChat = (): void => navigation.popTo('ChatHome');
    const viewStatus = (): void => navigation.replace('ResidentContactRequests', { mode: 'outgoing' });
    const remainingCharactersText = copy.message.charactersRemaining(CONTACT_MESSAGE_MAX_LENGTH - formValues.message.length);
    const bottomNavigationInset = responsiveLayout.isTablet
        ? resolveResidentTabBarObstruction(responsiveLayout.width, insets.bottom, getAppPlatform())
        : 0;
    if (isLoading) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}>
        <ResidentPageHeader title={copy.title} subtitle={copy.subtitle} showBackButton/>
        <LoadingState message={directoryCopy.loading}/>
      </View>);
    }
    if (error || !resident) {
        return (<View style={[styles.root, createViewBackgroundColorStyle2(colors.background)]}>
        <ResidentPageHeader title={copy.title} subtitle={copy.subtitle} showBackButton/>
        <ScreenErrorState title={workflowCopy.noLongerAvailable} message={workflowCopy.submissionError} onRetry={refetch}/>
      </View>);
    }
    if (!scope.canInitiateResidentContact) {
        return (<View style={[styles.root, createViewBackgroundColorStyle3(colors.background)]}>
        <ResidentPageHeader title={copy.title} subtitle={copy.subtitle} showBackButton/>
        <ScreenEmptyState title={workflowCopy.permissionDeniedTitle} description={workflowCopy.permissionDeniedDescription} iconName="lock-closed-outline"/>
      </View>);
    }
    return (<KeyboardAvoidingView testID="contact-request-keyboard-container" style={[styles.root, createKeyboardAvoidingViewBackgroundColorStyle(colors.background)]} {...includeWhenPresent("behavior", keyboardConfig.behavior)} keyboardVerticalOffset={keyboardConfig.keyboardVerticalOffset}>
      <ResidentPageHeader title={copy.title} subtitle={copy.subtitle} showBackButton/>

      <ScrollView ref={scrollRef} testID="contact-request-scroll-view" style={styles.scroll} contentContainerStyle={[
            styles.content,
            createScrollViewPaddingHorizontalPaddingBottomStyle(responsiveLayout.screenPadding, footerHeight + CONTACT_REQUEST_FOOTER_GAP),
        ]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <View testID="contact-request-content-frame" style={styles.contentFrame}>
          <View testID="contact-request-selected-resident" style={[styles.selectedCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
            <View style={[styles.avatar, createViewBackgroundColorStyle4(colors.primarySoft)]}>
              <Ionicons name="person-outline" size={22} color={colors.primary}/>
            </View>
            <View style={styles.flex}>
              <SafeText variant="tiny" style={createSafeTextColorStyle(colors.textMuted)}>
                {copy.selectedResident}
              </SafeText>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(colors.textPrimary)} numberOfLines={1}>
                {resident.displayNameVisible ? resident.displayName : copy.maskedResident}
              </SafeText>
              <SafeText variant="caption" style={createSafeTextColorStyle3(colors.textSecondary)} numberOfLines={1}>
                {resident.flatNumber}
              </SafeText>
            </View>
          </View>

          <FormField testID="contact-request-subject" label={copy.subject.label} required {...includeWhenPresent("errorText", subjectError)}>
            <AppTextInput ref={subjectInputRef} testID="contact-request-subject-input" accessibilityLabel={copy.accessibility.subjectInput} value={formValues.subject} onChangeText={handleSubjectChange} onBlur={() => setSubjectTouched(true)} onFocus={() => scrollInputIntoView(subjectInputRef.current)} placeholder={copy.subject.placeholder} maxLength={CONTACT_SUBJECT_MAX_LENGTH} hasError={Boolean(subjectError)} returnKeyType="next" onSubmitEditing={() => messageInputRef.current?.focus()}/>
          </FormField>

          <FormField testID="contact-request-message" label={copy.message.label} required helperText={copy.message.helper} {...includeWhenPresent("errorText", messageError)} characterCountText={remainingCharactersText}>
            <AppTextArea ref={messageInputRef} testID="contact-request-message-input" accessibilityLabel={copy.accessibility.messageInput} value={formValues.message} onChangeText={handleMessageChange} onBlur={() => setMessageTouched(true)} onFocus={() => scrollInputIntoView(messageInputRef.current)} placeholder={copy.message.placeholder} maxLength={CONTACT_MESSAGE_MAX_LENGTH} hasError={Boolean(messageError)}/>
          </FormField>

          <View testID="contact-request-topic-selector" style={styles.topicSection}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle4(colors.textPrimary)}>
              {copy.topic.label}
            </SafeText>
            <View style={styles.topics}>
              {topicKeys.map((key) => {
            const selected = formValues.topic === key;
            return (<View key={key} style={styles.topicCell}>
                    <AppButton testID={`contact-request-topic-${key}`} title={copy.topic[key]} onPress={() => handleTopicChange(key)} accessibilityLabel={copy.topic[key]} variant={selected ? 'secondary' : 'outline'} compact fullWidth/>
                  </View>);
        })}
            </View>
          </View>

          <View testID="contact-request-privacy-panel" style={styles.privacySection}>
            <PrivacyNoticePanel title={copy.privacy.title} description={copy.privacy.description}/>
          </View>

          {submissionError ? (<SafeText variant="caption" style={[styles.submissionError, createSafeTextColorStyle17(colors.danger)]}>
              {workflowCopy.submissionError}
            </SafeText>) : null}
        </View>
      </ScrollView>

      <StickyActionFooter bottomInset={bottomNavigationInset} onHeightChange={setFooterHeight} testID="contact-request-sticky-footer">
        <AppButton testID="contact-request-submit-button" title={copy.action.send} accessibilityLabel={copy.accessibility.send} onPress={openReview} disabled={!validation.formValid || isSubmitting} loading={isSubmitting} fullWidth/>
      </StickyActionFooter>

      <AppBottomSheet visible={sheetState !== 'closed'} onClose={() => setSheetState('closed')} preventDismiss={isSubmitting} testID="contact-request-review-sheet">
        {sheetState === 'review' ? (<View style={styles.sheetContent}>
            <SafeText variant="title" style={createSafeTextColorStyle5(colors.textPrimary)}>{workflowCopy.reviewTitle}</SafeText>
            <SafeText variant="body" style={createSafeTextColorStyle6(colors.textSecondary)}>{workflowCopy.reviewDescription}</SafeText>
            <View style={[styles.reviewCard, createViewBackgroundColorStyle5(colors.surfaceSoft)]}>
              <SafeText variant="caption" style={createSafeTextColorStyle7(colors.textMuted)}>{workflowCopy.recipientLabel}</SafeText>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle8(colors.textPrimary)}>
                {copy.residentAndFlat(resident.displayNameVisible ? resident.displayName : copy.maskedResident, resident.flatNumber)}
              </SafeText>
              <SafeText variant="caption" style={createSafeTextColorStyle9(colors.textMuted)}>{copy.subject.label}</SafeText>
              <SafeText variant="body" style={createSafeTextColorStyle10(colors.textPrimary)}>{formValues.subject.trim()}</SafeText>
              <SafeText variant="caption" style={createSafeTextColorStyle11(colors.textMuted)}>{workflowCopy.topicReviewLabel}</SafeText>
              <SafeText variant="body" style={createSafeTextColorStyle12(colors.textPrimary)}>{copy.topic[formValues.topic]}</SafeText>
              <SafeText variant="caption" style={createSafeTextColorStyle13(colors.textMuted)}>{workflowCopy.messageReviewLabel}</SafeText>
              <SafeText variant="body" style={createSafeTextColorStyle14(colors.textPrimary)}>{formValues.message.trim()}</SafeText>
            </View>
            <AppButton title={workflowCopy.confirmSend} onPress={() => void sendRequest()} loading={isSubmitting} fullWidth/>
            <AppButton title={workflowCopy.edit} onPress={() => setSheetState('closed')} variant="outline" fullWidth/>
          </View>) : (<View style={styles.sheetContent}>
            <View style={[styles.successIcon, createViewBackgroundColorStyle6(colors.successSoft)]}>
              <Ionicons name="checkmark-circle" size={40} color={colors.success}/>
            </View>
            <SafeText variant="title" align="center" style={createSafeTextColorStyle15(colors.textPrimary)}>{workflowCopy.sentTitle}</SafeText>
            <SafeText variant="body" align="center" style={createSafeTextColorStyle16(colors.textSecondary)}>{workflowCopy.sentDescription}</SafeText>
            <AppButton title={workflowCopy.viewStatus} onPress={viewStatus} fullWidth/>
            <AppButton title={workflowCopy.backToChat} onPress={backToChat} variant="outline" fullWidth/>
          </View>)}
      </AppBottomSheet>
    </KeyboardAvoidingView>);
}
export default NewResidentContactRequestScreen;

