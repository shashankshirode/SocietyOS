import { FlatList, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { AppCard } from "../../../shared/cards/AppCard";
import { useDeviceLocationMapping } from "../hooks/useDeviceLocationMapping";
import { styles } from "../styles/screens/DeviceLocationMappingScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function DeviceLocationMappingScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: mappings, isLoading } = useDeviceLocationMapping();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_f9dd8a3b3727}</Text>
          <View style={styles.viewWidth}/>
        </View>

        {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_b3d14f9e2a5c}</Text>) : (<FlatList data={mappings} keyExtractor={item => item.id} renderItem={({ item }) => (<AppCard style={styles.card}>
                <Text style={styles.deviceName}>{item.deviceName}</Text>
                <Text style={styles.text}>{localizedUiText.m_bbdffe25dc7d + " "}{item.location}</Text>
                <Text style={styles.text}>{localizedUiText.m_c91327e81fc3 + " "}{item.accessZone}</Text>
                <Text style={styles.text}>{localizedUiText.m_c61918927b7e + " "}{item.responsibleRole}</Text>
              </AppCard>)} contentContainerStyle={styles.list}/>)}
      </SafeAreaView>
    </ScreenContainer>);
}

