import React from "react";
import { FlatList, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppCard } from "../../../shared/cards/AppCard";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { FormField } from "../../../shared/forms/FormField";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { StatusBadge, getParkingBadgeType } from "../../../shared/components/StatusBadge";
import type { FacilityOpsStackParamList } from "../../../app/navigation/navigation.types";
import type { Vendor } from "../../../shared/types/vendor.types";
import { DetailRow, labelize, ParkingScreen } from "../../resident/parking/components/ParkingUi";
import { useVendors } from "../data/useVendors";
import { styles } from "../styles/screens/VendorDirectoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'VendorDirectory'>;
export function VendorDirectoryScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [query, setQuery] = React.useState('');
    const { data = [], isLoading, error, refetch } = useVendors({ query });
    if (isLoading)
        return <LoadingState message={localizedUiText.m_91e56c29c92d} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ParkingScreen title={localizedUiText.m_a6def7eea0ce} subtitle={localizedUiText.m_73cf2038166b} onBack={navigation.goBack}>
      <FormField label={localizedUiText.m_49c266baaaa7} value={query} onChangeText={setQuery} placeholder={localizedUiText.m_46691af51d7c}/>
      <FlatList data={data} keyExtractor={(item) => item.id} scrollEnabled={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_753f14140c27} description={localizedUiText.m_8e54861ca762}/>} renderItem={({ item }) => <VendorCard vendor={item} onPress={() => navigation.navigate('VendorDetail', { vendorId: item.id })}/>}/>
    </ParkingScreen>);
}
function VendorCard({ vendor, onPress }: {
    vendor: Vendor;
    onPress: () => void;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard style={styles.card} onPress={onPress}>
      <View style={styles.header}><View style={styles.titleBlock}><Text style={styles.title}>{vendor.name}</Text><Text style={styles.meta}>{labelize(vendor.category)} · {vendor.contactPerson}</Text></View><StatusBadge label={labelize(vendor.contractStatus)} type={getParkingBadgeType(vendor.contractStatus)}/></View>
      <DetailRow label={localizedUiText.m_63dceb8800b2} value={vendor.maskedPhone}/>
      <DetailRow label={localizedUiText.m_969ccbd3cf63} value={vendor.maskedEmail}/>
      <DetailRow label={localizedUiText.m_4a109cc49467} value={labelize(vendor.complianceStatus)}/>
      <DetailRow label={localizedUiText.m_c4aa7aefd5f5} value={`${vendor.activeAmcCount}`}/>
      <DetailRow label={localizedUiText.m_5a560fce99d4} value={`${vendor.openWorkOrders}`}/>
      <DetailRow label={localizedUiText.m_38e5a46cbc5a} value={`${vendor.rating.toFixed(1)} / 5`}/>
      <DetailRow label={localizedUiText.m_27d4d70e3d4b} value={vendor.lastServiceDate} isLast/>
    </AppCard>);
}

