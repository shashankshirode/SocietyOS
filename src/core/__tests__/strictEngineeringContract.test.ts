import {
  some,
  none,
  OptionState,
  findOrNull,
  getMapValueOrNull,
  assertNever,
  type Nullable,
  type Money,
  type UserId,
  type ResidenceId,
} from '../domain/domainTypes';
import {
  formatResidentCurrency,
  formatResidentInitials,
} from '../localization/dateTimeFormatters';
import { formatDomainError } from '../errors/errorPresenter';

describe('Society OS Strict Engineering Contract & Domain Primitives', () => {
  describe('1. Nullable & Option State', () => {
    it('some and none helpers construct correct Option models', () => {
      const someOption = some('A-1204');
      expect(someOption.state).toBe(OptionState.SOME);
      if (someOption.state === OptionState.SOME) {
        expect(someOption.value).toBe('A-1204');
      }

      const noneOption = none();
      expect(noneOption.state).toBe(OptionState.NONE);
    });

    it('findOrNull safely returns null instead of undefined', () => {
      const list = [
        { id: '1', name: 'Rohan' },
        { id: '2', name: 'Sunita' },
      ];

      const found: Nullable<{ id: string; name: string }> = findOrNull(
        list,
        (item) => item.id === '1'
      );
      expect(found).not.toBeNull();
      expect(found?.name).toBe('Rohan');

      const notFound = findOrNull(list, (item) => item.id === '99');
      expect(notFound).toBeNull();
      expect(notFound).not.toBeUndefined();
    });

    it('getMapValueOrNull returns null when key is absent', () => {
      const map = new Map<string, string>([['TOWER_A', 'Tower A']]);
      expect(getMapValueOrNull(map, 'TOWER_A')).toBe('Tower A');
      expect(getMapValueOrNull(map, 'TOWER_Z')).toBeNull();
    });
  });

  describe('2. Branded Types & Money Structure', () => {
    it('handles Money interface and currency formatting correctly', () => {
      const money: Money = {
        minorUnits: 485000,
        currency: 'INR',
      };

      const formatted = formatResidentCurrency(money);
      expect(formatted).toContain('4,850');

      const rawNumberFormatted = formatResidentCurrency(1500, 'INR', { locale: 'en-IN' });
      expect(rawNumberFormatted).toContain('1,500');
    });

    it('allows strongly typed branded IDs', () => {
      const userId = 'user_123' as UserId;
      const residenceId = 'res_456' as ResidenceId;

      expect(userId).toBe('user_123');
      expect(residenceId).toBe('res_456');
    });
  });

  describe('3. Person Name & Initials Formatter', () => {
    it('formats initials consistently across name variations', () => {
      expect(formatResidentInitials('Asha Deshmukh')).toBe('AD');
      expect(formatResidentInitials('Rohan')).toBe('RO');
      expect(formatResidentInitials('Amit Kumar Roy')).toBe('AR');
      expect(formatResidentInitials('')).toBe('??');
    });
  });

  describe('4. Exhaustive Checking & Error Presenter', () => {
    it('assertNever throws descriptive error if reached', () => {
      expect(() => assertNever('UNKNOWN_TYPE' as never)).toThrow(
        'Unhandled domain state encountered'
      );
    });

    it('formatDomainError handles Error instances, domain errors, and strings', () => {
      expect(formatDomainError('Custom error string')).toBe('Custom error string');
      expect(formatDomainError(new Error('Network failure'))).toBe('Network failure');
      expect(
        formatDomainError({
          code: 'PERMISSION_DENIED',
          message: '',
        })
      ).toBe('You do not have permission to perform this action.');
    });
  });
});
