import { FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppCard } from "../../../shared/cards/AppCard";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { StatusBadge, getParkingBadgeType } from "../../../shared/components/StatusBadge";
import type { FacilityOpsStackParamList } from "../../../app/navigation/navigation.types";
import { DetailRow, labelize, ParkingScreen } from "../../resident/parking/components/ParkingUi";
import { useServiceHistory } from "../data/useServiceHistory";
import { styles } from "../styles/screens/ServiceHistoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'ServiceHistory'>;
export function ServiceHistoryScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data = [], isLoading, error, refetch } = useServiceHistory();
    if (isLoading)
        return <LoadingState message={localizedUiText.m_a1a80b6c3f8f} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ParkingScreen title={localizedUiText.m_8b0adc9c9815} subtitle={localizedUiText.m_fcdb52f1ae9e} onBack={navigation.goBack}>
      <FlatList data={data} keyExtractor={(item) => item.id} scrollEnabled={false} renderItem={({ item }) => (<AppCard style={styles.appCardMarginBottom}>
          <StatusBadge label={labelize(item.status)} type={getParkingBadgeType(item.status)}/>
          <DetailRow label={localizedUiText.m_99c40ab40592} value={item.serviceDate}/>
          <DetailRow label={localizedUiText.m_80d298c9f240} value={item.assetName}/>
          <DetailRow label={localizedUiText.m_f8aa82b42d07} value={item.vendorName}/>
          <DetailRow label={localizedUiText.m_ce02285cc14e} value={item.workOrderNumber}/>
          <DetailRow label={localizedUiText.m_5844e6bad41d} value={labelize(item.serviceType)}/>
          <DetailRow label={localizedUiText.m_204a5eb2cd28} value={item.costPlaceholder}/>
          <DetailRow label={localizedUiText.m_9041ccc41723} value={item.technician}/>
          <DetailRow label={localizedUiText.m_e171c2ff25b5} value={item.findings}/>
          <DetailRow label={localizedUiText.m_365987d015f7} value={item.nextAction}/>
          <DetailRow label={localizedUiText.m_b6ce788d9786} value={item.reportPlaceholder} isLast/>
        </AppCard>)}/>
    </ParkingScreen>);
}

