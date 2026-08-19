import {
  maskAadhaar,
  maskBankAccount,
  maskDocumentNumber,
  maskEmail,
  maskGst,
  maskMobileNumber,
  maskPan,
  maskRfid,
  maskVehicleNumber,
} from '../masking';

describe('masking utilities', () => {
  it('masks mobile and email values', () => {
    expect(maskMobileNumber('9876544321')).toBe('******4321');
    expect(maskEmail('shashank@gmail.com')).toBe('sh******@gmail.com');
  });

  it('masks government and document identifiers', () => {
    expect(maskAadhaar('1234 5678 9012')).toBe('XXXX XXXX 9012');
    expect(maskPan('ABCDE1234F')).toBe('ABCD*****F');
    expect(maskGst('27ABCDE1234F1Z5')).toBe('27ABCDE****1Z5');
    expect(maskDocumentNumber('DOC-2026-0009')).toBe('DOC-****-0009');
  });

  it('masks RFID, vehicle, and bank account values safely', () => {
    expect(maskRfid('RFID-GVH-2819')).toBe('RFID-****-2819');
    expect(maskVehicleNumber('MH 15 AB 1234')).toBe('MH15****34');
    expect(maskVehicleNumber('MH 15 AB 1234', 'visible')).toBe('MH 15 AB 1234');
    expect(maskBankAccount('123456789012')).toBe('XXXXXX9012');
  });

  it('handles empty values', () => {
    expect(maskMobileNumber('')).toBe('');
    expect(maskEmail('')).toBe('');
    expect(maskAadhaar('')).toBe('');
  });
});
