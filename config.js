const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const NODE_ENV = process.env.NODE_ENV;

module.exports = {
    PORT,
    MONGO_URI,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    NODE_ENV,
};
