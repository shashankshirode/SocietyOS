



import type {
  SosType,
  SosResponsePlan,
  SosResidenceContext,
} from './sosResponsePlan.types';
import { sosConfigurationMockSource } from './sosConfiguration.mockSource';



export interface SosConfigurationRepositoryContract {
  
  getResponsePlans(context: SosResidenceContext): Promise<SosResponsePlan[]>;

  
  getResponsePlan(context: SosResidenceContext, sosType: SosType): Promise<SosResponsePlan>;

  
  saveResponsePlan(context: SosResidenceContext, plan: SosResponsePlan): Promise<SosResponsePlan>;

  
  resetToDefault(context: SosResidenceContext, sosType: SosType): Promise<SosResponsePlan>;

  
  resetAllToDefault(context: SosResidenceContext): Promise<SosResponsePlan[]>;
}





export const sosConfigurationRepository: SosConfigurationRepositoryContract = {
  getResponsePlans(context: SosResidenceContext): Promise<SosResponsePlan[]> {
    
    return sosConfigurationMockSource.getResponsePlans(context);
  },

  getResponsePlan(context: SosResidenceContext, sosType: SosType): Promise<SosResponsePlan> {
    return sosConfigurationMockSource.getResponsePlan(context, sosType);
  },

  saveResponsePlan(context: SosResidenceContext, plan: SosResponsePlan): Promise<SosResponsePlan> {
    return sosConfigurationMockSource.saveResponsePlan(context, plan);
  },

  resetToDefault(context: SosResidenceContext, sosType: SosType): Promise<SosResponsePlan> {
    return sosConfigurationMockSource.resetToDefault(context, sosType);
  },

  resetAllToDefault(context: SosResidenceContext): Promise<SosResponsePlan[]> {
    return sosConfigurationMockSource.resetAllToDefault(context);
  },
};
