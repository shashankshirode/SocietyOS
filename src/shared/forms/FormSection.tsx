import React from "react";
import { View } from "react-native";
import { AppText } from "../components/AppText";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewBackgroundColorBorderColorShadowColorStyle } from "./styles/FormSection.styles";
export interface FormSectionProps {
    title?: string;
    children: React.ReactNode;
    testID?: string;
}
export function FormSection({ title, children, testID }: FormSectionProps) {
    const { colors } = useAppTheme();
    return (<View testID={testID} style={[styles.container, createViewBackgroundColorBorderColorShadowColorStyle(colors.surface, colors.border, colors.shadow)]}>
      {title && (<AppText variant="cardTitle" tone="secondary" style={styles.title}>
          {title.toUpperCase()}
        </AppText>)}
      <View style={styles.content}>{children}</View>
    </View>);
}
export default FormSection;

