import React from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { isValueMissing, resolveEmptyLabel, type EmptyValueContext } from "../dataDisplay/dataDisplay.utils";
import { styles, createViewBorderBottomColorStyle, createTextColorStyle, createTextColorStyle2 } from "./styles/InfoRow.styles";
interface InfoRowProps {
    label: string;
    value?: string;
    customValue?: React.ReactNode;
    isLast?: boolean;
    valueColor?: string;
    valueBold?: boolean;
    emptyLabel?: string;
    emptyContext?: EmptyValueContext;
}
export function InfoRow({ label, value, customValue, isLast = false, valueColor, valueBold = false, emptyLabel, emptyContext = 'generic', }: InfoRowProps) {
    const { colors } = useAppTheme();
    const displayText = isValueMissing(value)
        ? (emptyLabel || resolveEmptyLabel(emptyContext))
        : value!;
    const isMissing = isValueMissing(value);
    return (<View style={[styles.container, !isLast && createViewBorderBottomColorStyle(colors.divider)]}>
      <Text style={[styles.label, createTextColorStyle(colors.textSecondary)]}>{label}</Text>
      {customValue ? (customValue) : (<Text style={[
                styles.value,
                createTextColorStyle2(isMissing ? colors.textMuted : (valueColor || colors.textPrimary)),
                valueBold && styles.textFontWeight,
                isMissing && styles.italic,
            ]}>
          {displayText}
        </Text>)}
    </View>);
}

