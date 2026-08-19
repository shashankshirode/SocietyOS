import { Messages } from '../../shared/constants/messages';
import { includeWhenPresent } from "../../shared/utils/presentProperty";
export interface AppAlertButton {
    text?: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}
export interface AppAlertOptions {
    cancelable?: boolean;
    onDismiss?: () => void;
}
export interface AppAlertRequest {
    kind: 'alert';
    title: string;
    message?: string;
    buttons: readonly AppAlertButton[];
    options?: AppAlertOptions;
}
export interface AppAlertPromptButton {
    text?: string;
    onPress?: (value?: string) => void;
    style?: 'default' | 'cancel' | 'destructive';
}
export interface AppAlertPromptRequest {
    kind: 'prompt';
    title: string;
    message?: string;
    buttons: readonly AppAlertPromptButton[];
    defaultValue?: string;
}
export type AppAlertHostRequest = AppAlertRequest | AppAlertPromptRequest;
type AppAlertHandler = (request: AppAlertHostRequest) => void;
let handler: AppAlertHandler | null = null;
const pendingRequests: AppAlertHostRequest[] = [];
export function registerAppAlertHandler(nextHandler: AppAlertHandler | null): void {
    handler = nextHandler;
    if (!handler)
        return;
    while (pendingRequests.length > 0) {
        const request = pendingRequests.shift();
        if (request)
            handler(request);
    }
}
export const AppAlert = {
    alert(title: string, message?: string, buttons: readonly AppAlertButton[] = [{ text: Messages.common.ok }], options?: AppAlertOptions): void {
        const request: AppAlertRequest = { kind: 'alert', title, ...includeWhenPresent("message", message), buttons, ...includeWhenPresent("options", options) };
        if (handler) {
            handler(request);
            return;
        }
        pendingRequests.push(request);
    },
    prompt(title: string, message?: string, callbackOrButtons: ((value?: string) => void) | readonly AppAlertPromptButton[] = [], _type?: 'default' | 'plain-text' | 'secure-text' | 'login-password', defaultValue = ''): void {
        const buttons = typeof callbackOrButtons === 'function'
            ? [{ text: Messages.common.ok, onPress: callbackOrButtons }]
            : callbackOrButtons;
        const request: AppAlertPromptRequest = {
            kind: 'prompt',
            title,
            ...includeWhenPresent("message", message),
            buttons,
            defaultValue
        };
        if (handler) {
            handler(request);
            return;
        }
        pendingRequests.push(request);
    }
};

