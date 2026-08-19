import { residentMockSeed } from './residentMockSeed';
import { residentMockFeatureKeys, type ResidentMockScenarioMatrixEntry } from './residentMockScenario.types';

export const residentMockScenarioMatrix: readonly ResidentMockScenarioMatrixEntry[] =
  residentMockSeed.flatMap((scenario) =>
    residentMockFeatureKeys.map((feature) => ({
      homeContextId: scenario.homeContextId,
      feature,
      enabled: scenario.enabledFeatures.includes(feature),
      recordCount: scenario.records[feature].length,
      supportedStates: scenario.edgeCases
        .filter((edgeCase) => edgeCase.feature === feature)
        .map((edgeCase) => edgeCase.state),
    }))
  );
