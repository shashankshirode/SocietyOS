import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, View, type ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { t } from "../../modules/resident/household/components/householdComponentUtils";
import { AppBottomSheet } from "../bottomSheet";
import { ModalFooter, ModalHeader, useModalController } from "../modal";
import { FormFieldContainer } from "./FormFieldContainer";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createSafeTextColorFontWeightStyle, createViewBorderColorStyle, createSafeTextBorderBottomColorBackgroundColorStyle, createPressableBackgroundColorStyle, createSafeTextColorStyle, createPressableBorderColorBackgroundColorSpread3Style } from "./styles/AppDateField.styles";
export interface AppDateFieldProps {
    label: string;
    value?: string;
    onChange: (value: string) => void;
    error?: string;
    helperText?: string;
    required?: boolean;
    containerStyle?: ViewStyle;
}
export function AppDateField({ label, value, onChange, error, helperText, required, containerStyle, }: AppDateFieldProps) {
    const { colors, shadows } = useAppTheme();
    const messages = useMessages();
    const picker = useModalController();
    const [tempDay, setTempDay] = useState('01');
    const [tempMonth, setTempMonth] = useState('01');
    const [tempYear, setTempYear] = useState('1990');
    const months = useMemo(() => Array.from({ length: 12 }, (_, index) => ({
        label: new Intl.DateTimeFormat('en-IN', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, index, 1))),
        value: String(index + 1).padStart(2, '0')
    })), []);
    const days = useMemo(() => Array.from({ length: 31 }, (_, index) => {
        const day = String(index + 1).padStart(2, '0');
        return { label: day, value: day };
    }), []);
    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: currentYear - 1900 + 1 }, (_, index) => {
            const year = String(currentYear - index);
            return { label: year, value: year };
        });
    }, []);
    React.useEffect(() => {
        if (!value)
            return;
        const [year, month, day] = value.split('-');
        if (year && month && day) {
            setTempYear(year);
            setTempMonth(month);
            setTempDay(day);
        }
    }, [picker.isOpen, value]);
    const displayValue = useMemo(() => {
        if (!value)
            return t(messages, 'resident.family.selectDateOfBirth');
        const [year, month, day] = value.split('-');
        if (!year || !month || !day)
            return value;
        const monthLabel = months.find((item) => item.value === month)?.label ?? month;
        return `${Number.parseInt(day, 10)} ${monthLabel} ${year}`;
    }, [messages, months, value]);
    const handleConfirm = () => {
        onChange(`${tempYear}-${tempMonth}-${tempDay}`);
        picker.close();
    };
    const renderColumn = (title: string, items: readonly {
        label: string;
        value: string;
    }[], selectedValue: string, onSelect: (nextValue: string) => void, large = false) => (<View style={[large ? styles.columnLarge : styles.column, createViewBorderColorStyle(colors.border)]}>
      <SafeText variant="caption" color="secondary" align="center" style={[styles.columnLabel, createSafeTextBorderBottomColorBackgroundColorStyle(colors.border, colors.surfaceMuted)]}>
        {title}
      </SafeText>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {items.map((item) => {
            const selected = item.value === selectedValue;
            return (<Pressable key={item.value} onPress={() => onSelect(item.value)} style={[styles.item, selected && createPressableBackgroundColorStyle(colors.primarySoft)]} accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={item.label}>
              <SafeText style={createSafeTextColorFontWeightStyle(selected ? colors.primary : colors.textPrimary, selected ? '700' : '500')}>
                {item.label}
              </SafeText>
            </Pressable>);
        })}
      </ScrollView>
    </View>);
    return (<>
      <FormFieldContainer label={label} {...includeWhenPresent("error", error)} {...includeWhenPresent("helperText", helperText)} {...includeWhenPresent("required", required)} {...includeWhenPresent("style", containerStyle)}>
        <Pressable onPress={picker.open} style={[
            styles.wrapper,
            createPressableBorderColorBackgroundColorSpread3Style(error ? colors.danger : colors.border, colors.inputBackground, shadows.soft),
        ]} accessibilityRole="button" accessibilityLabel={`${t(messages, 'resident.family.datePicker.openAccessibility')}: ${displayValue}`}>
          <SafeText style={[styles.valueText, createSafeTextColorStyle(value ? colors.textPrimary : colors.textMuted)]}>
            {displayValue}
          </SafeText>
          <Ionicons name="calendar-outline" size={18} color={colors.textSecondary}/>
        </Pressable>
      </FormFieldContainer>

      <AppBottomSheet visible={picker.isOpen} onClose={picker.close} testID="family-date-of-birth-picker-sheet" header={<ModalHeader title={t(messages, 'resident.family.selectDateOfBirth')} onClose={picker.close}/>}>
        <View style={styles.sheetContent}>
          <View style={styles.pickerContainer}>
            {renderColumn(t(messages, 'resident.family.datePicker.day'), days, tempDay, setTempDay)}
            {renderColumn(t(messages, 'resident.family.datePicker.month'), months, tempMonth, setTempMonth, true)}
            {renderColumn(t(messages, 'resident.family.datePicker.year'), years, tempYear, setTempYear)}
          </View>
          <ModalFooter secondaryAction={{
            label: t(messages, 'buttons.cancel'),
            onPress: picker.close,
            accessibilityLabel: t(messages, 'accessibility.modal.cancel')
        }} primaryAction={{
            label: t(messages, 'buttons.confirm'),
            onPress: handleConfirm,
            accessibilityLabel: t(messages, 'accessibility.modal.confirm')
        }}/>
        </View>
      </AppBottomSheet>
    </>);
}
export default AppDateField;

