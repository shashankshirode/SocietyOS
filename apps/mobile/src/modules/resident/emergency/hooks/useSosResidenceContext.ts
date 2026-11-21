import { useMemo } from 'react';
import type { SosResidenceContext } from '../data/sosResponsePlan.types';
import { useActiveResidentHome } from '../../homeContext';
import type { Absent } from "../../../../shared/types/absence.types";
export function useSosResidenceContext(): SosResidenceContext | Absent {
    const { activeContext } = useActiveResidentHome();
    return useMemo(() => {
        if (!activeContext)
            return undefined;
        return {
            societyId: activeContext.societyId,
            residenceId: activeContext.homeContextId,
            unitId: activeContext.unitId,
            flatNumber: activeContext.flatNumber,
            tower: activeContext.towerName ?? activeContext.wingName ?? activeContext.buildingName ?? '',
            residentRole: activeContext.residentRole,
        };
    }, [activeContext]);
}

