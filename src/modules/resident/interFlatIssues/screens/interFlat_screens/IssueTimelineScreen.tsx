import { Text, View, FlatList } from "react-native";
import { useIssueTimeline } from "../../data/useIssueTimeline";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { formatResidentDateTime } from "../../../../../core/localization/dateTimeFormatters";
import { styles } from "../../styles/screens/interFlat_screens/IssueTimelineScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function IssueTimelineScreen({ route }: InterFlatScreenProps<'IssueTimeline'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { issueId } = route.params;
    const { data } = useIssueTimeline(issueId);
    return (<View style={styles.container}>
      <FlatList data={data ?? []} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<View style={styles.timelineItem}>
            <View style={styles.dotContainer}>
              <View style={styles.dot}/>
              <View style={styles.line}/>
            </View>
            <View style={styles.content}>
              <Text style={styles.timestamp}>{formatResidentDateTime(item.timestamp)}</Text>
              <Text style={styles.summary}>{item.summary}</Text>
              <Text style={styles.role}>{localizedUiText.m_cf72bcca6c26 + " "}{item.actorRole.replace(/_/g, ' ')}</Text>
            </View>
          </View>)}/>
    </View>);
}

