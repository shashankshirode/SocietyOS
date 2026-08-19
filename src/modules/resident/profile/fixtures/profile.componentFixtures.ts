import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'profile-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.profile.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.profile.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'profile-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.profile.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.profile.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
