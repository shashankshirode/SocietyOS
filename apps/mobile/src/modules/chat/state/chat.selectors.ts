import { chatStore } from './chat.store';

export function selectChatDraft(residenceId: string, channelId: string): string {
  return chatStore.getDraft(residenceId, channelId);
}

export function selectVisibleChatContext() {
  const snapshot = chatStore.getSnapshot();
  return { residenceId: snapshot.activeResidenceId, channelId: snapshot.selectedChannelId };
}
