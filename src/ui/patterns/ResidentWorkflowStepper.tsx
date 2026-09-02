import React from "react";
import { View } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useResidentTheme } from "../foundation/residentTheme";
import { styles, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle, createSafeTextColorFontWeightStyle, createViewBackgroundColorStyle } from "./styles/ResidentWorkflowStepper.styles";
export interface ResidentWorkflowStepperProps {
    steps: string[];
    currentStepIndex: number;
}
export function ResidentWorkflowStepper({ steps, currentStepIndex }: ResidentWorkflowStepperProps) {
    const theme = useResidentTheme();
    return (<View style={styles.container}>
      <View style={styles.stepperRow}>
        {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            const isLast = index === steps.length - 1;
            let nodeBg: string = theme.background;
            let nodeBorder: string = theme.border;
            let textColor: string = theme.textSecondary;
            if (isCompleted) {
                nodeBg = theme.success;
                nodeBorder = 'transparent';
                textColor = theme.textPrimary;
            }
            else if (isActive) {
                nodeBg = theme.selectedBackground;
                nodeBorder = theme.selectedBorder;
                textColor = theme.textPrimary;
            }
            return (<React.Fragment key={index}>
              <View style={styles.stepItem}>
                <View style={[styles.node, createViewBackgroundColorBorderColorStyle(nodeBg, nodeBorder)]}>
                  <SafeText variant="tiny" style={[styles.nodeText, createSafeTextColorStyle(isActive ? theme.selectedForeground : isCompleted ? theme.textInverse : theme.textSecondary)]}>
                    {index + 1}
                  </SafeText>
                </View>
                <SafeText variant="tiny" style={[styles.label, createSafeTextColorFontWeightStyle(textColor, isActive ? '700' : '500')]} numberOfLines={1}>
                  {step}
                </SafeText>
              </View>
              {!isLast && (<View style={[styles.line, createViewBackgroundColorStyle(isCompleted ? theme.success : theme.border)]}/>)}
            </React.Fragment>);
        })}
      </View>
    </View>);
}
export default ResidentWorkflowStepper;
