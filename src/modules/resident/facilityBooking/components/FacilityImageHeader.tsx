import { useState } from "react";
import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
import { getFacilityImage } from "../media/facilityImageRegistry";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { styles, createViewHeightBackgroundColorStyle, createViewBackgroundColorStyle } from "../styles/components/FacilityImageHeader.styles";
export interface FacilityImageHeaderProps {
    name?: string;
    height?: number;
}
export function FacilityImageHeader({ name, height = 200 }: FacilityImageHeaderProps) {
    const { colors } = useAppTheme();
    const [loading, setLoading] = useState(true);
    const imageInfo = getFacilityImage(name);
    return (<View style={[styles.container, createViewHeightBackgroundColorStyle(height, colors.backgroundSoft)]}>
      <Image source={{ uri: imageInfo.url }} style={styles.image} accessibilityLabel={imageInfo.accessibilityLabel} onLoadStart={() => setLoading(true)} onLoadEnd={() => setLoading(false)}/>
      {loading && (<View style={[StyleSheet.absoluteFill, styles.loader, createViewBackgroundColorStyle(colors.backgroundSoft)]}>
          <ActivityIndicator size="small" color={colors.primary}/>
        </View>)}
    </View>);
}
export default FacilityImageHeader;

