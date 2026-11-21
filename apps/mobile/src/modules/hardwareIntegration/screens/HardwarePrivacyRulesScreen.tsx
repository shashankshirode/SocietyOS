import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { styles } from "../styles/screens/HardwarePrivacyRulesScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function HardwarePrivacyRulesScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const rules = [
        { title: String(localizedUiText.m_ace6b42e363b), desc: getActiveUiLiteral("m_9ba7f06813c6") },
        { title: String(localizedUiText.m_89683de8d23b), desc: getActiveUiLiteral("m_c69a53c1bbd2") },
        { title: String(localizedUiText.m_cfc012650e90), desc: getActiveUiLiteral("m_8fd13530ce34") },
        { title: String(localizedUiText.m_ca22f783037c), desc: getActiveUiLiteral("m_fab6e3659b67") },
    ];
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_99023b9a97b3}</Text>
          <View style={styles.viewWidth}/>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {rules.map((r, idx) => (<View key={idx} style={styles.card}>
              <Text style={styles.cardTitle}>{r.title}</Text>
              <Text style={styles.cardDesc}>{r.desc}</Text>
            </View>))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

