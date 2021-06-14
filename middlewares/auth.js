const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startWith("Brear ")) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }
  const token = authorization.replace("Brear ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }

  req.user = payload;

  return next();
};
