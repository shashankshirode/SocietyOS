import { CleanlinessRating } from '../types/housekeeping.types';
import { getRequiredItem } from "../utils/requiredItem";
export interface CommonAreaInspection {
    id: string;
    area: string;
    inspectorName: string;
    rating: CleanlinessRating;
    damageObserved: boolean;
    safetyHazardObserved: boolean;
    wasteIssueObserved: boolean;
    comments: string;
    date: string;
}
export const mockCommonAreaInspections: CommonAreaInspection[] = Array.from({ length: 15 }, (_, idx) => {
    const areas = ['Lobby A', 'Lobby B', 'Clubhouse', 'Basement B1', 'Parking Area A', 'Waste Collection Room'];
    const ratings: CleanlinessRating[] = ['EXCELLENT', 'GOOD', 'NEEDS_ATTENTION', 'POOR', 'CRITICAL'];
    return {
        id: `cai-${idx + 1}`,
        area: getRequiredItem(areas, idx % areas.length, "commonAreaInspections.mock.ts"),
        inspectorName: 'Suresh Patil',
        rating: getRequiredItem(ratings, idx % ratings.length, "commonAreaInspections.mock.ts"),
        damageObserved: idx % 4 === 0,
        safetyHazardObserved: idx % 5 === 0,
        wasteIssueObserved: idx % 3 === 0,
        comments: `Routine common area inspection completed. Cleanliness is ${getRequiredItem(ratings, idx % ratings.length, "commonAreaInspections.mock.ts").toLowerCase()}.`,
        date: `2026-06-${String((idx % 28) + 1).padStart(2, '0')}`
    };
});

