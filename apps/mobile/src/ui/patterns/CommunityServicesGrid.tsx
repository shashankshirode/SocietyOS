import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import { useReducedMotion } from "../../shared/motion/useReducedMotion";
import { DashboardSectionHeader } from "../components/SectionHeader";
import { useResponsiveLayout } from "../layout/useResponsiveLayout";
import type { CommunityServiceItem } from "../../modules/resident/dashboard/data/dashboard.types";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createAnimatedViewFlexBasisStyle, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorBorderColorStyle, createViewPaddingHorizontalStyle, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "./styles/CommunityServicesGrid.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface CommunityServicesGridProps {
    services: CommunityServiceItem[];
    onServicePress: (id: string) => void;
    paddingHorizontal?: number;
    sectionTitle?: string;
    sectionSubtitle?: string;
    viewAllLabel?: string;
    onViewAllPress?: () => void;
    verifiedLabel?: string;
    independentLabel?: string;
    emptyTitle?: string;
    emptyDescription?: string;
}
export function CommunityServicesGrid({ services, onServicePress, paddingHorizontal, sectionTitle = getActiveUiLiteral("m_6932a725c453"), sectionSubtitle = getActiveUiLiteral("m_d1d9b9db358a"), viewAllLabel, onViewAllPress, verifiedLabel, independentLabel, emptyTitle, emptyDescription, }: CommunityServicesGridProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    const { isTablet, isLarge } = useResponsiveLayout();
    const reducedMotion = useReducedMotion();
    const resolvedColumns = isTablet ? 2 : isLarge ? 3 : 2;
    const gridPadding = isTablet ? 0 : 20;
    const itemWidth = resolvedColumns === 3 ? '31%' : '47%';
    return (<View style={styles.container}>
      <DashboardSectionHeader title={sectionTitle} subtitle={sectionSubtitle} {...includeWhenPresent("actionLabel", viewAllLabel)} {...includeWhenPresent("onActionPress", onViewAllPress)}/>

      {services.length === 0 ? (<View style={[styles.empty, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
          <Ionicons name="storefront-outline" size={28} color={colors.textMuted}/>
          {emptyTitle ? <SafeText variant="bodyStrong" color="primary">{emptyTitle}</SafeText> : null}
          {emptyDescription ? <SafeText variant="caption" color="muted" align="center">{emptyDescription}</SafeText> : null}
        </View>) : (<View style={[styles.grid, createViewPaddingHorizontalStyle(paddingHorizontal ?? gridPadding)]}> 
        {services.map((service, index) => (<Animated.View key={service.id} {...includeWhenPresent("entering", reducedMotion ? undefined : FadeInUp.delay(index * 40).duration(250))} style={createAnimatedViewFlexBasisStyle(itemWidth)}>
            <PressableScale onPress={() => onServicePress(service.id)}>
              <View style={[styles.tile, createViewBackgroundColorBorderColorStyle2(colors.surface, colors.border)]}> 
                <View style={[styles.iconWrap, createViewBackgroundColorStyle(colors.primarySoft)]}> 
                  <Ionicons name={resolveServiceIcon(service.iconName)} size={22} color={colors.primary}/>
                </View>
                <SafeText variant="caption" color="primary" align="center" numberOfLines={2} style={styles.label}>
                  {service.label}
                </SafeText>
                {service.description ? (<SafeText variant="tiny" color="muted" align="center" numberOfLines={2}>
                    {service.description}
                  </SafeText>) : null}
                {service.societyVerified != null ? (<View style={[styles.verification, createViewBackgroundColorStyle2(service.societyVerified ? colors.successSoft : colors.surfaceMuted)]}> 
                    <Ionicons name={service.societyVerified ? 'shield-checkmark-outline' : 'information-circle-outline'} size={11} color={service.societyVerified ? colors.success : colors.textMuted}/>
                    <SafeText variant="tiny" style={createSafeTextColorStyle(service.societyVerified ? colors.success : colors.textMuted)} numberOfLines={1}>
                      {service.societyVerified ? verifiedLabel : independentLabel}
                    </SafeText>
                  </View>) : null}
                {service.availabilityLabel ? (<SafeText variant="tiny" style={createSafeTextColorStyle2(colors.primary)} numberOfLines={1}>
                    {service.availabilityLabel}
                  </SafeText>) : null}
              </View>
            </PressableScale>
          </Animated.View>))}
      </View>)}
    </View>);
}
function resolveServiceIcon(iconName: string): keyof typeof Ionicons.glyphMap {
    return iconName in Ionicons.glyphMap
        ? iconName as keyof typeof Ionicons.glyphMap
        : 'construct-outline';
}

