let accessToken: string | null = null;

export async function getAccessToken(): Promise<string | null> {
  return accessToken;
}

export async function setAccessToken(token: string): Promise<void> {
  accessToken = token;
}

export async function clearTokens(): Promise<void> {
  accessToken = null;
}

