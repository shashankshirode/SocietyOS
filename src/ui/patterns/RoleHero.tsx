import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { resolveRoleIdentity } from "../foundation/roleColorTokens";
import { styles, createViewBackgroundColorPaddingTopStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBackgroundColorStyle4, createViewBackgroundColorStyle5, createViewBackgroundColorStyle6 } from "./styles/RoleHero.styles";
interface RoleHeroProps {
    role: string;
    title: string;
    subtitle: string;
    contextItems?: string[];
    children?: React.ReactNode;
}
export function RoleHero({ role, title, subtitle, contextItems = [], children }: RoleHeroProps) {
    const identity = resolveRoleIdentity(role);
    const insets = useSafeAreaInsets();
    const { colors } = useAppTheme();
    return (<View style={styles.container}>
      
      <View style={[styles.gradientBase, createViewBackgroundColorPaddingTopStyle(identity.gradient[0], insets.top + 16)]}>
        
        <View style={[styles.gradientLayer1, createViewBackgroundColorStyle(identity.gradient[1])]}/>
        
        <View style={[styles.gradientLayer2, createViewBackgroundColorStyle2(identity.gradient[2])]}/>

        
        <View style={[styles.decorCircle, styles.decorCircle1, createViewBackgroundColorStyle3(identity.gradient[1])]}/>
        <View style={[styles.decorCircle, styles.decorCircle2, createViewBackgroundColorStyle4(identity.gradient[2])]}/>

        
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <View style={[styles.badgeDot, createViewBackgroundColorStyle5(identity.accent)]}/>
            <SafeText variant="tiny" style={styles.badgeText}>{identity.label}</SafeText>
          </View>
        </View>

        
        <SafeText variant="h1" style={styles.title} numberOfLines={2}>{title}</SafeText>
        <SafeText variant="body" style={styles.subtitle} numberOfLines={2}>{subtitle}</SafeText>

        
        {contextItems.filter(Boolean).length > 0 && (<View style={styles.contextRow}>
            {contextItems.filter(Boolean).map((item, i) => (<React.Fragment key={i}>
                {i > 0 && <View style={styles.contextDot}/>}
                <SafeText variant="caption" style={styles.contextText}>{item}</SafeText>
              </React.Fragment>))}
          </View>)}

        
        {children && <View style={styles.slotArea}>{children}</View>}
      </View>

      
      <View style={[styles.curvedEdge, createViewBackgroundColorStyle6(colors.background)]}/>
    </View>);
}

