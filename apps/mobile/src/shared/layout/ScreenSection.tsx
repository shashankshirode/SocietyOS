import React from "react";
import { View } from "react-native";
import { SafeText } from "../components/SafeText";
import { styles } from "./styles/ScreenSection.styles";
type ScreenSectionProps = {
    title?: string;
    description?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
};
export function ScreenSection({ title, description, action, children }: ScreenSectionProps) {
    return (<View style={styles.container}>
      {title || description || action ? (<View style={styles.header}>
          <View style={styles.copy}>
            {title ? <SafeText variant="title">{title}</SafeText> : null}
            {description ? <SafeText variant="caption" color="secondary">{description}</SafeText> : null}
          </View>
          {action ? <View style={styles.action}>{action}</View> : null}
        </View>) : null}
      {children}
    </View>);
}

