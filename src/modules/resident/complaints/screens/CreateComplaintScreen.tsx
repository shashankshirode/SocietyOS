import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState } from "react";
import { View, ScrollView, Switch, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentWorkflowStepper } from "../../../../ui/patterns/ResidentWorkflowStepper";
import { FormField } from "../../../../shared/forms/FormField";
import { AppButton } from "../../../../shared/components/AppButton";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { SafeText } from "../../../../shared/components/SafeText";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { useCreateComplaint } from "../hooks/useCreateComplaint";
import type { ComplaintCategory } from "../../../../shared/types/complaint.types";
import { useMessages } from "../../../../shared/constants/useMessages";
import { ComplaintPriority } from "../data/complaints.enums";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createSafeTextColorStyle10, createSafeTextColorStyle11, createSafeTextColorStyle12, createSafeTextColorStyle13, createSafeTextColorStyle14, createSafeTextColorStyle15, createSafeTextColorStyle16, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createViewBorderColorStyle, createViewBorderColorBackgroundColorStyle, createViewBorderColorBackgroundColorStyle2, createViewBackgroundColorBorderColorStyle3, createViewBackgroundColorBorderColorStyle4, createViewPaddingBottomBorderTopColorBackgroundColorStyle } from "../styles/screens/CreateComplaintScreen.styles";
export function CreateComplaintScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
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
    const nextStep = () => {
        if (stepIndex === 1 && (!form.title || !form.description)) {
            AppAlert.alert(messages.resident.errors.generic || String(localizedUiText.m_54a0e8c17ebb), messages.complaints.reasonRequiredMessage || String(localizedUiText.m_e5597d9a8abe));
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
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader titleKey="complaints.createTitle" title={localizedUiText.m_8171f68f4572} {...includeWhenPresent("onBackPress", stepIndex > 0 ? prevStep : undefined)}/>
      <ResidentWorkflowStepper steps={STEPS} currentStepIndex={stepIndex}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                        createViewBackgroundColorBorderColorStyle(isSelected ? theme.accent : theme.surface, isSelected ? 'transparent' : theme.border),
                    ]}>
                      <Ionicons name={c.icon as keyof typeof Ionicons.glyphMap} size={22} color={isSelected ? '#FFFFFF' : theme.accent}/>
                      <SafeText variant="caption" style={createSafeTextColorStyle2(isSelected ? '#FFFFFF' : theme.textPrimary)}>
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
            <FormField label={messages.complaints.titleSummaryLabel} value={form.title} onChangeText={(val) => setForm({ ...form, title: val })} placeholder={messages.complaints.titleSummaryPlaceholder}/>
            <FormField label={messages.complaints.detailedDescriptionLabel} value={form.description} onChangeText={(val) => setForm({ ...form, description: val })} placeholder={messages.complaints.detailedDescriptionPlaceholder} multiline numberOfLines={4}/>
            <FormField label={messages.complaints.locationLabel} value={form.location} onChangeText={(val) => setForm({ ...form, location: val })} placeholder={messages.complaints.locationPlaceholder}/>

            <SafeText variant="caption" style={createSafeTextColorStyle4(theme.textSecondary)}>{messages.complaints.priorityLevelLabel}</SafeText>
            <WrapRow gap={8}>
              {PRIORITIES.map((p) => {
                const isSelected = form.priority === p.key;
                return (<PressableScale key={p.key} onPress={() => setForm({ ...form, priority: p.key })}>
                    <View style={[
                        styles.chip,
                        createViewBackgroundColorBorderColorStyle2(isSelected ? theme.accent : theme.surface, isSelected ? 'transparent' : theme.border),
                    ]}>
                      <SafeText variant="tiny" style={createSafeTextColorStyle5(isSelected ? '#FFFFFF' : theme.textPrimary)}>
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
              <Switch value={form.isPrivate} onValueChange={(val) => setForm({ ...form, isPrivate: val })} trackColor={{ false: theme.border, true: theme.accent }}/>
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
      </ScrollView>

      
      <View style={[styles.bottomBar, createViewPaddingBottomBorderTopColorBackgroundColorStyle(insets.bottom + 12, theme.border, theme.background)]}>
        {stepIndex < STEPS.length - 1 ? (<AppButton title={messages.complaints.nextStepButton || localizedUiText.m_226366c3301a} onPress={nextStep} iconRight={<Ionicons name="arrow-forward-outline" size={18} color="#FFFFFF"/>}/>) : (<AppButton title={messages.complaints.submitButton || localizedUiText.m_a7435f2157a8} onPress={handleCreate} loading={isSubmitting} iconLeft={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF"/>}/>)}
      </View>
    </View>);
}
export default CreateComplaintScreen;

