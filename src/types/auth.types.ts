export interface AuthResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

export interface User {
  id: string;
  username: string;
  email?: string;
}
