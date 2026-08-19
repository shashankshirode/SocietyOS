import { validateFile } from '../fileValidation';
import { formatFileSize } from '../fileSizeFormatter';
import type { SelectedFile } from '../filePicker.types';

describe('File Pick Validation Mappings', () => {
  it('permits valid PDF file under 10MB limit', () => {
    const file: SelectedFile = {
      uri: 'file:///path/doc.pdf',
      name: 'doc.pdf',
      mimeType: 'application/pdf',
      size: 4 * 1024 * 1024,
    };
    const res = validateFile(file);
    expect(res.valid).toBe(true);
  });

  it('rejects unsupported file type', () => {
    const file: SelectedFile = {
      uri: 'file:///path/audio.mp3',
      name: 'audio.mp3',
      mimeType: 'audio/mp3',
      size: 1 * 1024 * 1024,
    };
    const res = validateFile(file);
    expect(res.valid).toBe(false);
    expect(res.error).toBe('File type is not supported.');
  });

  it('rejects oversized image over 5MB limit', () => {
    const file: SelectedFile = {
      uri: 'file:///path/photo.png',
      name: 'photo.png',
      mimeType: 'image/png',
      size: 6 * 1024 * 1024,
    };
    const res = validateFile(file);
    expect(res.valid).toBe(false);
    expect(res.error).toBe('File size is too large.');
  });

  it('formats file sizes to human readable strings', () => {
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(10.5 * 1024 * 1024)).toBe('10.5 MB');
  });
});
