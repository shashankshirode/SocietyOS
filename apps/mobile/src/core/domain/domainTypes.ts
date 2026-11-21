export type Nullable<T> = T | null;
declare const BrandSymbol: unique symbol;
export type Brand<T, TBrand extends string> = T & {
    readonly [BrandSymbol]: TBrand;
};
export type UserId = Brand<string, 'UserId'>;
export type ResidenceId = Brand<string, 'ResidenceId'>;
export type SocietyId = Brand<string, 'SocietyId'>;
export type UnitId = Brand<string, 'UnitId'>;
export type BookingId = Brand<string, 'BookingId'>;
export type VisitorPassId = Brand<string, 'VisitorPassId'>;
export type EmergencyIncidentId = Brand<string, 'EmergencyIncidentId'>;
export type ParkingIncidentId = Brand<string, 'ParkingIncidentId'>;
export type VehicleId = Brand<string, 'VehicleId'>;
export type BillId = Brand<string, 'BillId'>;
export type ComplaintId = Brand<string, 'ComplaintId'>;
export type DocumentId = Brand<string, 'DocumentId'>;
export type NoticeId = Brand<string, 'NoticeId'>;
export type IsoDateTime = Brand<string, 'IsoDateTime'>;
export type IsoDate = Brand<string, 'IsoDate'>;
export type DurationMinutes = Brand<number, 'DurationMinutes'>;
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD';
export interface Money {
    readonly minorUnits: number;
    readonly currency: CurrencyCode;
}
export enum OptionState {
    SOME = 'SOME',
    NONE = 'NONE'
}
export type Option<T> = {
    readonly state: OptionState.SOME;
    readonly value: T;
} | {
    readonly state: OptionState.NONE;
};
export function some<T>(value: T): Option<T> {
    return { state: OptionState.SOME, value };
}
export function none<T = never>(): Option<T> {
    return { state: OptionState.NONE };
}
export enum CommandResultType {
    SUCCESS = 'SUCCESS',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    CONFLICT = 'CONFLICT',
    STALE_STATE = 'STALE_STATE',
    NOT_FOUND = 'NOT_FOUND',
    FAILED = 'FAILED'
}
export type CommandResult<TData, TErrorCode extends string = string> = {
    readonly ok: true;
    readonly type: CommandResultType.SUCCESS;
    readonly data: TData;
} | {
    readonly ok: false;
    readonly type: Exclude<CommandResultType, CommandResultType.SUCCESS>;
    readonly code: TErrorCode;
    readonly message: string;
};
export function assertNever(value: never): never {
    throw new Error(`Unhandled domain state encountered: ${JSON.stringify(value)}`);
}
export function findOrNull<T>(items: readonly T[], predicate: (item: T) => boolean): Nullable<T> {
    const match = items.find(predicate);
    return match !== undefined ? match : null;
}
export function getMapValueOrNull<K, V>(map: ReadonlyMap<K, V>, key: K): Nullable<V> {
    const value = map.get(key);
    return value !== undefined ? value : null;
}
export { LoadingIntent, AsyncStatus, type AsyncState, createIdleAsyncState, createInitialLoadingAsyncState, createRefreshingAsyncState, createSubmittingAsyncState, createLoadingMoreAsyncState, createSuccessAsyncState, createErrorAsyncState, } from '../async/AsyncState';

