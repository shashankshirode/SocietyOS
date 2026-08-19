import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRuleLibrary } from "../../data/useRuleLibrary";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { styles } from "../../styles/screens/interFlat_screens/RuleLibraryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function RuleLibraryScreen({ navigation }: InterFlatScreenProps<'RuleLibrary'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useRuleLibrary();
    return (<View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_a2807aa55fde}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_f7f10405f799}</Text>
      </View>

      <FlatList data={data ?? []} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RuleDetail', { ruleId: item.id })}>
            <View style={styles.cardHeader}>
              <Text style={styles.ruleNum}>{item.ruleNumber}</Text>
              <Text style={[styles.badge, item.acknowledgementRequired ? styles.badgeReq : styles.badgeOpt]}>
                {item.acknowledgementRequired ? localizedUiText.m_d17da51aa89f : localizedUiText.m_59be71333c96}
              </Text>
            </View>
            <Text style={styles.ruleTitle}>{item.title}</Text>
            <Text style={styles.ruleSummary} numberOfLines={2}>{item.summary}</Text>
            <Text style={styles.version}>{localizedUiText.m_dd167905de0d + " "}{item.version}{" " + localizedUiText.m_e7f4ec8d2c46 + " "}{item.effectiveDate}</Text>
          </TouchableOpacity>)}/>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('MyRuleAcknowledgements')}>
          <Text style={styles.btnText}>{localizedUiText.m_e3a65c931dc3}</Text>
        </TouchableOpacity>
      </View>
    </View>);
}

