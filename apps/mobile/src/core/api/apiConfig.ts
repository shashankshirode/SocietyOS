import { appConfig } from '../config/appConfig';

export const apiConfig = {
  baseUrl: appConfig.apiBaseUrl,
  timeoutMs: appConfig.requestTimeoutMs,
  clientApp: appConfig.clientApp,
  clientVersion: appConfig.clientVersion,
} as const;

