import { FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton } from "../../../shared/components/AppButton";
import { AppCard } from "../../../shared/cards/AppCard";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { StatusBadge, getParkingBadgeType } from "../../../shared/components/StatusBadge";
import type { FacilityOpsStackParamList } from "../../../app/navigation/navigation.types";
import { DetailRow, labelize, ParkingScreen, WarningText } from "../../resident/parking/components/ParkingUi";
import { useAmcRenewalReminders, useMarkAmcRenewalStarted, useMarkAmcRenewed } from "../data/useAmcRenewalReminders";
import { styles } from "../styles/screens/AmcRenewalRemindersScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'AmcRenewalReminders'>;
export function AmcRenewalRemindersScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data = [], isLoading, error, refetch } = useAmcRenewalReminders();
    const started = useMarkAmcRenewalStarted();
    const renewed = useMarkAmcRenewed();
    if (isLoading)
        return <LoadingState message={localizedUiText.m_ccea3306696b} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ParkingScreen title={localizedUiText.m_fe940f09d9f1} subtitle={localizedUiText.m_7d18b0c670c6} onBack={navigation.goBack}>
      <WarningText>{localizedUiText.m_88b6b90c50f8}</WarningText>
      <FlatList data={data} keyExtractor={(item) => item.id} scrollEnabled={false} renderItem={({ item }) => (<AppCard style={styles.appCardMarginBottom}>
          <StatusBadge label={labelize(item.status)} type={getParkingBadgeType(item.status)}/>
          <DetailRow label={localizedUiText.m_a6f5b0e592fa} value={item.contractNumber}/>
          <DetailRow label={localizedUiText.m_f8aa82b42d07} value={item.vendorName}/>
          <DetailRow label={localizedUiText.m_6956d81401b8} value={item.expiryDate}/>
          <DetailRow label={localizedUiText.m_d5b090546f00} value={`${item.daysRemaining}`}/>
          <DetailRow label={localizedUiText.m_d60dbba07922} value={labelize(item.priority)}/>
          <DetailRow label={localizedUiText.m_bc110a6d0722} value={item.responsiblePerson}/>
          <DetailRow label={localizedUiText.m_0dca77303dd3} value={item.lastReminderDate}/>
          <AppButton title={localizedUiText.m_98d6c7a83b18} onPress={async () => { await started.submit(item.contractId); await refetch(); }} variant="secondary" compact/>
          <AppButton title={localizedUiText.m_adedd119133f} onPress={async () => { await renewed.submit(item.contractId); await refetch(); }} variant="ghost" compact/>
        </AppCard>)}/>
    </ParkingScreen>);
}

