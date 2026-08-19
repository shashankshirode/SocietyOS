import { FlatList, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusBadge, getParkingBadgeType } from "../../../../shared/components/StatusBadge";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { formatResidentDateTime } from "../../../../core/localization/dateTimeFormatters";
import { formatCurrency } from "../../../../shared/utils/formatters";
import { useParkingViolations } from "../data/useParkingViolations";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import type { ParkingViolation } from "../../../../shared/types/parking.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3 } from "../styles/screens/ParkingViolationHistoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type ParkingViolationHistoryProps = {
    route?: {
        params?: {
            unitId?: string;
        };
    };
};
export function ParkingViolationHistoryScreen({ route }: ParkingViolationHistoryProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { activeContext } = useActiveResidentHome();
    const { data: violations = [], isLoading, error, refetch } = useParkingViolations(route?.params?.unitId ?? activeContext.unitId);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_60bc6e3e9fdf} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    const renderItem = ({ item }: {
        item: ParkingViolation;
    }) => (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
      <View style={styles.headerRow}>
        <View style={[styles.icon, createViewBackgroundColorStyle(item.isRepeatOffence ? theme.surfaceRaised : theme.accentSoft)]}>
          <Ionicons name="warning-outline" size={20} color={item.isRepeatOffence ? theme.danger : theme.accent}/>
        </View>
        <View style={styles.heading}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{item.violationType.replaceAll('_', ' ')}</SafeText>
          <SafeText variant="tiny" color="secondary">{item.violationNumber} · {item.vehicleNumber}</SafeText>
        </View>
        <StatusBadge label={item.status.replaceAll('_', ' ')} type={getParkingBadgeType(item.status)}/>
      </View>
      <View style={[styles.divider, createViewBackgroundColorStyle2(theme.border)]}/>
      <SafeText variant="caption" color="secondary">{item.details}</SafeText>
      <SafeText variant="tiny" color="muted">{item.location} · {formatResidentDateTime(item.dateTime)}</SafeText>
      <View style={styles.footerRow}>
        {item.penaltyAmount ? (<SafeText variant="caption" style={createSafeTextColorStyle2(theme.warning)}>{localizedUiText.m_a31b82cf67a8 + " "}{formatCurrency(item.penaltyAmount)}</SafeText>) : <View />}
        {item.isRepeatOffence ? <SafeText variant="tiny" style={createSafeTextColorStyle3(theme.danger)}>{localizedUiText.m_f24307028a3a}</SafeText> : null}
      </View>
    </View>);
    return (<View style={[styles.root, createViewBackgroundColorStyle3(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_e8b94c291288} showBackButton/>
      <FlatList data={violations} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.content} refreshing={false} onRefresh={() => void refetch()} ListEmptyComponent={<EmptyState title={localizedUiText.m_10ac95330c03} description={localizedUiText.m_f23b96e99c33} iconName="checkmark-circle-outline"/>}/>
    </View>);
}

