import { residentRoutes } from './residentRoutes';
import type { ResidentRouteConfig } from './residentNavigation.types';
import type { Absent } from "../../../shared/types/absence.types";
export const residentNavigationConfig = {
    routes: residentRoutes,
    getRouteConfig(name: string): ResidentRouteConfig | Absent {
        return residentRoutes.find((route) => route.name === name);
    },
};

