import React from "react";
import { View, ScrollView } from "react-native";
import { styles } from "./styles/ActionRail.styles";
interface ActionRailProps {
    children: React.ReactNode;
}
export function ActionRail({ children }: ActionRailProps) {
    return (<View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {children}
      </ScrollView>
    </View>);
}

