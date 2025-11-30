export const GENERAL_MESSAGE = {
  INTERNAL_SERVER_ERROR: 'Interal Server Error',
  UNAUTHORIZED: 'Unauthorized',
  VALIDATION_ERROR: 'Validation error',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not found',
  CONFLICT: 'Conflict',
  INSUSFFICIENT_STOCK: 'Insufficient stock for one or more items',
} as const;

export const AUTH_MESSAGES = {
  //Login messages
  LOGIN_FAILED: 'Login failed',
  LOGIN_SUCCESSFUL: 'Login successful',
  EMAIL_OR_PASSWORD_INCORRECT: 'Email or password incorrect',
  ACCOUNT_BANNED: 'Account banned',
  USER_NOT_VERIFIED: 'User not verified',
  //Logout messages
  LOGOUT_SUCCESSFUL: 'Logout successful',
  LOGOUT_FAILED: 'Logout failed',
  // Register messages
  REGISTER_FAILED: 'Register failed',
  REGISTER_SUCCESSFUL: 'Register successful',
  USER_ALREADY_EXISTS: 'User already exists',
  USER_CREATED: 'User created',
  DATE_OF_BIRTH_MUST_BE_ISO_8601: 'Date of birth must be in ISO 8601 format',
  VERIFY_EMAIL_TOKEN_IS_REQUIRED: 'Verify email token is required',
  VERIFY_EMAIL_TOKEN_IS_INVALID: 'Verify email token is invalid',
  VERIFY_EMAIL_SUCCESSFUL: 'Verify email successful',
  ALREADY_VERIFIED_EMAIL_BEFORE: 'Already verified email before',
  RESEND_VERIFY_EMAIL_SUCCESSFUL: 'Resend verify email successful',
  ADDRESS_IS_REQUIRED: 'Address is required',
  PHONE_NUMBER_IS_REQUIRED: 'Phone number is required',
  DOB_IS_REQUIRED: 'Date of birth is required',
  DOB_MUST_BE_VALID_DATE: 'Date of birth must be a valid date',
  // Name messages
  NAME_IS_REQUIRED: 'Name is required',
  NAME_INVALID: 'Name must not contain special characters or numbers only',
  // Username messages
  USERNAME_IS_REQUIRED: 'UserName is required',
  USERNAME_MUST_BE_FROM_4_TO_15_CHARACTERS: 'UserName must be from 4 to 15 characters',
  USERNAME_INVALID: 'Username must not contains numbers only and special characters',
  USERNAME_ALREADY_EXIST: 'Username already exist',
  USERNAME_AND_PASSWORD_ARE_REQUIRED: 'Username and password are required',
  // Password messages
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be a string',
  PASSWORD_MUST_BE_FROM_6_TO_50_CHARACTERS: 'Password must be from 6 to 50 characters',
  PASSWORD_MUST_BE_STRONG:
    'Password must be at least 6 characters and contain at least one lowercase letter, one uppercase letter, one number and one symbol',
  PASSWORD_INCORRECT: 'Password is incorrect',
  PASSWORD_SHOULD_DIFFERRENCE:
    'The new password you entered is the same as the old password. Please enter a different password',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  CHANGE_PASSWORD_SUCCESSFUL: 'Change password successfully',
  // Forgot password messages
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESSFUL: 'Verify forgot password token successful',
  RESET_PASSWORD_SUCCESSFUL: 'Reset password successful',
  // Email messages
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_MUST_BE_VALID: 'Email must be a valid email',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  // Token messages
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_IS_NOT_EXIST: 'Refresh token is not exist',
} as const;

export const USER_MESSAGES = {
  UPDATE_ME_SUCCESSFUL: 'Update me successful',
  GET_PROFILE_SUCCESSFUL: 'Get profile successful',
} as const;
