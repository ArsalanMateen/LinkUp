const getErrorMessage = (err) =>
  err?.message || "An unexpected error occurred. Please try again.";
export default { getErrorMessage };
