import { useWindowDimensions, View } from "react-native";
import { SafeText } from "../../../shared/components/SafeText";
import { useMessages } from "../../../shared/constants/useMessages";
import type { MessageKey } from "./residentHeader.types";
import type { Absent } from "../../../shared/types/absence.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3 } from "./styles/ResidentHeaderTitle.styles";
export type MessageFunction = (...args: (string | number)[]) => string;
export type MessageNode = string | MessageTree | MessageFunction;
export type MessageTree = {
    readonly [key: string]: MessageNode;
};
export function resolveResidentMessage(messages: MessageTree, key: MessageKey): string {
    const segments = key.split('.');
    let current: MessageNode = messages;
    for (const segment of segments) {
        if (typeof current === 'string' || typeof current === 'function') {
            return key;
        }
        const next: MessageNode | Absent = current[segment];
        if (!next) {
            return key;
        }
        current = next;
    }
    return typeof current === 'string' ? current : key;
}
export type ResidentHeaderTitleProps = {
    titleKey: MessageKey;
    subtitleKey?: MessageKey;
    contextLabelKey?: MessageKey;
    textColor: string;
    mutedTextColor: string;
};
export function resolveResidentHeaderTextLines(fontScale: number): 1 | 2 {
    return fontScale >= 1.3 ? 2 : 1;
}
export function ResidentHeaderTitle({ titleKey, subtitleKey, contextLabelKey, textColor, mutedTextColor, }: ResidentHeaderTitleProps) {
    const messages = useMessages();
    const { fontScale } = useWindowDimensions();
    const numberOfLines = resolveResidentHeaderTextLines(fontScale);
    const messageTree = messages as MessageTree;
    const title = resolveResidentMessage(messageTree, titleKey);
    const subtitle = subtitleKey ? resolveResidentMessage(messageTree, subtitleKey) : undefined;
    const contextLabel = contextLabelKey ? resolveResidentMessage(messageTree, contextLabelKey) : undefined;
    return (<View style={styles.container}>
      {contextLabel ? (<SafeText variant="tiny" style={[styles.context, createSafeTextColorStyle(mutedTextColor)]} numberOfLines={numberOfLines} maxFontSizeMultiplier={1.5}>
          {contextLabel}
        </SafeText>) : null}
      <SafeText variant="bodyStrong" style={[styles.title, createSafeTextColorStyle2(textColor)]} numberOfLines={numberOfLines} maxFontSizeMultiplier={1.5}>
        {title}
      </SafeText>
      {subtitle ? (<SafeText variant="tiny" style={[styles.subtitle, createSafeTextColorStyle3(mutedTextColor)]} numberOfLines={numberOfLines} maxFontSizeMultiplier={1.5}>
          {subtitle}
        </SafeText>) : null}
    </View>);
}

