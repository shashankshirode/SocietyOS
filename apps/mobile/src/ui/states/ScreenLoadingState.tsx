import React from "react";
import { View } from "react-native";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { SocietyLoadingIndicator } from "../loading/SocietyLoadingIndicators";
import { LoadingIntent } from "../../core/async/AsyncState";
import { styles, createViewBackgroundColorStyle } from "./styles/ScreenLoadingState.styles";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";

export interface ScreenLoadingStateProps {
    readonly message?: string;
    readonly accessibilityLabel?: string;
}

export function ScreenLoadingState({
    message,
    accessibilityLabel = getActiveUiLiteral("m_d1049c5e8c3b"),
}: ScreenLoadingStateProps) {
    const { semantic } = useAppTheme();
    return (
        <View
            style={[styles.container, createViewBackgroundColorStyle(semantic.surface.canvas)]}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="progressbar"
        >
            <SocietyLoadingIndicator
                size="lg"
                intent={LoadingIntent.INITIAL_PAGE}
                {...(message === undefined ? {} : { message })}
            />
        </View>
    );
}

export default ScreenLoadingState;

