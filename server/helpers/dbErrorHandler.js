"use strict";

const getErrorMessage = (err) => {
  if (!err) return "An unexpected error occurred. Please try again.";
  if (err.errors) {
    for (const name in err.errors) {
      if (err.errors[name]?.message) return err.errors[name].message;
    }
  }
  return err.message || "An unexpected error occurred. Please try again.";
};

export default { getErrorMessage };
