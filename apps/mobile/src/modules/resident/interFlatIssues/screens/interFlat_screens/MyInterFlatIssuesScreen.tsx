import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useMyInterFlatIssues } from "../../data/useMyInterFlatIssues";
import { StatusBadge } from "../../../../../shared/components/StatusBadge";
import { formatResidentDate } from "../../../../../core/localization/dateTimeFormatters";
import { styles } from "../../styles/screens/interFlat_screens/MyInterFlatIssuesScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function MyInterFlatIssuesScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useMyInterFlatIssues();
    return (<View style={styles.container}>
      <FlatList data={data} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} ListEmptyComponent={<View style={styles.empty}>
            <Text style={styles.emptyText}>{localizedUiText.m_d983dfe146ef}</Text>
          </View>} renderItem={({ item }) => (<TouchableOpacity style={styles.card} onPress={() => navigation.navigate('InterFlatIssueDetail', { issueId: item.id })}>
            <View style={styles.cardHeader}>
              <Text style={styles.issueNum}>{item.issueNumber}</Text>
              <StatusBadge status={item.status} moduleType="complaint"/>
            </View>
            <Text style={styles.typeText}>{item.issueType.replace(/_/g, ' ')}</Text>
            <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
            <View style={styles.footer}>
              <Text style={styles.flatText}>{localizedUiText.m_89178413aa0e + " "}{item.reporterFlat}{" " + localizedUiText.m_30fb40f09926 + " "}{item.involvedFlat}</Text>
              <Text style={styles.date}>{formatResidentDate(item.createdAt)}</Text>
            </View>
          </TouchableOpacity>)}/>
    </View>);
}

