import { ScrollView, View, useWindowDimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "./householdComponentUtils";
import { styles, createSafeTextColorStyle, createSafeTextColorFontWeightStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle4, createViewBorderColorBackgroundColorStyle, createViewBackgroundColorStyle, createScrollViewBackgroundColorBorderColorStyle, createViewBorderColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3 } from "../styles/components/TenantOnboardingStepper.styles";
type TenantOnboardingStepperProps = {
    activeStep: number;
};
const stepKeys = [
    'resident.tenant.steps.start',
    'resident.tenant.steps.personalInfo',
    'resident.tenant.steps.agreement',
    'resident.tenant.steps.documents',
    'resident.tenant.steps.permissions',
    'resident.tenant.steps.review',
    'resident.tenant.steps.status',
];
export function TenantOnboardingStepper({ activeStep }: TenantOnboardingStepperProps) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 500;
    if (isSmallScreen) {
        return (<View style={[styles.gridContainer, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]} accessibilityLabel={t(messages, 'resident.accessibility.household.tenantStepper')}>
        <SafeText variant="caption" style={[styles.gridTitle, createSafeTextColorStyle4(colors.textSecondary)]}>{localizedUiText.m_025671a245ab}{activeStep + 1}{" " + localizedUiText.m_28391d3bc64e + " "}{stepKeys.length}
        </SafeText>
        <View style={styles.grid}>
          {stepKeys.map((stepKey, index) => {
                const isActive = index === activeStep;
                const isDone = index < activeStep;
                return (<View key={stepKey} style={[
                        styles.gridItem,
                        createViewBorderColorBackgroundColorStyle(isActive ? colors.primary : colors.border, isActive ? `${colors.primary}10` : isDone ? `${colors.success}10` : colors.background),
                    ]}>
                <View style={[
                        styles.gridDot,
                        createViewBackgroundColorStyle(isActive ? colors.primary : isDone ? colors.success : colors.border),
                    ]}>
                  {isDone ? (<Ionicons name="checkmark" size={10} color="#FFFFFF"/>) : (<SafeText variant="tiny" style={createSafeTextColorStyle(isActive ? '#FFFFFF' : colors.textMuted)}>
                      {String(index + 1)}
                    </SafeText>)}
                </View>
                <SafeText variant="tiny" style={createSafeTextColorFontWeightStyle(isActive ? colors.primary : isDone ? colors.success : colors.textSecondary, isActive || isDone ? '700' : '500')} numberOfLines={1}>
                  {t(messages, stepKey)}
                </SafeText>
              </View>);
            })}
        </View>
      </View>);
    }
    return (<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent} style={[styles.scrollStyle, createScrollViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]} accessibilityLabel={t(messages, 'resident.accessibility.household.tenantStepper')}>
      {stepKeys.map((stepKey, index) => {
            const isActive = index === activeStep;
            const isDone = index < activeStep;
            return (<View key={stepKey} style={styles.stepWrapper}>
            <View style={[styles.step, createViewBorderColorStyle(isActive ? colors.primary : 'transparent')]}>
              <View style={[styles.dot, createViewBackgroundColorStyle2(isDone || isActive ? colors.primary : colors.border)]}>
                {isDone ? (<Ionicons name="checkmark" size={10} color="#FFFFFF"/>) : (<SafeText variant="tiny" style={createSafeTextColorStyle2(isDone || isActive ? '#FFFFFF' : colors.textMuted)}>
                    {String(index + 1)}
                  </SafeText>)}
              </View>
              <SafeText variant="tiny" style={createSafeTextColorStyle3(isActive ? colors.primary : colors.textMuted)}>
                {t(messages, stepKey)}
              </SafeText>
            </View>
            {index < stepKeys.length - 1 && (<View style={[styles.connector, createViewBackgroundColorStyle3(isDone ? colors.primary : colors.border)]}/>)}
          </View>);
        })}
    </ScrollView>);
}
export default TenantOnboardingStepper;

