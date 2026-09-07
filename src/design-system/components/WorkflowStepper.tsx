import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { colors, getColors } from "../tokens/premium-colors";
import { radius } from "../tokens/premium-radius";
import { typography } from "../tokens/premium-typography";

export interface WorkflowStepperProps {
    steps: string[];
    currentStepIndex: number;
    variant?: 'default' | 'compact';
}

export function WorkflowStepper({ steps, currentStepIndex, variant = 'default' }: WorkflowStepperProps) {
    const { dark } = useAppTheme();
    const themeColors = getColors(dark ? 'dark' : 'light');

    return (
        <View style={styles.container}>
            <View style={styles.stepperRow}>
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isActive = index === currentStepIndex;
                    const isLast = index === steps.length - 1;

                    let nodeBg = themeColors.surface.primary;
                    let nodeBorder = themeColors.border.default;
                    let textColor = themeColors.text.secondary;

                    if (isCompleted) {
                        nodeBg = themeColors.brand.success;
                        nodeBorder = 'transparent';
                        textColor = themeColors.text.inverse;
                    } else if (isActive) {
                        nodeBg = themeColors.brand.primary;
                        nodeBorder = themeColors.brand.primary;
                        textColor = themeColors.text.inverse;
                    }

                    return (
                        <React.Fragment key={index}>
                            <View style={styles.stepItem}>
                                <View style={[
                                    styles.node,
                                    { backgroundColor: nodeBg, borderColor: nodeBorder, borderWidth: 2, borderRadius: 9999 },
                                ]}>
                                    <SafeText variant="tiny" style={[
                                        styles.nodeText,
                                        { color: isActive ? themeColors.text.inverse : isCompleted ? themeColors.text.inverse : themeColors.text.secondary, fontWeight: isActive ? '700' : '500' }
                                    ]}>
                                        {index + 1}
                                    </SafeText>
                                </View>
                                <SafeText variant="tiny" style={[
                                    styles.label,
                                    { color: textColor, fontWeight: isActive ? '700' : '500' }
                                ]} numberOfLines={1}>
                                    {step}
                                </SafeText>
                            </View>
                            {!isLast && (
                                <View style={[
                                    styles.line,
                                    { backgroundColor: isCompleted ? themeColors.brand.success : themeColors.border.default }
                                ]} />
                            )}
                        </React.Fragment>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepperRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    node: {
        width: 24,
        height: 24,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    nodeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
    },
    line: {
        flex: 1,
        height: 2,
        marginHorizontal: 4,
    },
});

export default WorkflowStepper;
