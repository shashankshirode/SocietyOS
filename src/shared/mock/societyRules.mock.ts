import type { Rule, RuleCategory } from '../types/rules.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockSocietyRules: Rule[] = [
    {
        id: 'rule-001',
        ruleNumber: 'R-GEN-01',
        title: 'Silent Hours and Noise Control',
        category: 'NOISE',
        version: '2.1',
        status: 'ACTIVE',
        effectiveDate: '2026-01-01',
        appliesToRoles: ['OWNER', 'TENANT', 'STAFF', 'VISITOR'],
        summary: 'Maintains peace and quiet during night and afternoon hours.',
        detailedText: 'Loud music, high-volume TV, drilling, hammer work, or shouting is strictly prohibited in all flats and common areas during Quiet Hours: 10:00 PM to 7:00 AM on all days, and 1:30 PM to 4:00 PM on weekends. Social gatherings or parties extending past 10:00 PM must obtain prior permission from the society office and ensure sound levels are kept within reasonable residential decibel levels.',
        examples: [
            'Playing loud music on balcony after 10:00 PM.',
            'Contractor drilling adjacent wall at 2:00 PM on Sunday.',
            'Shouting or loud arguments in the common lobbies.'
        ],
        penaltyPlaceholderDescription: 'First offence: Written warning. Second offence: Rs. 500 penalty. Repeat offences: Rs. 1000 per instance, subject to committee approval.',
        acknowledgementRequired: true,
        versionHistory: [
            { version: '2.0', publishDate: '2025-01-01', summaryOfChanges: 'Initial quiet hours policy' },
            { version: '2.1', publishDate: '2026-01-01', summaryOfChanges: 'Added afternoon quiet hours (1:30 PM - 4:00 PM) on weekends.' }
        ]
    },
    {
        id: 'rule-002',
        ruleNumber: 'R-REN-03',
        title: 'Renovation Permit and Timing Guidelines',
        category: 'RENOVATION',
        version: '1.2',
        status: 'ACTIVE',
        effectiveDate: '2026-02-15',
        appliesToRoles: ['OWNER', 'TENANT'],
        summary: 'Regulates interior flat modification hours, debris disposal, and elevator protection.',
        detailedText: 'No resident shall commence structural or interior renovations without obtaining a written NOC from the society office. Noisy renovation work (drilling, cutting, demolition) is permitted only from Monday to Saturday between 9:00 AM and 6:00 PM. No work is allowed on Sundays and public holidays. Debris must be bagged and disposed of outside the society premises within 48 hours. Lift walls must be padded during material transit.',
        examples: [
            'Renovation work continuing past 6:00 PM.',
            'Dumping tile debris in the common garbage chute.',
            'Using the passenger lift for transporting heavy cement bags without padding.'
        ],
        penaltyPlaceholderDescription: 'Rs. 2,000 for work outside hours. Rs. 5,000 for illegal debris dumping in common areas.',
        acknowledgementRequired: true,
        versionHistory: [
            { version: '1.0', publishDate: '2024-05-10', summaryOfChanges: 'Initial renovation policy.' }
        ]
    },
    {
        id: 'rule-003',
        ruleNumber: 'R-PET-02',
        title: 'Pet Care and Lobby Leash Rules',
        category: 'PET',
        version: '1.0',
        status: 'ACTIVE',
        effectiveDate: '2025-06-01',
        appliesToRoles: ['OWNER', 'TENANT'],
        summary: 'Ensures safety and hygiene of pets in common lobbies, elevators, and gardens.',
        detailedText: 'All pet dogs must be leashed when in the common lobbies, corridors, elevators, and society gardens. Pet owners are solely responsible for cleaning up after their pets if they defecate on society premises. Failure to scoop the poop will attract cleaning charges. Pets must not be allowed to bark continuously in balconies causing nuisance to neighbours.',
        examples: [
            'Leaving a dog unleashed in the parking lot or playground.',
            'Not cleaning pet waste from the walking track.',
            'Dog barking continuously on the balcony for hours.'
        ],
        penaltyPlaceholderDescription: 'Rs. 500 for leash violation. Rs. 1,000 for pet waste cleaning fee.',
        acknowledgementRequired: true,
        versionHistory: []
    }
];
const categories: RuleCategory[] = ['GENERAL', 'RENOVATION', 'NOISE', 'PET', 'PARKING', 'WASTE', 'FACILITY', 'VISITOR', 'TENANT', 'MOVE_IN_MOVE_OUT', 'SAFETY', 'FIRE_LIFT', 'PENALTY_POLICY'];
for (let i = 4; i <= 30; i++) {
    const cat = getRequiredItem(categories, i % categories.length, "societyRules.mock.ts");
    mockSocietyRules.push({
        id: `rule-0${i}`,
        ruleNumber: `R-${cat.slice(0, 3)}-0${i}`,
        title: `Society Regulation on ${cat.replace(/_/g, ' ').toLowerCase()} ${i}`,
        category: cat,
        version: '1.0',
        status: 'ACTIVE',
        effectiveDate: `2026-03-${10 + i % 15}`,
        appliesToRoles: ['OWNER', 'TENANT'],
        summary: `Short summary of regulation number ${i} regarding ${cat}.`,
        detailedText: `This is the detailed terms for rule ${i} under category ${cat}. Residents must comply with all provisions, park in designated slots, maintain cleanliness, and cooperate with security checks at the gate. Violations will be reviewed by the managing committee.`,
        examples: [`Example violation 1 of rule ${i}`, `Example violation 2 of rule ${i}`],
        penaltyPlaceholderDescription: 'Rs. 500 penalty for repeated infractions.',
        acknowledgementRequired: i % 2 === 0,
        versionHistory: []
    });
}

