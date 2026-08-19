import { useState } from "react";
import { ScrollView, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../../../app/navigation/navigation.types";
import { useFamilyMemberForm } from "../hooks/useFamilyMemberForm";
import { useFamilyMembers } from "../hooks/useFamilyMembers";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../components/householdComponentUtils";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { FamilyAccessPermissionPanel } from "../components/FamilyAccessPermissionPanel";
import { StatusModal } from "../../../../ui/modal/StatusModal";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { FamilyBasicInfoSection } from "../components/FamilyBasicInfoSection";
import { FamilyDateOfBirthField } from "../components/FamilyDateOfBirthField";
import { FamilyHealthEmergencySection } from "../components/FamilyHealthEmergencySection";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBackgroundColorStyle4, createViewBackgroundColorBorderColorStyle, createViewBorderTopColorBackgroundColorStyle } from "../styles/screens/AddFamilyMemberScreen.styles";
type Props = NativeStackScreenProps<HomeStackParamList, 'AddFamilyMember'>;
export function AddFamilyMemberScreen({ navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const familyMembers = useFamilyMembers();
    const form = useFamilyMemberForm(familyMembers.data || []);
    const messages = useMessages();
    const [step, setStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdMemberId, setCreatedMemberId] = useState<string | null>(null);
    const getFieldErrorMsg = (field: string) => {
        const error = form.validation.fieldErrors.find((item) => item.field === field);
        return error ? t(messages, error.messageKey) : undefined;
    };
    const handleNextStep = () => {
        const stepErrors = form.validate();
        const hasStep1Errors = stepErrors.fieldErrors.some((err) => ['fullName', 'dateOfBirth', 'phoneNumber', 'emailAddress', 'relationToOwner'].includes(err.field));
        if (step === 1 && hasStep1Errors) {
            return;
        }
        setStep(step + 1);
    };
    const handleSave = async () => {
        const result = form.validate();
        if (!result.isValid) {
            return;
        }
        const member = await familyMembers.addFamilyMember(form.input);
        setCreatedMemberId(member.id);
        setShowSuccessModal(true);
    };
    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        if (createdMemberId) {
            navigation.replace('FamilyMemberDetail', { familyMemberId: createdMemberId });
        }
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}>
      <ResidentPageHeader title={t(messages, 'resident.family.addMember')} showBackButton onBackPress={() => navigation.goBack()}/>

      
      <View style={styles.stepIndicator}>
        <View style={styles.barContainer}>
          <View style={[styles.bar, createViewBackgroundColorStyle2(step >= 1 ? colors.primary : colors.border)]}/>
          <View style={[styles.bar, createViewBackgroundColorStyle3(step >= 2 ? colors.primary : colors.border)]}/>
          <View style={[styles.bar, createViewBackgroundColorStyle4(step >= 3 ? colors.primary : colors.border)]}/>
        </View>
        <SafeText variant="caption" color="secondary" style={styles.stepLabel}>
          {step === 1 && `Step 1 of 3: ${t(messages, 'resident.family.steps.step1')}`}
          {step === 2 && `Step 2 of 3: ${t(messages, 'resident.family.steps.step2')}`}
          {step === 3 && `Step 3 of 3: ${t(messages, 'resident.family.steps.step3')}`}
        </SafeText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step === 1 && (<View style={styles.formSection}>
            <FamilyDateOfBirthField value={form.input.dateOfBirth} onChange={(dob, isMinor, isSenior) => {
                form.updateInput({
                    dateOfBirth: dob,
                    isMinor,
                    isSeniorCitizen: isSenior,
                    ...(isMinor ? { documentAccessPermission: 'NONE', isEmergencyContact: false } : {})
                });
            }} {...includeWhenPresent("error", getFieldErrorMsg('dateOfBirth'))}/>

            <FamilyBasicInfoSection input={form.input} updateInput={(changes) => form.updateInput(changes)} getFieldErrorMsg={getFieldErrorMsg}/>
          </View>)}

        {step === 2 && (<View style={styles.formSection}>
            <FamilyHealthEmergencySection input={{
                ...includeWhenPresent("bloodGroup", form.input.bloodGroup),
                ...includeWhenPresent("medicalNotes", form.input.medicalNotes),
                isEmergencyContact: form.input.isEmergencyContact,
                isMinor: form.input.isMinor,
                isSeniorCitizen: form.input.isSeniorCitizen
            }} updateInput={(changes) => form.updateInput(changes)} getFieldErrorMsg={getFieldErrorMsg}/>
          </View>)}

        {step === 3 && (<View style={styles.formSection}>
            <FamilyAccessPermissionPanel value={{
                visitorApprovalPermission: form.input.visitorApprovalPermission,
                noticeViewPermission: form.input.noticeViewPermission,
                emergencyAccessPermission: form.input.emergencyAccessPermission,
                facilityBookingPermission: form.input.facilityBookingPermission,
                documentAccessPermission: form.input.documentAccessPermission,
                profileVisibility: form.input.profileVisibility
            }} disabledDocumentAccess={form.input.isMinor} onChange={(permissions) => form.updateInput({ ...permissions })}/>

            <View style={[styles.reviewCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
              <SafeText variant="bodyStrong" color="primary" style={styles.safeTextMarginBottom}>
                {t(messages, 'resident.family.reviewFamilyDetails') || localizedUiText.m_b6019495288a}
              </SafeText>
              <View style={styles.reviewRow}>
                <SafeText variant="caption" color="secondary">{t(messages, 'resident.family.fields.fullName') || localizedUiText.m_dcd1d5223f73}:</SafeText>
                <SafeText variant="caption" style={createSafeTextColorStyle(colors.textPrimary)}>
                  {form.input.fullName}
                </SafeText>
              </View>
              <View style={styles.reviewRow}>
                <SafeText variant="caption" color="secondary">{t(messages, 'resident.family.fields.dateOfBirth') || localizedUiText.m_fdc739f52650}:</SafeText>
                <SafeText variant="caption" style={createSafeTextColorStyle2(colors.textPrimary)}>
                  {messages.resident.family.reviewDateAndCategory(formatResidentDate(form.input.dateOfBirth), form.input.isMinor
                ? messages.resident.family.datePicker.minor
                : form.input.isSeniorCitizen
                    ? messages.resident.family.datePicker.seniorCitizen
                    : messages.resident.family.datePicker.adult)}
                </SafeText>
              </View>
              <View style={styles.reviewRow}>
                <SafeText variant="caption" color="secondary">{t(messages, 'resident.family.fields.gender') || localizedUiText.m_a04630ef8bc3}:</SafeText>
                <SafeText variant="caption" style={createSafeTextColorStyle3(colors.textPrimary)}>
                  {t(messages, `resident.family.gender.${form.input.gender}`) || form.input.gender}
                </SafeText>
              </View>
              <View style={styles.reviewRow}>
                <SafeText variant="caption" color="secondary">{t(messages, 'resident.family.fields.relationToOwner') || localizedUiText.m_1367485dc3c3}:</SafeText>
                <SafeText variant="caption" style={createSafeTextColorStyle4(colors.textPrimary)}>
                  {t(messages, `resident.family.relations.${form.input.relationToOwner}`) || form.input.relationToOwner}
                </SafeText>
              </View>
              <View style={styles.reviewRow}>
                <SafeText variant="caption" color="secondary">{t(messages, 'resident.family.fields.phoneNumber') || localizedUiText.m_63dceb8800b2}:</SafeText>
                <SafeText variant="caption" style={createSafeTextColorStyle5(colors.textPrimary)}>
                  {form.input.phoneNumber || localizedUiText.m_dc937b598926}
                </SafeText>
              </View>
              <View style={styles.reviewRow}>
                <SafeText variant="caption" color="secondary">{t(messages, 'resident.family.fields.isEmergencyContact') || localizedUiText.m_e6d3c0aa2771}:</SafeText>
                <SafeText variant="caption" style={createSafeTextColorStyle6(form.input.isEmergencyContact ? colors.success : colors.textMuted)}>
                  {form.input.isEmergencyContact ? localizedUiText.m_85a39ab345d6 : localizedUiText.m_1ea442a134b2}
                </SafeText>
              </View>
              <View style={styles.reviewRow}>
                <SafeText variant="caption" color="secondary">{localizedUiText.m_4e300fd7b3bc}</SafeText>
                <SafeText variant="caption" style={createSafeTextColorStyle7(colors.primary)}>
                  {form.input.isMinor ? localizedUiText.m_aa899f673dcd : form.input.isSeniorCitizen ? localizedUiText.m_69a08bd8e829 : localizedUiText.m_1a761ac29d39}
                </SafeText>
              </View>
              <View style={styles.reviewRow}>
                <SafeText variant="caption" color="secondary">{localizedUiText.m_d30b73ec30f1}</SafeText>
                <SafeText variant="caption" style={createSafeTextColorStyle8(colors.textPrimary)}>
                  {form.input.documentAccessPermission === 'LIMITED' ? localizedUiText.m_e5125d9f63d2 : localizedUiText.m_dc937b598926}
                </SafeText>
              </View>
            </View>
          </View>)}
      </ScrollView>

      <View style={[styles.bottomActions, createViewBorderTopColorBackgroundColorStyle(colors.border, colors.surface)]}>
        {step > 1 && (<View style={styles.viewFlex}>
            <AppButton title={t(messages, 'buttons.back') || localizedUiText.m_76900f1bfd16} variant="secondary" onPress={() => setStep(step - 1)}/>
          </View>)}
        <View style={styles.viewFlex2}>
          {step < 3 ? (<AppButton title={t(messages, 'buttons.next') || localizedUiText.m_1ff57a29d7c9} variant="primary" onPress={handleNextStep}/>) : (<AppButton title={t(messages, 'buttons.save') || localizedUiText.m_1509f561f241} variant="primary" onPress={handleSave} disabled={familyMembers.isMutating || !form.input.fullName}/>)}
        </View>
      </View>

      <StatusModal visible={showSuccessModal} type="success" title={t(messages, 'resident.family.successTitle')} message={t(messages, 'resident.family.successDescription')} actionLabel={localizedUiText.m_565339bc4d33} onClose={handleSuccessClose}/>
    </View>);
}
export default AddFamilyMemberScreen;

