import { AppAlert } from "../../../../ui/modal/AppAlert";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { useUnitVehicles } from "../hooks/useUnitVehicles";
import type { UnitVehiclesScreenProps } from "../../../../app/navigation/navigation.types";
import type { Vehicle } from "../../../../shared/types/ownerTenant.types";
import { styles } from "../styles/screens/UnitVehiclesScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
export function UnitVehiclesScreen({ navigation, route }: UnitVehiclesScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { unitId } = route.params;
    const { data: vehicles = [], isLoading, error, refetch } = useUnitVehicles(unitId);
    if (isLoading)
        return <LoadingState />;
    if (error) {
        return (<ErrorState title={localizedUiText.m_7796e600e8b7} message={localizedUiText.m_4a7e45470089} onRetry={refetch}/>);
    }
    const getVehicleIcon = (type: string) => {
        switch (type) {
            case 'CAR': return 'car-outline';
            case 'TWO_WHEELER': return 'bicycle-outline';
            case 'EV': return 'flash-outline';
            case 'COMMERCIAL': return 'bus-outline';
            default: return 'car-outline';
        }
    };
    const getRfidBadgeType = (status: string) => {
        switch (status) {
            case 'READY': return 'success';
            case 'PENDING': return 'warning';
            case 'SUSPENDED': return 'danger';
            default: return 'neutral';
        }
    };
    const getStickerBadgeType = (status: string) => {
        switch (status) {
            case 'ISSUED': return 'success';
            case 'NOT_ISSUED': return 'neutral';
            case 'LOST': return 'danger';
            case 'RETURNED': return 'neutral';
            case 'EXPIRED': return 'danger';
            default: return 'neutral';
        }
    };
    const handleVehiclePress = (vehicle: Vehicle) => {
        AppAlert.alert(String(localizedUiText.m_bfea2c421f58), formatUiLiteral(String(localizedUiText.m_31d970781086), [vehicle.vehicleNumber, vehicle.type, vehicle.ownerDriverName, vehicle.stickerStatus, vehicle.rfidReadinessStatus]), [{ text: String(localizedUiText.m_565339bc4d33) }]);
    };
    const renderVehicleItem = ({ item, index }: {
        item: Vehicle;
        index: number;
    }) => {
        return (<Animated.View entering={FadeInLeft.delay(index * 40).duration(400)}>
        <AppCard style={styles.vehicleCard} onPress={() => handleVehiclePress(item)}>
          <View style={styles.cardRow}>
            <View style={styles.vehicleIconCircle}>
              <Ionicons name={getVehicleIcon(item.type)} size={22} color={Colors.primary}/>
            </View>

            <View style={styles.details}>
              <Text style={styles.vehicleNo}>{item.vehicleNumber}</Text>
              <Text style={styles.driverLine}>{localizedUiText.m_8bc4a5ebed89 + " "}{item.ownerDriverName}</Text>
              <Text style={styles.slotLine}>{localizedUiText.m_6ade7afbc2f3 + " "}{item.parkingSlot}</Text>
              {item.lastGateEntry ? (<Text style={styles.entryLine}>{localizedUiText.m_b89644f17ca2 + " "}{item.lastGateEntry}</Text>) : (<Text style={styles.entryLineMuted}>{localizedUiText.m_5029f19b17e0}</Text>)}
            </View>

            <View style={styles.badgesCol}>
              <StatusBadge label={formatUiLiteral(localizedUiText.m_e6a0bc303b1d, [item.rfidReadinessStatus])} type={getRfidBadgeType(item.rfidReadinessStatus)} style={styles.badge}/>
              <StatusBadge label={formatUiLiteral(localizedUiText.m_0e53135bc79a, [item.stickerStatus])} type={getStickerBadgeType(item.stickerStatus)} style={StyleSheet.flatten([styles.badge, styles.statusBadgeMarginTop])}/>
            </View>
          </View>
        </AppCard>
      </Animated.View>);
    };
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_b326854f0c77} showBack onBack={() => navigation.goBack()}/>
      <FlatList data={vehicles} renderItem={renderVehicleItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_b368c4e19017} description={localizedUiText.m_c3a8fe868c7c} iconName="car-outline"/>}/>
    </SafeAreaView>);
}

