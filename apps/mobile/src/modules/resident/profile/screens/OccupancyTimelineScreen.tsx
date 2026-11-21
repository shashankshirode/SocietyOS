import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { WarningBanner } from "../../../../shared/feedback/WarningBanner";
import { StatusBadge, getTimelineEventStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { useOccupancyTimeline } from "../hooks/useOccupancyTimeline";
import type { OccupancyTimelineScreenProps } from "../../../../app/navigation/navigation.types";
import type { OccupancyTimelineEvent } from "../../../../shared/types/occupancy.types";
import { formatResidentDateTime } from "../../../../core/localization/dateTimeFormatters";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { styles, createViewBorderColorStyle } from "../styles/screens/OccupancyTimelineScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function OccupancyTimelineScreen({ navigation, route }: OccupancyTimelineScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { unitId } = route.params;
    const { data: events = [], isLoading, error, refetch } = useOccupancyTimeline(unitId);
    if (isLoading)
        return <LoadingState />;
    if (error) {
        return (<ErrorState title={localizedUiText.m_01fb75483b31} message={localizedUiText.m_87a4d6061315} onRetry={refetch}/>);
    }
    const getEventIcon = (type: string) => {
        switch (type) {
            case 'OWNERSHIP_STARTED': return 'key-outline';
            case 'TENANT_MOVE_IN': return 'home-outline';
            case 'TENANT_PV_COMPLETED': return 'shield-checkmark-outline';
            case 'VEHICLE_ADDED': return 'car-outline';
            case 'NOC_REQUESTED': return 'document-text-outline';
            case 'MOVE_OUT_REQUESTED': return 'exit-outline';
            case 'DUES_CLEARED': return 'receipt-outline';
            case 'NOC_GENERATED': return 'checkmark-circle-outline';
            case 'ACCESS_REVOKED': return 'lock-closed-outline';
            default: return 'ellipse-outline';
        }
    };
    const getEventColor = (type: string) => {
        if (type.includes('REVOKED') || type.includes('MOVE_OUT'))
            return Colors.danger;
        if (type.includes('COMPLETED') || type.includes('CLEARED') || type.includes('NOC_GENERATED'))
            return Colors.success;
        return Colors.primary;
    };
    const renderTimelineItem = ({ item, index }: {
        item: OccupancyTimelineEvent;
        index: number;
    }) => {
        const iconColor = getEventColor(item.eventType);
        const isLast = index === events.length - 1;
        return (<Animated.View entering={FadeInLeft.delay(index * 30).duration(400)} style={styles.itemWrapper}>
        
        {!isLast && (<View style={styles.verticalLine}/>)}

        <View style={[styles.iconCircle, createViewBorderColorStyle(iconColor)]}>
          <Ionicons name={getEventIcon(item.eventType)} size={16} color={iconColor}/>
        </View>

        <View style={styles.detailsContent}>
          <AppCard style={styles.eventCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.eventTitle}>{item.eventTitle}</Text>
                <Text style={styles.metaLine}>
                  {formatResidentDateTime(item.eventDate)}{" " + localizedUiText.m_31ef69ce2f08 + " "}{item.actorName}
                </Text>
              </View>
              <StatusBadge label={item.status} type={getTimelineEventStatusBadgeType(item.status)} style={styles.badge}/>
            </View>
            <Text style={styles.descText}>{item.description}</Text>
          </AppCard>
        </View>
      </Animated.View>);
    };
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_4b764e2f4a32} showBack onBack={() => navigation.goBack()}/>
      <View style={styles.mainContainer}>
        <WarningBanner message={localizedUiText.m_913792aa06b2} type="info" style={styles.banner}/>

        <FlatList data={events} renderItem={renderTimelineItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}/>
      </View>
    </SafeAreaView>);
}

