



import type {
  SosType,
  SosResponsePlan,
  SosResidenceContext,
} from './sosResponsePlan.types';
import {
  createDefaultResponsePlan,
  createAllDefaultResponsePlans,
} from './sosDefaultResponsePlans';



const planStore = new Map<string, Map<SosType, SosResponsePlan>>();

function getResidenceStore(residenceId: string): Map<SosType, SosResponsePlan> {
  let store = planStore.get(residenceId);
  if (!store) {
    store = new Map<SosType, SosResponsePlan>();
    planStore.set(residenceId, store);
  }
  return store;
}

function ensurePlansExist(context: SosResidenceContext): void {
  const store = getResidenceStore(context.residenceId);
  if (store.size === 0) {
    const defaults = createAllDefaultResponsePlans(context);
    for (const plan of defaults) {
      store.set(plan.sosType, plan);
    }
  }
}

function delay(ms: number = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}



export const sosConfigurationMockSource = {
  async getResponsePlans(context: SosResidenceContext): Promise<SosResponsePlan[]> {
    await delay();
    ensurePlansExist(context);
    const store = getResidenceStore(context.residenceId);
    return Array.from(store.values());
  },

  async getResponsePlan(context: SosResidenceContext, sosType: SosType): Promise<SosResponsePlan> {
    await delay(200);
    ensurePlansExist(context);
    const store = getResidenceStore(context.residenceId);
    const plan = store.get(sosType);
    if (!plan) {
      
      const newPlan = createDefaultResponsePlan(sosType, context);
      store.set(sosType, newPlan);
      return newPlan;
    }
    return plan;
  },

  async saveResponsePlan(context: SosResidenceContext, plan: SosResponsePlan): Promise<SosResponsePlan> {
    await delay(300);
    ensurePlansExist(context);
    const store = getResidenceStore(context.residenceId);
    const updated: SosResponsePlan = {
      ...plan,
      version: (plan.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    };
    store.set(updated.sosType, updated);
    return updated;
  },

  async resetToDefault(context: SosResidenceContext, sosType: SosType): Promise<SosResponsePlan> {
    await delay(300);
    const store = getResidenceStore(context.residenceId);
    const newPlan = createDefaultResponsePlan(sosType, context);
    store.set(sosType, newPlan);
    return newPlan;
  },

  async resetAllToDefault(context: SosResidenceContext): Promise<SosResponsePlan[]> {
    await delay(500);
    const store = getResidenceStore(context.residenceId);
    store.clear();
    const defaults = createAllDefaultResponsePlans(context);
    for (const plan of defaults) {
      store.set(plan.sosType, plan);
    }
    return defaults;
  },

  
  _resetAll(): void {
    planStore.clear();
  },
};
