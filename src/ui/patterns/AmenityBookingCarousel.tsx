import { Pressable, ScrollView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { StatusPill, type StatusTone } from "../components/StatusPill";
import { PressableScale } from "../../shared/motion/PressableScale";
import { DashboardSectionHeader } from "../components/SectionHeader";
import type { AmenityBookingItem, AvailabilityStatus } from "../../modules/resident/dashboard/data/dashboard.types";
import { AmenityImage } from "../media/AmenityImage";
import type { AppImageAsset } from "../media/image.types";
import { useResponsiveLayout } from "../layout/useResponsiveLayout";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { residentColors } from "../../shared/theme/residentColors";
import { getRequiredItem } from "../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import type { Absent } from "../../shared/types/absence.types";
import { styles, createViewBackgroundColorBorderColorStyle, createViewSpread1Style, createViewSpread1Style2, createViewSpread1Style3 } from "./styles/AmenityBookingCarousel.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface AmenityBookingCarouselProps {
    amenities: AmenityBookingItem[];
    onAmenityPress: (id: string) => void;
    onBookPress: (id: string) => void;
    imageAssetsByAmenityId?: Record<string, AppImageAsset>;
    imageAssetsByAmenityName?: Record<string, AppImageAsset>;
    sectionTitle?: string;
    sectionSubtitle?: string;
    bookLabel?: string;
    viewAllLabel?: string;
    onViewAllPress?: () => void;
    emptyTitle?: string;
    emptyDescription?: string;
    availabilityLabels?: Partial<Record<AvailabilityStatus, string>>;
}
const defaultAvailabilityConfig: Record<AvailabilityStatus, {
    label: string;
    tone: StatusTone;
}> = {
    available: { get label() {
            return getActiveUiLiteral("m_e674447337e8");
        }, tone: 'success' },
    limited: { get label() {
            return getActiveUiLiteral("m_586d2bd8c42f");
        }, tone: 'warning' },
    closed: { get label() {
            return getActiveUiLiteral("m_c21ead0614e7");
        }, tone: 'danger' }
};
const fallbackGradients = [
    [residentColors.brandInk, residentColors.brandCobalt],
    [residentColors.darkSurface, residentColors.accentAqua],
    [residentColors.brandInk, residentColors.brandIndigo],
    [residentColors.darkElevatedSurface, residentColors.warning],
];
export function AmenityBookingCarousel({ amenities, onAmenityPress, onBookPress, imageAssetsByAmenityId, imageAssetsByAmenityName, sectionTitle = getActiveUiLiteral("m_9a4c27126ec5"), sectionSubtitle = getActiveUiLiteral("m_9e7d1e7d3fc4"), bookLabel = 'Book', viewAllLabel, onViewAllPress, emptyTitle, emptyDescription, availabilityLabels: availabilityLabelsProp, }: AmenityBookingCarouselProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { isTablet } = useResponsiveLayout();
    const { colors } = useAppTheme();
    const resolvedAvailabilityConfig = availabilityLabelsProp
        ? (Object.fromEntries((Object.keys(defaultAvailabilityConfig) as AvailabilityStatus[]).map((k) => [
            k,
            { ...defaultAvailabilityConfig[k], label: availabilityLabelsProp[k] ?? defaultAvailabilityConfig[k].label },
        ])) as Record<AvailabilityStatus, {
            label: string;
            tone: StatusTone;
        }>)
        : defaultAvailabilityConfig;
    return (<View style={styles.container}>
      <DashboardSectionHeader title={sectionTitle} subtitle={sectionSubtitle} {...includeWhenPresent("actionLabel", viewAllLabel)} {...includeWhenPresent("onActionPress", onViewAllPress)}/>

      {amenities.length === 0 ? (<View style={[styles.empty, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
          <Ionicons name="calendar-outline" size={28} color={colors.textMuted}/>
          {emptyTitle ? <SafeText variant="bodyStrong" color="primary">{emptyTitle}</SafeText> : null}
          {emptyDescription ? <SafeText variant="caption" color="muted" align="center">{emptyDescription}</SafeText> : null}
        </View>) : (<ScrollView horizontal={!isTablet} scrollEnabled={!isTablet} showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, isTablet ? styles.tabletGrid : null]} accessibilityRole="list">
        {amenities.map((amenity, index) => {
                const gradient = getRequiredItem(fallbackGradients, index % fallbackGradients.length, "AmenityBookingCarousel.tsx");
                const config = resolvedAvailabilityConfig[amenity.availabilityStatus];
                const isClosed = amenity.availabilityStatus === 'closed';
                const imageAsset: AppImageAsset | Absent = amenity.imageUri
                    ? { id: amenity.id, kind: 'remoteMock', uri: amenity.imageUri, altMessageKey: 'resident.images.fallback', usage: 'amenity' }
                    : (imageAssetsByAmenityId?.[amenity.id] ?? imageAssetsByAmenityName?.[amenity.name.toLowerCase()]);
                return (<PressableScale key={amenity.id} onPress={() => onAmenityPress(amenity.id)} accessibilityRole="button">
              <View style={[styles.card, createViewSpread1Style(includeWhenPresent("backgroundColor", gradient[0]))]}>
                {imageAsset ? (<AmenityImage asset={imageAsset} height={220} imageStyle={styles.image} fallbackStyle={styles.image}/>) : null}
                
                <View style={[styles.overlay1, createViewSpread1Style2(includeWhenPresent("backgroundColor", gradient[1]))]}/>
                <View style={[styles.decorCircle, createViewSpread1Style3(includeWhenPresent("backgroundColor", gradient[1]))]}/>
                {imageAsset ? <View style={styles.imageOverlay}/> : null}

                
                <View style={styles.cardContent}>
                  <StatusPill label={config.label} tone={config.tone} small/>

                  <View style={styles.cardCenter}>
                    <SafeText variant="title" style={styles.amenityName} numberOfLines={2}>
                      {amenity.name}
                    </SafeText>
                  </View>

                  <View style={styles.cardMeta}>
                    {amenity.nextSlotLabel ? (<View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={12} color={residentColors.lightSurface}/>
                        <SafeText variant="tiny" style={styles.nextSlotText}>{amenity.nextSlotLabel}</SafeText>
                      </View>) : null}
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={12} color={residentColors.lightSurface}/>
                      <SafeText variant="tiny" style={styles.metaText}>{amenity.timingLabel}</SafeText>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="people-outline" size={12} color={residentColors.lightSurface}/>
                      <SafeText variant="tiny" style={styles.metaText}>{amenity.capacityLabel}</SafeText>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <SafeText variant="bodyStrong" style={styles.price}>{amenity.priceLabel}</SafeText>
                    {!isClosed && (<Pressable onPress={() => onBookPress(amenity.id)} style={styles.bookBtn}>
                        <SafeText variant="tiny" style={styles.bookText}>{bookLabel}</SafeText>
                      </Pressable>)}
                  </View>
                </View>
              </View>
            </PressableScale>);
            })}
      </ScrollView>)}
    </View>);
}

