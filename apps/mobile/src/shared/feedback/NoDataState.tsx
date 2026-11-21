import React from 'react';
import { EmptyState, type EmptyStateProps } from './EmptyState';
import { includeWhenPresent } from "../utils/presentProperty";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../localization/activeUiLiteral";
interface NoDataStateProps extends Omit<EmptyStateProps, 'title' | 'description'> {
    title?: string;
    description?: string;
    hasActiveFilters?: boolean;
}
export function NoDataState({ title, description, hasActiveFilters = false, ...rest }: NoDataStateProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const defaultTitle = hasActiveFilters ? getActiveUiLiteral("m_7d7e36058609") : getActiveUiLiteral("m_d2d2d48c815b");
    const defaultDescription = hasActiveFilters
        ? getActiveUiLiteral("m_aa73801a2854") : getActiveUiLiteral("m_a045ef862b8c");
    return (<EmptyState title={title || defaultTitle} description={description || defaultDescription} icon={hasActiveFilters ? 'filter' : 'empty'} {...includeWhenPresent("actionLabel", hasActiveFilters ? getActiveUiLiteral("m_7179ea0035fc") : undefined)} {...rest}/>);
}
export default NoDataState;

