const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // Simple regex for email validation
// requires form __@__.___

const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/; // Simple regex for password verification
// requires password to have atleast 1 special character, 1 number, and one uppercase letter (must be longer than 8 chars)

const limits = {
  userName: { min: 0, max: 50 },
  email: { min: 3, max: 75 },
  id: { min: 24, max: 24 },
};

const defaultMaxLength = 100; // Default max length for values

function processEmails(obj, badEmail) {
  if (obj == null) {
    return [];
  }
  Object.keys(obj).forEach((key) => {
    if (key.toLowerCase().includes("email")) {
      // Replace %40 with @
      obj[key] = obj[key].replace(/%40/gi, "@");

      // Validate the email format
      if (!emailRegex.test(obj[key])) {
        badEmail.push(obj[key]);
      }
    }
  });
}

const checkLength = (key, value, min, max) => {
  if (Array.isArray(value)) {
    // If the value is an array, check each string element within the array
    return value.some(
      (element) =>
        typeof element === "string" &&
        (element.length < min || element.length > max)
    );
  }
  // If the value is a string, check its length
  return (
    typeof value === "string" && (value.length < min || value.length > max)
  );
};

function processLength(obj) {
  if (obj == null) {
    return [];
  }
  var InvalidLength = [];
  for (const [key, value] of Object.entries(obj)) {
    // Use specific limit if exists, otherwise use default
    const min = limits[key]?.min || 0;
    const max = limits[key]?.max || defaultMaxLength;
    if (max !== -1 && value) {
      if (checkLength(key, value, min, max)) {
        InvalidLength.push(key);
      }
    }
  }
  return InvalidLength;
}

const checkBodyForLongValues = (req, res, next) => {
  const keysWithInvalidLength = [];

  Array.prototype.push.apply(keysWithInvalidLength, processLength(req.body));
  Array.prototype.push.apply(keysWithInvalidLength, processLength(req.params));

  if (keysWithInvalidLength.length > 0) {
    // If there are any fields with string values outside the specified limits, send an error response.
    return res.status(400).json({
      message: "Request body contains values with invalid lengths.",
      fields: keysWithInvalidLength,
    });
  }

  // If everything is fine, proceed to the next middleware
  next();
};

const validateAndFormatEmailParams = (req, res, next) => {
  let badEmail = [];
  processEmails(req.params, badEmail);
  processEmails(req.body, badEmail);
  if (badEmail.length > 0) {
    return res.status(400).json({
      message: "Invalid email format.",
      email: badEmail,
    });
  } else {
    next(); // Proceed to the next middleware if all checks pass
  }
};

const validatePasswordForm = (req, res, next) => {
  if (
    (!req.body.password || passwordRegex.test(req.body.password)) &&
    (!req.params.password || passwordRegex.test(req.params.password))
  ) {
    next();
  } else {
    return res.status(400).json({
      message: `Invalid password format. Password must be longer than 8 characters, 
      requires at least 1 special character, 1 number, and 1 uppercase letter.`,
    });
  }
};

module.exports = {
  checkBodyForLongValues,
  validateAndFormatEmailParams,
  validatePasswordForm,
  passwordRegex, // Exporting if I want to check it somewhere else
  emailRegex, // Exporting the regex in case it's needed elsewhere
};
