/**
 * Centralized injectable clock abstraction for SocietyOS.
 * Allows deterministic time progression (+15m, +1h, +1d, +7d, or custom ISO date) in test/demo modes
 * while defaulting to system time in production.
 */

export interface IAppClock {
  now(): number;
  iso(): string;
  date(): Date;
  advance(ms: number): void;
  advanceMinutes(minutes: number): void;
  advanceHours(hours: number): void;
  advanceDays(days: number): void;
  setDate(isoDateString: string): void;
  reset(): void;
  isMocked(): boolean;
  subscribe(listener: () => void): () => void;
}

class AppClockImpl implements IAppClock {
  private offsetMs = 0;
  private fixedTimestamp: number | null = null;
  private listeners = new Set<() => void>();

  now(): number {
    if (this.fixedTimestamp !== null) {
      return this.fixedTimestamp;
    }
    return Date.now() + this.offsetMs;
  }

  iso(): string {
    return new Date(this.now()).toISOString();
  }

  date(): Date {
    return new Date(this.now());
  }

  advance(ms: number): void {
    if (this.fixedTimestamp !== null) {
      this.fixedTimestamp += ms;
    } else {
      this.offsetMs += ms;
    }
    this.notify();
  }

  advanceMinutes(minutes: number): void {
    this.advance(minutes * 60 * 1000);
  }

  advanceHours(hours: number): void {
    this.advance(hours * 60 * 60 * 1000);
  }

  advanceDays(days: number): void {
    this.advance(days * 24 * 60 * 60 * 1000);
  }

  setDate(isoDateString: string): void {
    const parsed = new Date(isoDateString).getTime();
    if (!Number.isNaN(parsed)) {
      this.fixedTimestamp = parsed;
      this.notify();
    }
  }

  reset(): void {
    this.offsetMs = 0;
    this.fixedTimestamp = null;
    this.notify();
  }

  isMocked(): boolean {
    return this.offsetMs !== 0 || this.fixedTimestamp !== null;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }
}

export const AppClock: IAppClock = new AppClockImpl();
export const appClock = AppClock;
export default AppClock;
