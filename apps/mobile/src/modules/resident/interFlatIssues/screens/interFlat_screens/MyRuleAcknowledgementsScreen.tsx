import { Text, View, FlatList } from "react-native";
import { useMyRuleAcknowledgements } from "../../data/useMyRuleAcknowledgements";
import { formatResidentDateTime } from "../../../../../core/localization/dateTimeFormatters";
import { styles } from "../../styles/screens/interFlat_screens/MyRuleAcknowledgementsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function MyRuleAcknowledgementsScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useMyRuleAcknowledgements();
    return (<View style={styles.container}>
      <FlatList data={data ?? []} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<View style={styles.card}>
            <Text style={styles.title}>{item.ruleTitle}</Text>
            <Text style={styles.ref}>{localizedUiText.m_823960a09c43 + " "}{item.referenceNumber}</Text>
            <Text style={styles.date}>{localizedUiText.m_dd167905de0d + " "}{item.ruleVersion}{" " + localizedUiText.m_d18febf766d3 + " "}{formatResidentDateTime(item.acknowledgedAt)}</Text>
          </View>)}/>
    </View>);
}

