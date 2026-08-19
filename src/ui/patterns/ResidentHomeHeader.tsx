import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeText } from "../../shared/components/SafeText";
import { resolveRoleIdentity } from "../foundation/roleColorTokens";
import { useReducedMotion } from "../../shared/motion/useReducedMotion";
import { ResidentDisplayName } from "../typography/ResidentDisplayName";
import { DailyContextHint } from "../../modules/resident/contextualInsights";
import { ResidentHomeSwitcherButton } from "../../modules/resident/homeContext/components/ResidentHomeSwitcherButton";
import { useActiveResidentHome } from "../../modules/resident/homeContext/hooks/useActiveResidentHome";
import { mapContextRoleToAppRole } from "../../modules/resident/homeContext/utils/residentHomeContextPermissions";
import { useResidentGreeting } from "../../modules/resident/dashboard/hooks/useResidentGreeting";
import { useMessages } from "../../shared/constants/useMessages";
import { useResponsiveLayout } from "../layout/useResponsiveLayout";
import { residentColors } from "../../shared/theme/residentColors";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createViewBackgroundColorPaddingTopStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBackgroundColorStyle4, createViewMaxWidthPaddingHorizontalStyle, createViewBackgroundColorStyle5 } from "./styles/ResidentHomeHeader.styles";
export interface ResidentHomeHeaderProps {
    residentName: string;
    unitLabel: string;
    societyName: string;
    roleLabel: string;
    residentRoleKey?: string;
    unreadNoticeCount: number;
    pendingActionCount: number;
    onProfilePress: () => void;
    onSwitchRolePress?: () => void;
    onNotificationsPress?: () => void;
}
export function ResidentHomeHeader({ residentName, unitLabel, societyName, roleLabel, residentRoleKey, unreadNoticeCount, pendingActionCount, onProfilePress, onNotificationsPress, }: ResidentHomeHeaderProps) {
    const insets = useSafeAreaInsets();
    const { activeContext } = useActiveResidentHome();
    const resolvedRoleKey = residentRoleKey ?? (activeContext ? mapContextRoleToAppRole(activeContext.residentRole) : 'RESIDENT_OWNER');
    const identity = resolveRoleIdentity(resolvedRoleKey);
    const reducedMotion = useReducedMotion();
    const greeting = useResidentGreeting(activeContext);
    const messages = useMessages();
    const { contentMaxWidth, isTablet, screenPadding } = useResponsiveLayout();
    return (<View style={styles.container}>
      <View style={[styles.gradientBase, createViewBackgroundColorPaddingTopStyle(identity.gradient[0], insets.top + 12)]}> 
        
        <View style={[styles.layer1, createViewBackgroundColorStyle(identity.gradient[1])]}/>
        <View style={[styles.layer2, createViewBackgroundColorStyle2(identity.gradient[2])]}/>
        <View style={[styles.decorCircle1, createViewBackgroundColorStyle3(identity.gradient[1])]}/>
        <View style={[styles.decorCircle2, createViewBackgroundColorStyle4(identity.gradient[2])]}/>

        <View style={[
            styles.inner,
            createViewMaxWidthPaddingHorizontalStyle(contentMaxWidth, isTablet ? screenPadding : 20),
        ]}>
        
        <Animated.View {...includeWhenPresent("entering", reducedMotion ? undefined : FadeIn.delay(100).duration(300))} style={styles.topBar}>
          <View style={styles.topLeft}>
            <View style={styles.roleBadge}>
              <View style={[styles.badgeDot, createViewBackgroundColorStyle5(identity.accent)]}/>
              <SafeText variant="tiny" style={styles.roleText}>{roleLabel}</SafeText>
            </View>
          </View>
          <View style={styles.topRight}>
            <ResidentHomeSwitcherButton iconColor={residentColors.onBrandMedium}/>
            <Pressable onPress={onNotificationsPress || onProfilePress} hitSlop={8} style={styles.topAction} accessibilityRole="button" accessibilityLabel={messages.resident.dashboard.identity.notificationsAccessibility(unreadNoticeCount)}>
              <View style={styles.notifBadgeContainer}>
                <Ionicons name="notifications-outline" size={20} color={residentColors.onBrandMedium}/>
                {unreadNoticeCount > 0 && (<View style={styles.notifBadge}>
                    <SafeText variant="tiny" style={styles.notifText}>
                      {unreadNoticeCount > 99 ? '99+' : unreadNoticeCount}
                    </SafeText>
                  </View>)}
              </View>
            </Pressable>
            <Pressable onPress={onProfilePress} hitSlop={8} style={styles.topAction} accessibilityRole="button" accessibilityLabel={messages.resident.dashboard.identity.profileAccessibility}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={18} color={identity.gradient[0]}/>
              </View>
            </Pressable>
          </View>
        </Animated.View>

        
        <Animated.View {...includeWhenPresent("entering", reducedMotion ? undefined : FadeIn.delay(200).duration(350))} style={styles.greetingArea}>
          <SafeText variant="h1" style={styles.greeting} numberOfLines={1}>
            {greeting},
          </SafeText>
          <ResidentDisplayName displayName={residentName} variant="h1" style={styles.greeting} testID="resident-dashboard-name"/>
          <SafeText variant="body" style={styles.subtitle} numberOfLines={1}>
            {unitLabel}
          </SafeText>
          <View style={styles.contextRow}>
            <Ionicons name="business-outline" size={13} color={residentColors.onBrandMuted}/>
            <SafeText variant="caption" style={styles.societyName} numberOfLines={1}>
              {societyName}
            </SafeText>
            {pendingActionCount > 0 && (<>
                <View style={styles.contextDot}/>
                <SafeText variant="caption" style={styles.actionCount} numberOfLines={1}>
                  {messages.resident.dashboard.identity.attentionCount(pendingActionCount)}
                </SafeText>
              </>)}
          </View>

          
          <DailyContextHint societyId={activeContext?.societyId ?? societyName} unitId={activeContext?.unitId ?? unitLabel}/>
        </Animated.View>
        </View>
      </View>
    </View>);
}

