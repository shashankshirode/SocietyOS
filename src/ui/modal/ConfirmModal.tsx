import React from 'react';
import { AppModal } from './AppModal';
import { ModalHeader } from './ModalHeader';
import { ModalFooter } from './ModalFooter';
import { Messages } from '../../shared/constants/messages';
import { includeWhenPresent } from "../../shared/utils/presentProperty";
export type ConfirmModalTone = 'primary' | 'danger' | 'warning';
interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: ConfirmModalTone;
    loading?: boolean;
    icon?: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
}
export function ConfirmModal({ visible, title, message, confirmLabel, cancelLabel, tone = 'primary', loading = false, icon, onConfirm, onCancel, }: ConfirmModalProps) {
    return (<AppModal visible={visible} onClose={onCancel} centered>
      <ModalHeader title={title} {...includeWhenPresent("subtitle", message)} {...includeWhenPresent("icon", icon)} onClose={onCancel}/>
      <ModalFooter secondaryAction={{
            label: cancelLabel || Messages.common.cancel,
            onPress: onCancel,
            disabled: loading,
            accessibilityLabel: Messages.accessibility.modal.cancel
        }} {...includeWhenPresent("primaryAction", tone === 'danger'
        ? undefined
        : {
            label: confirmLabel || Messages.common.confirm,
            onPress: onConfirm,
            loading,
            disabled: loading,
            accessibilityLabel: Messages.accessibility.modal.confirm
        })} {...includeWhenPresent("dangerAction", tone === 'danger'
        ? {
            label: confirmLabel || Messages.common.confirm,
            onPress: onConfirm,
            loading,
            disabled: loading,
            variant: 'danger',
            accessibilityLabel: Messages.accessibility.modal.confirm
        }
        : tone === 'warning'
            ? {
                label: confirmLabel || Messages.common.confirm,
                onPress: onConfirm,
                loading,
                disabled: loading,
                variant: 'warning',
                accessibilityLabel: Messages.accessibility.modal.confirm
            }
            : undefined)}/>
    </AppModal>);
}
export default ConfirmModal;

