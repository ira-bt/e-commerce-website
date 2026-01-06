export const VALIDATION_MESSAGES = {
  // Common
  REQUIRED_USERNAME: "Username is required",
  REQUIRED_PASSWORD: "Password is required",
  INVALID_PASSWORD_FORMAT:
    "Password must be at least 6 characters and include 1 uppercase, 1 lowercase, 1 digit, and 1 special character",

  // Register specific
  REQUIRED_EMAIL: "Email is required",
  INVALID_EMAIL: "Invalid email address",
  PASSWORD_MISMATCH: "Passwords do not match",
  USERNAME_MIN_LENGTH: "Username must be at least 3 characters",

  // Auth errors
  INVALID_CREDENTIALS: "Invalid username or password",
  USERNAME_EXISTS: "Username already exists",
  REGISTRATION_FAILED: "Registration failed",
};
