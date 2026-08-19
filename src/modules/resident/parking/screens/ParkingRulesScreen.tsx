import { Text } from "react-native";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { useParkingRules } from "../data/useParkingRules";
import { DetailCard, ParkingScreen } from "../components/ParkingUi";
import type { ParkingRulesScreenProps } from "../../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/ParkingRulesScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ParkingRulesScreen({ navigation }: ParkingRulesScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useParkingRules();
    if (isLoading) {
        return <LoadingState message={localizedUiText.m_8f3e931cf83d} showCardPlaceholder/>;
    }
    if (error) {
        return <ErrorState message={error.message} onRetry={refetch}/>;
    }
    if (!data) {
        return <ErrorState message={localizedUiText.m_d65ec6e549b4} onRetry={refetch}/>;
    }
    return (<ParkingScreen title={localizedUiText.m_4db1d8f78883} subtitle={localizedUiText.m_edde8ac83581} onBack={navigation.goBack}>
      <RuleSection title={localizedUiText.m_233e14bd486f} items={data.residentRules}/>
      <RuleSection title={localizedUiText.m_f820951bbe4d} items={data.visitorRules}/>
      <RuleSection title={localizedUiText.m_4a93f30687ad} items={data.evRules}/>
      <RuleSection title={localizedUiText.m_7fca85434039} items={data.wrongParkingPolicy}/>
      <RuleSection title={localizedUiText.m_24f6e226fc9f} items={data.stickerRfidRules}/>
      <RuleSection title={localizedUiText.m_3b5aa8124098} items={data.penaltyRules}/>
      <RuleSection title={localizedUiText.m_cb76a28a9044} items={[data.emergencyVehicleAccessRule]}/>
      <RuleSection title={localizedUiText.m_4f4f20331706} items={data.securityInstructions}/>
    </ParkingScreen>);
}
function RuleSection({ title, items }: {
    title: string;
    items: string[];
}) {
    return (<DetailCard title={title}>
      {items.map((item) => (<Text key={item} style={styles.textColorMarginBottom}>{item}</Text>))}
    </DetailCard>);
}

