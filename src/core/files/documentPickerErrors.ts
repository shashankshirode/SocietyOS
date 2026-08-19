export function handleDocumentPickerError(error: Error | null): string {
  const msg = error?.message ?? '';
  if (msg.includes('DOCUMENT_PICKER_CANCELLED')) {
    return 'Document selection cancelled.';
  }
  if (msg.includes('File type is not supported.')) {
    return 'File type is not supported. Please select PDF, JPEG, PNG, DOC/DOCX, or XLS/XLSX.';
  }
  if (msg.includes('File size is too large.')) {
    return 'File size is too large. Maximum size is 10MB (5MB for images).';
  }
  return 'Failed to pick document. Please try again.';
}
