export interface TextTruncationResult {
  truncatedText: string;
  isTruncated: boolean;
  fullText: string;
}

export function useTextTruncation(text: string, maxLength: number = 30): TextTruncationResult {
  const isTruncated = text.length > maxLength;
  const truncatedText = isTruncated ? `${text.substring(0, maxLength).trim()}...` : text;

  return {
    truncatedText,
    isTruncated,
    fullText: text,
  };
}
