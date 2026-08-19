import React from 'react';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { ResidentAppHeader } from '../../modules/resident/navigation/ResidentAppHeader';
import type { MessageKey, ResidentHeaderAction, ResidentHeaderVariant } from '../../modules/resident/navigation/residentHeader.types';
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import type { RootTabParamList } from '../../app/navigation/navigation.types';
export interface ResidentPageHeaderProps {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    rightAction?: React.ReactNode;
    titleKey?: MessageKey;
    subtitleKey?: MessageKey;
    actions?: ResidentHeaderAction[];
    variant?: ResidentHeaderVariant;
    roleLabelKey?: MessageKey;
    testID?: string;
}
export function ResidentPageHeader({ title, subtitle, showBackButton = true, onBackPress, actions, titleKey, subtitleKey, variant = 'detail', roleLabelKey = 'resident.header.roles.owner', testID, }: ResidentPageHeaderProps) {
    const navigation = useNavigation<NavigationProp<RootTabParamList>>();
    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        }
        else if (navigation.canGoBack()) {
            navigation.goBack();
        }
        else {
            navigation.navigate('HomeTab', { screen: 'ResidentHome' });
        }
    };
    return (<ResidentAppHeader variant={variant} titleKey={titleKey ?? title} {...includeWhenPresent("subtitleKey", subtitleKey ?? subtitle)} roleLabelKey={roleLabelKey} showBackButton={showBackButton} {...includeWhenPresent("actions", actions)} onBackPress={handleBack} includeSafeAreaTop {...includeWhenPresent("testID", testID)}/>);
}
export default ResidentPageHeader;
