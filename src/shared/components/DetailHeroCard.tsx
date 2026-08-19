import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { AppText } from "./AppText";
import { AppCard } from "../cards/AppCard";
import { styles, createViewBackgroundColorStyle } from "./styles/DetailHeroCard.styles";
export interface DetailHeroCardProps {
    title: string;
    subtitle?: string;
    statusNode?: React.ReactNode;
    infoNode?: React.ReactNode;
    accentColor?: string;
    style?: StyleProp<ViewStyle>;
}
export function DetailHeroCard({ title, subtitle, statusNode, infoNode, accentColor, style, }: DetailHeroCardProps) {
    return (<AppCard variant="elevated" style={[styles.card, style]}>
      {accentColor && <View style={[styles.accentLine, createViewBackgroundColorStyle(accentColor)]}/>}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <AppText variant="h2" weight="bold">
            {title}
          </AppText>
          {subtitle && (<AppText variant="bodyMedium" color="muted" style={styles.subtitle}>
              {subtitle}
            </AppText>)}
        </View>
        {statusNode && <View style={styles.status}>{statusNode}</View>}
      </View>
      {infoNode && <View style={styles.info}>{infoNode}</View>}
    </AppCard>);
}
export default DetailHeroCard;

