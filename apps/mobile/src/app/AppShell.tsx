import React from "react";
import { View } from "react-native";
import { AppHeader } from "../shared/components/AppHeader";
import { AppScreen } from "../shared/layouts/AppScreen";
import { includeWhenPresent } from "../shared/utils/presentProperty";
import { styles } from "./styles/AppShell.styles";
import { useMessages as useGeneratedUiMessages } from "../messages/useMessages";
type AppShellProps = {
    title: string;
    children: React.ReactNode;
    subtitle?: string;
    rightLabel?: string;
    onRightPress?: () => void;
    onBack?: () => void;
    scroll?: boolean;
};
export function AppShell({ title, children, rightLabel, onRightPress, onBack, scroll = true, }: AppShellProps) {
    return (<AppScreen scroll={scroll}>
      <AppHeader title={title} showBack={Boolean(onBack)} {...includeWhenPresent("onBack", onBack)} {...includeWhenPresent("rightLabel", rightLabel)} {...includeWhenPresent("onRightPress", onRightPress)}/>
      <View style={styles.content}>{children}</View>
    </AppScreen>);
}
type RoleBasedAppShellProps = Omit<AppShellProps, 'title'> & {
    roleTitle: string;
};
export function RoleBasedAppShell({ roleTitle, ...props }: RoleBasedAppShellProps) {
    return <AppShell title={roleTitle} {...props}/>;
}
export function ResidentShell(props: Omit<AppShellProps, 'title'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return <AppShell title={localizedUiText.m_280eda6fb8fa} {...props}/>;
}
export function GuardShell(props: Omit<AppShellProps, 'title'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return <AppShell title={localizedUiText.m_57efa03814ce} {...props}/>;
}
export function AdminShell(props: Omit<AppShellProps, 'title'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return <AppShell title={localizedUiText.m_ec78428b9acc} {...props}/>;
}
export function TreasurerShell(props: Omit<AppShellProps, 'title'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return <AppShell title={localizedUiText.m_90f3a773feb4} {...props}/>;
}
export function FacilityShell(props: Omit<AppShellProps, 'title'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return <AppShell title={localizedUiText.m_c881461497cd} {...props}/>;
}
export default AppShell;

