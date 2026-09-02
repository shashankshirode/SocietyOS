import React from "react";
import type { DimensionValue, ViewStyle, StyleProp } from "react-native";
import { SocietySkeleton } from "../../ui/loading/SocietySkeleton";
import { SocietySkeletonSurface } from "../../ui/loading/SocietySkeletonPrimitives";
import { AppCard } from "../cards/AppCard";
import { styles } from "./styles/Skeleton.styles";

export interface SkeletonProps {
    readonly width?: DimensionValue;
    readonly height: DimensionValue;
    readonly borderRadius?: number;
    readonly style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height, borderRadius = 8, style }: SkeletonProps) {
    return (
        <SocietySkeleton
            width={width}
            height={height}
            borderRadius={borderRadius}
            style={style}
        />
    );
}

export function ListCardSkeleton() {
    return (
        <AppCard style={styles.card}>
            <SocietySkeletonSurface style={{ borderBottomWidth: 0, padding: 0 }}>
                <SocietySkeleton width={40} height={40} borderRadius={8} style={styles.marginRight} />
                <SocietySkeleton width="60%" height={14} style={styles.marginBottomSm} />
                <SocietySkeleton width="40%" height={10} />
            </SocietySkeletonSurface>
        </AppCard>
    );
}

export function DetailBlockSkeleton() {
    return (
        <AppCard style={styles.card}>
            <SocietySkeleton height={18} width="30%" style={styles.marginBottomLg} />
            <SocietySkeleton height={12} width="100%" style={styles.marginBottomSm} />
            <SocietySkeleton height={12} width="95%" style={styles.marginBottomSm} />
            <SocietySkeleton height={12} width="85%" style={styles.marginBottomSm} />
            <SocietySkeleton height={12} width="50%" />
        </AppCard>
    );
}

export default Skeleton;


