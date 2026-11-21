import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { AppIconAlias, AppIconName } from './icon.types';
import { iconRegistry } from './iconRegistry';
import { useAppTheme } from '../theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { formatUiLiteral } from "../localization/formatUiLiteral";
export interface AppIconProps {
    name: AppIconName;
    size?: number;
    color?: string;
    testID?: string;
}
function isAppIconAlias(name: AppIconName): name is AppIconAlias {
    return Object.prototype.hasOwnProperty.call(iconRegistry, name);
}
export function AppIcon({ name, size = 24, color, testID }: AppIconProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const iconName = isAppIconAlias(name) ? iconRegistry[name] : name;
    const iconColor = color || colors.textSecondary;
    return (<Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={iconColor} testID={testID} accessibilityLabel={formatUiLiteral(localizedUiText.m_fd0592006cb7, [name])}/>);
}
export default AppIcon;
