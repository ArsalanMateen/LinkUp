export const getFriendlyErrorMessage = (errorInput) => {
  if (!errorInput) return "";
  const errStr =
    typeof errorInput === "string"
      ? errorInput
      : errorInput.error || errorInput.message || "";

  if (!errStr) return "Something went wrong. Please try again.";

  if (/duplicate key|E11000|already exists/i.test(errStr)) {
    return "An account with this email address already exists. Please sign in or use a different email.";
  }

  if (/user not found/i.test(errStr)) {
    return "No account found with this email address. Please check your email or sign up.";
  }
  if (/email and password don't match|invalid password/i.test(errStr)) {
    return "The email and password you entered do not match. Please try again.";
  }

  if (/password must be at least 6/i.test(errStr)) {
    return "Password must be at least 6 characters long.";
  }
  if (/valid email/i.test(errStr)) {
    return "Please enter a valid email address (e.g. name@example.com).";
  }
  if (/name is required/i.test(errStr)) {
    return "Please enter your full name.";
  }
  if (/password is required/i.test(errStr)) {
    return "Please enter a password.";
  }

  if (/failed to fetch|network|econnrefused/i.test(errStr)) {
    return "Could not connect to the server. Please check your connection and try again.";
  }

  return errStr;
};
