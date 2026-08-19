import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { usePenaltyReadiness } from "../../data/usePenaltyReadiness";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { styles } from "../../styles/screens/interFlat_screens/PenaltyReadinessPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
export function PenaltyReadinessPlaceholderScreen({ navigation }: InterFlatScreenProps<'PenaltyReadinessPlaceholder'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = usePenaltyReadiness();
    const pen = data?.[0] || {
        violationNumber: 'VIOL-2026-001',
        flatNumber: 'B-0803',
        ruleTitle: getActiveUiLiteral("m_d9e92097067e"),
        status: 'APPROVAL_REQUIRED',
        proposedAmount: 500
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_d755c2afbe63}</Text>
      <Text style={styles.subtitle}>{localizedUiText.m_0921ae5512e6}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>{localizedUiText.m_a86eee92aada}</Text>
        <Text style={styles.value}>{pen.violationNumber}</Text>

        <Text style={styles.label}>{localizedUiText.m_4fa489554ff1}</Text>
        <Text style={styles.value}>{pen.flatNumber}</Text>

        <Text style={styles.label}>{localizedUiText.m_1016c19bdabc}</Text>
        <Text style={styles.value}>{pen.ruleTitle}</Text>

        <Text style={styles.label}>{localizedUiText.m_e40df6b4c6a1}</Text>
        <Text style={styles.value}>{localizedUiText.m_c81c81b9ce6f + " "}{pen.proposedAmount}</Text>

        <Text style={styles.label}>{localizedUiText.m_920e413c7d41}</Text>
        <Text style={styles.value}>{pen.status}</Text>
      </View>

      <View style={styles.stepsCard}>
        <Text style={styles.stepsTitle}>{localizedUiText.m_d0e331628521}</Text>
        <Text style={styles.step}>{localizedUiText.m_adc7b9c9ce74}</Text>
        <Text style={styles.step}>{localizedUiText.m_ee292591dfb1}</Text>
        <Text style={styles.step}>{localizedUiText.m_1406f067d467}</Text>
        <Text style={styles.step}>{localizedUiText.m_52631361d4c1}</Text>
        <Text style={styles.step}>{localizedUiText.m_1aa3850fb680}</Text>
      </View>

      <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.actionBtnText}>{localizedUiText.m_b8d99df1066e}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

