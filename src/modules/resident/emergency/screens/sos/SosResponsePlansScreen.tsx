import { View, ScrollView, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { useSosResidenceContext } from "../../hooks/useSosResidenceContext";
import { useSosResponsePlans } from "../../hooks/useSosResponsePlans";
import { SosPlanCard } from "../../components/sos/SosPlanCard";
import type { SosResponsePlanStackParamList } from "../../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createScrollViewBackgroundColorStyle, createSafeTextColorStyle2 } from "../../styles/screens/sos/SosResponsePlansScreen.styles";
type Props = NativeStackScreenProps<SosResponsePlanStackParamList, 'SosResponsePlans'>;
export function SosResponsePlansScreen({ navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const context = useSosResidenceContext();
    const { plans, isLoading, error } = useSosResponsePlans(context);
    const sosMsg = messages.resident?.emergency?.sosSettings ?? {};
    if (isLoading) {
        return (<View style={[styles.centered, createViewBackgroundColorStyle(colors.background)]}>
        <ActivityIndicator size="large" color={colors.textSecondary}/>
      </View>);
    }
    if (error) {
        return (<View style={[styles.centered, createViewBackgroundColorStyle2(colors.background)]}>
        <SafeText variant="body" style={createSafeTextColorStyle(colors.textSecondary)}>{localizedUiText.m_de7561a758e7}</SafeText>
      </View>);
    }
    return (<ScrollView style={[styles.container, createScrollViewBackgroundColorStyle(colors.background)]} contentContainerStyle={styles.contentContainer}>
      <SafeText variant="caption" style={[styles.subtitle, createSafeTextColorStyle2(colors.textSecondary)]}>
        {sosMsg?.responsePlansSubtitle ?? localizedUiText.m_7f60a8c996c1}
      </SafeText>

      <View style={styles.plansList}>
        {plans.map((plan) => (<SosPlanCard key={plan.id} plan={plan} onPress={() => navigation.navigate('SosResponsePlanDetails', { sosType: plan.sosType })}/>))}
      </View>
    </ScrollView>);
}

