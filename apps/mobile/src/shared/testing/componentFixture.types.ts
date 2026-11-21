import type { MessageKey } from '../mock/mockScenario.types';

export interface ComponentFixture<TProps> {
  id: string;
  titleMessageKey: MessageKey;
  descriptionMessageKey: MessageKey;
  props: TProps;
  viewport: 'phoneSmall' | 'phone' | 'phoneLarge' | 'tablet' | 'tabletWide';
  themeMode: 'light' | 'dark';
}
