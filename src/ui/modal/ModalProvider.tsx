import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMessages } from "../../messages";
import { resolveMessage } from "../../messages/resolveMessage";
import { AppButton } from "../../shared/components/AppButton";
import { useAppTheme } from "../../shared/theme";
import { AppModal } from "./AppModal";
import { ModalHeader } from "./ModalHeader";
import { StatusModal } from "./StatusModal";
import { registerAppAlertHandler, type AppAlertHostRequest } from "./AppAlert";
import type { AppModalController, AppModalRequest, ModalAction } from "./modal.types";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createTextInputColorBackgroundColorBorderColorStyle } from "./styles/ModalProvider.styles";
interface QueuedModal {
    id: string;
    request: AppModalRequest;
}
interface LegacyQueuedModal {
    id: string;
    legacyRequest: AppAlertHostRequest;
}
type ModalQueueItem = QueuedModal | LegacyQueuedModal;
const ModalContext = createContext<AppModalController | null>(null);
function isLegacyModal(item: ModalQueueItem): item is LegacyQueuedModal {
    return 'legacyRequest' in item;
}
function createModalId(): string {
    return `app-modal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
export function ModalProvider({ children }: {
    children: React.ReactNode;
}) {
    const messages = useMessages();
    const { colors } = useAppTheme();
    const [queue, setQueue] = useState<ModalQueueItem[]>([]);
    const [visible, setVisible] = useState(false);
    const [promptText, setPromptText] = useState('');
    const promptTextRef = useRef('');
    const pendingCallbackRef = useRef<(() => void) | null>(null);
    const active = queue[0];
    useEffect(() => {
        if (active) {
            const initialPromptText = isLegacyModal(active) && active.legacyRequest.kind === 'prompt'
                ? active.legacyRequest.defaultValue ?? ''
                : '';
            promptTextRef.current = initialPromptText;
            setPromptText(initialPromptText);
            setVisible(true);
        }
    }, [active]);
    const enqueueLegacyAlert = useCallback((legacyRequest: AppAlertHostRequest) => {
        setQueue((current) => [...current, { id: createModalId(), legacyRequest }]);
    }, []);
    useEffect(() => {
        registerAppAlertHandler(enqueueLegacyAlert);
        return () => registerAppAlertHandler(null);
    }, [enqueueLegacyAlert]);
    const show = useCallback((request: AppModalRequest) => {
        const id = request.id ?? createModalId();
        setQueue((current) => [...current, { id, request }]);
        return id;
    }, []);
    const hide = useCallback((id?: string) => {
        setQueue((current) => {
            if (!id || current[0]?.id === id) {
                setVisible(false);
                return current;
            }
            return current.filter((item) => item.id !== id);
        });
    }, []);
    const hideAll = useCallback(() => {
        pendingCallbackRef.current = null;
        setVisible(false);
        setQueue((current) => current.slice(0, 1));
    }, []);
    const controller = useMemo<AppModalController>(() => ({ show, hide, hideAll }), [hide, hideAll, show]);
    const finishDismiss = useCallback(() => {
        const dismissed = queue[0];
        setQueue((current) => current.slice(1));
        const callback = pendingCallbackRef.current;
        pendingCallbackRef.current = null;
        callback?.();
        if (dismissed) {
            if (isLegacyModal(dismissed)) {
                if (dismissed.legacyRequest.kind === 'alert') {
                    dismissed.legacyRequest.options?.onDismiss?.();
                }
            }
            else {
                dismissed.request.onDismiss?.();
            }
        }
    }, [queue]);
    const requestClose = useCallback(() => {
        if (!active)
            return;
        const dismissible = isLegacyModal(active)
            ? active.legacyRequest.kind === 'prompt' || active.legacyRequest.options?.cancelable !== false
            : active.request.dismissible !== false;
        if (dismissible)
            setVisible(false);
    }, [active]);
    const runAction = useCallback((callback?: () => void) => {
        if (!visible)
            return;
        pendingCallbackRef.current = callback ?? null;
        setVisible(false);
    }, [visible]);
    const renderModernActions = (actions: readonly ModalAction[]) => (<View style={styles.actions}>
      {actions.map((action) => (<AppButton key={action.id} title={resolveMessage(messages, action.labelKey, action.labelValues)} accessibilityLabel={resolveMessage(messages, action.accessibilityLabelKey ?? action.labelKey, action.labelValues)} variant={action.tone === 'danger' ? 'danger' : action.tone === 'warning' ? 'warning' : 'primary'} {...includeWhenPresent("disabled", action.disabled)} {...includeWhenPresent("loading", action.loading)} fullWidth onPress={() => runAction(action.onPress)}/>))}
    </View>);
    const renderActiveModal = () => {
        if (!active)
            return null;
        if (isLegacyModal(active)) {
            const { title, message, buttons } = active.legacyRequest;
            const isPrompt = active.legacyRequest.kind === 'prompt';
            return (<AppModal visible={visible} onClose={requestClose} onDismiss={finishDismiss} centered>
          <ModalHeader title={title} {...includeWhenPresent("subtitle", message)} onClose={requestClose}/>
          {isPrompt ? (<TextInput value={promptText} onChangeText={(value) => {
                        promptTextRef.current = value;
                        setPromptText(value);
                    }} autoFocus style={[
                        styles.promptInput,
                        createTextInputColorBackgroundColorBorderColorStyle(colors.textPrimary, colors.inputBackground, colors.border),
                    ]} accessibilityLabel={title}/>) : null}
          <View style={styles.actions}>
            {buttons.map((button, index) => (<AppButton key={`${button.text ?? messages.common.ok}-${index}`} title={button.text ?? messages.common.ok} variant={button.style === 'destructive' ? 'danger' : button.style === 'cancel' ? 'outline' : 'primary'} fullWidth onPress={() => runAction(isPrompt
                        ? () => button.onPress?.(promptTextRef.current)
                        : button.onPress)}/>))}
          </View>
        </AppModal>);
        }
        const { request } = active;
        if (request.presentation === 'status') {
            return (<StatusModal visible={visible} type={request.tone === 'danger'
                    ? 'error'
                    : request.tone === 'success' || request.tone === 'warning' || request.tone === 'info'
                        ? request.tone
                        : 'info'} title={resolveMessage(messages, request.titleKey, request.titleValues)} {...includeWhenPresent("message", request.messageKey ? resolveMessage(messages, request.messageKey, request.messageValues) : undefined)} onClose={requestClose} onDismiss={finishDismiss}/>);
        }
        return (<AppModal visible={visible} onClose={requestClose} onDismiss={finishDismiss} centered={request.presentation !== 'bottomSheet' && request.presentation !== 'formSheet'} preventDismiss={request.dismissible === false}>
        <ModalHeader title={resolveMessage(messages, request.titleKey, request.titleValues)} {...includeWhenPresent("subtitle", request.messageKey ? resolveMessage(messages, request.messageKey, request.messageValues) : undefined)} {...includeWhenPresent("icon", request.tone === 'danger' ? <Ionicons name="warning" size={24}/> : undefined)} onClose={requestClose} showClose={request.dismissible !== false}/>
        {request.content}
        {request.actions ? renderModernActions(request.actions) : null}
      </AppModal>);
    };
    return (<ModalContext.Provider value={controller}>
      {children}
      {renderActiveModal()}
    </ModalContext.Provider>);
}
export function useAppModal(): AppModalController {
    const controller = useContext(ModalContext);
    if (!controller) {
        throw new Error('useAppModal must be used within ModalProvider');
    }
    return controller;
}

