import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import { residentHomeContextStore } from './residentHomeContext.store';
import type { ActiveResidentHomeContext } from '../data/residentHomeContext.types';
import { residentHomeContextStorage } from '../utils/residentHomeContextStorage';
import type { Absent } from "../../../../shared/types/absence.types";
const ResidentHomeContextReact = createContext<ActiveResidentHomeContext | Absent>(undefined);
export function ResidentHomeContextProvider({ children }: {
    children: React.ReactNode;
}) {
    const activeContext = useSyncExternalStore(residentHomeContextStore.subscribe, residentHomeContextStore.getActiveContext, residentHomeContextStore.getActiveContext);
    useEffect(() => {
        let isMounted = true;
        async function restoreActiveHome(): Promise<void> {
            const storedHomeContextId = await residentHomeContextStorage.getSelectedContextId();
            if (!isMounted) {
                return;
            }
            const restoredContext = residentHomeContextStore.resolveRestoredContext(storedHomeContextId);
            residentHomeContextStore.setActiveContext(restoredContext);
            if (storedHomeContextId !== restoredContext.homeContextId) {
                await residentHomeContextStorage.saveSelectedContextId(restoredContext.homeContextId);
            }
        }
        void restoreActiveHome();
        return () => {
            isMounted = false;
        };
    }, []);
    return (<ResidentHomeContextReact.Provider value={activeContext}>
      {children}
    </ResidentHomeContextReact.Provider>);
}
export function useResidentHomeContext(): ActiveResidentHomeContext {
    const context = useContext(ResidentHomeContextReact);
    if (!context) {
        return residentHomeContextStore.getActiveContext();
    }
    return context;
}
export default ResidentHomeContextProvider;

