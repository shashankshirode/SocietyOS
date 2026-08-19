import React from 'react';
import { TruncatedText, TruncatedTextProps } from './TruncatedText';

export type ResidentDisplayNameProps = Omit<TruncatedTextProps, 'text'> & {
  displayName: string;
};

export function ResidentDisplayName({ displayName, ...props }: ResidentDisplayNameProps) {
  return (
    <TruncatedText
      {...props}
      text={displayName}
    />
  );
}
