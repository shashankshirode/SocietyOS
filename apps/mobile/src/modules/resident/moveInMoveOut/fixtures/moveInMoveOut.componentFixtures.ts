import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'moveInMoveOut-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.moveInMoveOut.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.moveInMoveOut.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'moveInMoveOut-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.moveInMoveOut.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.moveInMoveOut.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
