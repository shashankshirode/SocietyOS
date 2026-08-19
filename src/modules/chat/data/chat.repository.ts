import { createRepository } from '../../../core/dataSource/repositoryFactory';
import { chatApiSource } from './chat.apiSource';
import { chatMockSource } from './chat.mockSource';
import type { ChatRepository } from './chat.repository.types';

export const chatRepository: ChatRepository = createRepository({
  moduleKey: 'chat',
  mockRepository: chatMockSource,
  apiRepository: chatApiSource,
});
