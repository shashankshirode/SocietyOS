export type ChatStateSnapshot = {
  activeResidenceId: string | null;
  selectedChannelId: string | null;
  draftVersion: number;
};

const drafts = new Map<string, string>();
const listeners = new Set<() => void>();
let state: ChatStateSnapshot = { activeResidenceId: null, selectedChannelId: null, draftVersion: 0 };

function emit(): void {
  listeners.forEach((listener) => listener());
}

export const chatStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): ChatStateSnapshot { return state; },
  switchResidence(residenceId: string): void {
    if (state.activeResidenceId === residenceId) return;
    state = { ...state, activeResidenceId: residenceId, selectedChannelId: null };
    emit();
  },
  selectChannel(channelId: string | null): void {
    if (state.selectedChannelId === channelId) return;
    state = { ...state, selectedChannelId: channelId };
    emit();
  },
  getDraft(residenceId: string, channelId: string): string {
    return drafts.get(`${residenceId}:${channelId}`) ?? '';
  },
  setDraft(residenceId: string, channelId: string, value: string): void {
    drafts.set(`${residenceId}:${channelId}`, value);
    state = { ...state, draftVersion: state.draftVersion + 1 };
    emit();
  },
};
