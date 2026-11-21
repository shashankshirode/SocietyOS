import { NavigationState, PartialState } from '@react-navigation/native';
import { shouldHideTabBar } from './residentTabVisibility';
import type { Absent } from "../../../shared/types/absence.types";
export function getDeepActiveRouteName(state: NavigationState | PartialState<NavigationState> | Absent): string | null {
    if (!state || !state.routes)
        return null;
    const route = state.routes[state.index ?? 0];
    if (!route)
        return null;
    if (route.state) {
        return getDeepActiveRouteName(route.state);
    }
    return route.name;
}
export function useResidentTabVisibility(state: NavigationState | Absent): boolean {
    const activeRouteName = getDeepActiveRouteName(state);
    return activeRouteName ? shouldHideTabBar(activeRouteName) : false;
}

