export type MockStorageSnapshot<TState> = {
  seed: TState;
  current: TState;
};

export function createMockStorage<TState>(seed: TState) {
  let current = seed;

  return {
    getSnapshot(): MockStorageSnapshot<TState> {
      return { seed, current };
    },
    getState(): TState {
      return current;
    },
    setState(nextState: TState): TState {
      current = nextState;
      return current;
    },
    reset(): TState {
      current = seed;
      return current;
    },
  };
}

