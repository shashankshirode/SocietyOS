import React from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { DataValue } from "./DataValue";
import { AppIcon } from "../icons/AppIcon";
import type { AppIconName } from "../icons/icon.types";
import type { EmptyValueContext } from "./dataDisplay.utils";
import { includeWhenPresent } from "../utils/presentProperty";
import { styles, createViewBackgroundColorStyle, createViewBorderBottomColorStyle, createTextColorStyle } from "./styles/DataRow.styles";
interface DataRowProps {
    label: string;
    value?: string | number | null;
    emptyLabel?: string;
    emptyContext?: EmptyValueContext;
    icon?: AppIconName;
    customValue?: React.ReactNode;
    valueBold?: boolean;
    valueColor?: string;
    isLast?: boolean;
    mask?: 'mobile' | 'email';
}
export function DataRow({ label, value, emptyLabel, emptyContext = 'generic', icon, customValue, valueBold = false, valueColor, isLast = false, mask, }: DataRowProps) {
    const { colors } = useAppTheme();
    function maskValue(val: string): string {
        if (!mask || !val)
            return val;
        if (mask === 'mobile' && val.length >= 10) {
            return val.slice(0, 2) + '••••••' + val.slice(-2);
        }
        if (mask === 'email' && val.includes('@')) {
            const separatorIndex = val.indexOf('@');
            return val.slice(0, Math.min(2, separatorIndex)) + '•••@' + val.slice(separatorIndex + 1);
        }
        return val;
    }
    const displayVal = typeof value === 'string' && mask ? maskValue(value) : value;
    return (<View style={[styles.container, createViewBackgroundColorStyle(colors.surfaceMuted), !isLast && createViewBorderBottomColorStyle(colors.divider)]}>
      <View style={styles.labelRow}>
        {icon && <AppIcon name={icon} size={14} color={colors.textMuted}/>}
        <Text style={[styles.label, createTextColorStyle(colors.textSecondary)]}>{label}</Text>
      </View>
      <View style={styles.valueContainer}>
        {customValue || (<DataValue value={displayVal} emptyContext={emptyContext} {...includeWhenPresent("emptyLabel", emptyLabel)} bold={valueBold} {...includeWhenPresent("color", valueColor)}/>)}
      </View>
    </View>);
}

