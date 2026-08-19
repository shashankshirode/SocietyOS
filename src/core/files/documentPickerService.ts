import * as DocumentPicker from 'expo-document-picker';
import { validateFile } from '../../shared/files/fileValidation';
import type { SelectedFile } from '../../shared/files/filePicker.types';
import { handleDocumentPickerError } from './documentPickerErrors';

export async function pickDocument(): Promise<SelectedFile> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      throw new Error('DOCUMENT_PICKER_CANCELLED');
    }

    const asset = result.assets[0];
    if (!asset) {
      throw new Error('DOCUMENT_PICKER_EMPTY_RESULT');
    }
    const file: SelectedFile = {
      uri: asset.uri,
      name: asset.name,
      mimeType: asset.mimeType || 'application/octet-stream',
      size: asset.size || 0,
    };

    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'INVALID_FILE');
    }

    return file;
  } catch (error) {
    throw new Error(handleDocumentPickerError(error instanceof Error ? error : null));
  }
}
