export interface AuthResponse {
  tokenAccess: string;
  tokenType?: string;
  role?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
}
