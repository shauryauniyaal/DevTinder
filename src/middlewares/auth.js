const adminAuth = (req, res, next) => {
  console.log("Verifying admin...");

  const token = "abc";
  const isTokenVerified = token === "abc";
  if (isTokenVerified) {
    next();
  } else {
    res.status(401).send("Unauthorised");
  }
};

const userAuth = (req, res, next) => {
  console.log("Verifying user...");

  const token = "lmn";
  const isTokenVerified = token === "lmn";
  if (isTokenVerified) {
    next();
  } else {
    res.status(401).send("Unauthorised");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
