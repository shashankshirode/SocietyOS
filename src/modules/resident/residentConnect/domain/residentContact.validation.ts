export const CONTACT_SUBJECT_MIN_LENGTH = 5;
export const CONTACT_SUBJECT_MAX_LENGTH = 80;
export const CONTACT_MESSAGE_MIN_LENGTH = 10;
export const CONTACT_MESSAGE_MAX_LENGTH = 500;

export type ContactRequestValidation = {
  subjectValid: boolean;
  messageValid: boolean;
  formValid: boolean;
};

export function validateResidentContactRequest(subject: string, message: string): ContactRequestValidation {
  const subjectLength = subject.trim().length;
  const messageLength = message.trim().length;
  const subjectValid = subjectLength >= CONTACT_SUBJECT_MIN_LENGTH && subjectLength <= CONTACT_SUBJECT_MAX_LENGTH;
  const messageValid = messageLength >= CONTACT_MESSAGE_MIN_LENGTH && messageLength <= CONTACT_MESSAGE_MAX_LENGTH;
  return { subjectValid, messageValid, formValid: subjectValid && messageValid };
}
