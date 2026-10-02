import {
  canonicalPreimage,
  canonicalPreimageSha256,
  canonicalStringify,
  optionalPart,
  readPartValue,
  requiredPart,
  requiredString,
  sortedStringListPart,
  stringListPart,
} from '../canonicalJson';

describe('canonicalStringify', () => {
  it('emits object keys in sorted order regardless of insertion order', () => {
    expect(canonicalStringify({ b: 1, a: 2 })).toBe('{"a":2,"b":1}');
    expect(canonicalStringify({ a: 2, b: 1 })).toBe('{"a":2,"b":1}');
  });

  it('sorts keys recursively', () => {
    expect(canonicalStringify({ z: { y: 1, x: 2 }, a: 3 })).toBe('{"a":3,"z":{"x":2,"y":1}}');
  });

  it('preserves array order because sequences are not sets', () => {
    expect(canonicalStringify([3, 1, 2])).toBe('[3,1,2]');
  });

  it('renders scalars unambiguously', () => {
    expect(canonicalStringify(null)).toBe('null');
    expect(canonicalStringify(true)).toBe('true');
    expect(canonicalStringify(false)).toBe('false');
    expect(canonicalStringify(42)).toBe('42');
    expect(canonicalStringify('')).toBe('""');
  });

  it('escapes strings so delimiters inside values cannot forge structure', () => {
    expect(canonicalStringify('a|b=c')).toBe('"a|b=c"');
    expect(canonicalStringify({ 'a|b': 'c' })).toBe('{"a|b":"c"}');
  });

  it('distinguishes a key from a string value containing the pair separator', () => {
    expect(canonicalStringify({ a: 'b=c' })).not.toBe(canonicalStringify({ 'a=b': 'c' }));
  });

  it('distinguishes the string one from the number one', () => {
    expect(canonicalStringify('1')).not.toBe(canonicalStringify(1));
    expect(canonicalStringify('true')).not.toBe(canonicalStringify(true));
  });

  it('renders integers and fractions without exponent noise', () => {
    expect(canonicalStringify(0)).toBe('0');
    expect(canonicalStringify(-17)).toBe('-17');
    expect(canonicalStringify(0.5)).toBe('0.5');
  });

  it('refuses non finite numbers so a hash can never depend on NaN or Infinity', () => {
    expect(() => canonicalStringify(Number.NaN)).toThrow('CANONICAL_NUMBER_NOT_FINITE');
    expect(() => canonicalStringify(Number.POSITIVE_INFINITY)).toThrow('CANONICAL_NUMBER_NOT_FINITE');
  });

  it('nests arrays and objects deterministically', () => {
    expect(canonicalStringify({ a: [1, { d: 4, c: 3 }] })).toBe('{"a":[1,{"c":3,"d":4}]}');
  });
});

describe('canonicalPreimage', () => {
  it('orders parts by key so caller ordering cannot change the digest', () => {
    const forwards = [requiredPart('alpha', 1), requiredPart('beta', 2)];
    const backwards = [requiredPart('beta', 2), requiredPart('alpha', 1)];
    expect(canonicalPreimage('ns', forwards)).toBe(canonicalPreimage('ns', backwards));
    expect(canonicalPreimageSha256('ns', forwards)).toBe(canonicalPreimageSha256('ns', backwards));
  });

  it('namespaces the preimage so two domains cannot collide', () => {
    const parts = [requiredPart('a', 1)];
    expect(canonicalPreimage('nsA', parts)).not.toBe(canonicalPreimage('nsB', parts));
  });

  it('marks an absent optional distinctly from an empty value', () => {
    expect(canonicalPreimage('ns', [optionalPart('k', undefined)])).toContain('k=absent');
    expect(canonicalPreimage('ns', [optionalPart('k', '')])).toContain('k=""');
  });

  it('separates adjacent parts so shifting values cannot collide', () => {
    expect(canonicalPreimage('ns', [requiredPart('a', 'x'), requiredPart('b', 'y')])).not.toBe(
      canonicalPreimage('ns', [requiredPart('a', 'xy'), optionalPart('b', undefined)]),
    );
  });

  it('rejects a required part that is absent', () => {
    expect(() => requiredPart('k', undefined)).toThrow('CANONICAL_PART_REQUIRED:k');
    expect(() => requiredString('k', '')).toThrow('CANONICAL_STRING_REQUIRED:k');
  });

  it('orders a sorted list so set equality produces one digest', () => {
    const first = sortedStringListPart('roles', ['ADMIN', 'SECRETARY']);
    const second = sortedStringListPart('roles', ['SECRETARY', 'ADMIN']);
    expect(canonicalPreimage('ns', [first])).toBe(canonicalPreimage('ns', [second]));
  });

  it('keeps order significant for an ordered list', () => {
    const first = stringListPart('steps', ['a', 'b']);
    const second = stringListPart('steps', ['b', 'a']);
    expect(canonicalPreimage('ns', [first])).not.toBe(canonicalPreimage('ns', [second]));
  });

  it('does not collide when a list element contains the separator', () => {
    const joined = stringListPart('items', ['a,b']);
    const split = stringListPart('items', ['a', 'b']);
    expect(canonicalPreimage('ns', [joined])).not.toBe(canonicalPreimage('ns', [split]));
  });

  it('produces a stable 64 character hex digest', () => {
    const digest = canonicalPreimageSha256('moveOut', [
      requiredString('requestId', 'r-1'),
      requiredPart('revision', 3),
    ]);
    expect(digest).toMatch(/^[0-9a-f]{64}$/);
  });

  it('changes the digest when any single part changes', () => {
    const base = canonicalPreimageSha256('moveOut', [requiredPart('status', 'READY')]);
    const changed = canonicalPreimageSha256('moveOut', [requiredPart('status', 'APPROVED')]);
    expect(base).not.toBe(changed);
  });

  it('reads a part back by key', () => {
    const parts = [requiredString('a', 'x'), requiredPart('n', 7)];
    expect(readPartValue(parts, 'a')).toBe('x');
    expect(readPartValue(parts, 'n')).toBe(7);
    expect(() => readPartValue(parts, 'missing')).toThrow('CANONICAL_PART_MISSING:missing');
  });
});
