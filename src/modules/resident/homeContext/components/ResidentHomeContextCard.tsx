import { ActivityIndicator, Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { ResidentHomeContextBadge } from "./ResidentHomeContextBadge";
import type { ResidentHomeContext } from "../data/residentHomeContext.types";
import { useMessages } from "../../../../shared/constants/useMessages";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { isSelectableResidentHomeContext } from "../state/residentHomeContext.store";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createPressableBackgroundColorBorderColorOpacityStyle, createSafeTextColorStyle5, createSafeTextColorStyle6, createViewBackgroundColorStyle } from "../styles/components/ResidentHomeContextCard.styles";
export function ResidentHomeContextCard({ context, isActive, isSwitching, isInteractionDisabled, onPress, }: {
    context: ResidentHomeContext;
    isActive: boolean;
    isSwitching: boolean;
    isInteractionDisabled: boolean;
    onPress: () => void;
}) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const isRestricted = context.status === 'accessRestricted';
    const isPending = context.status === 'pendingApproval';
    const isFuture = context.status === 'active' && !isSelectableResidentHomeContext(context);
    const isDisabled = isPending || isFuture || context.status === 'inactive' || isInteractionDisabled;
    return (<Pressable onPress={isDisabled ? undefined : onPress} accessibilityRole="button" accessibilityLabel={`${messages.resident.accessibility.homeContext.selectHome} ${context.displayUnitName}`} accessibilityHint={isActive ? messages.resident.accessibility.homeContext.currentHome : undefined} accessibilityState={{ disabled: isDisabled, selected: isActive, busy: isSwitching }} style={[
            styles.card,
            createPressableBackgroundColorBorderColorOpacityStyle(colors.surface, isActive ? colors.primary : colors.border, isPending || isFuture || context.status === 'inactive' ? 0.6 : 1),
        ]}>
      <View style={styles.cardHeader}>
        <View style={styles.headerInfo}>
          <SafeText variant="bodyStrong" style={[styles.unitText, createSafeTextColorStyle5(colors.textPrimary)]}>
            {context.flatNumber}
          </SafeText>
          {context.buildingName ? (<SafeText variant="caption" style={[styles.buildingText, createSafeTextColorStyle6(colors.textSecondary)]}>
              {context.buildingName}
            </SafeText>) : null}
        </View>

        <View style={styles.badgeRow}>
          <ResidentHomeContextBadge value={context.residentRole} type="role"/>
          <ResidentHomeContextBadge value={context.status} type="status"/>
          {isSwitching ? (<ActivityIndicator testID={`home-context-switching-${context.homeContextId}`} size="small" color={colors.primary}/>) : isActive ? (<Ionicons name="checkmark-circle" size={20} color={colors.primary}/>) : null}
        </View>
      </View>

      <View style={styles.contextLabelRow}>
        {isActive ? (<SafeText variant="tiny" style={createSafeTextColorStyle(colors.primary)}>
            {messages.resident.homeContext.currentHome}
          </SafeText>) : null}
        {context.isPrimary ? (<SafeText variant="tiny" style={createSafeTextColorStyle2(colors.textSecondary)}>
            {messages.resident.homeContext.primaryHome}
          </SafeText>) : null}
        {context.lastSwitchedAt ? (<SafeText variant="tiny" style={createSafeTextColorStyle3(colors.textSecondary)}>
            {messages.resident.homeContext.lastUsedAt(formatResidentDate(context.lastSwitchedAt))}
          </SafeText>) : null}
      </View>

      {!isRestricted && !isPending && context.status !== 'inactive' && (<View style={styles.statsRow}>
          {context.activeVisitorCount > 0 && (<View style={[styles.statChip, createViewBackgroundColorStyle(colors.background)]}>
              <Ionicons name="people-outline" size={12} color={colors.textSecondary}/>
              <SafeText variant="tiny" style={createSafeTextColorStyle4(colors.textSecondary)}>
                {messages.resident.homeContext.activeVisitors(context.activeVisitorCount)}
              </SafeText>
            </View>)}

          {context.outstandingBillAmount !== undefined && context.outstandingBillAmount > 0 ? (<View style={[styles.statChip, styles.viewBackgroundColor]}>
              <Ionicons name="card-outline" size={12} color="#DC2626"/>
              <SafeText variant="tiny" style={styles.safeTextColorFontWeight}>
                {messages.resident.homeContext.outstandingBill(context.outstandingBillAmount)}
              </SafeText>
            </View>) : null}

          {context.pendingCount > 0 && (<View style={[styles.statChip, styles.viewBackgroundColor2]}>
              <Ionicons name="time-outline" size={12} color="#D97706"/>
              <SafeText variant="tiny" style={styles.safeTextColorFontWeight2}>
                {messages.resident.homeContext.pendingItems(context.pendingCount)}
              </SafeText>
            </View>)}
        </View>)}
    </Pressable>);
}
export default ResidentHomeContextCard;

