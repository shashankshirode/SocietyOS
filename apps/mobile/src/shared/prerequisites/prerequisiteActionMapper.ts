import type { PrerequisiteAction, PrerequisiteActionType } from './prerequisite.types';
import { includeWhenPresent } from "../utils/presentProperty";
const actionLabelKeys: Record<PrerequisiteActionType, string> = {
    navigate: 'resident.prerequisites.continue',
    openModal: 'resident.prerequisites.continue',
    retry: 'resident.prerequisites.retry',
    contactAdmin: 'resident.prerequisites.contactAdmin',
    waitForApproval: 'resident.prerequisites.waitForApproval',
    uploadDocument: 'resident.prerequisites.uploadDocument',
    completeProfile: 'resident.prerequisites.completeProfile',
    payDues: 'resident.prerequisites.payDues',
    createDraft: 'resident.prerequisites.createDraft',
    none: 'resident.prerequisites.continue'
};
export function createPrerequisiteAction(type: PrerequisiteActionType, routeName?: PrerequisiteAction['routeName']): PrerequisiteAction {
    return {
        type,
        labelMessageKey: actionLabelKeys[type],
        ...includeWhenPresent("routeName", routeName)
    };
}

