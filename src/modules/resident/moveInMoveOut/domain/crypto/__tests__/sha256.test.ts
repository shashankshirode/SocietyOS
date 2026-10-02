import { sha256Hex } from '../sha256';

const boundaryLengths: readonly number[] = [54, 55, 56, 57, 63, 64, 65, 119, 120, 127, 128];

const boundaryDigests: Readonly<Record<number, string>> = {
  54: 'a3f01b6939256127582ac8ae9fb47a382a244680806a3f613a118851c1ca1d47',
  55: '9f4390f8d30c2dd92ec9f095b65e2b9ae9b0a925a5258e241c9f1e910f734318',
  56: 'b35439a4ac6f0948b6d6f9e3c6af0f5f590ce20f1bde7090ef7970686ec6738a',
  57: 'f13b2d724659eb3bf47f2dd6af1accc87b81f09f59f2b75e5c0bed6589dfe8c6',
  63: '7d3e74a05d7db15bce4ad9ec0658ea98e3f06eeecf16b4c6fff2da457ddc2f34',
  64: 'ffe054fe7ae0cb6dc65c3af9b61d5209f439851db43d0ba5997337df154668eb',
  65: '635361c48bb9eab14198e76ea8ab7f1a41685d6ad62aa9146d301d4f17eb0ae0',
  119: '31eba51c313a5c08226adf18d4a359cfdfd8d2e816b13f4af952f7ea6584dcfb',
  120: '2f3d335432c70b580af0e8e1b3674a7c020d683aa5f73aaaedfdc55af904c21c',
  127: 'c57e9278af78fa3cab38667bef4ce29d783787a2f731d4e12200270f0c32320a',
  128: '6836cf13bac400e9105071cd6af47084dfacad4e5e302c94bfed24e013afb73e',
};

const utf8Cases: readonly (readonly [string, string])[] = [
  ['café', '850f7dc43910ff890f8879c0ed26fe697c93a067ad93a7d50f466a7028a9bf4e'],
  ['😀', 'f0443a342c5ef54783a111b51ba56c938e474c32324d90c3a60c9c8e3a37e2d9'],
  ['日本語', '77710aedc74ecfa33685e33a6c7df5cc83004da1bdcef7fb280f5c2b2e97e0a5'],
  ['move-in:MIR-1', 'c9f2745c9536b932c0b5e2546023351c860934b2f43d2d1739a61c6038302c4d'],
  ['noc:NOC-1', '5b0cd12c2e675d90c2146bb0650c02d7ec15d448782be7c39495a82105ea8c1d'],
  [' ', '36a9e7f1c95b82ffb99743e0c5c4ce95d83c9a430aac59f84ef3cbfab6145068'],
  [
    'society-os-phase8',
    'fc5bbe0cf42bb00c6355cd195ba85f6f14ceb59fe0370d31ddf639707b48521a',
  ],
];

describe('sha256Hex', () => {
  it('matches the NIST empty-string vector', () => {
    expect(sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });

  it('matches the NIST single-block abc vector', () => {
    expect(sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });

  it('matches the NIST two-block vector', () => {
    expect(sha256Hex('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq')).toBe(
      '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1',
    );
  });

  it('matches the NIST multi-block vector', () => {
    expect(
      sha256Hex(
        'abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu',
      ),
    ).toBe('cf5b16a778af8380036ce59e7b0492370b249b11e8f07a51afac45037afee9d1');
  });

  it('matches the NIST one-million-a vector', () => {
    expect(sha256Hex('a'.repeat(1_000_000))).toBe(
      'cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0',
    );
  });

  it.each(boundaryLengths)(
    'matches the reference digest at padding boundary length %i',
    (length) => {
      expect(sha256Hex('a'.repeat(length))).toBe(boundaryDigests[length]);
    },
  );

  it.each(utf8Cases)('encodes %p as reference utf8', (input, expected) => {
    expect(sha256Hex(input)).toBe(expected);
  });

  it('produces a 64 character lowercase hex digest for any input', () => {
    expect(sha256Hex('society-os-phase8')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('is deterministic across repeated evaluation', () => {
    const inputs: readonly string[] = ['move-in:MIR-1', 'move-out:MOR-1', 'noc:NOC-1', '', ' '];
    const firstPass = inputs.map(sha256Hex);
    const secondPass = inputs.map(sha256Hex);
    expect(secondPass).toEqual(firstPass);
  });

  it('does not collide across distinct domain identifiers', () => {
    const inputs: readonly string[] = [
      'move-in:MIR-1',
      'move-in:MIR-2',
      'move-out:MOR-1',
      'noc:NOC-1',
      '',
      ' ',
    ];
    expect(new Set(inputs.map(sha256Hex)).size).toBe(inputs.length);
  });

  it('treats an unpaired surrogate as a stable three-byte sequence', () => {
    const digest = sha256Hex('\ud83d');
    expect(digest).toMatch(/^[0-9a-f]{64}$/);
    expect(sha256Hex('\ud83d')).toBe(digest);
  });

  it('distinguishes inputs that differ only by case', () => {
    expect(sha256Hex('MIR-1')).not.toBe(sha256Hex('mir-1'));
  });

  it('distinguishes inputs that differ only by separator', () => {
    expect(sha256Hex('a:b:c')).not.toBe(sha256Hex('a:b-c'));
  });
});
