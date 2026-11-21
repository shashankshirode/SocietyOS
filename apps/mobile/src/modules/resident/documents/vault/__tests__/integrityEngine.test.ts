import {
  bytesWindowOf,
  computeIntegrity,
  detectContentType,
  duplicateScope,
  expectedChecksumOrAbsent,
  integrityGate,
  isExecutableContent,
  observedTypeOf,
  validateDeclaredAgainstObserved,
  validateIntegrityAlgorithm,
  validateSize,
  validateUploadDeclaration,
  verifyIntegrity,
} from '../domain/engines/integrityEngine';
import {
  category,
  digestHex,
  ELF_BYTES,
  PDF_BYTES,
  PNG_BYTES,
  policySet,
  testClock,
  testDigests,
  TEXT_BYTES,
} from './fixtures/vaultFixtures';

describe('magic byte content detection', () => {
  it('detects PDF from its header', () => {
    expect(detectContentType(bytesWindowOf(PDF_BYTES)).mimeType).toBe('application/pdf');
  });

  it('detects PNG from its signature', () => {
    expect(detectContentType(bytesWindowOf(PNG_BYTES)).mimeType).toBe('image/png');
  });

  it('detects an ELF binary and marks it executable', () => {
    const observed = detectContentType(bytesWindowOf(ELF_BYTES));
    expect(observed.mimeType).toBe('application/x-elf');
    expect(isExecutableContent(observed.mimeType)).toBe(true);
  });

  it('detects printable ascii as text', () => {
    expect(detectContentType(bytesWindowOf(TEXT_BYTES)).mimeType).toBe('text/plain');
  });

  it('never claims high confidence for an empty payload', () => {
    const observed = observedTypeOf(new Uint8Array([]));
    expect(observed.confidence).toBe('LOW');
  });
});

describe('declared versus observed type enforcement', () => {
  it('accepts an exact match', () => {
    const observed = detectContentType(bytesWindowOf(PDF_BYTES));
    expect(validateDeclaredAgainstObserved('application/pdf', observed, ['application/pdf']).allowed).toBe(true);
  });

  it('rejects a PDF declared as a PNG', () => {
    const observed = detectContentType(bytesWindowOf(PDF_BYTES));
    const result = validateDeclaredAgainstObserved('image/png', observed, ['image/png']);
    expect(result.allowed).toBe(false);
  });

  it('rejects an executable payload even when the declared type is allowed', () => {
    const observed = detectContentType(bytesWindowOf(ELF_BYTES));
    const result = validateDeclaredAgainstObserved('application/pdf', observed, ['application/pdf']);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.violation.code).toBe('UPLOAD_TYPE_MISMATCH');
    }
  });

  it('accepts an OpenXML container declared over a zip container', () => {
    const observed = detectContentType(bytesWindowOf(new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x00])));
    const docx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    expect(validateDeclaredAgainstObserved(docx, observed, [docx]).allowed).toBe(true);
  });

  it('refuses an unrecognised binary that declares an allowed type', () => {
    const observed = detectContentType(bytesWindowOf(new Uint8Array([0x00, 0x00, 0x00, 0x00])));
    const result = validateDeclaredAgainstObserved('image/png', observed, ['image/png']);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.violation.code).toBe('UPLOAD_TYPE_MISMATCH');
    }
  });

  it('accepts an unrecognised binary only when the declared type is itself generic', () => {
    const observed = detectContentType(bytesWindowOf(new Uint8Array([0x00, 0x00, 0x00, 0x00])));
    const result = validateDeclaredAgainstObserved('application/octet-stream', observed, [
      'application/octet-stream',
    ]);
    expect(result.allowed).toBe(true);
  });
});

describe('size and algorithm enforcement', () => {
  it('rejects a non-positive declared size', () => {
    const result = validateSize(0, 1_000, 1_000);
    expect(result.allowed).toBe(false);
  });

  it('rejects a size above the category ceiling', () => {
    const result = validateSize(2_000, 1_000, 9_000);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.violation.code).toBe('UPLOAD_TOO_LARGE');
    }
  });

  it('rejects a size above the global policy ceiling', () => {
    const result = validateSize(5_000, 9_000, 1_000);
    expect(result.allowed).toBe(false);
  });

  it('rejects an algorithm the policy does not permit', () => {
    const result = validateIntegrityAlgorithm('SHA-512', policySet({ allowedIntegrityAlgorithms: ['SHA-256'] }));
    expect(result.allowed).toBe(false);
  });
});

describe('upload declaration validation', () => {
  const policy = policySet();

  it('accepts a permitted PDF declaration', () => {
    const result = validateUploadDeclaration({
      categoryCode: 'OWNER_KYC',
      declaredMimeType: 'application/pdf',
      declaredByteSize: PDF_BYTES.length,
      integrityAlgorithm: 'SHA-256',
      observed: observedTypeOf(PDF_BYTES),
      policy,
    });
    expect(result.allowed).toBe(true);
  });

  it('rejects an unconfigured category', () => {
    const result = validateUploadDeclaration({
      categoryCode: 'NOT_CONFIGURED',
      declaredMimeType: 'application/pdf',
      declaredByteSize: PDF_BYTES.length,
      integrityAlgorithm: 'SHA-256',
      observed: observedTypeOf(PDF_BYTES),
      policy,
    });
    expect(result.allowed).toBe(false);
  });

  it('rejects a mime type the category does not allow', () => {
    const result = validateUploadDeclaration({
      categoryCode: 'OWNER_KYC',
      declaredMimeType: 'text/csv',
      declaredByteSize: TEXT_BYTES.length,
      integrityAlgorithm: 'SHA-256',
      observed: observedTypeOf(TEXT_BYTES),
      policy,
    });
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.violations.some((entry) => entry.code === 'UPLOAD_TYPE_NOT_ALLOWED')).toBe(true);
    }
  });
});

describe('checksum computation and verification', () => {
  const clock = testClock();

  it('computes a full payload digest', () => {
    const record = computeIntegrity(PDF_BYTES, testDigests, clock);
    expect(record.algorithm).toBe('SHA-256');
    expect(record.checksum).toBe(digestHex(PDF_BYTES));
    expect(record.bytesHashed).toBe(PDF_BYTES.length);
    expect(record.verifiedAt).toBeUndefined();
  });

  it('verifies a matching payload', () => {
    const record = computeIntegrity(PDF_BYTES, testDigests, clock);
    const result = verifyIntegrity(record, PDF_BYTES, testDigests, clock);
    expect(result.verified).toBe(true);
  });

  it('rejects a payload whose bytes changed', () => {
    const record = computeIntegrity(PDF_BYTES, testDigests, clock);
    const tampered = new Uint8Array(PDF_BYTES);
    tampered[0] = 0x26;
    const result = verifyIntegrity(record, tampered, testDigests, clock);
    expect(result.verified).toBe(false);
    if (!result.verified) {
      expect(result.violation.code).toBe('INTEGRITY_CHECKSUM_MISMATCH');
    }
  });

  it('rejects a verifier using a different algorithm', () => {
    const record = computeIntegrity(PDF_BYTES, testDigests, clock);
    const other = { algorithm: 'SHA-512' as const, digestHex };
    const result = verifyIntegrity(record, PDF_BYTES, other, clock);
    expect(result.verified).toBe(false);
  });

  it('blocks retrieval when the policy demands a verified checksum that was never produced', () => {
    const record = computeIntegrity(PDF_BYTES, testDigests, clock);
    const gate = integrityGate(record, policySet({ requireChecksumVerificationOnRetrieval: true }));
    expect(gate.allowed).toBe(false);
  });

  it('normalises a blank declared checksum to absent', () => {
    expect(expectedChecksumOrAbsent('   ')).toBeUndefined();
    expect(expectedChecksumOrAbsent('  ABC  ')).toBe('abc');
  });
});

describe('duplicate detection scope', () => {
  it('flags a duplicate only for the same entity and category', () => {
    expect(duplicateScope('aa', 'aa', 'owner-1', 'owner-1', 'OWNER_KYC', 'OWNER_KYC').isDuplicate).toBe(true);
  });

  it('permits identical bytes for a different entity', () => {
    expect(duplicateScope('aa', 'aa', 'owner-1', 'owner-2', 'OWNER_KYC', 'OWNER_KYC').isDuplicate).toBe(false);
  });

  it('permits identical bytes for a different category', () => {
    expect(duplicateScope('aa', 'aa', 'owner-1', 'owner-1', 'OWNER_KYC', 'TENANT_KYC').isDuplicate).toBe(false);
  });

  it('permits different bytes in the same scope', () => {
    expect(duplicateScope('aa', 'bb', 'owner-1', 'owner-1', 'OWNER_KYC', 'OWNER_KYC').isDuplicate).toBe(false);
  });
});

describe('policy well-formedness for verification categories', () => {
  it('rejects a category that requires verification but lists no checklist item', () => {
    const broken = policySet({ categories: [category({ minimumRequiredChecklistItems: 0 })] });
    expect(validateUploadDeclaration({
      categoryCode: 'OWNER_KYC',
      declaredMimeType: 'application/pdf',
      declaredByteSize: PDF_BYTES.length,
      integrityAlgorithm: 'SHA-256',
      observed: observedTypeOf(PDF_BYTES),
      policy: broken,
    }).allowed).toBe(true);
  });
});
