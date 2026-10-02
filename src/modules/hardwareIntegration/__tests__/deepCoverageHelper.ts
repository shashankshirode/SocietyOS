import {
  deviceRegistryService,
  connectorFrameworkService,
  rfidIntegrationService,
  anprIntegrationService,
  boomBarrierService,
  cctvIntegrationService,
  smartMeterConnectorService,
  evChargingConnectorService,
  hardwareHealthObservabilityService,
  assertCapability,
  type HardwareActorContext,
  CircuitBreaker,
} from '../services';

export const circuitBreakerInstance = new CircuitBreaker();

export {
  deviceRegistryService,
  connectorFrameworkService,
  rfidIntegrationService,
  anprIntegrationService,
  boomBarrierService,
  cctvIntegrationService,
  smartMeterConnectorService,
  evChargingConnectorService,
  hardwareHealthObservabilityService,
  assertCapability,
  type HardwareActorContext,
};
