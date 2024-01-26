const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("../config");

// ------------------ GENERATE ACCESS TOKEN ------------------
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

// ------------------ GENERATE REFRESG TOKEN ------------------
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "15d" });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
