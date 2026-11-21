import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useRuleDetail } from "../../data/useRuleDetail";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { styles } from "../../styles/screens/interFlat_screens/RuleDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function RuleDetailScreen({ route, navigation }: InterFlatScreenProps<'RuleDetail'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { ruleId } = route.params;
    const { data, isLoading } = useRuleDetail(ruleId);
    if (isLoading || !data) {
        return (<View style={styles.loading}>
        <Text style={styles.loadingText}>{localizedUiText.m_e6c5ad4e17a9}</Text>
      </View>);
    }
    const rule = data;
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.ruleNum}>{rule.ruleNumber}</Text>
        <Text style={styles.title}>{rule.title}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{localizedUiText.m_292c06f0045a}</Text>
        <Text style={styles.value}>{rule.category}</Text>

        <Text style={styles.label}>{localizedUiText.m_079ab6c8c10f}</Text>
        <Text style={styles.value}>{rule.effectiveDate}</Text>

        <Text style={styles.label}>{localizedUiText.m_dd167905de0d}</Text>
        <Text style={styles.value}>{rule.version}</Text>

        <Text style={styles.label}>{localizedUiText.m_5e306a7ea63a}</Text>
        <Text style={styles.value}>{rule.appliesToRoles.join(', ')}</Text>
      </View>

      <Text style={styles.sectionTitle}>{localizedUiText.m_4bee930516f0}</Text>
      <Text style={styles.detailText}>{rule.detailedText}</Text>

      {rule.examples && rule.examples.length > 0 && (<View style={styles.section}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_0454299bf469}</Text>
          {rule.examples.map((ex: string, idx: number) => (<Text key={idx} style={styles.exampleText}>• {ex}</Text>))}
        </View>)}

      {rule.penaltyPlaceholderDescription && (<View style={styles.penaltyCard}>
          <Text style={styles.penaltyTitle}>{localizedUiText.m_74d3a5b9a4b9}</Text>
          <Text style={styles.penaltyText}>{rule.penaltyPlaceholderDescription}</Text>
        </View>)}

      {rule.acknowledgementRequired && (<TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('RuleAcknowledgement', { ruleId })}>
          <Text style={styles.actionBtnText}>{localizedUiText.m_7678073eb70a}</Text>
        </TouchableOpacity>)}
    </ScrollView>);
}

