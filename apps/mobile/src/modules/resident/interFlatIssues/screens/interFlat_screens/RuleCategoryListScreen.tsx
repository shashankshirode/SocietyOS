import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRuleCategories } from "../../data/useRuleCategories";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { styles } from "../../styles/screens/interFlat_screens/RuleCategoryListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function RuleCategoryListScreen({ navigation }: InterFlatScreenProps<'RuleCategoryList'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useRuleCategories();
    return (<View style={styles.container}>
      <FlatList data={data ?? []} keyExtractor={(item) => item.name} contentContainerStyle={styles.list} renderItem={({ item }) => (<TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RuleLibrary', { category: item.name })}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.count}>{item.count}{" " + localizedUiText.m_6afd55043943 + " "}{item.pending}{" " + localizedUiText.m_331551b0de41}</Text>
            <Text style={styles.date}>{localizedUiText.m_d621a996258e + " "}{item.lastUpdated}</Text>
          </TouchableOpacity>)}/>
    </View>);
}

