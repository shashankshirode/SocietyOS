import { FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton } from "../../../shared/components/AppButton";
import { AppCard } from "../../../shared/cards/AppCard";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { StatusBadge, getParkingBadgeType } from "../../../shared/components/StatusBadge";
import type { FacilityOpsStackParamList } from "../../../app/navigation/navigation.types";
import { DetailRow, labelize, ParkingScreen } from "../../resident/parking/components/ParkingUi";
import { usePreventiveMaintenance } from "../data/usePreventiveMaintenance";
import { styles } from "../styles/screens/PreventiveMaintenanceScheduleScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'PreventiveMaintenanceSchedule'>;
export function PreventiveMaintenanceScheduleScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data = [], isLoading, error, refetch } = usePreventiveMaintenance();
    if (isLoading)
        return <LoadingState message={localizedUiText.m_6cec8e4ef734} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ParkingScreen title={localizedUiText.m_d2d0a1a92348} subtitle={localizedUiText.m_f31a01f99bd3} onBack={navigation.goBack}>
      <FlatList data={data} keyExtractor={(item) => item.id} scrollEnabled={false} renderItem={({ item }) => (<AppCard style={styles.appCardMarginBottom}>
          <StatusBadge label={labelize(item.status)} type={getParkingBadgeType(item.status)}/>
          <DetailRow label={localizedUiText.m_f4830a1dae29} value={item.scheduleNumber}/>
          <DetailRow label={localizedUiText.m_80d298c9f240} value={item.assetName}/>
          <DetailRow label={localizedUiText.m_f8aa82b42d07} value={item.vendorName}/>
          <DetailRow label={localizedUiText.m_fb6f7c93e6bf} value={`${item.plannedDate} ${item.plannedTime}`}/>
          <DetailRow label={localizedUiText.m_16b6668d9831} value={labelize(item.frequency)}/>
          <DetailRow label={localizedUiText.m_8191888dd97c} value={item.assignedTo}/>
          <DetailRow label={localizedUiText.m_919d8b74c781} value={`${item.lastCompletedDate} / ${item.nextDueDate}`}/>
          <AppButton title={localizedUiText.m_ade7e3bc2adc} onPress={() => navigation.navigate('CreateWorkOrder', { assetId: item.assetId })} variant="secondary" compact/>
        </AppCard>)}/>
    </ParkingScreen>);
}

