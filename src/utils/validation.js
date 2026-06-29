const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, password, gender, age, emailId } = req.body;

  if (!firstName) {
    throw new Error("First Name is mandatory.");
  }
  if (!password) {
    throw new Error("Password is mandatory.");
  }
  if (!age) {
    throw new Error("Age is mandatory.");
  }
  if (!emailId) {
    throw new Error("Email is mandatory.");
  }
  if (age < 18) {
    throw new Error("Your Age should be 18 or above.");
  }
  if (password.includes(".")) {
    throw new Error("Password cannot include a ','.");
  }
  if (password.length < 8) {
    throw new Error("Password length must be atleast 8 characters.");
  }
};

const validateProfileEdit = (req) => {
  const allowedFieldsToEdit = [
    "firstName",
    "lastName",
    "about",
    "gender",
    "skills",
    "emailId",
    "age",
  ];

  const isReqAllowed = Object.keys(req?.body).every((field) =>
    allowedFieldsToEdit.includes(field),
  );

  return isReqAllowed;
};

const validateChangePassword = (req) => {
  const allowedPasswordFields = ["password", "new_password"];
  const isPasswordFieldsAllowed = Object.keys(req?.body).every((field) =>
    allowedPasswordFields.includes(field),
  );
  if (isPasswordFieldsAllowed) {
    const { new_password, password } = req?.body;

    if (new_password.includes(".")) {
      throw new Error("Password cannot include a '.'.");
    }
    if (new_password.length < 8) {
      throw new Error("Password length must be atleast 8 characters.");
    }
    if (password === new_password) {
      throw new Error("New password cannot be the same as the old password.");
    }
  }

  return isPasswordFieldsAllowed;
};

module.exports = {
  validateSignUp,
  validateProfileEdit,
  validateChangePassword,
};
