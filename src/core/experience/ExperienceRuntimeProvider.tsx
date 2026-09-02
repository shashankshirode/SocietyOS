import React, { createContext, useContext } from 'react';
import { useReducedMotion } from '../../shared/motion/useReducedMotion';
import { createExperienceRuntimeProfile, resolveTransitionSpec } from './experienceRuntime';
import type { ExperienceRuntimeContextValue, NavigationTransition } from './experienceRuntime.types';

const defaultProfile = createExperienceRuntimeProfile({ reducedMotion: false });
const defaultContext: ExperienceRuntimeContextValue = {
  profile: defaultProfile,
  transition: (transition: NavigationTransition) => resolveTransitionSpec(transition, defaultProfile),
};
const ExperienceRuntimeContext = createContext<ExperienceRuntimeContextValue>(defaultContext);

export function ExperienceRuntimeProvider({ children }: { readonly children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const profile = createExperienceRuntimeProfile({ reducedMotion });
  const value: ExperienceRuntimeContextValue = {
    profile,
    transition: (transition) => resolveTransitionSpec(transition, profile),
  };
  return <ExperienceRuntimeContext.Provider value={value}>{children}</ExperienceRuntimeContext.Provider>;
}

export function useExperienceRuntime(): ExperienceRuntimeContextValue {
  return useContext(ExperienceRuntimeContext);
}