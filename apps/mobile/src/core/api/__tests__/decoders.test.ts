import { D, decodeOrThrow, ApiContractError } from '../decoders';

describe('API DTO Decoders', () => {
  describe('Primitives', () => {
    it('decodes strings correctly and rejects non-strings', () => {
      expect(D.string('hello').ok).toBe(true);
      expect(D.string(123).ok).toBe(false);
      expect(D.string(null).ok).toBe(false);
      expect(D.string(undefined).ok).toBe(false);
    });

    it('decodes numbers correctly and rejects NaN / infinite values', () => {
      expect(D.number(42).ok).toBe(true);
      expect(D.number(0).ok).toBe(true);
      expect(D.number(-15.5).ok).toBe(true);
      expect(D.number(NaN).ok).toBe(false);
      expect(D.number(Infinity).ok).toBe(false);
      expect(D.number('42').ok).toBe(false);
    });

    it('decodes booleans correctly', () => {
      expect(D.boolean(true).ok).toBe(true);
      expect(D.boolean(false).ok).toBe(true);
      expect(D.boolean('true').ok).toBe(false);
    });
  });

  describe('Combinators', () => {
    it('handles optional fields', () => {
      const optString = D.optional(D.string);
      expect(optString(undefined).ok).toBe(true);
      expect(optString(null).ok).toBe(true);
      expect(optString('test').ok).toBe(true);
      expect(optString(123).ok).toBe(false);
    });

    it('enforces oneOf enums strictly', () => {
      const statusDecoder = D.oneOf(['EXPECTED', 'CHECKED_IN', 'CANCELLED'] as const);
      expect(statusDecoder('EXPECTED').ok).toBe(true);
      expect(statusDecoder('CHECKED_IN').ok).toBe(true);
      expect(statusDecoder('UNKNOWN_STATUS').ok).toBe(false);
    });

    it('decodes arrays and reports path on failure', () => {
      const numbersDecoder = D.array(D.number);
      const success = numbersDecoder([1, 2, 3]);
      expect(success.ok).toBe(true);
      if (success.ok) {
        expect(success.value).toEqual([1, 2, 3]);
      }

      const failure = numbersDecoder([1, 'two', 3]);
      expect(failure.ok).toBe(false);
      if (!failure.ok) {
        expect(failure.path).toBe('$[1]');
      }
    });

    it('decodes nested objects with precise paths', () => {
      const personDecoder = D.object({
        id: D.string,
        name: D.string,
        age: D.optional(D.number),
        tags: D.array(D.string),
      });

      const valid = {
        id: 'usr-1',
        name: 'Aarav',
        age: 30,
        tags: ['resident', 'owner'],
      };

      const result = personDecoder(valid);
      expect(result.ok).toBe(true);

      const invalid = {
        id: 'usr-1',
        name: 'Aarav',
        tags: ['resident', 123], // invalid tag
      };
      const badResult = personDecoder(invalid);
      expect(badResult.ok).toBe(false);
      if (!badResult.ok) {
        expect(badResult.path).toBe('$.tags[1]');
      }
    });
  });

  describe('decodeOrThrow', () => {
    it('returns value on valid input', () => {
      const val = decodeOrThrow(D.string, 'valid');
      expect(val).toBe('valid');
    });

    it('throws ApiContractError with descriptive metadata on failure', () => {
      expect(() => decodeOrThrow(D.number, 'not a number', '$.amount')).toThrow(ApiContractError);
      try {
        decodeOrThrow(D.number, 'not a number', '$.amount');
      } catch (err) {
        expect(err).toBeInstanceOf(ApiContractError);
        const contractError = err as ApiContractError;
        expect(contractError.path).toBe('$.amount');
        expect(contractError.expected).toBe('number');
      }
    });
  });
});
