import { FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppCard } from "../../../shared/cards/AppCard";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { StatusBadge, getParkingBadgeType } from "../../../shared/components/StatusBadge";
import type { FacilityOpsStackParamList } from "../../../app/navigation/navigation.types";
import { DetailRow, labelize, ParkingScreen, WarningText } from "../../resident/parking/components/ParkingUi";
import { useAssetDocuments } from "../data/useAssetDocuments";
import { styles } from "../styles/screens/AssetDocumentsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'AssetDocuments'>;
export function AssetDocumentsScreen({ navigation, route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data = [], isLoading, error, refetch } = useAssetDocuments(route.params.assetId);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_c5d69384479c} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ParkingScreen title={localizedUiText.m_cc184cd5db22} subtitle={localizedUiText.m_055447140218} onBack={navigation.goBack}>
      <WarningText>{localizedUiText.m_49e1265c471f}</WarningText>
      <FlatList data={data} keyExtractor={(item) => item.id} scrollEnabled={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_d36a9d93a116} description={localizedUiText.m_dae7fb3d6ffd}/>} renderItem={({ item }) => (<AppCard style={styles.appCardMarginBottom}>
          <StatusBadge label={labelize(item.status)} type={getParkingBadgeType(item.status)}/>
          <DetailRow label={localizedUiText.m_d6bd8c0aeee8} value={item.documentName}/>
          <DetailRow label={localizedUiText.m_baaddf70fb5d} value={item.documentType}/>
          <DetailRow label={localizedUiText.m_6956d81401b8} value={item.expiryDate ?? getActiveUiLiteral("m_5237c96ac1a2")}/>
          <DetailRow label={localizedUiText.m_3cc3767e7032} value={item.uploadedDate ?? getActiveUiLiteral("m_da13a43b46b9")}/>
          <DetailRow label={localizedUiText.m_eb889342e78a} value={item.verifiedBy ?? 'Pending'} isLast/>
        </AppCard>)}/>
    </ParkingScreen>);
}

