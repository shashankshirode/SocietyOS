import { View } from "react-native";
import { ShimmerBlock } from "../loading/ShimmerBlock";
import { styles, createViewHeightStyle } from "./styles/imageLoadingSkeleton.styles";
export interface ImageLoadingSkeletonProps {
    height: number;
}
export function ImageLoadingSkeleton({ height }: ImageLoadingSkeletonProps) {
    return (<View style={[styles.container, createViewHeightStyle(height)]}>
      <ShimmerBlock width="100%" height={height} borderRadius={16}/>
    </View>);
}

