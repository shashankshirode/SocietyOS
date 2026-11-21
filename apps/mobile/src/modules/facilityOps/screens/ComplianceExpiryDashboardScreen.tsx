import { FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppCard } from "../../../shared/cards/AppCard";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { StatusBadge, getParkingBadgeType } from "../../../shared/components/StatusBadge";
import type { FacilityOpsStackParamList } from "../../../app/navigation/navigation.types";
import { DetailRow, labelize, ParkingScreen, WarningText } from "../../resident/parking/components/ParkingUi";
import { useComplianceExpiry } from "../data/useComplianceExpiry";
import { styles } from "../styles/screens/ComplianceExpiryDashboardScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'ComplianceExpiryDashboard'>;
export function ComplianceExpiryDashboardScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data = [], isLoading, error, refetch } = useComplianceExpiry();
    if (isLoading)
        return <LoadingState message={localizedUiText.m_7dc26303658d} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ParkingScreen title={localizedUiText.m_bdb1dd8b5196} subtitle={localizedUiText.m_73b82747a925} onBack={navigation.goBack}>
      <WarningText>{localizedUiText.m_7361ce6ab146}</WarningText>
      <FlatList data={data} keyExtractor={(item) => item.id} scrollEnabled={false} renderItem={({ item }) => (<AppCard style={styles.appCardMarginBottom}>
          <StatusBadge label={labelize(item.status)} type={getParkingBadgeType(item.status)}/>
          <DetailRow label={localizedUiText.m_d6bd8c0aeee8} value={item.documentName}/>
          <DetailRow label={localizedUiText.m_9f4920c364ab} value={item.linkedEntity}/>
          <DetailRow label={localizedUiText.m_70a46a7ef904} value={item.expiryDate}/>
          <DetailRow label={localizedUiText.m_d5b090546f00} value={`${item.daysRemaining}`}/>
          <DetailRow label={localizedUiText.m_bc110a6d0722} value={item.responsiblePerson}/>
          <DetailRow label={localizedUiText.m_64cff1319d2f} value="View / create reminder placeholder" isLast/>
        </AppCard>)}/>
    </ParkingScreen>);
}

