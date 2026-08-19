import { useEffect } from "react";
import { DimensionValue, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useAppTheme } from "../theme/useAppTheme";
import { AppCard } from "../cards/AppCard";
import { styles, createAnimatedViewBackgroundColorWidthHeightBorderRadiusStyle } from "./styles/Skeleton.styles";
export interface SkeletonProps {
    width?: DimensionValue;
    height: number;
    borderRadius?: number;
    style?: ViewStyle;
}
export function Skeleton({ width = '100%', height, borderRadius = 8, style, }: SkeletonProps) {
    const { colors } = useAppTheme();
    const opacity = useSharedValue(0.3);
    useEffect(() => {
        opacity.value = withRepeat(withSequence(withTiming(0.8, { duration: 600 }), withTiming(0.3, { duration: 600 })), -1, true);
    }, [opacity]);
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));
    return (<Animated.View style={[
            styles.skeleton,
            createAnimatedViewBackgroundColorWidthHeightBorderRadiusStyle(colors.border, width as DimensionValue, height, borderRadius),
            animatedStyle,
            style,
        ]}/>);
}
export function ListCardSkeleton() {
    return (<AppCard style={styles.card}>
      <Animated.View style={styles.cardRow}>
        <Skeleton height={40} width={40} borderRadius={8} style={styles.marginRight}/>
        <Animated.View style={styles.flex1}>
          <Skeleton height={14} width="60%" style={styles.marginBottomSm}/>
          <Skeleton height={10} width="40%"/>
        </Animated.View>
        <Skeleton height={20} width={60} borderRadius={999}/>
      </Animated.View>
    </AppCard>);
}
export function DetailBlockSkeleton() {
    return (<AppCard style={styles.card}>
      <Skeleton height={18} width="30%" style={styles.marginBottomLg}/>
      <Skeleton height={12} width="100%" style={styles.marginBottomSm}/>
      <Skeleton height={12} width="95%" style={styles.marginBottomSm}/>
      <Skeleton height={12} width="85%" style={styles.marginBottomSm}/>
      <Skeleton height={12} width="50%"/>
    </AppCard>);
}

