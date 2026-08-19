import React from 'react';
import { ConfirmationDialog } from '../../../shared/modals/ConfirmationDialog';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export interface LogoutConfirmDialogProps {
    visible: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}
export function LogoutConfirmDialog({ visible, onConfirm, onCancel, loading = false, }: LogoutConfirmDialogProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<ConfirmationDialog visible={visible} title={localizedUiText.m_aa6c39523876} message={localizedUiText.m_9b0d715168c0} confirmLabel="Logout" cancelLabel="Cancel" tone="danger" loading={loading} onConfirm={onConfirm} onCancel={onCancel}/>);
}
export default LogoutConfirmDialog;

