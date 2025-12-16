export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup'
  }
};

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard'
};

export const ERRORS = {
  SUCCESSFUL_LOGIN: 'Login Successful! (Redirecting...)',
  FAILED_LOGIN: 'Login failed. Please check your credentials.',
  FAILED_SIGNUP: 'Sign up failed. Please try again.',
  PASSWORD_MISMATCH: 'Passwords do not match',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters'
};

export const MESSAGES = {
  SIGNUP_SUCCESS: 'Account created successfully! Logging you in...'
};

export const UI_TEXT = {
  LOGIN: {
    TITLE: 'Welcome Back',
    SUBTITLE: 'Sign in to access your dashboard',
    BUTTON: 'Sign In',
    FOOTER: "Don't have an account?",
    FOOTER_LINK: 'Sign Up'
  },
  SIGNUP: {
    TITLE: 'Create Account',
    SUBTITLE: 'Sign up to get started',
    BUTTON: 'Create Account',
    FOOTER: 'Already have an account?',
    FOOTER_LINK: 'Sign In'
  },
  LABELS: {
    USERNAME: 'Username',
    EMAIL: 'Email',
    PASSWORD: 'Password',
    CONFIRM_PASSWORD: 'Confirm Password'
  },
  PLACEHOLDERS: {
    USERNAME_LOGIN: 'Enter your username',
    USERNAME_SIGNUP: 'Choose a username',
    EMAIL: 'Enter your email',
    PASSWORD_LOGIN: 'Enter your password',
    PASSWORD_CREATE: 'Create a password',
    PASSWORD_CONFIRM: 'Confirm your password'
  }
};

export const VALIDATION = {
  MIN_USERNAME_LENGTH: 3,
  MIN_PASSWORD_LENGTH: 6,
  SUCCESS_REDIRECT_DELAY: 1500
};