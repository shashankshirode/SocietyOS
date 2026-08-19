import { ALLOWED_FILE_TYPES, type FileValidationResult, type SelectedFile } from './filePicker.types';

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; 
const IMAGE_MAX_SIZE = 5 * 1024 * 1024; 

function isImageMime(mime: string): boolean {
  return mime.startsWith('image/');
}


export function validateFile(file: SelectedFile): FileValidationResult {
  if (!ALLOWED_FILE_TYPES.includes(file.mimeType as typeof ALLOWED_FILE_TYPES[number])) {
    return { valid: false, error: 'File type is not supported.' };
  }

  const maxSize = isImageMime(file.mimeType) ? IMAGE_MAX_SIZE : DEFAULT_MAX_SIZE;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size is too large.' };
  }

  return { valid: true };
}


export function validateFileList(files: SelectedFile[]): FileValidationResult {
  if (files.length === 0) {
    return { valid: false, error: 'Please select at least one document.' };
  }
  return { valid: true };
}
