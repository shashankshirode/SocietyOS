import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useRef, useState } from "react";
import { View, Pressable, type TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { Screen } from "../../../../design-system/layouts";
import { Button } from "../../../../design-system/components";
import { Input } from "../../../../design-system/components";
import { Card } from "../../../../design-system/components";
import { WorkflowStepper } from "../../../../design-system/components/WorkflowStepper";
import { FormField } from "../../../../shared/forms/FormField";
import { KeyboardAwareForm } from "../../../../shared/forms/KeyboardAwareForm";
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
import { StyleSheet } from "react-native";
import { spacing, colors, getColors } from "../../../../design-system/tokens/premium-index";

export function CreateComplaintScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors, dark } = useAppTheme();
    const themeColors = require('../../../../design-system/tokens/premium-colors').getColors(dark ? 'dark' : 'light');
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
    const command = <View style={styles.formCommand}>
        {stepIndex < STEPS.length - 1 ? (
            <Button
                title={messages.complaints.nextStepButton || localizedUiText.m_226366c3301a}
                onPress={nextStep}
                variant="primary"
                rightIcon={<Ionicons name="arrow-forward-outline" size={18} color={themeColors.text.inverse} />}
            />
        ) : (
            <Button
                title={messages.complaints.submitButton || localizedUiText.m_a7435f2157a8}
                onPress={handleCreate}
                loading={isSubmitting}
                variant="primary"
                leftIcon={<Ionicons name="checkmark-circle-outline" size={18} color={themeColors.text.inverse} />}
            />
        )}
    </View>;
    return (
        <Screen
            title={localizedUiText.m_8171f68f4572}
            subtitle={messages.resident.navigation.complaints.subtitle || 'Report an issue'}
            showBackButton
            onBack={() => {
                if (stepIndex > 0) prevStep();
                else navigation.goBack();
            }}
        >
            <WorkflowStepper steps={STEPS} currentStepIndex={stepIndex} />
            <KeyboardAwareForm command={command} contentStyle={styles.scrollContent} testID="complaint-keyboard-aware-form">
                {stepIndex === 0 && (
                    <View style={styles.formContainer}>
                        <SafeText variant="bodyStrong" style={{ color: themeColors.text.primary }}>
                            {messages.complaints.selectCategoryHeader}
                        </SafeText>
                        <View style={styles.categoryGrid}>
                            {CATEGORIES.map((c) => {
                                const isSelected = form.category === c.key;
                                return (
                                    <PressableScale key={c.key} onPress={() => setForm({ ...form, category: c.key })} style={styles.gridItem}>
                                        <View style={[
                                            styles.catCard,
                                            { backgroundColor: isSelected ? themeColors.brand.primary : themeColors.surface.primary, borderColor: isSelected ? themeColors.brand.primary : themeColors.border.default, borderWidth: isSelected ? 2 : 1 },
                                        ]}>
                                            <Ionicons name={c.icon as keyof typeof Ionicons.glyphMap} size={22} color={isSelected ? themeColors.text.inverse : themeColors.brand.primary} />
                                            <SafeText variant="tiny" style={{ color: isSelected ? themeColors.text.inverse : themeColors.text.primary, fontWeight: '600' }}>
                                                {c.label}
                                            </SafeText>
                                        </View>
                                    </PressableScale>
                                );
                            })}
                        </View>
                    </View>
                )}
                {stepIndex === 1 && (
                    <View style={styles.formContainer}>
                        <SafeText variant="bodyStrong" style={{ color: themeColors.text.primary }}>
                            {messages.complaints.describeIssueHeader}
                        </SafeText>
                        <Input
                            ref={titleInputRef}
                            label={messages.complaints.titleSummaryLabel}
                            value={form.title}
                            onChangeText={(val) => { setForm({ ...form, title: val }); if (fieldErrors.title) setFieldErrors((current) => ({ ...current, title: '' })); }}
                            placeholder={messages.complaints.titleSummaryPlaceholder}
                            error={fieldErrors.title}
                            required
                            returnKeyType="next"
                            blurOnSubmit={false}
                            onSubmitEditing={() => descriptionInputRef.current?.focus()}
                        />
                        <Input
                            ref={descriptionInputRef}
                            label={messages.complaints.detailedDescriptionLabel}
                            value={form.description}
                            onChangeText={(val) => { setForm({ ...form, description: val }); if (fieldErrors.description) setFieldErrors((current) => ({ ...current, description: '' })); }}
                            placeholder={messages.complaints.detailedDescriptionPlaceholder}
                            error={fieldErrors.description}
                            multiline
                            numberOfLines={4}
                            required
                        />
                        <Input
                            ref={locationInputRef}
                            label={messages.complaints.locationLabel}
                            value={form.location}
                            onChangeText={(val) => setForm({ ...form, location: val })}
                            placeholder={messages.complaints.locationPlaceholder}
                            returnKeyType="done"
                        />

                        <SafeText variant="caption" style={{ color: themeColors.text.secondary }}>{messages.complaints.priorityLevelLabel}</SafeText>
                        <WrapRow gap={8}>
                            {PRIORITIES.map((p) => {
                                const isSelected = form.priority === p.key;
                                return (
                                    <PressableScale key={p.key} onPress={() => setForm({ ...form, priority: p.key })}>
                                        <View style={[
                                            styles.chip,
                                            { backgroundColor: isSelected ? themeColors.brand.primary : themeColors.surface.primary, borderColor: isSelected ? themeColors.brand.primary : themeColors.border.default, borderWidth: isSelected ? 2 : 1 },
                                        ]}>
                                            <SafeText variant="tiny" style={{ color: isSelected ? themeColors.text.inverse : themeColors.text.primary, fontWeight: '600' }}>
                                                {p.label}
                                            </SafeText>
                                        </View>
                                    </PressableScale>
                                );
                            })}
                        </WrapRow>

                        <View style={styles.switchRow}>
                            <View style={styles.switchText}>
                                <SafeText variant="bodyStrong" style={{ color: themeColors.text.primary }}>
                                    {messages.complaints.filePrivatelyLabel}
                                </SafeText>
                                <SafeText variant="tiny" style={{ color: themeColors.text.secondary }}>
                                    {messages.complaints.filePrivatelyDescription}
                                </SafeText>
                            </View>
                            <SocietySwitch value={form.isPrivate} onValueChange={(val) => setForm({ ...form, isPrivate: val })} />
                        </View>
                        {form.isPrivate && (<PrivacyNoticePanel description={messages.complaints.privateNoticeText} />)}
                    </View>
                )}
                {stepIndex === 2 && (
                    <View style={styles.formContainer}>
                        <SafeText variant="bodyStrong" style={{ color: themeColors.text.primary }}>
                            {messages.complaints.uploadEvidenceHeader}
                        </SafeText>
                        <SafeText variant="caption" color="muted">
                            {messages.complaints.uploadEvidenceDescription}
                        </SafeText>

                        <View style={styles.evidenceGrid}>
                            <PressableScale onPress={() => setForm({ ...form, hasEvidence: true })} style={styles.evidenceBtn}>
                                <View style={[styles.evidenceBox, { backgroundColor: themeColors.surface.primary, borderColor: themeColors.border.default, borderWidth: 1 }]}>
                                    <Ionicons name="camera-outline" size={28} color={themeColors.brand.primary} />
                                    <SafeText variant="tiny" style={{ color: themeColors.text.primary, fontWeight: '600' }}>
                                        {messages.complaints.takePhotoLabel}
                                    </SafeText>
                                </View>
                            </PressableScale>

                            <PressableScale onPress={() => setForm({ ...form, hasEvidence: true })} style={styles.evidenceBtn}>
                                <View style={[styles.evidenceBox, { backgroundColor: themeColors.surface.primary, borderColor: themeColors.border.default, borderWidth: 1 }]}>
                                    <Ionicons name="document-attach-outline" size={28} color={themeColors.brand.primary} />
                                    <SafeText variant="tiny" style={{ color: themeColors.text.primary, fontWeight: '600' }}>
                                        {messages.complaints.pickFileLabel}
                                    </SafeText>
                                </View>
                            </PressableScale>
                        </View>

                        {form.hasEvidence && (
                            <View style={{ backgroundColor: '#E8F5E9', borderColor: '#4CAF50', borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Ionicons name="image" size={20} color="#4CAF50" />
                                <SafeText variant="tiny" style={{ color: '#4CAF50', fontWeight: '600' }}>
                                    {messages.complaints.evidenceAttachedText}
                                </SafeText>
                                <Pressable onPress={() => setForm({ ...form, hasEvidence: false })}>
                                    <Ionicons name="close-circle" size={16} color="#EF4444" />
                                </Pressable>
                            </View>
                        )}
                    </View>
                )}
                {stepIndex === 3 && (
                    <View style={styles.formContainer}>
                        <SafeText variant="bodyStrong" style={{ color: themeColors.text.primary }}>
                            {messages.complaints.reviewDetailsHeader}
                        </SafeText>
                        <Card variant="outlined" padding="md">
                            <View style={styles.reviewHeader}>
                                <SafeText variant="bodyStrong" style={{ color: themeColors.text.primary, fontWeight: '700' }}>
                                    {form.title}
                                </SafeText>
                                <SafeText variant="caption" style={{ color: themeColors.brand.primary }}>
                                    {form.category}
                                </SafeText>
                            </View>
                            <SafeText variant="caption" color="secondary">{form.description}</SafeText>
                            {form.location ? <SafeText variant="tiny" color="muted">{messages.complaints.labelLocation}: {form.location}</SafeText> : null}
                            <View style={styles.reviewFooter}>
                                <SafeText variant="tiny" style={{ color: themeColors.text.secondary }}>{messages.complaints.reviewPriorityLabel}: {form.priority}</SafeText>
                                <SafeText variant="tiny" style={{ color: themeColors.text.secondary }}>
                                    {messages.complaints.reviewPrivacyLabel}: {form.isPrivate ? messages.complaints.reviewPrivacyPrivate : messages.complaints.reviewPrivacyPublic}
                                </SafeText>
                            </View>
                        </Card>
                    </View>
                )}
            </KeyboardAwareForm>
        </Screen>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        gap: 24,
        paddingHorizontal: 16,
    },
    formCommand: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderColor: '#E2E8F0',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 12,
    },
    gridItem: {
        flex: 1,
        minWidth: 140,
    },
    catCard: {
        aspectRatio: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    switchText: {
        gap: 2,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    evidenceGrid: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    evidenceBtn: {
        flex: 1,
    },
    evidenceBox: {
        aspectRatio: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    evidencePreview: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reviewCard: {
        marginTop: 8,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    reviewFooter: {
        flexDirection: 'column',
        gap: 4,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100,
        gap: 24,
    },
});

export default CreateComplaintScreen;