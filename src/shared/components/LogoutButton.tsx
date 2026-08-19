import React from 'react';
import { useAppTheme } from '../theme/useAppTheme';
import { AppButton } from './AppButton';
import { AppIcon } from '../icons/AppIcon';
import { ConfirmationDialog } from '../modals/ConfirmationDialog';
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
export type LogoutButtonProps = {
    onConfirmLogout: () => void | Promise<void>;
    fullWidth?: boolean;
    disabled?: boolean;
};
export function LogoutButton({ onConfirmLogout, fullWidth = true, disabled = false, }: LogoutButtonProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [confirmVisible, setConfirmVisible] = React.useState(false);
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);
    async function handleConfirm() {
        setIsLoggingOut(true);
        try {
            await onConfirmLogout();
            setConfirmVisible(false);
        }
        finally {
            setIsLoggingOut(false);
        }
    }
    return (<>
      <AppButton title={localizedUiText.m_d0527e4b3d65} onPress={() => setConfirmVisible(true)} variant="danger" fullWidth={fullWidth} disabled={disabled || isLoggingOut} accessibilityLabel={localizedUiText.m_d0527e4b3d65} iconLeft={<AppIcon name="logout" size={18} color={colors.textOnPrimary}/>}/>
      <ConfirmationDialog visible={confirmVisible} title={localizedUiText.m_067f10b73411} message={localizedUiText.m_b660ce746f0c} confirmLabel="Logout" cancelLabel="Cancel" tone="danger" loading={isLoggingOut} onConfirm={handleConfirm} onCancel={() => {
            if (!isLoggingOut) {
                setConfirmVisible(false);
            }
        }}/>
    </>);
}
export default LogoutButton;

