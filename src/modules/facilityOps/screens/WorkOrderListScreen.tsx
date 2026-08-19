import React from "react";
import { FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton } from "../../../shared/components/AppButton";
import { AppCard } from "../../../shared/cards/AppCard";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { FormField } from "../../../shared/forms/FormField";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { StatusBadge, getParkingBadgeType } from "../../../shared/components/StatusBadge";
import type { FacilityOpsStackParamList } from "../../../app/navigation/navigation.types";
import { DetailRow, labelize, ParkingScreen } from "../../resident/parking/components/ParkingUi";
import { useWorkOrders } from "../data/useWorkOrders";
import { styles } from "../styles/screens/WorkOrderListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'WorkOrderList'>;
export function WorkOrderListScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [query, setQuery] = React.useState('');
    const { data = [], isLoading, error, refetch } = useWorkOrders({ query });
    if (isLoading)
        return <LoadingState message={localizedUiText.m_c8e9ab296db0} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ParkingScreen title={localizedUiText.m_079483a4f2b0} subtitle={localizedUiText.m_eeec39a7774c} onBack={navigation.goBack}>
      <FormField label={localizedUiText.m_49c266baaaa7} value={query} onChangeText={setQuery} placeholder={localizedUiText.m_b6427886a97b}/>
      <AppButton title={localizedUiText.m_c5d5bfc361bf} onPress={() => navigation.navigate('CreateWorkOrder', {})}/>
      <FlatList data={data} keyExtractor={(item) => item.id} scrollEnabled={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_c35a29805be8} description={localizedUiText.m_2e69394b1972}/>} renderItem={({ item }) => (<AppCard style={styles.appCardMarginVertical} onPress={() => navigation.navigate('WorkOrderDetail', { workOrderId: item.id })}>
          <StatusBadge label={labelize(item.status)} type={getParkingBadgeType(item.status)}/>
          <DetailRow label={localizedUiText.m_dffa6bca874e} value={item.workOrderNumber}/>
          <DetailRow label={localizedUiText.m_7e8cd2056da7} value={item.title}/>
          <DetailRow label={localizedUiText.m_baaddf70fb5d} value={labelize(item.type)}/>
          <DetailRow label={localizedUiText.m_80d298c9f240} value={item.linkedAssetName ?? getActiveUiLiteral("m_1e31d9596d67")}/>
          <DetailRow label={localizedUiText.m_f8aa82b42d07} value={item.vendorName ?? getActiveUiLiteral("m_13075c233611")}/>
          <DetailRow label={localizedUiText.m_d60dbba07922} value={labelize(item.priority)}/>
          <DetailRow label={localizedUiText.m_9ac788070834} value={`${item.dueDate} · ${item.slaStatus}`}/>
          <DetailRow label={localizedUiText.m_0e570ca6fabe} value={item.source} isLast/>
        </AppCard>)}/>
    </ParkingScreen>);
}

