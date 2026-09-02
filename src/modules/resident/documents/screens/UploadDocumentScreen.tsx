import { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentWorkflowStepper } from "../../../../ui/patterns/ResidentWorkflowStepper";
import { FormField } from "../../../../shared/forms/FormField";
import { AppButton } from "../../../../shared/components/AppButton";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { SafeText } from "../../../../shared/components/SafeText";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { StatusModal } from "../../../../ui/modal/StatusModal";
import { SocietySwitch } from "../../../../ui/controls/SocietySwitch";
import { useMockStore } from "../../../../core/mockStore/useMockStore";
import type { DocumentCategory } from "../../../../shared/types/document.types";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createSafeTextColorStyle10, createSafeTextColorStyle11, createSafeTextColorStyle12, createSafeTextColorStyle13, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBorderColorStyle, createViewBackgroundColorStyle2, createViewBorderColorBackgroundColorStyle, createViewBorderColorBackgroundColorStyle2, createViewBackgroundColorBorderColorStyle2, createViewBorderColorStyle2, createViewBackgroundColorBorderColorStyle3, createViewPaddingBottomBorderTopColorStyle } from "../styles/screens/UploadDocumentScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
const STEPS = ['Type', 'File', 'Details', 'Review'];
const CATEGORIES: {
    key: DocumentCategory;
    label: string;
}[] = [
    { key: 'OWNER_KYC', get label() {
            return getActiveUiLiteral("m_d437471b8701");
        } },
    { key: 'TENANT_KYC', get label() {
            return getActiveUiLiteral("m_76a9c53ded6e");
        } },
    { key: 'RENT_AGREEMENT', get label() {
            return getActiveUiLiteral("m_0f8b78a01471");
        } },
    { key: 'POLICE_VERIFICATION', get label() {
            return getActiveUiLiteral("m_3f8638633511");
        } },
    { key: 'VEHICLE_DOCUMENT', get label() {
            return getActiveUiLiteral("m_1454fce203cc");
        } },
    { key: 'OTHER', get label() {
            return getActiveUiLiteral("m_8ccf3120dbee");
        } },
];
export function UploadDocumentScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const { addDocument } = useMockStore();
    const [stepIndex, setStepIndex] = useState(0);
    const [fileRequiredVisible, setFileRequiredVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [form, setForm] = useState({
        category: 'OWNER_KYC' as DocumentCategory,
        title: String(localizedUiText.m_5e1f1b97008a),
        flatNumber: 'A-1204',
        expiryDate: '',
        isSensitive: true,
        fileAttached: false,
        fileName: 'aadhar_card_masked.pdf',
        fileSize: '1.4 MB'
    });
    const nextStep = () => {
        if (stepIndex === 1 && !form.fileAttached) {
            setFileRequiredVisible(true);
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
    const handleSubmit = () => {
        addDocument({
            id: `doc-${Date.now()}`,
            title: form.title,
            category: form.category,
            flatNumber: form.flatNumber,
            status: 'PENDING_VERIFICATION',
            ...includeWhenPresent("uploadedDate", new Date().toISOString().split('T')[0]),
            uploadedBy: 'Shashank',
            fileType: 'pdf',
            fileSize: form.fileSize,
            sensitivity: form.isSensitive ? 'OWNER_ONLY' : 'PUBLIC',
            ...includeWhenPresent("expiryDate", form.expiryDate || undefined)
        });
        setSuccessVisible(true);
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_c4e3a37dbf22} {...includeWhenPresent("onBackPress", stepIndex > 0 ? prevStep : undefined)}/>
      <ResidentWorkflowStepper steps={STEPS} currentStepIndex={stepIndex}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {stepIndex === 0 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_653638e3d658}</SafeText>
            <View style={styles.list}>
              {CATEGORIES.map((c) => {
                const isSelected = form.category === c.key;
                return (<PressableScale key={c.key} onPress={() => setForm({ ...form, category: c.key, title: c.label })}>
                    <View style={[
                        styles.catRow,
                        createViewBackgroundColorBorderColorStyle(isSelected ? theme.accentSoft : theme.surface, isSelected ? theme.accent : theme.border),
                    ]}>
                      <Ionicons name="document-text-outline" size={20} color={theme.accent}/>
                      <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textPrimary)}>
                        {c.label}
                      </SafeText>
                      <View style={[styles.radio, createViewBorderColorStyle(isSelected ? theme.accent : theme.border)]}>
                        {isSelected && <View style={[styles.radioInner, createViewBackgroundColorStyle2(theme.accent)]}/>}
                      </View>
                    </View>
                  </PressableScale>);
            })}
            </View>
          </View>)}

        {stepIndex === 1 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>{localizedUiText.m_61749a164553}</SafeText>
            <SafeText variant="caption" color="muted">{localizedUiText.m_c5ff9c0fc251}</SafeText>

            <View style={styles.evidenceGrid}>
              <PressableScale onPress={() => setForm({ ...form, fileAttached: true })} style={styles.evidenceBtn}>
                <View style={[styles.evidenceBox, createViewBorderColorBackgroundColorStyle(theme.border, theme.surface)]}>
                  <Ionicons name="camera-outline" size={28} color={theme.accent}/>
                  <SafeText variant="caption" style={createSafeTextColorStyle4(theme.textPrimary)}>{localizedUiText.m_9a5d0246847c}</SafeText>
                </View>
              </PressableScale>

              <PressableScale onPress={() => setForm({ ...form, fileAttached: true })} style={styles.evidenceBtn}>
                <View style={[styles.evidenceBox, createViewBorderColorBackgroundColorStyle2(theme.border, theme.surface)]}>
                  <Ionicons name="cloud-upload-outline" size={28} color={theme.accent}/>
                  <SafeText variant="caption" style={createSafeTextColorStyle5(theme.textPrimary)}>{localizedUiText.m_1181df850327}</SafeText>
                </View>
              </PressableScale>
            </View>

            {form.fileAttached && (<View style={[styles.evidencePreview, createViewBackgroundColorBorderColorStyle2(theme.accentSoft, theme.accent)]}>
                <Ionicons name="document-attach-outline" size={20} color={theme.accent}/>
                <SafeText variant="tiny" style={createSafeTextColorStyle6(theme.accent)}>
                  {form.fileName} ({form.fileSize})
                </SafeText>
                <Pressable onPress={() => setForm({ ...form, fileAttached: false })}>
                  <Ionicons name="close-circle" size={16} color={theme.danger}/>
                </Pressable>
              </View>)}
          </View>)}

        {stepIndex === 2 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle7(theme.textPrimary)}>{localizedUiText.m_cd90907ec1c9}</SafeText>
            <FormField label={localizedUiText.m_5908cf133300} value={form.title} onChangeText={(val) => setForm({ ...form, title: val })} placeholder={localizedUiText.m_b8f57bc9ee7c}/>
            <FormField label={localizedUiText.m_0220df632cd6} value={form.expiryDate} onChangeText={(val) => setForm({ ...form, expiryDate: val })} placeholder={localizedUiText.m_dbffec00917a}/>

            <View style={[styles.switchRow, createViewBorderColorStyle2(theme.border)]}>
              <View style={styles.switchText}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle8(theme.textPrimary)}>{localizedUiText.m_9f6f225432bc}</SafeText>
                <SafeText variant="tiny" style={createSafeTextColorStyle9(theme.textSecondary)}>{localizedUiText.m_74538bde17d3}</SafeText>
              </View>
              <SocietySwitch value={form.isSensitive} onValueChange={(val) => setForm({ ...form, isSensitive: val })}/>
            </View>
          </View>)}

        {stepIndex === 3 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle10(theme.textPrimary)}>{localizedUiText.m_bd4e14525f72}</SafeText>
            <View style={[styles.reviewCard, createViewBackgroundColorBorderColorStyle3(theme.surface, theme.border)]}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle11(theme.textPrimary)}>{form.title}</SafeText>
              <SafeText variant="caption" color="secondary">{localizedUiText.m_5ecf5a529a75 + " "}{form.category}</SafeText>
              {form.expiryDate ? <SafeText variant="tiny" color="muted">{localizedUiText.m_6486dd6ab9b6 + " "}{form.expiryDate}</SafeText> : null}
              <View style={styles.reviewFooter}>
                <SafeText variant="tiny" style={createSafeTextColorStyle12(theme.textSecondary)}>{localizedUiText.m_a4d377ed7684}{form.isSensitive ? localizedUiText.m_a00571bcb257 : localizedUiText.m_591935b15b1c}
                </SafeText>
                <SafeText variant="tiny" style={createSafeTextColorStyle13(theme.textSecondary)}>{localizedUiText.m_c987f668d963}{form.fileSize}
                </SafeText>
              </View>
            </View>
            <PrivacyNoticePanel description={localizedUiText.m_6734013c7cae}/>
          </View>)}
      </ScrollView>

      <View style={[styles.bottomBar, createViewPaddingBottomBorderTopColorStyle(insets.bottom + 12, theme.border)]}>
        {stepIndex < STEPS.length - 1 ? (<AppButton title={localizedUiText.m_226366c3301a} onPress={nextStep} iconRight={<Ionicons name="arrow-forward-outline" size={18} color="#FFFFFF"/>}/>) : (<AppButton title={localizedUiText.m_d138fa8b9b41} onPress={handleSubmit} iconLeft={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF"/>}/>)}
      </View>

      <StatusModal visible={fileRequiredVisible} type="warning" title={localizedUiText.m_b895ae2a3223} message={localizedUiText.m_599d6c863cfb} actionLabel={localizedUiText.m_565339bc4d33} onClose={() => setFileRequiredVisible(false)}/>

      <StatusModal visible={successVisible} type="success" title={localizedUiText.m_c88a0b907419} message={localizedUiText.m_37d05dfd91e1} actionLabel={localizedUiText.m_565339bc4d33} onClose={() => {
            setSuccessVisible(false);
            navigation.goBack();
        }}/>
    </View>);
}
export default UploadDocumentScreen;
