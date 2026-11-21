import React from "react";
import { type ViewStyle } from "react-native";
import { AmbientPageChrome } from "../../resident/experience/AmbientPageChrome";
export type ChatPageHeaderProps = {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    roleLabel?: string;
    rightAction?: React.ReactNode;
    style?: ViewStyle;
    testID?: string;
};
export function ChatPageHeader({ title, subtitle, showBackButton = false, onBackPress, roleLabel, rightAction, style, testID, }: ChatPageHeaderProps) {
    return <AmbientPageChrome titleKey={title} subtitleKey={subtitle} contextLabelKey={roleLabel ?? 'MESSAGES'} showBackButton={showBackButton} onBackPress={onBackPress} contextualAction={rightAction} style={style} {...(testID ? { testID } : {})}/>;
}
export default ChatPageHeader;
