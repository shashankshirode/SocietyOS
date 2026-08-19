import React from "react";
import { View } from "react-native";
import { AppText } from "../../../../shared/components/AppText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorBorderColorStyle, createAppTextColorStyle, createAppTextColorStyle2, createAppTextColorStyle3 } from "../styles/components/AuthenticationSurface.styles";
export interface AuthenticationSurfaceProps {
    eyebrow: string;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    keyboardVisible?: boolean;
    scrollEnabled?: boolean;
    accessibilityLabel: string;
}
export function AuthenticationSurface({ eyebrow, title, description, children, footer, accessibilityLabel, }: AuthenticationSurfaceProps) {
    const { colors, dark } = useAppTheme();
    return (<View style={[
            styles.surface,
            createViewBackgroundColorBorderColorStyle(dark ? '#0A0E1A' : '#FAF9F6', dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)'),
        ]} accessibilityLabel={accessibilityLabel} accessibilityRole="summary">
      <View style={styles.curveHeader}/>

      <View style={styles.body}>
        
        <View style={styles.headerBlock}>
          <AppText variant="caption" style={[styles.eyebrow, createAppTextColorStyle(colors.primary)]}>
            {eyebrow}
          </AppText>
          <AppText variant="h2" style={[styles.title, createAppTextColorStyle2(colors.textPrimary)]}>
            {title}
          </AppText>
          {!!description && (<AppText variant="bodySmall" style={[styles.subtitle, createAppTextColorStyle3(colors.textSecondary)]}>
              {description}
            </AppText>)}
        </View>

        
        <View style={styles.childrenContainer}>{children}</View>

        
        <View style={styles.spacer}/>

        
        {!!footer && <View style={styles.footerContainer}>{footer}</View>}
      </View>
    </View>);
}

