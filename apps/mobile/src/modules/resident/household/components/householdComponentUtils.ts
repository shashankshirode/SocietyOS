import type { EnglishMessagesType } from '../../../../messages/en';
import { resolveResidentMessage, type MessageNode, type MessageTree, } from '../../navigation/ResidentHeaderTitle';
import type { Absent } from "../../../../shared/types/absence.types";
export function t(messages: EnglishMessagesType, key: string, ...args: (string | number)[]): string {
    if (args.length === 0) {
        return resolveResidentMessage(messages as MessageTree, key);
    }
    const segments = key.split('.');
    let current: MessageNode = messages as MessageTree;
    for (const segment of segments) {
        if (typeof current === 'string' || typeof current === 'function') {
            return key;
        }
        const next: MessageNode | Absent = current[segment];
        if (!next) {
            return key;
        }
        current = next;
    }
    return typeof current === 'function' ? current(...args) : resolveResidentMessage(messages as MessageTree, key);
}
export function formatBoolean(value: boolean, yesLabel: string, noLabel: string): string {
    return value ? yesLabel : noLabel;
}

