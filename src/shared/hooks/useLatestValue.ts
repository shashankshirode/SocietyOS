import { useMemo, useRef } from 'react';
import type { Absent } from "../types/absence.types";
export function useLatestValue<T>(value: T, version: string | Absent) {
    const valueRef = useRef(value);
    valueRef.current = value;
    return useMemo(() => ({ valueRef, version }), [version]);
}

