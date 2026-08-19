import { FlatList, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { CctvPrivacyNotice } from "../components/CctvPrivacyNotice";
import { useCctvCameraRegistry } from "../hooks/useCctvCameraRegistry";
import { styles } from "../styles/screens/CctvCameraRegistryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function CctvCameraRegistryScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: cameras, isLoading } = useCctvCameraRegistry();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_f55c458dfe2b}</Text>
          <View style={styles.viewWidth}/>
        </View>

        <View style={styles.viewPaddingHorizontal}>
          <CctvPrivacyNotice />
        </View>

        {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_fe5939c6591f}</Text>) : (<FlatList data={cameras} keyExtractor={item => item.id} renderItem={({ item }) => (<View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.name}>{item.name}</Text>
                  <StatusBadge moduleType="hardware" status={item.status}/>
                </View>
                <Text style={styles.text}>{localizedUiText.m_5f09e1f74a6d + " "}{item.deviceCode}{" " + localizedUiText.m_a6f0aff5052a + " "}{item.location}</Text>
                <Text style={styles.text}>{localizedUiText.m_c79fb7487ef4 + " "}{item.coverageArea}</Text>
                <Text style={styles.text}>{localizedUiText.m_0d020899a161 + " "}{item.accessLevel.replace(/_/g, ' ')}</Text>
              </View>)} contentContainerStyle={styles.list}/>)}
      </SafeAreaView>
    </ScreenContainer>);
}

