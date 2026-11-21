import { AppClock } from '../clock/AppClock';
import { ScenarioOrchestrator } from '../scenario/ScenarioOrchestrator';

export type FreshnessLevel = 'LIVE' | 'FRESH' | 'STALE' | 'OFFLINE' | 'RECONNECTING';

export interface DomainFreshnessState {
  domainKey: string;
  lastFetchedAt: number;
  freshness: FreshnessLevel;
}

class DataFreshnessCoordinatorEngine {
  private domainTimestamps = new Map<string, number>();

  recordFetch(domainKey: string) {
    this.domainTimestamps.set(domainKey, AppClock.now());
  }

  getFreshness(domainKey: string, maxFreshAgeMs = 120_000): FreshnessLevel {
    const network = ScenarioOrchestrator.getNetworkState();
    if (network === 'offline') {
      return 'OFFLINE';
    }

    const lastFetched = this.domainTimestamps.get(domainKey);
    if (!lastFetched) {
      return 'FRESH';
    }

    const age = AppClock.now() - lastFetched;
    if (age <= 15_000) return 'LIVE';
    if (age <= maxFreshAgeMs) return 'FRESH';
    return 'STALE';
  }
}

export const DataFreshnessCoordinator = new DataFreshnessCoordinatorEngine();
export default DataFreshnessCoordinator;
