import React from "react";
import { FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppCard } from "../../../shared/cards/AppCard";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { FormField } from "../../../shared/forms/FormField";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { StatusBadge, getParkingBadgeType } from "../../../shared/components/StatusBadge";
import type { FacilityOpsStackParamList } from "../../../app/navigation/navigation.types";
import { DetailRow, labelize, ParkingScreen } from "../../resident/parking/components/ParkingUi";
import { useAmcContracts } from "../data/useAmcContracts";
import { styles } from "../styles/screens/AmcContractListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'AmcContractList'>;
export function AmcContractListScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [query, setQuery] = React.useState('');
    const { data = [], isLoading, error, refetch } = useAmcContracts({ query });
    if (isLoading)
        return <LoadingState message={localizedUiText.m_dbcd39cb03f0} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ParkingScreen title={localizedUiText.m_18a8fe5ca0f1} subtitle={localizedUiText.m_6d19f35ff885} onBack={navigation.goBack}>
      <FormField label={localizedUiText.m_49c266baaaa7} value={query} onChangeText={setQuery} placeholder={localizedUiText.m_188397895e84}/>
      <FlatList data={data} keyExtractor={(item) => item.id} scrollEnabled={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_b529280a7c44} description={localizedUiText.m_f464112df088}/>} renderItem={({ item }) => (<AppCard style={styles.appCardMarginBottom} onPress={() => navigation.navigate('AmcContractDetail', { contractId: item.id })}>
          <StatusBadge label={labelize(item.status)} type={getParkingBadgeType(item.status)}/>
          <DetailRow label={localizedUiText.m_a6f5b0e592fa} value={item.contractNumber}/>
          <DetailRow label={localizedUiText.m_f8aa82b42d07} value={item.vendorName}/>
          <DetailRow label={localizedUiText.m_292c06f0045a} value={labelize(item.category)}/>
          <DetailRow label={localizedUiText.m_14303aa0c4a0} value={item.endDate}/>
          <DetailRow label={localizedUiText.m_43eda89d4d31} value={`${item.renewalDueInDays} days`}/>
          <DetailRow label={localizedUiText.m_8e37953d23da} value={`Rs. ${item.contractAmount}`}/>
          <DetailRow label={localizedUiText.m_b8f1ef8dbd6d} value={item.nextServiceDate} isLast/>
        </AppCard>)}/>
    </ParkingScreen>);
}

