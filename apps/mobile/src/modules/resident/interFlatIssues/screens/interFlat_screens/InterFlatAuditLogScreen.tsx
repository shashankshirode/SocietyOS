import { Text, View, FlatList } from "react-native";
import { useInterFlatAuditLogs } from "../../data/useInterFlatAuditLogs";
import { styles } from "../../styles/screens/interFlat_screens/InterFlatAuditLogScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function InterFlatAuditLogScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useInterFlatAuditLogs();
    return (<View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_f6f9dba711cb}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_4087dee4d1d1}</Text>
      </View>

      <FlatList data={data ?? []} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.eventName}>{item.eventName}</Text>
              <Text style={styles.time}>{new Date(item.timestamp).toLocaleString()}</Text>
            </View>
            <Text style={styles.details}>{item.details}</Text>
            <Text style={styles.ref}>{localizedUiText.m_823960a09c43 + " "}{item.entityReference}{" " + localizedUiText.m_86524a1e795f + " "}{item.actorName} ({item.actorRole})</Text>
          </View>)}/>
    </View>);
}

