import React from 'react';
import { ScrollView, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeText } from '../../shared/components/SafeText';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { HapticFeedback } from '../../shared/utils/haptics';
import type { Absent } from "../../shared/types/absence.types";
export interface DateHorizonItem {
    key: string;
    dayLabel: string;
    dateLabel: string;
    monthLabel?: string | Absent;
    badge?: string | Absent;
    disabled?: boolean | Absent;
}
export interface DateHorizonPickerProps {
    dates: DateHorizonItem[];
    selectedDateKey: string | null;
    onSelectDate: (key: string) => void;
    style?: ViewStyle | Absent;
    testID?: string | Absent;
}
export function DateHorizonPicker({ dates, selectedDateKey, onSelectDate, style, testID = 'date-horizon-picker', }: DateHorizonPickerProps) {
    const { colors, dark } = useAppTheme();
    return (<View style={[styles.container, style]} testID={testID}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollTrack}>
        {dates.map((item) => {
            const isSelected = selectedDateKey === item.key;
            return (<Pressable key={item.key} disabled={item.disabled} onPress={() => {
                    HapticFeedback.light();
                    onSelectDate(item.key);
                }} accessibilityRole="button" accessibilityState={{ selected: isSelected, disabled: item.disabled }} accessibilityLabel={`${item.dayLabel} ${item.dateLabel} ${item.monthLabel ?? ''}`} testID={`date-item-${item.key}`} style={[
                    styles.dateNode,
                    {
                        backgroundColor: isSelected
                            ? colors.primary
                            : dark
                                ? 'rgba(255, 255, 255, 0.06)'
                                : 'rgba(0, 0, 0, 0.04)',
                        borderColor: isSelected
                            ? colors.primary
                            : dark
                                ? 'rgba(255, 255, 255, 0.12)'
                                : 'rgba(0, 0, 0, 0.08)',
                        opacity: item.disabled ? 0.4 : 1,
                    },
                ]}>
              <SafeText variant="tiny" style={{
                    color: isSelected
                        ? colors.primaryText
                        : colors.textMuted,
                    fontWeight: '600',
                    fontSize: 11,
                    textTransform: 'uppercase',
                }}>
                {item.dayLabel}
              </SafeText>
              <SafeText variant="title" style={{
                    color: isSelected ? colors.primaryText : colors.textPrimary,
                    fontWeight: '700',
                    fontSize: 18,
                    marginVertical: 2,
                }}>
                {item.dateLabel}
              </SafeText>
              {item.monthLabel ? (<SafeText variant="tiny" style={{
                        color: isSelected
                            ? colors.primaryText
                            : colors.textMuted,
                        fontSize: 10,
                    }}>
                  {item.monthLabel}
                </SafeText>) : null}
            </Pressable>);
        })}
      </ScrollView>
    </View>);
}
const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    scrollTrack: {
        paddingHorizontal: 4,
        gap: 8,
    },
    dateNode: {
        width: 60,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default DateHorizonPicker;

