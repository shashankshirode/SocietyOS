import { chatStore } from './chat.store';

export const chatActions = {
  switchResidence: chatStore.switchResidence,
  selectChannel: chatStore.selectChannel,
  setDraft: chatStore.setDraft,
};
