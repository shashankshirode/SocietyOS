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
import { useInventory } from "../data/useInventory";
import { styles } from "../styles/screens/InventoryListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'InventoryList'>;
export function InventoryListScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [query, setQuery] = React.useState('');
    const { data = [], isLoading, error, refetch } = useInventory({ query });
    if (isLoading)
        return <LoadingState message={localizedUiText.m_e8fe42eae91c} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ParkingScreen title={localizedUiText.m_758f487fe8e9} subtitle={localizedUiText.m_377cfbec8f65} onBack={navigation.goBack}>
      <FormField label={localizedUiText.m_49c266baaaa7} value={query} onChangeText={setQuery} placeholder={localizedUiText.m_5b859d6d6be7}/>
      <FlatList data={data} keyExtractor={(item) => item.id} scrollEnabled={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_8ffb79c42aaf} description={localizedUiText.m_f1a39c35a4f5}/>} renderItem={({ item }) => (<AppCard style={styles.appCardMarginBottom}>
          <StatusBadge label={labelize(item.stockStatus)} type={getParkingBadgeType(item.stockStatus)}/>
          <DetailRow label={localizedUiText.m_652bcc3a4784} value={item.itemName}/>
          <DetailRow label={localizedUiText.m_292c06f0045a} value={labelize(item.category)}/>
          <DetailRow label={localizedUiText.m_fcc12ef3c413} value={`${item.currentStock} ${item.unit}`}/>
          <DetailRow label={localizedUiText.m_84f85bc06804} value={`${item.minimumStockLevel} ${item.unit}`}/>
          <DetailRow label={localizedUiText.m_15b61974b270} value={item.location}/>
          <DetailRow label={localizedUiText.m_a8fffa683d5c} value={item.lastIssuedDate}/>
          <DetailRow label={localizedUiText.m_2227db2ff988} value={item.lastPurchasedDate}/>
          <AppButton title={localizedUiText.m_297e13e8d706} onPress={() => navigation.navigate('InventoryTransaction', { itemId: item.id })} variant="secondary" compact/>
        </AppCard>)}/>
      <AppButton title={localizedUiText.m_eac9b508cf93} onPress={() => navigation.navigate('PurchaseRequest')} variant="ghost"/>
    </ParkingScreen>);
}

