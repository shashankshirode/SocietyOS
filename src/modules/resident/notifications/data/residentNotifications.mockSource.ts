import { repositorySuccess, withMockDelay } from '../../../../core/repositories/repository.types';
import { getResidentMockRecords } from '../../mock/residentMockRegistry';
import type { ResidentNotificationsRepository } from './residentNotifications.repository.types';

export const residentNotificationsMockSource: ResidentNotificationsRepository = {
  async list(context) {
    await withMockDelay();
    return repositorySuccess(
      getResidentMockRecords(context, 'notifications').map((record) => ({
        id: record.id,
        homeContextId: record.homeContextId,
        societyId: record.societyId,
        unitId: record.unitId,
        dataScopeKey: record.dataScopeKey,
        titleMessageKey: record.titleMessageKey,
        descriptionMessageKey: record.descriptionMessageKey,
        status: record.status === 'unread' ? 'unread' : 'read',
        priority: record.ordinal % 10 === 0 ? 'critical' : record.ordinal % 4 === 0 ? 'important' : 'normal',
        actionable: record.ordinal % 3 === 0,
        createdAtIso: record.createdAtIso,
      }))
    );
  },
};
