import { useState } from 'react';
import { interFlatRepository } from './interFlat.repository';

export function useRuleAcknowledgement(ruleId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const acknowledge = async () => {
    setIsSubmitting(true);
    try {
      return await interFlatRepository.acknowledgeRule(ruleId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { acknowledge, isSubmitting };
}
