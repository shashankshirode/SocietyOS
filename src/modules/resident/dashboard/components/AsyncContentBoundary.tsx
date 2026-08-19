import React from "react";
import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { ShimmerBlock } from "../../../../ui/loading/ShimmerBlock";
import type { DashboardSectionStatus } from "../data/dashboard.types";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle3, createViewBackgroundColorStyle2, createPressableBackgroundColorStyle } from "../styles/components/AsyncContentBoundary.styles";
export type DashboardSkeletonVariant = 'priority' | 'pulse' | 'timeline' | 'finance' | 'complaint' | 'editorial' | 'media' | 'matrix';
type AsyncContentBoundaryProps = {
    status?: DashboardSectionStatus;
    children: React.ReactNode;
    skeletonVariant: DashboardSkeletonVariant;
    emptyTitle: string;
    emptyDescription: string;
    errorTitle: string;
    errorDescription: string;
    offlineTitle: string;
    offlineDescription: string;
    retryLabel: string;
    onRetry: () => void;
    testID?: string;
};
export function AsyncContentBoundary({ status = 'ready', children, skeletonVariant, emptyTitle, emptyDescription, errorTitle, errorDescription, offlineTitle, offlineDescription, retryLabel, onRetry, testID, }: AsyncContentBoundaryProps) {
    if (status === 'loading') {
        return <SectionSkeleton variant={skeletonVariant} {...includeWhenPresent("testID", testID ? `${testID}-loading` : undefined)}/>;
    }
    if (status === 'empty') {
        return (<SectionEmptyState title={emptyTitle} description={emptyDescription} {...includeWhenPresent("testID", testID ? `${testID}-empty` : undefined)}/>);
    }
    if (status === 'error' || status === 'offline') {
        return (<SectionErrorState title={status === 'offline' ? offlineTitle : errorTitle} description={status === 'offline' ? offlineDescription : errorDescription} retryLabel={retryLabel} offline={status === 'offline'} onRetry={onRetry} {...includeWhenPresent("testID", testID ? `${testID}-${status}` : undefined)}/>);
    }
    return <View {...includeWhenPresent("testID", testID)}>{children}</View>;
}
export function SectionSkeleton({ variant, testID, }: {
    variant: DashboardSkeletonVariant;
    testID?: string;
}) {
    const { colors } = useAppTheme();
    const mediaHeight = variant === 'media' ? 176 : variant === 'timeline' ? 104 : 82;
    const rowCount = variant === 'priority'
        ? 3
        : variant === 'matrix'
            ? 4
            : variant === 'complaint'
                ? 3
                : 2;
    return (<View {...includeWhenPresent("testID", testID)} style={[styles.skeletonCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonHeaderText}>
          <ShimmerBlock width="46%" height={18}/>
          <ShimmerBlock width="68%" height={11}/>
        </View>
        <ShimmerBlock width={42} height={24} borderRadius={12}/>
      </View>
      {Array.from({ length: rowCount }).map((_, index) => (<View key={index} style={styles.skeletonRow}>
          <ShimmerBlock width={44} height={44} borderRadius={14}/>
          <View style={styles.skeletonRowText}>
            <ShimmerBlock width="72%" height={14}/>
            <ShimmerBlock width="88%" height={10}/>
          </View>
        </View>))}
      {variant === 'media' ? <ShimmerBlock width="100%" height={mediaHeight} borderRadius={16}/> : null}
    </View>);
}
export function SectionEmptyState({ title, description, testID, }: {
    title: string;
    description: string;
    testID?: string;
}) {
    const { colors } = useAppTheme();
    return (<View {...includeWhenPresent("testID", testID)} style={[styles.stateCard, createViewBackgroundColorBorderColorStyle2(colors.surface, colors.border)]}> 
      <View style={[styles.stateIcon, createViewBackgroundColorStyle(colors.surfaceMuted)]}> 
        <Ionicons name="checkmark-circle-outline" size={24} color={colors.success}/>
      </View>
      <SafeText variant="bodyStrong" color="primary" align="center">{title}</SafeText>
      <SafeText variant="caption" color="muted" align="center">{description}</SafeText>
    </View>);
}
export function SectionErrorState({ title, description, retryLabel, offline, onRetry, testID, }: {
    title: string;
    description: string;
    retryLabel: string;
    offline: boolean;
    onRetry: () => void;
    testID?: string;
}) {
    const { colors } = useAppTheme();
    return (<View {...includeWhenPresent("testID", testID)} style={[styles.stateCard, createViewBackgroundColorBorderColorStyle3(colors.surface, colors.border)]}> 
      <View style={[styles.stateIcon, createViewBackgroundColorStyle2(offline ? colors.warningSoft : colors.dangerSoft)]}> 
        <Ionicons name={offline ? 'cloud-offline-outline' : 'refresh-circle-outline'} size={24} color={offline ? colors.warning : colors.danger}/>
      </View>
      <SafeText variant="bodyStrong" color="primary" align="center">{title}</SafeText>
      <SafeText variant="caption" color="muted" align="center">{description}</SafeText>
      <Pressable onPress={onRetry} accessibilityRole="button" style={[styles.retryButton, createPressableBackgroundColorStyle(colors.primarySoft)]}>
        <SafeText variant="caption" style={createSafeTextColorStyle(colors.primary)}>{retryLabel}</SafeText>
      </Pressable>
    </View>);
}

