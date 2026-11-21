import React from 'react';
import { AppBottomSheet, type AppBottomSheetProps } from '../bottomSheet';
import { ModalHeader } from './ModalHeader';
import { includeWhenPresent } from "../../shared/utils/presentProperty";
export interface AppFormSheetProps extends Omit<AppBottomSheetProps, 'header'> {
    title: string;
    subtitle?: string;
}
export function AppFormSheet({ title, subtitle, onClose, ...props }: AppFormSheetProps) {
    return (<AppBottomSheet {...props} onClose={onClose} header={<ModalHeader title={title} {...includeWhenPresent("subtitle", subtitle)} onClose={onClose}/>}/>);
}

