import { getRequiredItem } from '../../../../../shared/utils/requiredItem';

const ROUND_CONSTANTS: readonly number[] = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

const INITIAL_HASH: readonly number[] = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
];

const HEX_DIGITS = '0123456789abcdef';

function utf8Encode(input: string): number[] {
  const bytes: number[] = [];
  for (let index = 0; index < input.length; index += 1) {
    let codePoint = input.charCodeAt(index);
    const isHighSurrogate = codePoint >= 0xd800 && codePoint <= 0xdbff;
    if (isHighSurrogate && index + 1 < input.length) {
      const low = input.charCodeAt(index + 1);
      const isLowSurrogate = low >= 0xdc00 && low <= 0xdfff;
      if (isLowSurrogate) {
        codePoint = (codePoint - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000;
        index += 1;
      }
    }
    if (codePoint < 0x80) {
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      bytes.push(0xc0 | (codePoint >>> 6));
      bytes.push(0x80 | (codePoint & 0x3f));
    } else if (codePoint < 0x10000) {
      bytes.push(0xe0 | (codePoint >>> 12));
      bytes.push(0x80 | ((codePoint >>> 6) & 0x3f));
      bytes.push(0x80 | (codePoint & 0x3f));
    } else {
      bytes.push(0xf0 | (codePoint >>> 18));
      bytes.push(0x80 | ((codePoint >>> 12) & 0x3f));
      bytes.push(0x80 | ((codePoint >>> 6) & 0x3f));
      bytes.push(0x80 | (codePoint & 0x3f));
    }
  }
  return bytes;
}

function rotateRight(value: number, bitCount: number): number {
  return ((value >>> bitCount) | (value << (32 - bitCount))) >>> 0;
}

function toHex(value: number): string {
  let result = '';
  for (let shift = 28; shift >= 0; shift -= 4) {
    result += HEX_DIGITS.charAt((value >>> shift) & 0x0f);
  }
  return result;
}

function wordAt(schedule: readonly number[], index: number): number {
  return getRequiredItem(schedule, index, 'sha256.schedule');
}

function constantAt(index: number): number {
  return getRequiredItem(ROUND_CONSTANTS, index, 'sha256.roundConstants');
}

function initialAt(index: number): number {
  return getRequiredItem(INITIAL_HASH, index, 'sha256.initialHash');
}

export function sha256Hex(input: string): string {
  const messageBytes = utf8Encode(input);
  const totalBitLength = messageBytes.length * 8;
  const blockCount = Math.floor((messageBytes.length + 8) / 64) + 1;
  const paddedLength = blockCount * 64;

  const padded = new Uint8Array(paddedLength);
  for (let index = 0; index < messageBytes.length; index += 1) {
    padded[index] = getRequiredItem(messageBytes, index, 'sha256.message');
  }
  padded[messageBytes.length] = 0x80;

  const view = new DataView(padded.buffer);
  const highBits = Math.floor(totalBitLength / 4294967296);
  const lowBits = totalBitLength % 4294967296;
  view.setUint32(paddedLength - 8, highBits, false);
  view.setUint32(paddedLength - 4, lowBits, false);

  const hash: number[] = [];
  for (let index = 0; index < 8; index += 1) {
    hash.push(initialAt(index));
  }

  for (let block = 0; block < blockCount; block += 1) {
    const blockOffset = block * 64;
    const schedule: number[] = new Array<number>(64).fill(0);

    for (let index = 0; index < 16; index += 1) {
      schedule[index] = view.getUint32(blockOffset + index * 4, false);
    }

    for (let index = 16; index < 64; index += 1) {
      const previous15 = wordAt(schedule, index - 15);
      const previous2 = wordAt(schedule, index - 2);
      const sigma0 =
        rotateRight(previous15, 7) ^ rotateRight(previous15, 18) ^ (previous15 >>> 3);
      const sigma1 =
        rotateRight(previous2, 17) ^ rotateRight(previous2, 19) ^ (previous2 >>> 10);
      schedule[index] =
        (wordAt(schedule, index - 16) + sigma0 + wordAt(schedule, index - 7) + sigma1) >>> 0;
    }

    let workingA = wordAt(hash, 0);
    let workingB = wordAt(hash, 1);
    let workingC = wordAt(hash, 2);
    let workingD = wordAt(hash, 3);
    let workingE = wordAt(hash, 4);
    let workingF = wordAt(hash, 5);
    let workingG = wordAt(hash, 6);
    let workingH = wordAt(hash, 7);

    for (let index = 0; index < 64; index += 1) {
      const bigSigma1 = rotateRight(workingE, 6) ^ rotateRight(workingE, 11) ^ rotateRight(workingE, 25);
      const choose = (workingE & workingF) ^ (~workingE & workingG);
      const temporary1 =
        (workingH + bigSigma1 + choose + constantAt(index) + wordAt(schedule, index)) >>> 0;
      const bigSigma0 = rotateRight(workingA, 2) ^ rotateRight(workingA, 13) ^ rotateRight(workingA, 22);
      const majority = (workingA & workingB) ^ (workingA & workingC) ^ (workingB & workingC);
      const temporary2 = (bigSigma0 + majority) >>> 0;

      workingH = workingG;
      workingG = workingF;
      workingF = workingE;
      workingE = (workingD + temporary1) >>> 0;
      workingD = workingC;
      workingC = workingB;
      workingB = workingA;
      workingA = (temporary1 + temporary2) >>> 0;
    }

    hash[0] = (wordAt(hash, 0) + workingA) >>> 0;
    hash[1] = (wordAt(hash, 1) + workingB) >>> 0;
    hash[2] = (wordAt(hash, 2) + workingC) >>> 0;
    hash[3] = (wordAt(hash, 3) + workingD) >>> 0;
    hash[4] = (wordAt(hash, 4) + workingE) >>> 0;
    hash[5] = (wordAt(hash, 5) + workingF) >>> 0;
    hash[6] = (wordAt(hash, 6) + workingG) >>> 0;
    hash[7] = (wordAt(hash, 7) + workingH) >>> 0;
  }

  let digest = '';
  for (let index = 0; index < 8; index += 1) {
    digest += toHex(wordAt(hash, index));
  }
  return digest;
}
