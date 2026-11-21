import React from 'react';
import { FormField } from './FormField';

type AppTextAreaProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  editable?: boolean;
  maxLength?: number;
};

export function AppTextArea(props: AppTextAreaProps) {
  return <FormField {...props} multiline numberOfLines={4} />;
}

export default AppTextArea;
