import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useDisputeHistory } from "../../data/useDisputeHistory";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { styles } from "../../styles/screens/interFlat_screens/DisputeHistoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function DisputeHistoryScreen({ navigation }: InterFlatScreenProps<'DisputeHistory'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useDisputeHistory();
    return (<View style={styles.container}>
      <FlatList data={data ?? []} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<TouchableOpacity style={styles.card} onPress={() => navigation.navigate('InterFlatIssueDetail', { issueId: item.id })}>
            <View style={styles.cardHeader}>
              <Text style={styles.issueNum}>{item.issueNumber}</Text>
              <Text style={styles.status}>{localizedUiText.m_fea6a6784717}</Text>
            </View>
            <Text style={styles.typeText}>{item.issueType.replace(/_/g, ' ')}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.outcome}>{localizedUiText.m_dccba87a1d24 + " "}{item.closureSummary || localizedUiText.m_acd742d3fd87}</Text>
          </TouchableOpacity>)}/>
    </View>);
}

