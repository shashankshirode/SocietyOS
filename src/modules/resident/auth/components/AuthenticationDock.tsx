import React from "react";
import { View } from "react-native";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { styles } from "../styles/components/AuthenticationDock.styles";
interface AuthenticationDockProps {
    children: React.ReactNode;
}
export function AuthenticationDock({ children }: AuthenticationDockProps) {
    const { dark } = useAppTheme();
    const containerStyle = [
        styles.dock,
        {
            backgroundColor: dark ? '#090D1A' : '#F9F8F6',
            borderColor: dark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
            shadowColor: dark ? '#000000' : 'rgba(15, 23, 42, 0.5)',
        },
    ];
    return (<View style={containerStyle}>
      <View style={styles.inner}>{children}</View>
    </View>);
}

