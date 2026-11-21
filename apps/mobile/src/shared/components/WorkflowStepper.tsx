import { View } from "react-native";
import { WrapRow } from "../layout/WrapRow";
import { Spacing } from "../theme/spacing";
import { useAppTheme } from "../theme/useAppTheme";
import { SafeText } from "./SafeText";
import { styles, createViewBackgroundColorBorderColorStyle } from "./styles/WorkflowStepper.styles";
export function WorkflowStepper({ steps, currentStep }: {
    steps: string[];
    currentStep: number;
}) {
    const { colors } = useAppTheme();
    return (<WrapRow gap={Spacing.sm}>
      {steps.map((step, index) => {
            const active = index <= currentStep;
            return (<View key={step} style={[styles.step, createViewBackgroundColorBorderColorStyle(active ? colors.primarySoft : colors.surfaceMuted, active ? colors.primary : colors.border)]}>
            <SafeText variant="tiny" color={active ? colors.primary : 'secondary'} numberOfLines={2}>{index + 1}. {step}</SafeText>
          </View>);
        })}
    </WrapRow>);
}

