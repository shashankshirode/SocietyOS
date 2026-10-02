import type { Absent } from '../../../../../../shared/types/absence.types';
import type { IntegrityAlgorithm, IntegrityRecord } from '../types/document.types';
import type {
  DocumentVaultViolation,
  VaultClock,
} from '../types/primitives';
import { allowedWith, denied, violation } from '../types/primitives';
import type { DocumentPolicySet } from '../types/policy.types';
import { findCategoryPolicy, findMimeRule } from '../types/policy.types';

export type DigestProvider = {
  readonly algorithm: IntegrityAlgorithm;
  readonly digestHex: (payload: Uint8Array) => string;
};

export type ByteWindow = {
  readonly bytes: Uint8Array;
  readonly totalLength: number;
};

const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46];
const ZIP_LOCAL_HEADER = [0x50, 0x4b, 0x03, 0x04];
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPEG_SIGNATURE = [0xff, 0xd8, 0xff];
const OLE2_SIGNATURE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
const RIFF_SIGNATURE = [0x52, 0x49, 0x46, 0x46];
const ELF_SIGNATURE = [0x7f, 0x45, 0x4c, 0x46];
const MACH_O_SIGNATURE = [0xfe, 0xed, 0xfa, 0xce];
const SHEBANG_SIGNATURE = [0x23, 0x21];

export type ObservedContentType = {
  readonly mimeType: string;
  readonly confidence: 'HIGH' | 'LOW';
  readonly evidence: string;
};

function startsWith(window: ByteWindow, signature: readonly number[]): boolean {
  if (window.bytes.length < signature.length) {
    return false;
  }
  return signature.every((byte, index) => window.bytes[index] === byte);
}

function allZero(bytes: Uint8Array): boolean {
  return bytes.every((byte) => byte === 0);
}

function isPrintableAscii(bytes: Uint8Array): boolean {
  return bytes.every((byte) => byte === 0x09 || byte === 0x0a || byte === 0x0d || (byte >= 0x20 && byte <= 0x7e));
}

export function detectContentType(window: ByteWindow): ObservedContentType {
  if (window.bytes.length === 0) {
    return { mimeType: 'application/octet-stream', confidence: 'LOW', evidence: 'empty' };
  }
  if (startsWith(window, PDF_SIGNATURE)) {
    return { mimeType: 'application/pdf', confidence: 'HIGH', evidence: 'PDF header' };
  }
  if (startsWith(window, PNG_SIGNATURE)) {
    return { mimeType: 'image/png', confidence: 'HIGH', evidence: 'PNG signature' };
  }
  if (startsWith(window, JPEG_SIGNATURE)) {
    return { mimeType: 'image/jpeg', confidence: 'HIGH', evidence: 'JPEG SOI marker' };
  }
  if (startsWith(window, ZIP_LOCAL_HEADER)) {
    return { mimeType: 'application/zip', confidence: 'HIGH', evidence: 'ZIP local file header' };
  }
  if (startsWith(window, OLE2_SIGNATURE)) {
    return { mimeType: 'application/x-ole-storage', confidence: 'HIGH', evidence: 'OLE2 compound file header' };
  }
  if (startsWith(window, ELF_SIGNATURE)) {
    return { mimeType: 'application/x-elf', confidence: 'HIGH', evidence: 'ELF binary header' };
  }
  if (startsWith(window, MACH_O_SIGNATURE)) {
    return { mimeType: 'application/x-mach-binary', confidence: 'HIGH', evidence: 'Mach-O binary header' };
  }
  if (startsWith(window, SHEBANG_SIGNATURE)) {
    return { mimeType: 'text/x-script', confidence: 'HIGH', evidence: 'script interpreter directive' };
  }
  if (startsWith(window, RIFF_SIGNATURE)) {
    return { mimeType: 'application/x-riff', confidence: 'LOW', evidence: 'RIFF container' };
  }
  if (allZero(window.bytes)) {
    return { mimeType: 'application/octet-stream', confidence: 'LOW', evidence: 'null bytes' };
  }
  if (isPrintableAscii(window.bytes)) {
    return { mimeType: 'text/plain', confidence: 'HIGH', evidence: 'printable ascii' };
  }
  return { mimeType: 'application/octet-stream', confidence: 'LOW', evidence: 'unrecognised' };
}

const EXECUTABLE_MIME_TYPES: readonly string[] = [
  'application/x-elf',
  'application/x-mach-binary',
  'application/x-ole-storage',
  'text/x-script',
];

const GENERIC_OBSERVED_MIME = 'application/octet-stream';

export function isExecutableContent(mimeType: string): boolean {
  return EXECUTABLE_MIME_TYPES.includes(mimeType);
}

export function validateDeclaredAgainstObserved(
  declaredMimeType: string,
  observed: ObservedContentType,
  allowedMimeTypes: readonly string[],
): { allowed: true } | { allowed: false; violation: DocumentVaultViolation } {
  const normalizedDeclared = declaredMimeType.trim().toLowerCase();
  const normalizedObserved = observed.mimeType.trim().toLowerCase();

  if (isExecutableContent(normalizedObserved)) {
    return {
      allowed: false,
      violation: violation(
        'UPLOAD_TYPE_MISMATCH',
        'upload.observedMimeType',
        `Content inspection detected an executable payload (${observed.evidence}); upload is refused.`,
      ),
    };
  }

  if (normalizedDeclared === normalizedObserved) {
    return { allowed: true };
  }

  if (observed.mimeType === GENERIC_OBSERVED_MIME) {
    return normalizedDeclared === GENERIC_OBSERVED_MIME && allowedMimeTypes.includes(normalizedDeclared)
      ? { allowed: true }
      : {
          allowed: false,
          violation: violation(
            'UPLOAD_TYPE_MISMATCH',
            'upload.observedMimeType',
            `Content inspection could not confirm ${declaredMimeType}; the upload is refused rather than assumed.`,
          ),
        };
  }

  const declaredIsZipContainer =
    normalizedDeclared ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    normalizedDeclared === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    normalizedDeclared === 'application/vnd.ms-excel' ||
    normalizedDeclared === 'application/vnd.ms-word' ||
    normalizedDeclared === 'application/zip';
  if (declaredIsZipContainer && normalizedObserved === 'application/zip') {
    return { allowed: true };
  }

  const declaredIsWordDocument = normalizedDeclared === 'application/msword';
  if (declaredIsWordDocument && normalizedObserved === 'application/x-ole-storage') {
    return { allowed: true };
  }

  const declaredIsTextual =
    normalizedDeclared === 'text/plain' || normalizedDeclared === 'text/csv';
  if (declaredIsTextual && normalizedObserved === 'text/plain') {
    return { allowed: true };
  }

  const declaredIsImage =
    normalizedDeclared === 'image/jpeg' ||
    normalizedDeclared === 'image/png' ||
    normalizedDeclared === 'image/webp';
  if (declaredIsImage && normalizedObserved === 'application/x-riff' && normalizedDeclared === 'image/webp') {
    return { allowed: true };
  }

  if (allowedMimeTypes.includes(normalizedDeclared) && observed.confidence === 'LOW' && observed.mimeType === normalizedDeclared) {
    return { allowed: true };
  }

  return {
    allowed: false,
    violation: violation(
      'UPLOAD_TYPE_MISMATCH',
      'upload.declaredMimeType',
      `Declared type ${declaredMimeType} does not match inspected content ${observed.mimeType}.`,
    ),
  };
}

export function validateSize(
  declaredByteSize: number,
  categoryAllowedBytes: number,
  policyMaximumBytes: number,
): { allowed: true } | { allowed: false; violation: DocumentVaultViolation } {
  if (declaredByteSize <= 0) {
    return {
      allowed: false,
      violation: violation('UPLOAD_SIZE_MISMATCH', 'upload.declaredByteSize', 'Declared byte size must be positive.'),
    };
  }
  const ceiling = Math.min(categoryAllowedBytes, policyMaximumBytes);
  if (declaredByteSize > ceiling) {
    return {
      allowed: false,
      violation: violation(
        'UPLOAD_TOO_LARGE',
        'upload.declaredByteSize',
        `Declared size ${declaredByteSize} exceeds the permitted ceiling ${ceiling}.`,
      ),
    };
  }
  return { allowed: true };
}

export function validateIntegrityAlgorithm(
  algorithm: IntegrityAlgorithm,
  policy: DocumentPolicySet,
): { allowed: true } | { allowed: false; violation: DocumentVaultViolation } {
  if (!policy.allowedIntegrityAlgorithms.includes(algorithm)) {
    return {
      allowed: false,
      violation: violation(
        'INTEGRITY_WEAK_ALGORITHM',
        'upload.integrityAlgorithm',
        `Integrity algorithm ${algorithm} is not permitted by the effective policy.`,
      ),
    };
  }
  return { allowed: true };
}

export function validateUploadDeclaration(
  input: {
    categoryCode: string;
    declaredMimeType: string;
    declaredByteSize: number;
    integrityAlgorithm: IntegrityAlgorithm;
    observed: ObservedContentType;
    policy: DocumentPolicySet;
  },
): { allowed: true; mimeRuleMaxBytes: number } | { allowed: false; violations: readonly DocumentVaultViolation[] } {
  const violations: DocumentVaultViolation[] = [];
  const category = findCategoryPolicy(input.policy, input.categoryCode);
  if (category === undefined) {
    return {
      allowed: false,
      violations: [
        violation('POLICY_CONFIG_INVALID', 'upload.categoryCode', `Category ${input.categoryCode} is not configured.`),
      ],
    };
  }
  const mimeRule = findMimeRule(category, input.declaredMimeType.trim().toLowerCase());
  if (mimeRule === undefined) {
    violations.push(
      violation(
        'UPLOAD_TYPE_NOT_ALLOWED',
        'upload.declaredMimeType',
        `Type ${input.declaredMimeType} is not allowed for category ${input.categoryCode}.`,
      ),
    );
  }
  const sizeCheck = validateSize(
    input.declaredByteSize,
    mimeRule?.maxBytes ?? input.policy.maximumFileBytes,
    input.policy.maximumFileBytes,
  );
  if (!sizeCheck.allowed) {
    violations.push(sizeCheck.violation);
  }
  const algorithmCheck = validateIntegrityAlgorithm(input.integrityAlgorithm, input.policy);
  if (!algorithmCheck.allowed) {
    violations.push(algorithmCheck.violation);
  }
  const typeCheck = validateDeclaredAgainstObserved(
    input.declaredMimeType,
    input.observed,
    category.allowedMimeTypes.map((rule) => rule.mimeType),
  );
  if (!typeCheck.allowed) {
    violations.push(typeCheck.violation);
  }
  if (violations.length > 0) {
    return { allowed: false, violations };
  }
  return { allowed: true, mimeRuleMaxBytes: mimeRule?.maxBytes ?? input.policy.maximumFileBytes };
}

export function computeIntegrity(
  payload: Uint8Array,
  provider: DigestProvider,
  clock: VaultClock,
): IntegrityRecord {
  return {
    algorithm: provider.algorithm,
    checksum: provider.digestHex(payload),
    computedAt: clock.now().toISOString(),
    verifiedAt: undefined,
    bytesHashed: payload.length,
  };
}

export function verifyIntegrity(
  expected: IntegrityRecord,
  payload: Uint8Array,
  provider: DigestProvider,
  clock: VaultClock,
): { verified: true; record: IntegrityRecord } | { verified: false; violation: DocumentVaultViolation } {
  if (expected.algorithm !== provider.algorithm) {
    return {
      verified: false,
      violation: violation(
        'INTEGRITY_CHECKSUM_MISMATCH',
        'integrity.algorithm',
        `Expected ${expected.algorithm} but the verifier provides ${provider.algorithm}.`,
      ),
    };
  }
  const actual = provider.digestHex(payload);
  if (actual !== expected.checksum) {
    return {
      verified: false,
      violation: violation(
        'INTEGRITY_CHECKSUM_MISMATCH',
        'integrity.checksum',
        'Computed checksum does not match the recorded checksum.',
      ),
    };
  }
  return {
    verified: true,
    record: {
      ...expected,
      verifiedAt: clock.now().toISOString(),
      bytesHashed: payload.length,
    },
  };
}

export function duplicateScope(
  existingChecksum: string,
  newChecksum: string,
  existingEntityId: string,
  newEntityId: string,
  existingCategoryCode: string,
  newCategoryCode: string,
): { isDuplicate: true; existingEntityId: string } | { isDuplicate: false } {
  if (existingChecksum !== newChecksum) {
    return { isDuplicate: false };
  }
  if (existingEntityId === newEntityId && existingCategoryCode === newCategoryCode) {
    return { isDuplicate: true, existingEntityId };
  }
  return { isDuplicate: false };
}

export function integrityGate(record: IntegrityRecord, policy: DocumentPolicySet): ReturnType<typeof allowedWith> | ReturnType<typeof denied> {
  if (record.verifiedAt === undefined && policy.requireChecksumVerificationOnRetrieval) {
    return denied([
      violation(
        'INTEGRITY_CHECKSUM_MISMATCH',
        'integrity.verifiedAt',
        'Retrieval requires a verified checksum under the effective policy.',
      ),
    ]);
  }
  return allowedWith([]);
}

export function bytesWindowOf(payload: Uint8Array, limit = 4096): ByteWindow {
  const slice = payload.length > limit ? payload.subarray(0, limit) : payload;
  return { bytes: slice, totalLength: payload.length };
}

export function observedTypeOf(payload: Uint8Array): ObservedContentType {
  return detectContentType(bytesWindowOf(payload));
}

export function expectedChecksumOrAbsent(
  checksum: string | Absent,
): string | Absent {
  if (checksum === undefined) {
    return undefined;
  }
  const normalized = checksum.trim().toLowerCase();
  return normalized.length === 0 ? undefined : normalized;
}
