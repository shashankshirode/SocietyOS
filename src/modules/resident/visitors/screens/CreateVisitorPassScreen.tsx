import { useMemo, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCreateVisitorPass } from "../data/useCreateVisitorPass";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentWorkflowStepper } from "../../../../ui/patterns/ResidentWorkflowStepper";
import { VisitorPassPanel } from "../../../../ui/patterns/VisitorPassPanel";
import { FormField } from "../../../../shared/forms/FormField";
import { AppButton } from "../../../../shared/components/AppButton";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { SafeText } from "../../../../shared/components/SafeText";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import type { CreateVisitorPassScreenProps } from "../../../../app/navigation/navigation.types";
import { useMessages } from "../../../../shared/constants/useMessages";
import { VisitorType } from "../data/visitors.enums";
import { getPlatformKeyboardConfig } from "../../../../shared/platform";
import { StatusModal } from "../../../../ui/modal/StatusModal";
import { VisitorExpectedExitSelector } from "../components/VisitorExpectedExitSelector";
import { VisitorExitPolicyNotice } from "../components/VisitorExitPolicyNotice";
import { VisitorPassReviewCard } from "../components/VisitorPassReviewCard";
import { getVisitorExitPolicy, resolveExpectedExitAtIso, resolveVisitorCategory, validateExpectedExitSelection } from "../utils/visitorExitPolicyResolver";
import { t } from "../../household/components/householdComponentUtils";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorFontWeightStyle, createSafeTextColorStyle9, createSafeTextColorStyle10, createSafeTextColorStyle11, createSafeTextColorStyle12, createSafeTextColorStyle13, createSafeTextColorStyle14, createKeyboardAvoidingViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createViewBorderColorBackgroundColorStyle, createSafeTextColorStyle15, createViewBackgroundColorStyle, createViewBorderColorStyle, createViewBorderColorBackgroundColorStyle2, createViewBackgroundColorBorderColorStyle3, createViewBackgroundColorBorderColorStyle4, createViewPaddingBottomBorderTopColorBackgroundColorStyle } from "../styles/screens/CreateVisitorPassScreen.styles";
export function CreateVisitorPassScreen({ navigation }: CreateVisitorPassScreenProps) {
    const localizedUiText = useMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const messages = useMessages();
    const keyboardConfig = getPlatformKeyboardConfig(insets.top);
    const { submit, isSubmitting } = useCreateVisitorPass();
    const STEPS = [
        messages.complaints.detailsSection,
        messages.visitors.labelAccessType,
        messages.visitors.labelPurpose,
        messages.common.confirm || 'Preview',
    ];
    const VISITOR_TYPES: {
        key: VisitorType;
        label: string;
        icon: string;
    }[] = [
        { key: VisitorType.GUEST, label: messages.visitors.typeGuest, icon: 'people-outline' },
        { key: VisitorType.DELIVERY, label: messages.visitors.typeDelivery, icon: 'bicycle-outline' },
        { key: VisitorType.CAB, label: messages.visitors.typeCab, icon: 'car-sport-outline' },
        { key: VisitorType.VENDOR, label: messages.visitors.typeVendor, icon: 'storefront-outline' },
    ];
    const ACCESS_TYPES = ['oneDay', 'limitedHours', 'recurring'];
    const PURPOSE_CHIPS = [
        messages.visitors.typeGuest,
        messages.visitors.typeDelivery,
        'Maintenance',
        'Carpentry',
        'Plumbing',
        'Cleaning',
        messages.complaints.categoryOther || 'Other',
    ];
    const POPULAR_TIMES = [
        '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
        '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
        '08:00 PM', '09:00 PM', '10:00 PM'
    ];
    const [stepIndex, setStepIndex] = useState(0);
    const [form, setForm] = useState({
        name: '',
        phone: '',
        type: null as VisitorType | null,
        accessType: 'oneDay',
        expectedDate: 'Today',
        expectedTime: '12:00 PM',
        expectedExitAtIso: '',
        vehicleNumber: '',
        purpose: String(localizedUiText.m_aade86fb93fa)
    });
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        expectedExit: ''
    });
    const [statusModal, setStatusModal] = useState<'success' | 'error' | null>(null);
    const [statusMessage, setStatusMessage] = useState('');
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const formatDateString = (date: Date) => {
        const t = new Date();
        if (date.getDate() === t.getDate() &&
            date.getMonth() === t.getMonth() &&
            date.getFullYear() === t.getFullYear()) {
            return 'Today';
        }
        return formatResidentDate(date);
    };
    const expectedEntryAtIso = useMemo(() => {
        const [rawTime, meridiem] = form.expectedTime.split(' ');
        if (!rawTime || !meridiem)
            return new Date(selectedDate).toISOString();
        const [rawHour = '0', rawMinute = '0'] = rawTime.split(':');
        const hourNumber = Number(rawHour);
        const minuteNumber = Number(rawMinute);
        const normalizedHour = meridiem === 'PM' && hourNumber < 12
            ? hourNumber + 12
            : meridiem === 'AM' && hourNumber === 12
                ? 0
                : hourNumber;
        const entryDate = new Date(selectedDate);
        entryDate.setHours(normalizedHour, minuteNumber, 0, 0);
        return entryDate.toISOString();
    }, [form.expectedTime, selectedDate]);
    const visitorCategory = useMemo(() => resolveVisitorCategory(form.type ?? VisitorType.GUEST, form.purpose), [form.purpose, form.type]);
    const exitPolicy = useMemo(() => getVisitorExitPolicy(visitorCategory), [visitorCategory]);
    const expectedExitAtIso = useMemo(() => resolveExpectedExitAtIso(expectedEntryAtIso, exitPolicy, form.expectedExitAtIso || undefined), [expectedEntryAtIso, exitPolicy, form.expectedExitAtIso]);
    const getDaysList = () => {
        const date = new Date(currentYear, currentMonth, 1);
        const startDay = date.getDay();
        const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
        const days: (Date | null)[] = [];
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }
        for (let d = 1; d <= totalDays; d++) {
            days.push(new Date(currentYear, currentMonth, d));
        }
        return days;
    };
    const isPastDate = (date: Date) => {
        const todayZero = new Date();
        todayZero.setHours(0, 0, 0, 0);
        return date < todayZero;
    };
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        }
        else {
            setCurrentMonth(currentMonth - 1);
        }
    };
    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        }
        else {
            setCurrentMonth(currentMonth + 1);
        }
    };
    const validateField = (field: 'name' | 'phone', value: string) => {
        if (field === 'name') {
            if (!value.trim()) {
                return messages.validation.required(String(localizedUiText.m_dcd1d5223f73));
            }
            if (value.trim().length < 2) {
                return messages.validation.minLength('Name', 2);
            }
            return '';
        }
        if (field === 'phone') {
            if (!value.trim()) {
                return messages.validation.required(String(localizedUiText.m_306f1bb20677));
            }
            if (!/^\d{10}$/.test(value.trim())) {
                return messages.validation.invalidPhone;
            }
            return '';
        }
        return '';
    };
    const handleNameChange = (val: string) => {
        setForm(prev => ({ ...prev, name: val }));
        setErrors(prev => ({ ...prev, name: validateField('name', val) }));
    };
    const handlePhoneChange = (val: string) => {
        setForm(prev => ({ ...prev, phone: val }));
        setErrors(prev => ({ ...prev, phone: validateField('phone', val) }));
    };
    const handleTypeSelect = (type: VisitorType) => {
        const nameErr = validateField('name', form.name);
        const phoneErr = validateField('phone', form.phone);
        if (nameErr || phoneErr) {
            setErrors((prev) => ({ ...prev, name: nameErr, phone: phoneErr }));
            return;
        }
        setForm(prev => ({ ...prev, type }));
        setStepIndex(1);
    };
    const nextStep = () => {
        if (stepIndex === 0) {
            const nameErr = validateField('name', form.name);
            const phoneErr = validateField('phone', form.phone);
            if (nameErr || phoneErr) {
                setErrors((prev) => ({ ...prev, name: nameErr, phone: phoneErr }));
                return;
            }
        }
        if (stepIndex === 1) {
            const validation = validateExpectedExitSelection({
                expectedEntryAtIso,
                expectedExitAtIso: form.expectedExitAtIso || expectedExitAtIso,
                policy: exitPolicy
            });
            if (!validation.isValid) {
                setErrors((prev) => ({ ...prev, expectedExit: t(messages, validation.messageKey) }));
                return;
            }
            setErrors((prev) => ({ ...prev, expectedExit: '' }));
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
        if (!form.type) {
            setStatusMessage(t(messages, 'visitors.formType'));
            setStatusModal('error');
            return;
        }
        const res = await submit({
            name: form.name,
            phone: form.phone,
            type: form.type,
            expectedDate: form.expectedDate,
            expectedTime: form.expectedTime,
            expectedEntryAtIso,
            expectedExitAtIso,
            visitorCategory,
            ...includeWhenPresent("vehicleNumber", form.vehicleNumber || undefined),
            purpose: form.purpose
        });
        if (res.ok) {
            setStatusMessage(messages.visitors.passCreatedMessage(form.name));
            setStatusModal('success');
        }
        else {
            setStatusMessage(res.error.message);
            setStatusModal('error');
        }
    };
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setForm(prev => ({ ...prev, expectedDate: formatDateString(date) }));
    };
    return (<KeyboardAvoidingView {...includeWhenPresent("behavior", keyboardConfig.behavior)} keyboardVerticalOffset={keyboardConfig.keyboardVerticalOffset} style={[styles.root, createKeyboardAvoidingViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader titleKey="resident.navigation.visitors.title" title={localizedUiText.m_911bf7379819} {...includeWhenPresent("onBackPress", stepIndex > 0 ? prevStep : undefined)}/>
      <ResidentWorkflowStepper steps={STEPS} currentStepIndex={stepIndex}/>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {stepIndex === 0 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
              {messages.visitors.whoIsVisitingHeader}
            </SafeText>
            <FormField label={messages.visitors.visitorNameLabel} value={form.name} onChangeText={handleNameChange} placeholder={messages.visitors.visitorNamePlaceholder} error={errors.name} required/>
            <FormField label={messages.visitors.phoneLabel} value={form.phone} onChangeText={handlePhoneChange} placeholder={messages.visitors.phonePlaceholder} keyboardType="phone-pad" error={errors.phone} maxLength={10} required/>

            <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textSecondary)}>
              {messages.visitors.selectVisitorTypeHeader}
            </SafeText>
            <View style={styles.typeGrid}>
              {VISITOR_TYPES.map((t) => {
                const isSelected = form.type === t.key;
                return (<PressableScale key={t.key} onPress={() => handleTypeSelect(t.key)} style={styles.typeItem}>
                    <View style={[
                        styles.typeCard,
                        createViewBackgroundColorBorderColorStyle(isSelected ? theme.accent : theme.surface, isSelected ? 'transparent' : theme.border),
                    ]}>
                      <Ionicons name={t.icon as keyof typeof Ionicons.glyphMap} size={20} color={isSelected ? '#FFFFFF' : theme.accent}/>
                      <SafeText variant="tiny" style={createSafeTextColorStyle3(isSelected ? '#FFFFFF' : theme.textPrimary)}>
                        {t.label}
                      </SafeText>
                    </View>
                  </PressableScale>);
            })}
            </View>

            <VisitorExitPolicyNotice policy={exitPolicy}/>
            <VisitorExpectedExitSelector expectedEntryAtIso={expectedEntryAtIso} {...includeWhenPresent("selectedExpectedExitAtIso", form.expectedExitAtIso || undefined)} policy={exitPolicy} error={errors.expectedExit} onSelectExpectedExit={(value) => setForm({ ...form, expectedExitAtIso: value })}/>
          </View>)}

        {stepIndex === 1 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle4(theme.textPrimary)}>
              {messages.visitors.whenAreTheyArrivingHeader}
            </SafeText>

            <SafeText variant="caption" style={createSafeTextColorStyle5(theme.textSecondary)}>{messages.visitors.accessDurationLabel}</SafeText>
            <WrapRow gap={8}>
              {ACCESS_TYPES.map((t) => {
                const isSelected = form.accessType === t;
                return (<PressableScale key={t} onPress={() => setForm({ ...form, accessType: t })}>
                    <View style={[
                        styles.chip,
                        createViewBackgroundColorBorderColorStyle2(isSelected ? theme.accent : theme.surface, isSelected ? 'transparent' : theme.border),
                    ]}>
                      <SafeText variant="tiny" style={createSafeTextColorStyle6(isSelected ? '#FFFFFF' : theme.textPrimary)}>
                        {t === 'oneDay' ? messages.visitors.accessTypeOneDay : t === 'limitedHours' ? messages.visitors.accessTypeLimitedHours : messages.visitors.accessTypeRecurring}
                      </SafeText>
                    </View>
                  </PressableScale>);
            })}
            </WrapRow>

            
            <SafeText variant="caption" style={createSafeTextColorStyle7(theme.textSecondary)}>
              {messages.visitors.expectedDateLabel} ({formatResidentDate(form.expectedDate)})
            </SafeText>
            <View style={[styles.calendarContainer, createViewBorderColorBackgroundColorStyle(theme.border, theme.surface)]}>
              
              <View style={styles.calendarHeader}>
                <Pressable onPress={handlePrevMonth} style={styles.arrowButton}>
                  <Ionicons name="chevron-back" size={16} color={theme.textPrimary}/>
                </Pressable>
                <SafeText variant="caption" style={createSafeTextColorStyle8(theme.textPrimary)}>
                  {getRequiredItem(monthNames, currentMonth, "CreateVisitorPassScreen.tsx")} {currentYear}
                </SafeText>
                <Pressable onPress={handleNextMonth} style={styles.arrowButton}>
                  <Ionicons name="chevron-forward" size={16} color={theme.textPrimary}/>
                </Pressable>
              </View>

              
              <View style={styles.weekdayRow}>
                {daysOfWeek.map((day) => (<SafeText key={day} variant="tiny" style={[styles.weekdayText, createSafeTextColorStyle15(theme.textSecondary)]}>
                    {day}
                  </SafeText>))}
              </View>

              
              <View style={styles.daysGrid}>
                {getDaysList().map((d, idx) => {
                if (!d) {
                    return <View key={`empty-${idx}`} style={styles.dayCell}/>;
                }
                const isSelected = selectedDate.getDate() === d.getDate() &&
                    selectedDate.getMonth() === d.getMonth() &&
                    selectedDate.getFullYear() === d.getFullYear();
                const isDisabled = isPastDate(d);
                return (<Pressable key={d.toISOString()} disabled={isDisabled} onPress={() => handleDateSelect(d)} style={styles.dayCell}>
                      <View style={[
                        styles.dayButton,
                        isSelected && createViewBackgroundColorStyle(theme.accent),
                        !isSelected &&
                            d.getDate() === today.getDate() &&
                            d.getMonth() === today.getMonth() &&
                            d.getFullYear() === today.getFullYear() && createViewBorderColorStyle(theme.accent),
                    ]}>
                        <SafeText variant="tiny" style={createSafeTextColorFontWeightStyle(isSelected
                        ? '#FFFFFF'
                        : isDisabled
                            ? theme.textSecondary + '66'
                            : theme.textPrimary, isSelected ? '700' : '400')}>
                          {d.getDate()}
                        </SafeText>
                      </View>
                    </Pressable>);
            })}
              </View>
            </View>

            <SafeText variant="caption" style={createSafeTextColorStyle9(theme.textSecondary)}>
              {messages.visitors.expectedTimeLabel || localizedUiText.m_00056f4fa3e8} ({form.expectedTime})
            </SafeText>
            <View style={[styles.calendarContainer, createViewBorderColorBackgroundColorStyle2(theme.border, theme.surface)]}>
              <WrapRow gap={8}>
                {POPULAR_TIMES.map((time) => {
                const isSelected = form.expectedTime === time;
                return (<PressableScale key={time} onPress={() => setForm({ ...form, expectedTime: time })}>
                      <View style={[
                        styles.timeChip,
                        createViewBackgroundColorBorderColorStyle3(isSelected ? theme.accent : 'transparent', isSelected ? 'transparent' : theme.border),
                    ]}>
                        <SafeText variant="tiny" style={createSafeTextColorStyle10(isSelected ? '#FFFFFF' : theme.textPrimary)}>
                          {time}
                        </SafeText>
                      </View>
                    </PressableScale>);
            })}
              </WrapRow>
            </View>
          </View>)}

        {stepIndex === 2 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle11(theme.textPrimary)}>
              {messages.visitors.vehicleAndPurposeHeader}
            </SafeText>

            <FormField label={messages.visitors.vehicleNumberLabel} value={form.vehicleNumber} onChangeText={(val: string) => setForm({ ...form, vehicleNumber: val })} placeholder={messages.visitors.vehicleNumberPlaceholder} autoCapitalize="characters"/>

            <SafeText variant="caption" style={createSafeTextColorStyle12(theme.textSecondary)}>
              {messages.visitors.purposeOfVisitLabel}
            </SafeText>
            <WrapRow gap={8}>
              {PURPOSE_CHIPS.map((chip) => {
                const isSelected = form.purpose === chip;
                return (<PressableScale key={chip} onPress={() => setForm({ ...form, purpose: chip })}>
                    <View style={[
                        styles.chip,
                        createViewBackgroundColorBorderColorStyle4(isSelected ? theme.accent : theme.surface, isSelected ? 'transparent' : theme.border),
                    ]}>
                      <SafeText variant="tiny" style={createSafeTextColorStyle13(isSelected ? '#FFFFFF' : theme.textPrimary)}>
                        {chip}
                      </SafeText>
                    </View>
                  </PressableScale>);
            })}
            </WrapRow>
          </View>)}

        {stepIndex === 3 && (<View style={styles.previewContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle14(theme.textPrimary)} align="center">
              {messages.visitors.verifyPassDetailsHeader}
            </SafeText>
            <VisitorPassPanel visitorName={form.name} visitorType={form.type || VisitorType.GUEST} purpose={form.purpose} validFrom={form.expectedDate} validTill={form.expectedTime} gateName="Main Gate"/>
            <VisitorPassReviewCard visitorTypeLabel={form.type ? VISITOR_TYPES.find((item) => item.key === form.type)?.label ?? messages.visitors.typeGuest : messages.visitors.typeGuest} expectedEntryAtIso={expectedEntryAtIso} expectedExitAtIso={expectedExitAtIso} policy={exitPolicy}/>
          </View>)}
      </ScrollView>

      {stepIndex > 0 && (<View style={[styles.bottomBar, createViewPaddingBottomBorderTopColorBackgroundColorStyle(insets.bottom + 12, theme.border, theme.background)]}>
          {stepIndex < STEPS.length - 1 ? (<AppButton title={messages.visitors.nextStepButton || localizedUiText.m_226366c3301a} onPress={nextStep} iconRight={<Ionicons name="arrow-forward-outline" size={18} color="#FFFFFF"/>}/>) : (<AppButton title={messages.visitors.generatePassButton || localizedUiText.m_b44a6e47e93e} onPress={handleCreate} loading={isSubmitting} iconLeft={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF"/>}/>)}
        </View>)}
      <StatusModal visible={statusModal !== null} type={statusModal === 'success' ? 'success' : 'error'} title={statusModal === 'success' ? messages.visitors.passCreatedTitle : messages.resident.errors.generic} message={statusMessage} actionLabel={messages.common.ok} onClose={() => {
            const wasSuccess = statusModal === 'success';
            setStatusModal(null);
            if (wasSuccess) {
                navigation.navigate('VisitorList');
            }
        }}/>
    </KeyboardAvoidingView>);
}
export default CreateVisitorPassScreen;

