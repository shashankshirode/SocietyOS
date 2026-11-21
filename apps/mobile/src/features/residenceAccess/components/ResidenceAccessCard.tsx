import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Image, Pressable, View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useResponsiveLayout } from "../../../shared/layout/useResponsiveLayout";
import { residenceAccessMessages, residenceAccessStatusLabels, residenceRoleLabels } from "../../../messages/en/residenceAccess.messages";
import { presentResidenceDate } from "../services/residenceAccessDateTime";
import type { ResidenceAccessAction, ResidenceAccessListItem } from "../models/residenceAccess.types";
import { ResidenceStatusBadge } from "./ResidenceStatusBadge";
import { ResidenceAccessProgress } from "./ResidenceAccessProgress";
import { styles, createImageHeightStyle, createViewHeightBackgroundColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorSpread3Style } from "../styles/components/ResidenceAccessCard.styles";
interface ResidenceAccessCardProps {
    readonly item: ResidenceAccessListItem;
    readonly onAction: (item: ResidenceAccessListItem, action: ResidenceAccessAction) => void;
    readonly onOpenStatus: (item: ResidenceAccessListItem) => void;
}
export function ResidenceAccessCard({ item, onAction, onOpenStatus }: ResidenceAccessCardProps) {
    const { colors, shadows } = useAppTheme();
    const { isTablet } = useResponsiveLayout();
    const [imageFailed, setImageFailed] = useState(false);
    const { residence, accessRecord, primaryAction, secondaryActions } = item;
    const updated = presentResidenceDate(accessRecord.statusUpdatedAt);
    const statusLabel = residenceAccessStatusLabels[accessRecord.status];
    const firstSecondary = secondaryActions.find((action) => action.enabled);
    const location = [residence.unitNumber, residence.buildingName, residence.wingName]
        .filter(Boolean)
        .join(' · ');
    const shouldShowProgress = item.totalRequirementCount > 0 && !item.eligibility.canEnterResidence;
    useEffect(() => {
        setImageFailed(false);
    }, [residence.image.uri]);
    return (<View style={[
            styles.card,
            createViewBackgroundColorBorderColorSpread3Style(colors.surface, colors.border, shadows.medium),
        ]} accessible accessibilityLabel={residenceAccessMessages.accessibility.card(residence.societyName, residence.unitNumber, statusLabel, primaryAction.label)}>
      {residence.image.uri && !imageFailed ? (<Image source={{ uri: residence.image.uri }} accessibilityRole="image" accessibilityLabel={residence.image.accessibilityLabel} onError={() => setImageFailed(true)} resizeMode="cover" style={[styles.image, createImageHeightStyle(isTablet ? 166 : 138)]}/>) : (<View style={[styles.image, styles.fallback, createViewHeightBackgroundColorStyle(isTablet ? 166 : 138, colors.surfaceMuted)]} accessibilityRole="image" accessibilityLabel={residence.image.accessibilityLabel}>
          <Ionicons name={residence.image.fallbackIcon} size={34} color={colors.textMuted}/>
          <AppText variant="caption" tone="secondary" numberOfLines={2} style={styles.fallbackText}>
            {residence.societyName}
          </AppText>
        </View>)}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleColumn}>
            <AppText variant="h3" weight="800" numberOfLines={2}>
              {residence.societyName}
            </AppText>
            <AppText variant="bodySmall" tone="secondary" numberOfLines={2}>
              {location}
            </AppText>
          </View>
          <View style={[styles.rolePill, createViewBackgroundColorStyle(colors.primarySoft)]}>
            <AppText variant="tiny" color={colors.primary} weight="800">
              {residenceRoleLabels[residence.role].toLocaleUpperCase()}
            </AppText>
          </View>
        </View>
        <Pressable onPress={() => onOpenStatus(item)} style={styles.statusPressable} accessibilityRole="button" accessibilityLabel={residenceAccessMessages.accessibility.statusBadge(statusLabel)}>
          <ResidenceStatusBadge status={accessRecord.status}/>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted}/>
        </Pressable>
        <AppText variant="body" numberOfLines={2}>
          {accessRecord.statusReason}
        </AppText>
        <AppText variant="caption" tone="muted">
          {`${residenceAccessMessages.list.updatedPrefix} ${updated.relative}`}
        </AppText>
        {shouldShowProgress ? (<ResidenceAccessProgress completed={item.completedRequirementCount} total={item.totalRequirementCount}/>) : null}
        <View style={styles.actions}>
          <AppButton title={primaryAction.label} accessibilityLabel={primaryAction.accessibilityLabel} onPress={() => onAction(item, primaryAction)} disabled={!primaryAction.enabled} fullWidth/>
          {firstSecondary ? (<AppButton title={firstSecondary.label} accessibilityLabel={firstSecondary.accessibilityLabel} onPress={() => onAction(item, firstSecondary)} variant="outline" disabled={!firstSecondary.enabled} fullWidth/>) : null}
        </View>
      </View>
    </View>);
}

