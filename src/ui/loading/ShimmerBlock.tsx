import React from "react";
import type { DimensionValue, ViewStyle, StyleProp } from "react-native";
import { SocietySkeleton, SocietyShimmerProvider, useSocietyShimmerValue } from "./SocietySkeleton";
import { Radius } from "../../shared/theme/radius";

export const ShimmerProvider = SocietyShimmerProvider;
export const useShimmerValue = useSocietyShimmerValue;

export interface ShimmerBlockProps {
    width?: DimensionValue;
    height?: number;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
}

export function ShimmerBlock({ width = '100%', height = 16, borderRadius = Radius.sm, style }: ShimmerBlockProps) {
    return (
        <SocietySkeleton
            width={width}
            height={height}
            borderRadius={borderRadius}
            style={style}
        />
    );
}

export default ShimmerBlock;


