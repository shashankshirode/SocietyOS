import { Text, View, FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useSafetyInstructions } from "../../data/useSafetyInstructions";
import { LoadingState } from "../../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { SafetyInstructionCard } from "../../components/SafetyInstructionCard";
import { styles } from "../../styles/screens/safety_screens/SafetyInstructionsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'SafetyInstructions'>;
export function SafetyInstructionsScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useSafetyInstructions();
    if (isLoading)
        return <LoadingState message={localizedUiText.m_62df1ab69598}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ScreenContainer style={styles.container}>
      <FlatList data={data} keyExtractor={item => item.id} contentContainerStyle={styles.scroll} renderItem={({ item }) => (<SafetyInstructionCard instruction={item} onPress={() => {
                alert(`${item.title}\n\nSteps:\n${item.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`);
            }}/>)} ListHeaderComponent={<View style={styles.header}>
            <Text style={styles.title}>{localizedUiText.m_82a59b8890d4}</Text>
            <Text style={styles.subtitle}>{localizedUiText.m_ecc05b610eb7}</Text>
          </View>} ListEmptyComponent={<View style={styles.empty}>
            <Text style={styles.emptyText}>{localizedUiText.m_9a5a3c14404a}</Text>
          </View>}/>
    </ScreenContainer>);
}

