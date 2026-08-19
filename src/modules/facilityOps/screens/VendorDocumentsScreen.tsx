import { FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton } from "../../../shared/components/AppButton";
import { AppCard } from "../../../shared/cards/AppCard";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { StatusBadge, getParkingBadgeType } from "../../../shared/components/StatusBadge";
import type { FacilityOpsStackParamList } from "../../../app/navigation/navigation.types";
import { DetailRow, labelize, ParkingScreen, WarningText } from "../../resident/parking/components/ParkingUi";
import { useVendorDocuments } from "../data/useVendorDocuments";
import { styles } from "../styles/screens/VendorDocumentsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'VendorDocuments'>;
export function VendorDocumentsScreen({ navigation, route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data = [], isLoading, error, refetch } = useVendorDocuments(route.params.vendorId);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_825888533133} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ParkingScreen title={localizedUiText.m_7bdbd584dcaa} subtitle={localizedUiText.m_131be51c9f60} onBack={navigation.goBack}>
      <WarningText>{localizedUiText.m_c2f7351865ed}</WarningText>
      <FlatList data={data} keyExtractor={(item) => item.id} scrollEnabled={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_d36a9d93a116} description={localizedUiText.m_f442493454bb}/>} renderItem={({ item }) => (<AppCard style={styles.appCardMarginBottom}>
          <StatusBadge label={labelize(item.status)} type={getParkingBadgeType(item.status)}/>
          <DetailRow label={localizedUiText.m_d6bd8c0aeee8} value={item.documentName}/>
          <DetailRow label={localizedUiText.m_baaddf70fb5d} value={item.documentType}/>
          <DetailRow label={localizedUiText.m_6956d81401b8} value={item.expiryDate ?? getActiveUiLiteral("m_5237c96ac1a2")}/>
          <DetailRow label={localizedUiText.m_3cc3767e7032} value={item.uploadedDate ?? getActiveUiLiteral("m_da13a43b46b9")}/>
          <DetailRow label={localizedUiText.m_eb889342e78a} value={item.verifiedBy ?? 'Pending'}/>
          <DetailRow label={localizedUiText.m_ebb57a260d58} value={item.sensitivity}/>
          <AppButton title={localizedUiText.m_cb5fda85c56b} onPress={() => undefined} variant="ghost" compact/>
        </AppCard>)}/>
      <AppButton title={localizedUiText.m_ebf100d2d372} onPress={() => undefined} variant="secondary"/>
      <AppButton title={localizedUiText.m_6852292495ca} onPress={() => undefined} variant="ghost"/>
    </ParkingScreen>);
}

