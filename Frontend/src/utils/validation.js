export const validateEmail = (email) => {
  if (!email) return "Email is required";

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Invalid email format";

  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";

  if (password.length < 6) return "Password must be at least 6 characters";

  if (!/[A-Z]/.test(password))
    return "Include at least one uppercase letter";

  if (!/[0-9]/.test(password))
    return "Include at least one number";

  return "";
};

export const getPasswordStrength = (password) => {
  if (!password) return "";

  let score = 0;

  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;

  if (score === 1) return "weak";
  if (score === 2) return "medium";
  if (score === 3) return "strong";

  return "";
};