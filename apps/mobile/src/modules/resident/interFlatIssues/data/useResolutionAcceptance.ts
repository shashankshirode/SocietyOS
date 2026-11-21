import { useState } from 'react';
import { interFlatRepository } from './interFlat.repository';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
export function useResolutionAcceptance(proposalId: string) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const accept = async (feedback: string | Absent, role: 'REPORTER' | 'INVOLVED_FLAT') => {
        setIsSubmitting(true);
        try {
            return await interFlatRepository.acceptResolutionProposal(proposalId, { ...includeWhenPresent("feedback", feedback), role });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const reject = async (feedback: string | Absent, role: 'REPORTER' | 'INVOLVED_FLAT') => {
        setIsSubmitting(true);
        try {
            return await interFlatRepository.rejectResolutionProposal(proposalId, { ...includeWhenPresent("feedback", feedback), role });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return { accept, reject, isSubmitting };
}

