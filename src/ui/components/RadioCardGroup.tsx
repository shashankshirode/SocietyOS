import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../shared/components/SafeText';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { HapticFeedback } from '../../shared/utils/haptics';
import type { Absent } from "../../shared/types/absence.types";
export interface RadioOptionItem<T extends string = string> {
    id: T;
    title: string;
    description?: string | Absent;
    iconName?: keyof typeof Ionicons.glyphMap | Absent;
    badge?: string | Absent;
    disabled?: boolean | Absent;
}
export interface RadioCardGroupProps<T extends string = string> {
    options: RadioOptionItem<T>[];
    selectedId: T;
    onSelect: (id: T) => void;
    style?: ViewStyle | Absent;
    testID?: string | Absent;
}
export function RadioCardGroup<T extends string = string>({ options, selectedId, onSelect, style, testID = 'radio-card-group', }: RadioCardGroupProps<T>) {
    const { colors, dark } = useAppTheme();
    return (<View style={[styles.container, style]} testID={testID} accessibilityRole="radiogroup">
      {options.map((option) => {
            const isSelected = selectedId === option.id;
            return (<Pressable key={option.id} disabled={option.disabled} onPress={() => {
                    HapticFeedback.light();
                    onSelect(option.id);
                }} accessibilityRole="radio" accessibilityState={{ checked: isSelected, disabled: option.disabled }} testID={`radio-option-${option.id}`} style={[
                    styles.card,
                    {
                        backgroundColor: isSelected
                            ? colors.primarySoft
                            : dark
                                ? '#1E293B'
                                : '#FFFFFF',
                        borderColor: isSelected
                            ? colors.primary
                            : dark
                                ? 'rgba(255, 255, 255, 0.1)'
                                : '#E2E8F0',
                        opacity: option.disabled ? 0.45 : 1,
                    },
                ]}>
            {option.iconName ? (<View style={[
                        styles.iconBox,
                        {
                            backgroundColor: isSelected
                                ? colors.primary
                                : dark
                                    ? 'rgba(255,255,255,0.08)'
                                    : '#F1F5F9',
                        },
                    ]}>
                <Ionicons name={option.iconName} size={20} color={isSelected ? colors.primaryText : colors.textPrimary}/>
              </View>) : null}

            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <SafeText variant="bodyStrong" style={{
                    color: isSelected ? colors.primary : colors.textPrimary,
                    fontWeight: '700',
                    fontSize: 15,
                }}>
                  {option.title}
                </SafeText>
                {option.badge ? (<View style={[styles.badge, { backgroundColor: colors.secondarySoft }]}>
                    <SafeText variant="tiny" style={{ color: colors.secondary, fontWeight: '700' }}>
                      {option.badge}
                    </SafeText>
                  </View>) : null}
              </View>

              {option.description ? (<SafeText variant="caption" style={{ color: colors.textSecondary, marginTop: 2 }}>
                  {option.description}
                </SafeText>) : null}
            </View>

            <View style={[
                    styles.radioCircle,
                    {
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected ? colors.primary : 'transparent',
                    },
                ]}>
              {isSelected ? (<View style={[styles.innerCircle, { backgroundColor: colors.textOnPrimary }]}/>) : null}
            </View>
          </Pressable>);
        })}
    </View>);
}
const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    radioCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
export default RadioCardGroup;

