import React from "react";
import { SafeText, SafeTextProps } from "../../shared/components/SafeText";
import { createSafeTextMaxWidthStyle } from "./styles/TruncatedText.styles";
export type TruncatedTextProps = Omit<SafeTextProps, 'children'> & {
    text: string;
    maxWidth?: number;
    children?: React.ReactNode;
};
export function TruncatedText({ text, maxWidth, style, accessibilityLabel, ...props }: TruncatedTextProps) {
    return (<SafeText {...props} numberOfLines={1} ellipsizeMode="tail" accessibilityLabel={accessibilityLabel || text} style={[
            maxWidth ? createSafeTextMaxWidthStyle(maxWidth) : null,
            style,
        ]}>
      {text}
    </SafeText>);
}

