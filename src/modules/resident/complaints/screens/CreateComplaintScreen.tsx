import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useRef, useState } from "react";
import { View, Pressable, type TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentWorkflowStepper } from "../../../../ui/patterns/ResidentWorkflowStepper";
import { FormField } from "../../../../shared/forms/FormField";
import { KeyboardAwareForm } from "../../../../shared/forms/KeyboardAwareForm";
import { AppButton } from "../../../../shared/components/AppButton";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { SafeText } from "../../../../shared/components/SafeText";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { SocietySwitch } from "../../../../ui/controls/SocietySwitch";
import { useCreateComplaint } from "../hooks/useCreateComplaint";
import type { ComplaintCategory } from "../../../../shared/types/complaint.types";
import { useMessages } from "../../../../shared/constants/useMessages";
import { ComplaintPriority } from "../data/complaints.enums";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createSafeTextColorStyle10, createSafeTextColorStyle11, createSafeTextColorStyle12, createSafeTextColorStyle13, createSafeTextColorStyle14, createSafeTextColorStyle15, createSafeTextColorStyle16, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createViewBorderColorStyle, createViewBorderColorBackgroundColorStyle, createViewBorderColorBackgroundColorStyle2, createViewBackgroundColorBorderColorStyle3, createViewBackgroundColorBorderColorStyle4, createViewPaddingBottomBorderTopColorBackgroundColorStyle } from "../styles/screens/CreateComplaintScreen.styles";
export function CreateComplaintScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useMessages().uiLiterals;
    const theme = useResidentTheme();
    const messages = useMessages();
    const { submit, isSubmitting } = useCreateComplaint();
    const STEPS = [
        messages.complaints.formCategory,
        messages.complaints.detailsSection,
        messages.complaints.evidenceSection,
        messages.complaints.reviewSection,
    ];
    const CATEGORIES: {
        key: ComplaintCategory;
        label: string;
        icon: string;
    }[] = [
        { key: 'PLUMBING', label: messages.complaints.categoryPlumbing, icon: 'water-outline' },
        { key: 'ELECTRICAL', label: messages.complaints.categoryElectrical, icon: 'flash-outline' },
        { key: 'LIFT', label: messages.complaints.categoryLift, icon: 'arrow-up-circle-outline' },
        { key: 'SECURITY', label: messages.complaints.categorySecurity, icon: 'shield-outline' },
        { key: 'HOUSEKEEPING', label: messages.complaints.categoryHousekeeping, icon: 'sparkles-outline' },
        { key: 'PARKING', label: messages.complaints.categoryParking, icon: 'car-outline' },
        { key: 'OTHER', label: messages.complaints.categoryOther, icon: 'help-circle-outline' },
    ];
    const PRIORITIES = [
        { key: ComplaintPriority.LOW, label: messages.complaints.priorityLow },
        { key: ComplaintPriority.MEDIUM, label: messages.complaints.priorityMedium },
        { key: ComplaintPriority.HIGH, label: messages.complaints.priorityHigh },
        { key: ComplaintPriority.URGENT, label: messages.complaints.priorityUrgent },
    ];
    const [stepIndex, setStepIndex] = useState(0);
    const [form, setForm] = useState({
        category: 'PLUMBING' as ComplaintCategory,
        title: '',
        description: '',
        priority: ComplaintPriority.MEDIUM,
        location: '',
        isPrivate: false,
        hasEvidence: false
    });
    const titleInputRef = useRef<TextInput>(null);
    const descriptionInputRef = useRef<TextInput>(null);
    const locationInputRef = useRef<TextInput>(null);
    const [fieldErrors, setFieldErrors] = useState({ title: '', description: '' });
    const nextStep = () => {
        if (stepIndex === 1 && (!form.title || !form.description)) {
            const nextErrors = {
                title: form.title.trim() ? '' : messages.validation.required(messages.complaints.titleSummaryLabel),
                description: form.description.trim() ? '' : messages.validation.required(messages.complaints.detailedDescriptionLabel),
            };
            setFieldErrors(nextErrors);
            requestAnimationFrame(() => {
                if (nextErrors.title) titleInputRef.current?.focus();
                else descriptionInputRef.current?.focus();
            });
            return;
        }
        if (stepIndex < STEPS.length - 1) {
            setStepIndex(stepIndex + 1);
        }
    };
    const prevStep = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
        }
    };
    const handleCreate = async () => {
        const res = await submit({
            category: form.category,
            title: form.title,
            description: form.description,
            priority: form.priority,
            location: form.location,
            isPrivate: form.isPrivate
        });
        if (res.ok) {
            AppAlert.alert(messages.complaints.complaintRaisedTitle || String(localizedUiText.m_c88a0b907419), messages.complaints.complaintRaisedMessage || String(localizedUiText.m_82fd7dace01a), [
                { text: messages.common.ok || String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('ComplaintList') },
            ]);
        }
        else {
            AppAlert.alert(messages.resident.errors.generic || String(localizedUiText.m_54a0e8c17ebb), res.error.message || String(localizedUiText.m_dc09d02ba5d1));
        }
    };
    const command = <View style={[styles.formCommand, createViewPaddingBottomBorderTopColorBackgroundColorStyle(12, theme.border, theme.background)]}>
      {stepIndex < STEPS.length - 1 ? (<AppButton title={messages.complaints.nextStepButton || localizedUiText.m_226366c3301a} onPress={nextStep} iconRight={<Ionicons name="arrow-forward-outline" size={18} color={theme.selectedForeground}/>}/>) : (<AppButton title={messages.complaints.submitButton || localizedUiText.m_a7435f2157a8} onPress={handleCreate} loading={isSubmitting} iconLeft={<Ionicons name="checkmark-circle-outline" size={18} color={theme.selectedForeground}/>}/>)}
    </View>;
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader titleKey="complaints.createTitle" title={localizedUiText.m_8171f68f4572} {...includeWhenPresent("onBackPress", stepIndex > 0 ? prevStep : undefined)}/>
      <ResidentWorkflowStepper steps={STEPS} currentStepIndex={stepIndex}/>

      <KeyboardAwareForm command={command} contentStyle={styles.scrollContent} testID="complaint-keyboard-aware-form">
        {stepIndex === 0 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
              {messages.complaints.selectCategoryHeader}
            </SafeText>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((c) => {
                const isSelected = form.category === c.key;
                return (<PressableScale key={c.key} onPress={() => setForm({ ...form, category: c.key })} style={styles.gridItem}>
                    <View style={[
                        styles.catCard,
                        createViewBackgroundColorBorderColorStyle(isSelected ? theme.selectedBackground : theme.surface, isSelected ? theme.selectedBorder : theme.border),
                    ]}>
                      <Ionicons name={c.icon as keyof typeof Ionicons.glyphMap} size={22} color={isSelected ? theme.selectedForeground : theme.accent}/>
                      <SafeText variant="caption" style={createSafeTextColorStyle2(isSelected ? theme.selectedForeground : theme.textPrimary)}>
                        {c.label}
                      </SafeText>
                    </View>
                  </PressableScale>);
            })}
            </View>
          </View>)}

        {stepIndex === 1 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>
              {messages.complaints.describeIssueHeader}
            </SafeText>
            <FormField ref={titleInputRef} label={messages.complaints.titleSummaryLabel} value={form.title} onChangeText={(val) => { setForm({ ...form, title: val }); if (fieldErrors.title) setFieldErrors((current) => ({ ...current, title: '' })); }} placeholder={messages.complaints.titleSummaryPlaceholder} error={fieldErrors.title} required returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => descriptionInputRef.current?.focus()}/>
            <FormField ref={descriptionInputRef} label={messages.complaints.detailedDescriptionLabel} value={form.description} onChangeText={(val) => { setForm({ ...form, description: val }); if (fieldErrors.description) setFieldErrors((current) => ({ ...current, description: '' })); }} placeholder={messages.complaints.detailedDescriptionPlaceholder} error={fieldErrors.description} multiline numberOfLines={4} required/>
            <FormField ref={locationInputRef} label={messages.complaints.locationLabel} value={form.location} onChangeText={(val) => setForm({ ...form, location: val })} placeholder={messages.complaints.locationPlaceholder} returnKeyType="done"/>

            <SafeText variant="caption" style={createSafeTextColorStyle4(theme.textSecondary)}>{messages.complaints.priorityLevelLabel}</SafeText>
            <WrapRow gap={8}>
              {PRIORITIES.map((p) => {
                const isSelected = form.priority === p.key;
                return (<PressableScale key={p.key} onPress={() => setForm({ ...form, priority: p.key })}>
                    <View style={[
                        styles.chip,
                        createViewBackgroundColorBorderColorStyle2(isSelected ? theme.selectedBackground : theme.surface, isSelected ? theme.selectedBorder : theme.border),
                    ]}>
                      <SafeText variant="tiny" style={createSafeTextColorStyle5(isSelected ? theme.selectedForeground : theme.textPrimary)}>
                        {p.label}
                      </SafeText>
                    </View>
                  </PressableScale>);
            })}
            </WrapRow>

            
            <View style={[styles.switchRow, createViewBorderColorStyle(theme.border)]}>
              <View style={styles.switchText}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle6(theme.textPrimary)}>
                  {messages.complaints.filePrivatelyLabel}
                </SafeText>
                <SafeText variant="tiny" style={createSafeTextColorStyle7(theme.textSecondary)}>
                  {messages.complaints.filePrivatelyDescription}
                </SafeText>
              </View>
              <SocietySwitch value={form.isPrivate} onValueChange={(val) => setForm({ ...form, isPrivate: val })}/>
            </View>
            {form.isPrivate && (<PrivacyNoticePanel description={messages.complaints.privateNoticeText}/>)}
          </View>)}

        {stepIndex === 2 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle8(theme.textPrimary)}>
              {messages.complaints.uploadEvidenceHeader}
            </SafeText>
            <SafeText variant="caption" color="muted">
              {messages.complaints.uploadEvidenceDescription}
            </SafeText>

            <View style={styles.evidenceGrid}>
              <PressableScale onPress={() => setForm({ ...form, hasEvidence: true })} style={styles.evidenceBtn}>
                <View style={[styles.evidenceBox, createViewBorderColorBackgroundColorStyle(theme.border, theme.surface)]}>
                  <Ionicons name="camera-outline" size={28} color={theme.accent}/>
                  <SafeText variant="caption" style={createSafeTextColorStyle9(theme.textPrimary)}>{messages.complaints.takePhotoLabel}</SafeText>
                </View>
              </PressableScale>

              <PressableScale onPress={() => setForm({ ...form, hasEvidence: true })} style={styles.evidenceBtn}>
                <View style={[styles.evidenceBox, createViewBorderColorBackgroundColorStyle2(theme.border, theme.surface)]}>
                  <Ionicons name="document-attach-outline" size={28} color={theme.accent}/>
                  <SafeText variant="caption" style={createSafeTextColorStyle10(theme.textPrimary)}>{messages.complaints.pickFileLabel}</SafeText>
                </View>
              </PressableScale>
            </View>

            {form.hasEvidence && (<View style={[styles.evidencePreview, createViewBackgroundColorBorderColorStyle3(theme.accentSoft, theme.accent)]}>
                <Ionicons name="image" size={20} color={theme.accent}/>
                <SafeText variant="tiny" style={createSafeTextColorStyle11(theme.accent)}>
                  {messages.complaints.evidenceAttachedText}
                </SafeText>
                <Pressable onPress={() => setForm({ ...form, hasEvidence: false })}>
                  <Ionicons name="close-circle" size={16} color={theme.danger}/>
                </Pressable>
              </View>)}
          </View>)}

        {stepIndex === 3 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle12(theme.textPrimary)}>
              {messages.complaints.reviewDetailsHeader}
            </SafeText>
            <View style={[styles.reviewCard, createViewBackgroundColorBorderColorStyle4(theme.surface, theme.border)]}>
              <View style={styles.reviewHeader}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle13(theme.textPrimary)}>{form.title}</SafeText>
                <SafeText variant="caption" style={createSafeTextColorStyle14(theme.accent)}>{form.category}</SafeText>
              </View>
              <SafeText variant="caption" color="secondary">{form.description}</SafeText>
              {form.location ? <SafeText variant="tiny" color="muted">{messages.complaints.labelLocation}: {form.location}</SafeText> : null}
              <View style={styles.reviewFooter}>
                <SafeText variant="tiny" style={createSafeTextColorStyle15(theme.textSecondary)}>{messages.complaints.reviewPriorityLabel}: {form.priority}</SafeText>
                <SafeText variant="tiny" style={createSafeTextColorStyle16(theme.textSecondary)}>
                  {messages.complaints.reviewPrivacyLabel}: {form.isPrivate ? messages.complaints.reviewPrivacyPrivate : messages.complaints.reviewPrivacyPublic}
                </SafeText>
              </View>
            </View>
          </View>)}
      </KeyboardAwareForm>
    </View>);
}
export default CreateComplaintScreen;
