const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_]+$/;

export function validateEmail(email) {
  const trimmed = (email || "").trim();

  if (!trimmed) {
    return "Email is required";
  }

  if (!EMAIL_RE.test(trimmed)) {
    return "Enter a valid email address";
  }

  return "";
}

export function validatePassword(password, { minLength = 6, required = true } = {}) {
  if (!password) {
    return required ? "Password is required" : "";
  }

  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }

  return "";
}

export function validateUsername(username) {
  const trimmed = (username || "").trim();

  if (!trimmed) {
    return "Username is required";
  }

  if (trimmed.length < 3) {
    return "Username must be at least 3 characters";
  }

  if (trimmed.length > 30) {
    return "Username must be 30 characters or less";
  }

  if (!USERNAME_RE.test(trimmed)) {
    return "Username can only contain letters, numbers, and underscores";
  }

  return "";
}

export function validateLoginForm({ email, password }) {
  const errors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateRegisterForm({ username, email, password }) {
  const errors = {};

  const usernameError = validateUsername(username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password, { minLength: 8 });
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateProfileForm({
  username,
  email,
  currentPassword,
  newPassword,
  confirmPassword,
}) {
  const errors = {};

  const usernameError = validateUsername(username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const wantsPasswordChange = Boolean(
    currentPassword || newPassword || confirmPassword
  );

  if (wantsPasswordChange) {
    if (!currentPassword) {
      errors.currentPassword = "Current password is required to set a new one";
    }

    const newPasswordError = validatePassword(newPassword, { minLength: 8 });
    if (newPasswordError) {
      errors.newPassword = newPasswordError;
    }

    if (newPassword && newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
}
