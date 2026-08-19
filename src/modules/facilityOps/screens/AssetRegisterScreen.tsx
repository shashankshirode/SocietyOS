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
import { useAssets } from "../data/useAssets";
import { styles } from "../styles/screens/AssetRegisterScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'AssetRegister'>;
export function AssetRegisterScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [query, setQuery] = React.useState('');
    const { data = [], isLoading, error, refetch } = useAssets({ query });
    if (isLoading)
        return <LoadingState message={localizedUiText.m_133f76536add} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ParkingScreen title={localizedUiText.m_516ca51864c3} subtitle={localizedUiText.m_b6017bc39ded} onBack={navigation.goBack}>
      <FormField label={localizedUiText.m_49c266baaaa7} value={query} onChangeText={setQuery} placeholder={localizedUiText.m_2717b373101d}/>
      <FlatList data={data} keyExtractor={(item) => item.id} scrollEnabled={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_425899359c19} description={localizedUiText.m_b71c04e02395}/>} renderItem={({ item }) => (<AppCard style={styles.appCardMarginBottom} onPress={() => navigation.navigate('AssetDetail', { assetId: item.id })}>
          <StatusBadge label={labelize(item.status)} type={getParkingBadgeType(item.status)}/>
          <DetailRow label={localizedUiText.m_80d298c9f240} value={`${item.assetName} · ${item.assetCode}`}/>
          <DetailRow label={localizedUiText.m_292c06f0045a} value={labelize(item.category)}/>
          <DetailRow label={localizedUiText.m_15b61974b270} value={item.location}/>
          <DetailRow label={localizedUiText.m_00f6262604fa} value={labelize(item.amcStatus)}/>
          <DetailRow label={localizedUiText.m_4b721747570a} value={item.warrantyStatus}/>
          <DetailRow label={localizedUiText.m_69ab8f75b2a2} value={`${item.lastServiceDate} / ${item.nextServiceDate}`}/>
          <DetailRow label={localizedUiText.m_9c5b17d85544} value={`${item.healthScore}% / ${item.openWorkOrders}`} isLast/>
        </AppCard>)}/>
    </ParkingScreen>);
}

