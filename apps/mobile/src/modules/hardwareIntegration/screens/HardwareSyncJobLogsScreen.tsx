import { FlatList, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { HardwareSyncJobCard } from "../components/HardwareSyncJobCard";
import { useHardwareSyncJobs } from "../hooks/useHardwareSyncJobs";
import { styles } from "../styles/screens/HardwareSyncJobLogsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function HardwareSyncJobLogsScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: jobs, isLoading } = useHardwareSyncJobs();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_ecb87d29537c}</Text>
          <View style={styles.viewWidth}/>
        </View>

        {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_4b23ae6166f9}</Text>) : (<FlatList data={jobs} keyExtractor={item => item.id} renderItem={({ item }) => <HardwareSyncJobCard job={item}/>} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.empty}>{localizedUiText.m_08518c7f4b9d}</Text>}/>)}
      </SafeAreaView>
    </ScreenContainer>);
}

