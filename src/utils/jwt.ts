export const getTokenUsername = (token: string): string | null => {
  if (!token) {
    return null;
  }
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }
  const payload = parts[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  try {
    const json = JSON.parse(atob(padded));
    return typeof json.sub === 'string' ? json.sub : null;
  } catch {
    return null;
  }
};

export const getTokenRole = (token: string): string | null => {
  if (!token) {
    return null;
  }
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }
  const payload = parts[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  try {
    const json = JSON.parse(atob(padded));
    return typeof json.role === 'string' ? json.role : null;
  } catch {
    return null;
  }
};
