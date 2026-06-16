const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, password, gender, age, emailId, skills } =
    req.body;

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
  // skills = [
  //   ...new Set(
  //     skills.map((s) => s.trim().toLowerCase()).filter((s) => s.length > 0),
  //   ),
  // ];
  // if (skills?.length > 10) {
  //   throw new Error("You can only add 10 skills.");
  // }
  // if (password.includes(".")) {
  //   throw new Error("You cannot have '.' in the password.");
  // }
};

module.exports = { validateSignUp };
