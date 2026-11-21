import { View, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../shared/components/SafeText";
import { getFacilityImage } from "../media/facilityImageRegistry";
import type { Facility } from "../../../../shared/types/facility.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorStyle, createPressableBackgroundColorBorderColorSpread3Style } from "../styles/components/FacilityCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
export interface FacilityCardProps {
    facility: Facility;
    onPress: () => void;
}
export function FacilityCard({ facility, onPress }: FacilityCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors, shadows } = useAppTheme();
    const imageInfo = getFacilityImage(facility.name);
    const getStatusColor = () => {
        switch (facility.status) {
            case 'AVAILABLE':
                return colors.success;
            case 'PARTIALLY_AVAILABLE':
                return colors.warning;
            case 'UNDER_MAINTENANCE':
                return colors.danger;
            default:
                return colors.textSecondary;
        }
    };
    return (<Pressable onPress={onPress} style={[
            styles.card,
            createPressableBackgroundColorBorderColorSpread3Style(colors.surface, colors.border, shadows.soft),
        ]} accessibilityRole="button" accessibilityLabel={formatUiLiteral(localizedUiText.m_2bf65d9f446a, [facility.name, facility.status])}>
      <Image source={{ uri: imageInfo.url }} style={styles.image} accessibilityLabel={imageInfo.accessibilityLabel}/>
      <View style={styles.content}>
        <View style={styles.header}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)}>
            {facility.name}
          </SafeText>
          <View style={[styles.statusBadge, createViewBackgroundColorStyle(`${getStatusColor()}15`)]}>
            <SafeText variant="tiny" style={createSafeTextColorStyle2(getStatusColor())}>
              {facility.status.replace('_', ' ')}
            </SafeText>
          </View>
        </View>

        <SafeText variant="caption" numberOfLines={2} style={createSafeTextColorStyle3(colors.textSecondary)}>
          {facility.availabilityToday}
        </SafeText>

        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={14} color={colors.textSecondary}/>
            <SafeText variant="tiny" style={createSafeTextColorStyle4(colors.textSecondary)}>{localizedUiText.m_ef2840cc402e}{facility.capacity}{localizedUiText.m_327fb97d65cd}</SafeText>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={14} color={colors.textSecondary}/>
            <SafeText variant="tiny" style={createSafeTextColorStyle5(colors.textSecondary)}>
              {facility.chargeAmount > 0 ? formatUiLiteral(localizedUiText.m_4908340d8a96, [facility.chargeAmount]) : localizedUiText.m_f411a1fb6275}
            </SafeText>
          </View>
        </View>
      </View>
    </Pressable>);
}
export default FacilityCard;

