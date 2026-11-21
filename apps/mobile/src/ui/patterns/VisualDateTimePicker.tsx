import { useState } from "react";
import { View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { getRequiredItem } from "../../shared/utils/requiredItem";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorFontWeightStyle, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createViewBorderColorBackgroundColorStyle, createSafeTextColorStyle9, createViewBackgroundColorStyle, createViewBorderColorStyle, createViewBorderColorBackgroundColorStyle2, createPressableBackgroundColorStyle, createPressableBorderColorStyle, createPressableBackgroundColorStyle2, createPressableBorderColorStyle2, createPressableBackgroundColorStyle3, createPressableBorderColorStyle3 } from "./styles/VisualDateTimePicker.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
interface Props {
    value: string;
    onChange: (value: string) => void;
    mode: 'date' | 'time';
    minDate?: Date;
    label?: string;
    is24Hour?: boolean;
}
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export function VisualDateTimePicker({ value, onChange, mode, minDate = new Date(), label, is24Hour = false, }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [currentMonth, setCurrentMonth] = useState(minDate.getMonth());
    const [currentYear, setCurrentYear] = useState(minDate.getFullYear());
    const getSelectedDate = (): Date => {
        if (mode === 'date' && value) {
            const parsed = new Date(value);
            if (!isNaN(parsed.getTime()))
                return parsed;
        }
        return new Date();
    };
    const selectedDate = getSelectedDate();
    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };
    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
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
    const isPastDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };
    const getDaysList = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const list: (Date | null)[] = [];
        for (let i = 0; i < firstDay; i++) {
            list.push(null);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            list.push(new Date(currentYear, currentMonth, d));
        }
        return list;
    };
    const handleDateSelect = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        onChange(`${year}-${month}-${day}`);
    };
    const parseTime = () => {
        if (!value)
            return { hour: 12, minute: 0, ampm: 'AM' };
        if (value.includes(':')) {
            const parts = value.split(' ');
            const timeParts = getRequiredItem(parts, 0, "VisualDateTimePicker.tsx").split(':');
            let hour = parseInt(getRequiredItem(timeParts, 0, "VisualDateTimePicker.tsx"), 10);
            const minute = parseInt(getRequiredItem(timeParts, 1, "VisualDateTimePicker.tsx"), 10) || 0;
            if (getRequiredItem(parts, 1, "VisualDateTimePicker.tsx")) {
                return { hour, minute, ampm: getRequiredItem(parts, 1, "VisualDateTimePicker.tsx").toUpperCase() };
            }
            let ampm = 'AM';
            if (hour >= 12) {
                ampm = 'PM';
                if (hour > 12)
                    hour -= 12;
            }
            else if (hour === 0) {
                hour = 12;
            }
            return { hour, minute, ampm };
        }
        return { hour: 12, minute: 0, ampm: 'AM' };
    };
    const { hour: currentHour, minute: currentMinute, ampm: currentAmPm } = parseTime();
    const handleTimeSelect = (hour: number, minute: number, ampm: string) => {
        if (is24Hour) {
            let finalHour = hour;
            if (ampm === 'PM' && hour < 12)
                finalHour += 12;
            if (ampm === 'AM' && hour === 12)
                finalHour = 0;
            const formatted = `${String(finalHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            onChange(formatted);
        }
        else {
            const formatted = `${hour}:${String(minute).padStart(2, '0')} ${ampm}`;
            onChange(formatted);
        }
    };
    return (<View style={styles.container}>
      {label && (<SafeText variant="caption" style={createSafeTextColorStyle(colors.textSecondary)}>
          {label}
        </SafeText>)}

      {mode === 'date' ? (<View style={[styles.card, createViewBorderColorBackgroundColorStyle(colors.border, colors.surface)]}>
          <View style={styles.header}>
            <Pressable onPress={handlePrevMonth} style={styles.arrowButton}>
              <Ionicons name="chevron-back" size={18} color={colors.textPrimary}/>
            </Pressable>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(colors.textPrimary)}>
              {getRequiredItem(MONTH_NAMES, currentMonth, "VisualDateTimePicker.tsx")} {currentYear}
            </SafeText>
            <Pressable onPress={handleNextMonth} style={styles.arrowButton}>
              <Ionicons name="chevron-forward" size={18} color={colors.textPrimary}/>
            </Pressable>
          </View>

          
          <View style={styles.weekdays}>
            {DAYS_OF_WEEK.map((day) => (<SafeText key={day} variant="tiny" style={[styles.weekdayText, createSafeTextColorStyle9(colors.textSecondary)]}>
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
                        isSelected && createViewBackgroundColorStyle(colors.primary),
                        !isSelected &&
                            d.getDate() === minDate.getDate() &&
                            d.getMonth() === minDate.getMonth() &&
                            d.getFullYear() === minDate.getFullYear() && createViewBorderColorStyle(colors.primary),
                    ]}>
                    <SafeText variant="tiny" style={createSafeTextColorFontWeightStyle(isSelected
                        ? '#FFFFFF'
                        : isDisabled
                            ? colors.textSecondary + '44'
                            : colors.textPrimary, isSelected ? '700' : '400')}>
                      {d.getDate()}
                    </SafeText>
                  </View>
                </Pressable>);
            })}
          </View>
        </View>) : (<View style={[styles.card, createViewBorderColorBackgroundColorStyle2(colors.border, colors.surface)]}>
          
          <View style={styles.clockHeader}>
            <SafeText variant="title" style={createSafeTextColorStyle3(colors.primary)}>
              {currentHour}:{String(currentMinute).padStart(2, '0')} {currentAmPm}
            </SafeText>
          </View>

          
          <View style={styles.ampmContainer}>
            {['AM', 'PM'].map((ampm) => {
                const isActive = currentAmPm === ampm;
                return (<Pressable key={ampm} onPress={() => handleTimeSelect(currentHour, currentMinute, ampm)} style={[
                        styles.ampmButton,
                        isActive && createPressableBackgroundColorStyle(colors.primary),
                        createPressableBorderColorStyle(colors.border),
                    ]}>
                  <SafeText variant="caption" style={createSafeTextColorStyle4(isActive ? '#FFFFFF' : colors.textPrimary)}>
                    {ampm}
                  </SafeText>
                </Pressable>);
            })}
          </View>

          
          <SafeText variant="tiny" style={createSafeTextColorStyle5(colors.textSecondary)}>{localizedUiText.m_70ae8dfd7926}</SafeText>
          <View style={styles.grid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => {
                const isSelected = currentHour === hour;
                return (<Pressable key={hour} onPress={() => handleTimeSelect(hour, currentMinute, currentAmPm)} style={[
                        styles.gridItem,
                        isSelected && createPressableBackgroundColorStyle2(colors.primary),
                        createPressableBorderColorStyle2(colors.border),
                    ]}>
                  <SafeText variant="caption" style={createSafeTextColorStyle6(isSelected ? '#FFFFFF' : colors.textPrimary)}>
                    {hour}
                  </SafeText>
                </Pressable>);
            })}
          </View>

          
          <SafeText variant="tiny" style={createSafeTextColorStyle7(colors.textSecondary)}>{localizedUiText.m_a8941b4e4ac6}</SafeText>
          <View style={styles.minutesContainer}>
            {[0, 15, 30, 45].map((min) => {
                const isSelected = currentMinute === min;
                return (<Pressable key={min} onPress={() => handleTimeSelect(currentHour, min, currentAmPm)} style={[
                        styles.minuteItem,
                        isSelected && createPressableBackgroundColorStyle3(colors.primary),
                        createPressableBorderColorStyle3(colors.border),
                    ]}>
                  <SafeText variant="caption" style={createSafeTextColorStyle8(isSelected ? '#FFFFFF' : colors.textPrimary)}>
                    {String(min).padStart(2, '0')}
                  </SafeText>
                </Pressable>);
            })}
          </View>
        </View>)}
    </View>);
}

