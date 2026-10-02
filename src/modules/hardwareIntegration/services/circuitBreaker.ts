import type { CircuitState } from '../../../shared/types/hardware.types';

export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeoutMs: number;
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private consecutiveFailures = 0;
  private lastStateChange = new Date().toISOString();
  private lastFailureTime = 0;

  constructor(private readonly config: CircuitBreakerConfig = { failureThreshold: 3, recoveryTimeoutMs: 30000 }) {}

  getState(): CircuitState {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.config.recoveryTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.lastStateChange = new Date().toISOString();
      }
    }
    return this.state;
  }

  recordSuccess(): void {
    this.consecutiveFailures = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      this.lastStateChange = new Date().toISOString();
    }
  }

  recordFailure(): void {
    this.consecutiveFailures += 1;
    this.lastFailureTime = Date.now();
    if (this.consecutiveFailures >= this.config.failureThreshold) {
      this.state = 'OPEN';
      this.lastStateChange = new Date().toISOString();
    }
  }

  isOpen(): boolean {
    return this.getState() === 'OPEN';
  }

  reset(): void {
    this.state = 'CLOSED';
    this.consecutiveFailures = 0;
    this.lastStateChange = new Date().toISOString();
  }

  getMetrics(): { state: CircuitState; consecutiveFailures: number; lastStateChange: string } {
    return {
      state: this.getState(),
      consecutiveFailures: this.consecutiveFailures,
      lastStateChange: this.lastStateChange,
    };
  }
}
