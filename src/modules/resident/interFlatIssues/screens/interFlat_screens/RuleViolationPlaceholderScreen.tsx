import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRuleViolationPlaceholder } from "../../data/useRuleViolationPlaceholder";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { styles } from "../../styles/screens/interFlat_screens/RuleViolationPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function RuleViolationPlaceholderScreen({ navigation }: InterFlatScreenProps<'RuleViolationPlaceholder'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useRuleViolationPlaceholder();
    return (<View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_49184c2a7301}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_87c7beafb1c5}</Text>
      </View>

      <FlatList data={data ?? []} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PenaltyReadinessPlaceholder', { violationId: item.id })}>
            <View style={styles.cardHeader}>
              <Text style={styles.violNum}>{item.violationNumber}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>
            <Text style={styles.ruleTitle}>{item.ruleTitle}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.amount}>{localizedUiText.m_868b60e25323 + " "}{item.penaltyAmount || 0}</Text>
          </TouchableOpacity>)}/>
    </View>);
}

